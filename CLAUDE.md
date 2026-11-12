# Sistema de Gestão para Oficina Mecânica — Mecânica São Jorge

Documento único de contexto do projeto. Consolida objetivo, stack, decisões de arquitetura (com o porquê) e padrões de código. Atualizar este arquivo conforme novas decisões forem fechadas — não criar documentos de contexto paralelos.

## Objetivo

Sistema de gestão para a oficina mecânica Mecânica São Jorge: monorepo com API em Java/Spring Boot (`apps/api`) e app mobile em React Native + Expo (`apps/mobile`) para controlar clientes, veículos, ordens de serviço, peças, serviços, pagamentos e financeiro, substituindo processos manuais.

Foco principal: organização de prazos, custos e lucro — não é um sistema voltado para um negócio de grande porte, então a complexidade da arquitetura deve ser proporcional a isso (evitar overengineering).

Uso inicialmente interno (sem publicação em loja de apps). Arquitetura deve permitir evoluir para SaaS no futuro sem grandes refatorações.

---

## Stack

- **Java 21** (LTS) + **Spring Boot 4.1.0** — versões fixadas no `apps/api/pom.xml` na fundação F00.
- **MySQL** — volume alto de relacionamentos (Cliente→Veículo→Ordem→Serviços/Peças→Pagamentos→Financeiro) e necessidade de relatórios relacionais (faturamento, lucro).
- **Spring Data JPA**, **Spring Security** (JWT), **Bean Validation**, **Lombok**, **MapStruct**, **Flyway** (migrations).
- **springdoc-openapi** para documentação — não usar Springfox (abandonado, incompatível com Spring Boot 3+/4 por usar `javax` em vez de `jakarta`).
- Mobile: **React Native** com **Expo** (Expo Router) e TypeScript estrito.

Instruções de instalação, execução e testes: `README.md` da raiz e de cada app.

---

## Documentação complementar

- `docs/architecture/arquitetura-backend.md` — responsabilidade de cada pacote, classes por módulo, rotas REST.
- `docs/architecture/schema-referencia.sql` — modelo de dados alvo (referência, não executar).
- `docs/product/ux-ui-mapeamento.md` — telas e fluxos do app.
- `docs/design/identidade-visual.md` — paleta, tipografia, componentes.
- `docs/design/figma.md` e `docs/design/F24-wireframe-baixa-fidelidade.md` — wireframe e protótipos no Figma.

---

## Organização de pacotes

Por camada (não por domínio/feature):

```
br.com.mecanicasaojorge.api
├── config
├── controller
├── dto
│   ├── request
│   └── response
├── entity / model
├── repository
├── service
│   ├── impl
│   └── interfaces
├── mapper
├── exception
├── security
├── util
└── enums
```

Por quê por camada e não por domínio: organização por domínio escala melhor com vários times trabalhando em paralelo, mas este é um projeto de uma pessoa só, com módulos que se referenciam muito entre si (Ordem de Serviço usa Cliente, Veículo, Serviço e Peça ao mesmo tempo) — separar por domínio criaria import cruzado entre pastas sem ganho real nesse porte.

---

## Modelo de dados

Modelo alvo em `docs/architecture/schema-referencia.sql` (referência de modelagem). O schema real é criado só por migrations Flyway em `apps/api/src/main/resources/db/migration` — toda mudança de schema exige migration nova; Hibernate roda com `ddl-auto: validate`. Principais decisões e o porquê:

- **`Servico`** (catálogo de serviços oferecidos) e **`Peca`** (catálogo + estoque) são reaproveitáveis entre várias ordens, em vez de texto livre repetido em cada ordem.
- **`OrdemServico`** se relaciona com N serviços e N peças via tabelas de junção (`OrdensServicoServicos`, `OrdensServicoPecas`) que **congelam o valor cobrado no momento da venda** — se o preço do catálogo mudar depois, ordens já fechadas não são afetadas. Isso é necessário para relatório histórico de faturamento ficar correto.
- Estoque rastreado via `MovimentacoesEstoque` (entrada/saída/ajuste), opcionalmente ligado a uma ordem, para auditoria.
- Pagamento dividido em duas entidades (suporta parcelamento e pagamento parcial):
  - **`Parcela`** — o que é devido (valor previsto, vencimento, número da parcela / total de parcelas).
  - **`Pagamento`** — cada recebimento real (pode haver vários por parcela, somando até cobrir o valor previsto).
  - Status da parcela (PENDENTE / PARCIAL / PAGO / ATRASADO) é **calculado em runtime** a partir da soma dos pagamentos vs. valor previsto e da data de vencimento — nunca armazenado como coluna, para não dessincronizar.
  - **`Financeiro`** (movimentação financeira) é gerado automaticamente **a cada `Pagamento` real** (não a cada `Parcela` criada) — preserva a separação entre "vou receber" e "já recebi". Aceita também lançamentos manuais sem ordem associada (despesas como aluguel, fornecedores, salários).
- Decisões propositalmente fora de escopo agora (evitar complexidade desproporcional ao porte do negócio): tabela de Funcionário separada de Usuário, tabela de Forma de Pagamento (fica como enum Java), tabela de "Conta a Receber" separada, multi-tenant.

---

## Fluxo de status da Ordem de Serviço

```
ABERTA → EM_ANALISE → AGUARDANDO_PECA ⇄ EM_ANDAMENTO → FINALIZADA → ENTREGUE
                                                                  ↘ CANCELADA (de qualquer estado anterior a ENTREGUE)
```

- `EM_ANALISE` (diagnóstico) é separado de `EM_ANDAMENTO` (execução) para dar visibilidade de prazo por fase.
- `AGUARDANDO_PECA` é um estado reversível (pode voltar para `EM_ANDAMENTO` quando a peça chega).
- "PAGO" **não** é status da Ordem de Serviço — pagamento é rastreado via `Parcela`/`Pagamento`, desacoplado do ciclo de execução do serviço.
- Implementação: enum Java `StatusOrdemServico`, mapeado com `@Enumerated(EnumType.STRING)` — nunca `EnumType.ORDINAL` (reordenar o enum no futuro não pode corromper dados já gravados, pois `ORDINAL` grava só a posição numérica).
- Transições de status válidas são validadas na camada Service, nunca no Controller.

---

## Segurança e perfis de usuário

Autenticação via **JWT** (stateless — facilita reaproveitar a mesma API pelo app React Native depois, sem sessão guardada no servidor).

Perfis previstos: `ADMIN` e `FUNCIONARIO`. **Por enquanto, sem distinção de permissão entre eles** — qualquer usuário autenticado acessa tudo. A coluna de perfil já existe no schema (`Usuarios.perfil`) para permitir restringir por endpoint no futuro sem precisar de migration nova.

---

## Padrões e convenções de código

Sempre:

- Constructor injection.
- DTOs em toda API pública — nunca expor entidades diretamente. Conversão via MapStruct.
- Validação com Bean Validation.
- Retornar `ResponseEntity`.
- Tratamento global de exceções.
- Endpoints REST com substantivos no plural (`/clientes`, `/veiculos`, `/ordens-servico`), nunca verbos na URL.
- Regra de negócio sempre na camada Service — Controllers só recebem requisição e retornam resposta.
- Optional quando fizer sentido; Streams só quando melhoram legibilidade; métodos pequenos; uma responsabilidade por classe.

Nomenclatura: classes em PascalCase, métodos em camelCase, constantes em UPPER_SNAKE_CASE, pacotes em minúsculas.

Evitar: classes gigantes, métodos longos, duplicação de código, regra de negócio espalhada em Controllers.

---

## Como responder / como gerar código

Ao gerar código:

1. Explicar rapidamente a solução.
2. Mostrar quais arquivos serão criados ou alterados.
3. Gerar código completo.
4. Manter consistência com o restante do projeto.
5. Não remover funcionalidades existentes sem necessidade.
6. Evitar dependências desnecessárias.

Ao encontrar um problema no código existente: explicar a causa, explicar possíveis soluções, informar qual será aplicada, só então gerar o código.

Estilo das respostas: técnico e objetivo, sem genérico. Quando houver alternativas, explicar prós/contras e recomendar a melhor opção. Avisar antes de aplicar qualquer decisão que possa causar problema de escalabilidade no futuro.

---

## Backlog de funcionalidades futuras (fora do escopo atual)

- Controle financeiro completo (despesas detalhadas, relatórios de lucro/fluxo de caixa).
- Agenda da oficina.
- Histórico de manutenção dos veículos.
- Upload de fotos do veículo (antes/depois do serviço).
- Assinatura digital e PDF da Ordem de Serviço.
- Login de funcionários com controle de permissões (ver seção de Segurança).
- Dashboard com indicadores: ordens abertas/concluídas, faturamento do mês, quantidade de clientes, estoque baixo, serviços mais realizados, gráfico de faturamento.
- Integração com WhatsApp (inicialmente apenas link `https://wa.me/`, depois API oficial do WhatsApp Business) para orçamento, valor final e aviso de veículo pronto.
- Backup automático e notificações.

---

## Pendências conhecidas

- Só existe a migration `V1__criar_tabela_usuarios.sql` no `main`. A F24 cita `V2__criar_schema_oficina.sql` e `docs/architecture/overview.md`, que não estão versionados.
- Divergências registradas na F24 entre telas e schema (clientes sem CPF/endereço, serviços e peças sem nome, movimentação de estoque sem quantidade) — `docs/architecture/schema-referencia.sql` já prevê nome em serviços/peças e quantidade na movimentação; usar como base nas próximas migrations.
- ADRs de arquitetura, CI (`.github/workflows/ci.yml`) e Maven Wrapper ainda não commitados (ver `README.md`).

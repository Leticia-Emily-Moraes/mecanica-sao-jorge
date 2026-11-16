# Arquitetura — Mecânica São Jorge (op-002)

Visão de arquitetura da operação e índice de decisões (ADRs). Mantido pelo
CARTOGRAFO. Toda decisão difícil de reverter ou que afeta mais de um componente
vira um ADR em `adr/`, listado na tabela **Decisões** abaixo, atualizada no
mesmo commit.

## Estilo e fronteiras

- **Monorepo** ([[adr/ADR-008-monorepo-com-backend-spring-e-mobile-expo]]):
  `apps/api` (Spring Boot 4.1 / Java 21), `apps/mobile` (Expo), `docs/`.
- **Backend em camadas, pacotes por camada** ([[adr/ADR-001-organizar-pacotes-por-camada]]):
  `entity` → `repository`/`mapper` → `service` (regra de negócio) → `controller`;
  transversais em `config`, `security`, `exception`.
- **Nunca expor entidade na API**: entrada `*Request` (Bean Validation), saída
  `*Response`, mapeamento MapStruct ([[adr/ADR-007-nao-expor-entidade-na-api-dto-e-convencao-de-nomes]]).
- **Segurança**: Resource Server JWT HS256 stateless, a própria API emite/valida
  ([[adr/ADR-004-autenticacao-stateless-via-jwt-hs256]]); segredos fora de código
  e log ([[adr/ADR-009-configuracao-por-variavel-de-ambiente-e-segredos-fora-do-codigo]]).
- **Persistência**: MySQL via Flyway (migrations aditivas, sem DROP DATABASE),
  `ddl-auto: validate` ([[adr/ADR-003-versionar-schema-com-flyway-migrations-aditivas]]);
  enum como STRING ([[adr/ADR-006-persistir-enum-de-dominio-como-string]]);
  subtotais de item como coluna gerada ([[adr/ADR-005-subtotais-da-os-como-coluna-gerada-no-banco]]).

Diagramas C4 em `diagrams/` (contexto, contêineres, fluxo de login).
Mapa de navegação entre telas (wireframe F24, todas as telas do app, para
evitar fluxo órfão) em [`diagrams/navegacao-wireframe-f24.md`](diagrams/navegacao-wireframe-f24.md).

## Decisões

| ADR | Título | Status | Data |
|---|---|---|---|
| [ADR-001](adr/ADR-001-organizar-pacotes-por-camada.md) | Organizar o backend em pacotes por camada | Aceito | 2026-11-07 |
| [ADR-002](adr/ADR-002-documentar-api-com-springdoc-openapi.md) | Documentar a API com springdoc-openapi, não com Springfox | Aceito | 2026-11-07 |
| [ADR-003](adr/ADR-003-versionar-schema-com-flyway-migrations-aditivas.md) | Versionar o schema com Flyway e nunca reescrever migration aplicada | Aceito | 2026-11-07 |
| [ADR-004](adr/ADR-004-autenticacao-stateless-via-jwt-hs256.md) | Autenticação stateless via JWT HS256 com oauth2-resource-server | Aceito | 2026-11-07 |
| [ADR-005](adr/ADR-005-subtotais-da-os-como-coluna-gerada-no-banco.md) | Subtotais das junções da OS como coluna gerada no banco | Aceito | 2026-11-07 |
| [ADR-006](adr/ADR-006-persistir-enum-de-dominio-como-string.md) | Persistir enum de domínio como STRING | Aceito | 2026-11-07 |
| [ADR-007](adr/ADR-007-nao-expor-entidade-na-api-dto-e-convencao-de-nomes.md) | Não expor entidade na API: DTO + MapStruct e convenção de nomes | Aceito | 2026-11-07 |
| [ADR-008](adr/ADR-008-monorepo-com-backend-spring-e-mobile-expo.md) | Monorepo com backend Spring e mobile Expo | Aceito | 2026-11-07 |
| [ADR-009](adr/ADR-009-configuracao-por-variavel-de-ambiente-e-segredos-fora-do-codigo.md) | Configuração por variável de ambiente e segredos fora do código | Aceito | 2026-11-07 |
| [ADR-010](adr/ADR-010-testes-de-integracao-com-testcontainers.md) | Testes de integração com Testcontainers rodando as migrations do zero | Aceito | 2026-11-07 |
| [ADR-011](adr/ADR-011-handler-global-de-erro-e-mapeamento-de-status.md) | Handler global de erro: formato único e mapeamento de status HTTP | Aceito | 2026-11-07 |
| [ADR-012](adr/ADR-012-remover-template-generico-do-backend.md) | Remover o template genérico do backend em vez de adaptá-lo | Aceito | 2026-11-12 |
| [ADR-013](adr/ADR-013-adotar-migrations-flyway-como-fonte-unica-de-verdade-do-schema.md) | Adotar as migrations Flyway como fonte única de verdade do schema | Aceito | 2026-11-12 |
| [ADR-014](adr/ADR-014-adotar-referencia-figma-como-nova-identidade-visual.md) | Adotar o visual do Figma de referência como nova identidade visual do app (aceito na F41: referência FPdB8, cor ajustada para AA, classes de divergência e tabela token Figma × código) | Aceito | 2026-11-16 |
| [ADR-017](adr/ADR-017-padronizar-listagem-com-busca-e-paginacao.md) | Padronizar a listagem com busca: termo literal, collation ai_ci fixada por migration e página própria | Proposto | 2026-11-14 |

ADR-014 foi trazido de `docs/f39-wireframe-redesenho` (`18efb4e`) pela branch `docs/f41-adr014-referencia-aprovada` e aceito em 2026-11-16 na branch da F41 (`feat/f41-paridade-fpdb8-codigo`), que o leva à `main` pelo PR da F41. ADR-015 e ADR-016 continuam em ramos fora da `main` (`refactor/f40-estrutura-ui-sobre-f41` e o PR 13). A numeração deles está reservada, e cada um entra nesta tabela no próprio merge.

> Nota de materialização: a F00 referenciou ADR-004/006/010/011 em código mas
> não gravou os arquivos (ver `README.md`). Esta entrega da F02 materializa todo
> o conjunto, mantendo os números que o código já cita, e backfilla as decisões
> da F00 (008, 009, 010) para deixar a numeração íntegra e sem referência pendente.

## Modelo de dados (12 entidades)

Convenção ([[adr/ADR-007-nao-expor-entidade-na-api-dto-e-convencao-de-nomes]]):
tabela plural snake_case, PK `id` (`BIGINT UNSIGNED AUTO_INCREMENT`), FK
`<singular>_id`, entidade no singular em `entity`.

**Fonte de verdade**: o schema é o que as migrations Flyway criam
([[adr/ADR-013-adotar-migrations-flyway-como-fonte-unica-de-verdade-do-schema]]).
**Divergência registrada**: o script de referência (`docs/script.sql`, local e
fora do git desde `a1d2ddb`, originado do `BD/script.sql` do repo irmão) usa PascalCase e
PK `<tabela>_id` (ex.: `Clientes.cliente_id`). A casa segue o padrão já aplicado
pela F00 (`usuarios`, PK `id`, snake_case). O script é referência de **estrutura**
(colunas, FKs, geradas, enums), não de nomenclatura.

| Entidade | Tabela | Migration | Observações |
|---|---|---|---|
| Usuario | `usuarios` | V1 (F00) | PK `id`; `perfil` VARCHAR+CHECK (enum STRING); `created_at`/`updated_at` |
| Cliente | `clientes` | V2 (+ V3 na F03a) | nome, telefone, email, created_at; collation `utf8mb4_0900_ai_ci` fixada pela V3 ([ADR-017](adr/ADR-017-padronizar-listagem-com-busca-e-paginacao.md)) |
| Veiculo | `veiculos` | V2 | FK `cliente_id`; placa, modelo, marca, ano, cor, quilometragem |
| Servico | `servicos` | V2 | valor_padrao_mao_obra, tempo_estimado_horas, ativo |
| Peca | `pecas` | V2 | codigo UNIQUE, custo, preco_venda, quantidade_estoque, estoque_minimo, ativo |
| OrdemServico | `ordens_servico` | V2 | FK `cliente_id`, `veiculo_id`; `status` VARCHAR (enum); subtotais/desconto/valor_total **recalculados no service** (colunas comuns) |
| OrdemServicoServico | `ordens_servico_servicos` | V2 | FK `ordem_id`, `servico_id`; valor_cobrado, quantidade; **subtotal = coluna gerada** |
| OrdemServicoPeca | `ordens_servico_pecas` | V2 | FK `ordem_id`, `peca_id`; valor_unitario_cobrado, quantidade; **subtotal = coluna gerada** |
| MovimentacaoEstoque | `movimentacoes_estoque` | V2 | FK `peca_id`, `ordem_id?`; `tipo` VARCHAR (enum ENTRADA/SAIDA/AJUSTE), motivo |
| Parcela | `parcelas` | V2 | FK `ordem_id`; numero/total_parcelas, valor_previsto, data_vencimento. **Status calculado em runtime** (não é coluna) |
| Pagamento | `pagamentos` | V2 | FK `parcela_id`; valor, `forma_pagamento` VARCHAR (enum) |
| Financeiro | `financeiro` | V2 | `tipo` VARCHAR (enum ENTRADA/SAIDA); FK `ordem_id?`, `pagamento_id?` (origem do lançamento) |

Enums (todos `@Enumerated(EnumType.STRING)` + VARCHAR):
`Perfil` (ADMIN, FUNCIONARIO) · `StatusOS` (ABERTA, EM_ANALISE, ... — enum da
Sprint 04) · `FormaPagamento` (DINHEIRO, PIX, CARTAO, BOLETO) ·
`TipoMovimentacao` (ENTRADA, SAIDA, AJUSTE) · `TipoLancamento` (ENTRADA, SAIDA).

Colunas geradas ([[adr/ADR-005-subtotais-da-os-como-coluna-gerada-no-banco]]):
`ordens_servico_servicos.subtotal = GENERATED ALWAYS AS (valor_cobrado * quantidade) STORED`
e `ordens_servico_pecas.subtotal = GENERATED ALWAYS AS (valor_unitario_cobrado * quantidade) STORED`.
Mapear com `@Column(insertable=false, updatable=false)`.

## Reconciliação do schema com o script de referência

Regra ([[adr/ADR-013-adotar-migrations-flyway-como-fonte-unica-de-verdade-do-schema]]):
o schema do sistema é **o que as migrations criam**. `docs/script.sql` é
insumo histórico de requisito: fica local, fora do git desde `a1d2ddb`, e a
versão lida tem `sha256 d75746d0…afd235aa7`. Esta matriz congela o que o
script tem e a V1/V2 não têm. A V2 é **deliberadamente mínima**: cria as 11
tabelas só com o que a F02 precisa para `ddl-auto: validate`. Cada feature
dona fecha a sua linha **no mesmo PR** da migration aditiva (`V3+`,
[[adr/ADR-003-versionar-schema-com-flyway-migrations-aditivas]]). A entidade
JPA só mapeia a coluna depois que a migration que a cria entrar. Conferido
coluna a coluna por CARTOGRAFO em 2026-11-12, lendo os três arquivos SQL.

### Colunas do script ausentes nas migrations

| Tabela | Colunas no script que faltam em V1/V2 | Feature dona |
|---|---|---|
| `clientes` | nenhuma (só nomes divergem, ver abaixo) | n/a |
| `veiculos` | `data_cadastro` | F04 |
| `servicos` | `nome VARCHAR(150) NOT NULL`, `descricao VARCHAR(255)` | F05 / F11 / F12 |
| `pecas` | `nome VARCHAR(150) NOT NULL`, `categoria VARCHAR(80)`, `fabricante VARCHAR(100)`, `unidade VARCHAR(20) NOT NULL DEFAULT 'UN'` | F17 / F14 / F15 |
| `ordens_servico` | `descricao_problema TEXT`, `diagnostico TEXT`, `data_abertura`, `data_previsao_entrega DATE`, `data_fechamento` | F18 / F19 / F20 |
| `ordens_servico_servicos` | nenhuma | n/a |
| `ordens_servico_pecas` | nenhuma | n/a |
| `movimentacoes_estoque` | `quantidade INT NOT NULL`, `data_movimento` | F16 |
| `parcelas` | nenhuma (`numero` corresponde a `numero_parcela`) | n/a |
| `pagamentos` | `data_pagamento` | F22 |
| `financeiro` | `valor DECIMAL(10,2) NOT NULL`, `descricao VARCHAR(200)`, `forma_pagamento VARCHAR(30)`, `data_movimento` | F22 / F23 / F31 / F32 |
| `usuarios` | nenhuma | n/a |

### Regras de FK, nulidade, default e índice

Estas regras são decididas pela feature dona, com justificativa no PR. Não são
copiadas do script às cegas: `CASCADE` apaga histórico.

| Onde | Script | Migrations hoje | Feature dona |
|---|---|---|---|
| `veiculos.cliente_id` | `ON DELETE CASCADE` | sem ação (bloqueia o delete) | F04 |
| `veiculos.modelo`, `veiculos.marca` | `NULL` | `NOT NULL` (mais restrito) | F04 |
| `pecas.codigo` | `NULL`, `UNIQUE` | `NOT NULL`, `UNIQUE` | F14 |
| `ordens_servico.status` | `VARCHAR(30) DEFAULT 'ABERTA'` | `VARCHAR(20)`, sem default | F18 / F20 |
| `ordens_servico_servicos.ordem_id`, `ordens_servico_pecas.ordem_id` | `ON DELETE CASCADE` | sem ação | F19 |
| `movimentacoes_estoque.ordem_id` | `ON DELETE SET NULL` | sem ação | F16 |
| `parcelas.ordem_id` | `ON DELETE CASCADE` | sem ação | F21 |
| `parcelas.numero`, `parcelas.total_parcelas` | `DEFAULT 1` | sem default | F21 |
| `pagamentos.parcela_id` | `ON DELETE CASCADE` | sem ação | F22 |
| `financeiro.ordem_id`, `financeiro.pagamento_id` | `ON DELETE SET NULL` | sem ação | F22 / F23 |
| Índices fora de FK: `idx_ordem_status`, `idx_parcela_vencimento`, `idx_financeiro_tipo`, `idx_financeiro_data` | presentes | ausentes | F06 / F07 / F31 |
| `clientes.nome`, `telefone`, `email` (collation) | sem `COLLATE` | sem `COLLATE`; no `mysql:8.4` herdam `utf8mb4_0900_ai_ci` (verificado em 2026-11-14) | F03a: a V3 fixa `utf8mb4_0900_ai_ci` (ADR-017, achado A7) |
| `clientes.telefone` (formato) | `VARCHAR(20)` sem `CHECK` | `VARCHAR(20)` sem `CHECK` | F03c: `CHECK` de 10 ou 11 dígitos, junto com a validação de escrita (ADR-017, achado A8) |
| `ordens_servico.data_abertura`, `pagamentos.data_pagamento` | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | ausentes | F18 e F22: entram como `NOT NULL DEFAULT CURRENT_TIMESTAMP`, porque sustentam o prazo R1 da política de dados de cliente (achado A6). A `data_fechamento` da OS (F20) entra no cálculo quando existir |

Os 8 índices do script que ficam sobre colunas de FK são cobertos pelo índice
que o InnoDB cria sozinho para cada FK. Isso é o comportamento documentado do
MySQL, **não verificado** contra `information_schema` neste banco.

### Divergências aceitas (sem perda de dado)

* Nomes ([[adr/ADR-007-nao-expor-entidade-na-api-dto-e-convencao-de-nomes]]):
  PascalCase vira snake_case; PK `<tabela>_id` vira `id` `BIGINT UNSIGNED`;
  `data_cadastro` vira `created_at` (`clientes`, `usuarios`);
  `numero_parcela` vira `numero`.
* Enum STRING com `CHECK` a mais
  ([[adr/ADR-006-persistir-enum-de-dominio-como-string]]):
  `usuarios.perfil` (sem o default `'FUNCIONARIO'`),
  `movimentacoes_estoque.tipo`, `pagamentos.forma_pagamento` (`VARCHAR(20)`
  em vez de 30) e `financeiro.tipo`.
* Larguras maiores: `clientes.nome`/`email`, `usuarios.nome`/`email` e
  `movimentacoes_estoque.motivo` (255 em vez de 200). `usuarios.updated_at`
  existe só nas migrations.

### Fora do script

`clientes.cpf` e `clientes.endereco` **não estão no script**. Vêm da
US-DES-04 do wireframe F24. Isso é coleta nova de dado pessoal: a F09 precisa
registrar finalidade, base legal e retenção, com revisão do VIGIA, antes da
migration.

**Risco residual**: a matriz é documento, e nenhum teste a compara com o
banco. Se uma feature esquecer a coluna ou não fechar a linha, só a revisão de
PR (CARTOGRAFO/CORRENTE) pega. O `FlywayMigrationIT` garante só o conjunto
exato de tabelas.

## Contrato de API — Login (F02)

`POST /api/v1/auth/login` — público (fora de `authenticated()`).

Request (`LoginRequest`):
```json
{ "email": "usuario@oficina.com", "senha": "segredo" }
```
Validação (Bean Validation): `email` `@NotBlank @Email`; `senha` `@NotBlank`.
Ausência de campo → **400** com os campos listados ([[adr/ADR-011-handler-global-de-erro-e-mapeamento-de-status]]).

Resposta 200 (`LoginResponse`):
```json
{
  "token": "<jwt-hs256>",
  "tipo": "Bearer",
  "expiraEm": "2026-11-14T00:00:00Z",
  "usuario": { "id": 1, "nome": "Fulano", "email": "usuario@oficina.com", "perfil": "ADMIN" }
}
```
Nunca inclui `senha`/`senha_hash`.

JWT (HS256): `sub` = id do usuário; `perfil`; `iss` = `mecanica-sao-jorge-api`;
`iat`; `exp` = `iat + 7 dias` (`jwt.expiration-minutes=10080`, configurável).

Erros:
- **401** credencial inválida (email inexistente **ou** senha incorreta),
  mensagem genérica única ("Credenciais inválidas"), sem distinguir os casos.
- **401** rota protegida sem/with token inválido/expirado, via
  `AuthenticationEntryPoint`, no mesmo formato de corpo.
- Corpo de erro sempre: `{timestamp, status, erro, mensagem, path}`.

## Contrato de API — Clientes listar (F03a)

Contrato normativo no [ADR-017](adr/ADR-017-padronizar-listagem-com-busca-e-paginacao.md): `GET /api/v1/clientes` com `q` (até 100 caracteres), `page` (a partir de 0) e `size` (1 a 100, padrão 20), ordem por `nome` e `id`, corpo `PaginaResponse<ClienteListResponse>` com `itens`, `pagina`, `tamanho`, `totalItens` e `totalPaginas`. Cada item traz só `id`, `nome`, `telefone` e `email`. Erros 400, 401 e 500 seguem o formato do ADR-011. A F35 consome exatamente esse formato, e mudança nele exige alinhar com a F35 (premissa P6).

Pontos de integração da F03a:

* `controller.ClienteController` chama `service.ClienteService`, que chama `repository.ClienteRepository` sobre a tabela `clientes`.
* `mapper.ClienteMapper` (MapStruct) converte `Cliente` em `ClienteListResponse`; `dto.PaginaResponse<T>` monta a página.
* `exception.GlobalExceptionHandler` ganha os handlers de 400 para parâmetro inválido (achado A1).
* `security.MascaraDadoPessoal`: utilitário único de máscara de telefone e CPF para log (seção 6.2 da política de dados). Classe `final` com métodos estáticos, sem bean, com teste unitário para entrada nula, curta e com formatação. Ver a divergência 8.

## Threat model — busca de clientes (STRIDE, F03a)

Onde o dado pessoal entra, circula e sai: o termo `q`, que pode ser nome, telefone ou email de um terceiro, entra pela query string por HTTPS. Ele circula só em memória no service e como parâmetro ligado no JPQL, e nunca vai para log nem para mensagem de erro. Nome, telefone e email dos clientes saem só no corpo da resposta 200, para o app, que não os grava em disco. Base legal, retenção e descarte: `docs/security/politica-dados-pessoais-cliente.md`.

| Ameaça (STRIDE) | Vetor na busca | Mitigação | Risco residual |
|---|---|---|---|
| Spoofing | Chamar sem token ou com token expirado | Rota fora de `PUBLIC_PATHS`; 401 pelo entry point | Token vazado vale até 7 dias (ADR-004) |
| Tampering | Injeção pelo termo; curinga para ampliar o resultado | JPQL com parâmetro ligado; escape com `!` e `ESCAPE` explícito (ADR-017) | Nenhum conhecido |
| Repudiation | Negar extração da base | Linha de log `clientes.listar` com `usuarioId`, `total`, `page` e `size` | Sem auditoria persistida (fora de escopo) |
| Information disclosure | Termo em log, access log ou proxy; DTO largo; 500 com SQL | Log sem o termo; access log desligado ou só com `%U`; DTO com 4 campos; 500 com mensagem fixa | Termo na query string fora da aplicação (A4) |
| Denial of service | `size` enorme; termo longo; varredura repetida | `size` e `q` limitados a 100, com 400; volume pequeno (P2) | Sem rate limiting (backlog, igual ao login) |
| Elevation of privilege | FUNCIONARIO listar tudo | Não se aplica: perfis sem diferença nesta fase | A3, risco aceito: qualquer token percorre a base |

## Threat model — fluxo de login (STRIDE)

Onde o dado pessoal entra, circula e sai: `email`+`senha` entram pelo app via
HTTPS; `senha` é comparada em memória com `senha_hash` (BCrypt) e **nunca** é
gravada em claro nem logada; `senha_hash` repousa só no MySQL; o token sai para
o dispositivo e vive lá (logout local). Base legal/retenção na tabela LGPD do
PRD da F02.

| Ameaça (STRIDE) | Vetor no login | Mitigação nesta fatia | Risco residual |
|---|---|---|---|
| Spoofing | Enumeração de usuário; força bruta/credential stuffing | 401 genérico idêntico p/ email inexistente e senha errada; BCrypt | **Sem rate limiting/lockout** nesta fatia → força bruta possível. Backlog (VIGIA/ANCORA) |
| Tampering | Forjar/alterar JWT | HS256 validado por JwtDecoder (assinatura + exp); segredo ≥256 bits fora de código | Vazamento do segredo permite forjar token (mitigar: rotação = invalida todos) |
| Repudiation | Negar ação | Log de tentativa de login sem senha/segredo | Sem auditoria rica (fora de escopo) |
| Information disclosure | Vazar PII/segredo em log ou erro | Nunca logar senha/segredo/token; erro sem stack trace; DTO sem `senha_hash` | VIGIA valida mascaramento de log |
| Denial of service | Flood no /login | — | **Sem proteção** nesta fatia; backlog |
| Elevation of privilege | FUNCIONARIO agir como ADMIN | N/A — perfis sem diferença de permissão nesta fase (briefing) | Quando houver RBAC, revisitar (nova fatia) |

Transporte (HTTPS/TLS) é responsabilidade de infraestrutura (ANCORA); o threat
model assume terminação TLS antes da API. VIGIA valida este modelo na etapa
dele.

## Divergências do briefing / texto da fatia (registradas)

1. **"11 entidades" → 12**: o schema tem 12 tabelas; `Usuario` é necessária ao
   login. Ao final da F02, `entity` tem 12 classes ([[adr/ADR-007-nao-expor-entidade-na-api-dto-e-convencao-de-nomes]]).
2. **"Migration V1" → V2 aditiva**: a V1 (usuarios) já foi aplicada pela F00; o
   schema da oficina entra como V2 para não quebrar o checksum do Flyway
   ([[adr/ADR-003-versionar-schema-com-flyway-migrations-aditivas]]).
3. **jjwt → oauth2-resource-server**: troca de biblioteca de JWT, pois a jjwt da
   F00 nunca foi usada e a fatia pede JwtEncoder/JwtDecoder
   ([[adr/ADR-004-autenticacao-stateless-via-jwt-hs256]]).
4. **Validação 422 → 400**: handler global passa a devolver 400 para Bean
   Validation ([[adr/ADR-011-handler-global-de-erro-e-mapeamento-de-status]]).
5. **Telas de Login/Perfil não entram na F02**: o backend (fundação + endpoint
   de login) é da F02; as telas são da **F30** (depende de F02 + F25), conforme
   o grafo de dependências do panorama. Decisão alinhada ao PRD (BUSSOLA já
   descopou as telas) e ao PRUMO. Não é um ADR (decisão de produto/planejamento,
   não técnica difícil de reverter).
6. **Schema V2 mínimo/incremental vs schema de referência completo**: a V2 não
   reproduz todas as colunas de `docs/script.sql` de uma vez; cria o esqueleto e
   deixa cada feature adicionar suas colunas por migration aditiva (matriz na seção
   "Reconciliação do schema com o script de referência"; fonte de verdade no
   [[adr/ADR-013-adotar-migrations-flyway-como-fonte-unica-de-verdade-do-schema]]). Aplicação direta de [[adr/ADR-003-versionar-schema-com-flyway-migrations-aditivas]];
   não abre ADR novo, mas fica registrado por afetar todas as features de negócio.
7. **Guia da casa (hexagonal) vs pacotes por camada**: o guia de convenções
   descreve arquitetura hexagonal (`domain`/`application`/`adapters`) como
   referência; o briefing da OP-002 restringe a "pacotes por camada e não por
   feature". Seguimos o briefing e o padrão já aplicado no repo
   ([[adr/ADR-001-organizar-pacotes-por-camada]], Opção C compara e descarta o
   hexagonal pelo custo desproporcional a uma oficina de pequeno porte). Divergência
   consciente do guia, registrada conforme a própria regra da casa.
8. **Utilitário de máscara em `security`**: o ADR-001 descreve `security` como autenticação JWT. A máscara de dado pessoal em log (F03a) entra no mesmo pacote, como controle transversal de proteção de dado, em vez de abrir um pacote `util` fora da estrutura canônica. A classe é fácil de mover e não muda fronteira de módulo, por isso não abre ADR.

## Sem Springfox

Não há Springfox neste repositório ([[adr/ADR-002-documentar-api-com-springdoc-openapi]]);
a documentação é springdoc desde a F00. A restrição do briefing ("Springfox
2.9.2 sai do pom") refere-se ao repositório de referência externo, não a
`op-002/apps/api`.

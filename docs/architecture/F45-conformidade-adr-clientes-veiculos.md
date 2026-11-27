# F45: conformidade do código de Clientes e Veículos com os ADRs (CARTOGRAFO, rodada 2)

Data: 2026-11-25. Código medido: `origin/main` = `00f3236`. A branch `docs/f45-revisao-sprint-02-rodada-2`
não altera `apps/` (`git diff --stat 00f3236 HEAD -- apps` vazio). Escopo: `apps/api` de Clientes e Veículos
contra ADR-001, 002, 006, 007, 011 e os ADRs de feature 017 a 028. **Nenhum ADR novo aberto**: nenhuma decisão
mudou. Leitura estática e buscas com comando; não subi a API nesta etapa (a execução por HTTP é do ESPRESSO,
`docs/product/F45-evidencia-api-espresso.md`).

## 1. Ordem de merge (pedido da revisão humana)

Não há ordem a decidir: a pilha já está na `main`. Conferido nesta etapa com
`gh pr list --state merged --json number,headRefName,baseRefName,mergedAt`:

| PR | Ramo | Base | Merge (UTC) |
|---|---|---|---|
| #25 | `feat/f03c-clientes-criar` | `main` | 2026-11-25 01:28:21 |
| #27 | `feat/f04-veiculos` | `main` | 2026-11-25 01:28:39 |
| #30 | `feat/f03d-clientes-editar` | `main` | 2026-11-25 01:28:57 |
| #37 | `docs/f45-prd-revisao-sprint-02` | `feat/f35-front-clientes-veiculos` | 2026-11-21 02:13:22 |
| #36 | `feat/f35-front-clientes-veiculos` | `docs/f35-cartografo-adrs` | 2026-11-21 02:15:05 |
| #34 | `docs/f35-cartografo-adrs` | `main` | 2026-11-25 02:06:51 |

Ordem real: F03c, F04, F03d e depois F35. A F35 tem PR (#36), mas **não contra a `main`**: o código do app
chegou à `main` dentro da #34, um PR de documentação (ARQ-15). A evidência de Maven e HTTP do ESPRESSO foi tirada
de `00f3236`, depois dos quatro merges, e vale para a pilha inteira.

## 2. Checagens executadas nesta etapa

| # | Regra (ADR) | Busca | Resultado |
|---|---|---|---|
| K1 | Controller não importa `entity` nem `repository` (ADR-001, ADR-007) | imports de `.api.entity.` e `.api.repository.` em `controller/` | 0 ocorrências |
| K2 | DTO não carrega entidade (ADR-007) | imports de `.api.entity.` em `dto/` | 2: `UsuarioResumo.java:3` (enum `Perfil`) e `VeiculoRequest.java:3` (`PlacaVeiculo`, regra de formato). Nenhuma é entidade |
| K3 | Endpoint devolve `ResponseEntity` de DTO | métodos públicos em `controller/` | Todos devolvem `ResponseEntity` de DTO (`ClienteController.java:73,159,193,261`; `VeiculoController.java:105,139,168,205`) |
| K4 | Enum como STRING (ADR-006) | `ORDINAL` em `apps/api`; `@Enumerated` em `entity/` | `ORDINAL`: 0. 5 campos de enum, 5 com `EnumType.STRING` (`Financeiro:34`, `MovimentacaoEstoque:42`, `OrdemServico:49`, `Pagamento:42`, `Usuario:41`). `Cliente` e `Veiculo` não têm enum |
| K5 | springdoc, sem Springfox (ADR-002) | `springfox` sem caixa e `springdoc` em `apps/api` | Springfox: só a menção em `apps/api/README.md:59`. springdoc 2.8.5 (`pom.xml:24`, `:90-92`) |
| K6 | Toda resposta documentada (ADR-002, ADR-011) | `responseCode = "500"` nos controllers | Clientes: 4 de 4 operações. Veículos: **0 de 4** (ARQ-03) |
| K7 | Exemplo de erro no formato real (ADR-011, ADR-023 regra 1) | exemplos que terminam em `"path"` sem `erros` | 3: `ClienteController.java:124,137,150` (ARQ-08) |

## 3. Conforme (sem ação)

| Regra | Onde | Observação |
|---|---|---|
| Regra só no service | `ClienteService.java:104-147, 157-170`; `VeiculoService.java:57-117, 187-196` | Unicidade traduzida no ponto único de gravação (ADR-020, 022, 026); dono vindo do caminho (`VeiculoService.java:60`, ADR-024). Os controllers só delegam e montam o `Location` (`ClienteController.java:163`, `VeiculoController.java:112`) |
| Normalização fora do service | `ClienteMapper.java:29-85`, `VeiculoRequest.java:53-58` | Decidida no ADR-021 (no mapper, depois da validação) e nos ADR-022 e ADR-024 (no DTO, antes da validação). Não é regra de negócio espalhada |
| Exceções ao conteúdo de pacote do ADR-001 | `entity/PlacaVeiculo.java`, `security/MascaraDadoPessoal.java`, `exception` importa `dto` | Já decididas: ADR-022 regra 1 e divergências 8 e 11 do `overview.md` |
| Entidade nunca sai | `ClienteMapper.java`, `VeiculoMapper.java:30` | CPF e endereço só no detalhe (ADR-018); `historicoOs` sempre `List.of()` (ADR-025) |
| Mass assignment | `ClienteMapper.java:29-31, 44-46`; `VeiculoMapper.java:33-43` | `unmappedTargetPolicy = ERROR`; `id`, `createdAt`, `cliente` e `quilometragem` ignorados |
| 500 sem vazamento | `GlobalExceptionHandler.java:234-239` | Log só com a classe e o caminho, sem `getMessage()` nem pilha |
| Consulta parametrizada | `ClienteRepository.java:25-27` | JPQL com `:texto` e `:telefone`, `escape '!'` (ADR-017) |
| Log sem dado pessoal | `VeiculoService.java:63-68, 94-95`; `ClienteService` | Só ids, `usuarioId` e a placa mascarada |

## 4. Divergências

O limite de 5 correções pequenas da F45 já foi usado pela ORLA (`docs/design/F45-correcoes-pequenas-app-sprint-02.md`),
então **nenhum item abaixo é corrigido nesta feature** (US-REV-02-17 e 18).

| ID | Sev. | Regra | Onde | Divergência | Tamanho | Dono | Destino |
|---|---|---|---|---|---|---|---|
| ARQ-02 | Baixa | ADR-019; política (anonimização) | `docs/architecture/arquitetura-backend.md:114` e `:183` | Exemplo de 404 com o id na mensagem e rota `DELETE /clientes/{id}`, que não existe (a API responde 405) | pequeno (doc), excedente | CARTOGRAFO, PERGAMINHO | F-DOC-1 |
| ARQ-03 | Baixa | ADR-002, ADR-011 | `VeiculoController.java`, operações em `:105`, `:139`, `:168`, `:205` | Nenhuma das 4 operações declara 500; as 4 de Clientes declaram | pequeno, excedente | ESPRESSO | F-API-1 |
| ARQ-04 | Baixa | ADR-002, ADR-023 | `VeiculoController.java:185-188` | 400 do PUT sem exemplo de `erros[]`; o POST tem (`:66-77`) | pequeno, excedente | ESPRESSO | F-API-1 |
| ARQ-07 | Baixa | ADR-021 | `ClienteRequest.java:10` e `:16` | Javadoc e `@Schema` dizem "cadastrar", mas o mesmo DTO serve o PUT | pequeno, excedente | ESPRESSO | F-API-1 |
| ARQ-08 | Baixa | ADR-011, ADR-023 regra 1 | `ClienteController.java:121-124, 134-137, 147-150` | Exemplos de 400, 401 e 409 do POST sem `erros`. A resposta real sempre traz `erros` (`ErrorResponse.java`), e o exemplo do PUT já traz (`:249-252`) | pequeno, excedente | ESPRESSO | F-API-1 |
| ARQ-09 | Baixa | ADR-023 regras 1 e 2 | `GlobalExceptionHandler.java:91-92, 166-171` | `erros[]` sai ordenado (`:100-107`), mas `mensagem` junta os erros na ordem do Bean Validation, que não é garantida | pequeno, excedente | ESPRESSO | F-API-2 (teste da ordem de `erros[]`) e F-API-7 |
| ARQ-10 | Baixa | ADR-002 | `ADR-002`, linha 44, contra `OpenApiConfig.java:14` | O ADR cita o esquema `bearer-jwt`; o código usa `bearerAuth`. O ADR é aceito e imutável e a decisão não muda, então a divergência fica registrada no `overview.md` (divergência 13) | doc | CARTOGRAFO | registrado nesta etapa |
| ARQ-11 | Baixa | ADR-019, 020, 027 | `ClienteService.java:28`; `GlobalExceptionHandler.java:36-39` | Javadoc desatualizado: o service cita só F03a e F03b; o handler não lista o 404 de domínio nem o 409 | pequeno, excedente | ESPRESSO | F-API-1 |
| ARQ-12 | Baixa | CLAUDE.md (sem duplicação) | `ClienteService.java:173-181`; `VeiculoService.java:198-206` | Mesma leitura do nome da restrição em dois services | não pequeno; extrair na 3ª ocorrência | ESPRESSO | ressalva aceita; revisitar quando Serviços ou Peças ganharem índice único (Sprint 03) |
| ARQ-13 | Baixa | nomenclatura | `ClienteService.java:120` (`atualizar`) contra `VeiculoService.java:88` (`editar`) | Nome do método diverge entre os recursos. Não muda contrato | pequeno, excedente | ESPRESSO | ressalva aceita; alinhar no próximo toque nos arquivos |
| ARQ-14 | Média | regra de ADR ("nada começa com `Proposto`") | `overview.md`, tabela Decisões | ADR-015 a 031 estão `Proposto`, e o código na `main` depende de 016 a 031 | decisão | pessoa, com CARTOGRAFO | aceite ou rejeição registrados até 2026-11-30 (junto com o D-G) |
| ARQ-15 | Média | Git e PR da casa | PR #34 | O código da F35 entrou na `main` por um PR de documentação; a #36 foi revisada contra `docs/f35-cartografo-adrs` | decisão | pessoa (PO) | ressalva explícita do PO até 2026-11-28 |
| ARQ-16 | Baixa | US-REV-02-15 | `.qa-wt/` | Worktree em `00f3236` deixa `?? .qa-wt/` no `git status`. Não cabe a este papel apagá-lo | higiene | quem criou o clone limpo | `git worktree remove .qa-wt` antes do PR |

## 5. Respostas e decisões desta etapa

1. **Ordem dos erros por campo (C7 e C26, pergunta da BUSSOLA): é contrato.** O ADR-023, regra 1, fixa `erros[]`
   ordenado por `campo` e depois por `chave`. O teste fica com o ESPRESSO (F-API-2) e afirma a ordem de `erros[]`
   (`ano`, `marca`, `placa`), não a de `mensagem`, que é texto para quem lê e não para o app.
   O app lê `erros[]` (`apps/mobile/src/services/api-request.ts:51-55`).
2. **ESP-03 (formato diferente entre Clientes e Veículos).** Não é divergência: é a consequência "Ruim" declarada no
   ADR-023 (regra 7, cliente sem `chave`). Unificar o formato exige um ADR novo e uma mudança combinada com o app.
3. **A-06 e F-API-5 (409 de cliente com `erros[]`).** É a pendência B-1 do ADR-030. Como muda a regra 7 do ADR-023,
   a F-API-5 só começa com um ADR novo, escrito pelo CARTOGRAFO quando o PO priorizar a feature. Até lá, o vínculo
   por texto do app (`apps/mobile/src/services/clients-service.ts:79-103`) fica preso pelos testes da API, que
   conferem `CPF ja cadastrado` e `Email ja cadastrado` (17 ocorrências em 9 arquivos de `apps/api/src`).
4. **ESP-02 (`//` responde 401 em `/error`).** Ressalva aceita, sem mudar o ADR-004: o firewall do Spring Security
   falha fechado. Risco residual: o app trata todo 401 como sessão expirada (`apps/mobile/src/services/http-client.ts:32`),
   então uma URL com id vazio derrubaria a sessão. Hoje a rota só carrega id validado (ADR-029). Revisitar na F-API-3.
5. **ADR-041 a 043 (propostos na rodada anterior, nunca gravados): retirados.** Nenhum passa no critério de ADR. A
   máscara de CPF na tela é decisão de produto e LGPD (D-C, no PRD e na política), e o limite de tamanho das capturas
   é regra de higiene do repositório. Os números 041 a 043 ficam marcados como não usados no `overview.md`, para não
   serem reaproveitados com outro sentido (032 a 040 já existem em ramos da Sprint 03 e 04).
6. **Fronteira automática (Confirmação do ADR-001).** Proposta F-API-8: regra `ImportControl` no `checkstyle.xml`, que
   já existe (`pom.xml:222-228`), barrando `controller` de importar `entity` e `repository`. Não adiciona dependência e
   não muda ADR.

## 6. Features de correção novas ou ampliadas

| Card | Título | Escopo | Dono | Prazo proposto |
|---|---|---|---|---|
| F-API-1 (ampliado) | `fix(api): completar o OpenAPI de Veículos e cobrir o do detalhe de cliente` | Além do já listado pelo ESPRESSO: ARQ-08 (exemplos com `erros`) e ARQ-11 (javadoc) | ESPRESSO | 2026-12-02 |
| F-API-2 (ampliado) | `test(api): cobrir cliente anonimizado no detalhe` | Além de DET-15: teste da ordem de `erros[]` em C7 e C26 | ESPRESSO | 2026-12-02 |
| F-API-7 (novo) | `fix(api): ordenar a mensagem do 400 como erros[]` | Ordenar os `FieldError` antes de `juntarMensagens`; teste com dois campos que falha antes da correção | ESPRESSO | 2026-12-11 |
| F-API-8 (novo) | `build(api): import-control do Checkstyle para as fronteiras do ADR-001` | `ImportControl` no `checkstyle.xml`; `mvn checkstyle:check` no CI | ESPRESSO, ANCORA | 2026-12-11 |
| F-DOC-1 (ampliado) | `docs(architecture): alinhar arquitetura-backend.md aos ADRs` | ARQ-02 | CARTOGRAFO, PERGAMINHO | 2026-12-02 |

## 7. O que não verifiquei

- Não subi o jar nem chamei `/v3/api-docs`. A falta de 500 em Veículos vem da leitura das anotações; o ESPRESSO já
  executou HTTP e Maven em `00f3236`.
- Não auditei o código do app contra os ADR-029 a 031 linha a linha. Usei só os trechos de serviço citados acima.
- Não abri cards no painel, porque não tenho acesso.

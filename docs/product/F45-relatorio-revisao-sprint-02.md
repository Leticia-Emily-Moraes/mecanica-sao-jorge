# F45: relatório da revisão da Sprint 02 (Clientes e Veículos), CRIVO

Data: 2026-11-20. Branch `docs/f45-prd-revisao-sprint-02`, partindo de `35a8bee`. Sem push.
Este relatório não aprova nada: o aceite é humano. Separo o que eu executei do que li de relatórios anteriores.

## 1. Estado do repositório (verificado)

Fonte: `gh pr list`, `git merge-base --is-ancestor`, `git diff`.

- A `origin/main` está em `055a6da` (PR #22, F03b). Tem só F03a (PR #18), F03b (PR #22) e o protótipo F26 (PR #19).
- F03c, F03d e F04 existem só em branches locais (`feat/f03c-clientes-criar`, `feat/f03d-clientes-editar`, `feat/f04-veiculos`). Nenhuma tem PR.
- A F35 (`feat/f35-front-clientes-veiculos`) está dentro do HEAD desta branch, mas não tem PR e não está na `main`.
- `apps/api` no HEAD é idêntico à `origin/main` (`git diff --stat origin/main HEAD -- apps/api` vazio). O HEAD tem `ClienteController` só com GET. F03c (POST), F03d (PUT) e F04 (veículos) não estão no HEAD (`git merge-base --is-ancestor feat/f03d-clientes-editar HEAD` e o de `feat/f04-veiculos` falharam).
- Consequência: o app deste HEAD tem telas de criar, editar e veículos que chamam endpoints que o backend deste HEAD não tem (CR-01).

## 2. Build e testes (executado por mim)

Árvore de trabalho no HEAD `35a8bee`, não um clone novo. JDK `openjdk 21.0.10`, Docker ativo.

Backend:

    apps/api/mvnw -B -f apps/api/pom.xml clean verify
    ...
    [INFO] Tests run: 41, Failures: 0, Errors: 0, Skipped: 0   (failsafe, ITs com MySQL 8.4.13 Testcontainers)
    [INFO] BUILD SUCCESS   Total time: 43.734 s

Soma dos relatórios: surefire 114 testes (0 falha, 0 erro, 0 ignorado), failsafe 41 (idem). Total 155. Só cobre F03a e F03b.

App Expo (`apps/mobile`):

    npm --prefix apps/mobile run lint        -> 15 problems (0 errors, 15 warnings), todos @typescript-eslint/array-type
    npm --prefix apps/mobile run typecheck   -> tsc --noEmit, sem saída de erro
    npm --prefix apps/mobile test            -> Test Suites: 1 skipped, 86 passed, 86 of 87 total
                                                Tests: 34 skipped, 851 passed, 885 total

Sem cobertura: os 34 testes de `src/qa/f35-real-api.test.tsx` ficam ignorados sem `QA_F35_API` e não foram rodados contra uma API nesta etapa.

## 3. Regressão das cinco correções pequenas (executado por mim)

Reverti os 6 arquivos de produto para `581a50d` (`git checkout 581a50d -- <arquivos>`), rodei os 5 testes, restaurei com `git checkout HEAD -- <arquivos>` e conferi `git status --short` com 0 linhas.

    npm --prefix apps/mobile test -- header-icon-button inline-notice search-field client-form-fields vehicle-form-fields
    ANTES (código de 581a50d):  Test Suites: 5 failed, 5 total / Tests: 9 failed, 52 passed, 61 total
      header-icon-button  N-05: Expected: true / Received: false
      inline-notice       N-06: Expected: >= 48 / Received: 22
      search-field        LG-04: Expected: "off" / Received: undefined
      vehicle-form-fields N-09: Expected: "Inter_600SemiBold" / Received: undefined
      client-form-fields  LG-03: 5 falhas (name, tel, email, street-address recebidos no lugar de "off"; CPF undefined no lugar de "none")
    DEPOIS (código atual):      Test Suites: 5 passed, 5 total / Tests: 61 passed, 61 total

Commits: `919d39a` (N-05), `eed2d2b` (N-06), `d5a04b2` (LG-04), `26acea2` (N-09), `301cdf4` (LG-03). Os 11 arquivos do app mudaram 117 linhas a mais e 20 a menos desde `581a50d`. `apps/api` não mudou, então o `mvn` da seção 2 vale como "depois".

Limite: o teste prova props e estilos no renderer de teste. Anel de foco, alvo de toque e autofill reais não foram vistos em aparelho.

## 4. Status por feature

Nenhuma marcada como Aprovada.

| Feature | Status | Evidência | Comando |
|---|---|---|---|
| F03a Clientes listar (PR #18) | Com ressalva | ITs `ClienteListagemIT` (24 métodos de teste) passam no `verify` da seção 2; ADR-017 e política seguem `proposto` | `apps/api/mvnw -B -f apps/api/pom.xml clean verify` |
| F03b Clientes detalhe (PR #22) | Com ressalva | `ClienteDetalheIT` 11 testes passam; decisões D-B, D-E, D-F, D-G abertas; ADR-018 e ADR-019 `proposto` | idem |
| F03c Clientes criar (F09) | Não verificado por mim | Não está no HEAD nem na `main`; sem PR. O relatório CRIVO anterior diz que o critério 9 (CPF repetido responde 409, não 201) depende da pessoa (ADR-020) | nenhum rodado |
| F03d Clientes editar (F10) | Não verificado por mim | Idem. Relatório anterior: 11 critérios passaram, deadlock real do MySQL não provado | nenhum rodado |
| F04 Veículos | Não verificado por mim | Idem. Relatório anterior: 26 critérios passaram contra a API real | nenhum rodado |
| F26 Protótipo | Com ressalva | Não li o Figma (sem ferramenta nesta sessão). ESQUADRO leu 44 frames; N-07: 5 frames propostos fora da seção F26 | nenhum rodado |
| F35 Front mobile | Com ressalva | Lint, tipos e 851 testes passam; sem captura do app, sem leitor de tela; critério de histórico de OS não atendido (F06) | seção 2 |

## 5. Matriz de critérios Gherkin x teste (só o que está no HEAD)

F03b (PRD `docs/product/F03b-clientes-detalhe.md`, seção 8), todos em `apps/api/src/test/java/br/com/mecanicasaojorge/api/integration/ClienteDetalheIT.java`:

| Cenário | Teste | Resultado no `verify` |
|---|---|---|
| US-CLI-DET-02 contrato 200 | `shouldReturnFullDetailWithSixFieldsWhenClientExists` | passou |
| DET-14 opcionais nulos | `shouldReturnNullsPresentWhenClientWasCreatedBeforeV4Columns` | passou |
| DET-02 sem vazar CPF na lista | `shouldNotExposeCpfOrAddressInListingWhenColumnsArePopulated` | passou |
| DET-04 id inexistente | `shouldReturnNotFoundNotServerErrorWhenIdDoesNotExist` | passou |
| DET-05 / DET-13 id inválido | `shouldReturnBadRequestWhenIdIsInvalid` | passou |
| DET-19 id vazio ou espaço | `shouldReturnBadRequestNotServerErrorWhenIdIsOnlyWhitespace` | passou |
| DET-06 sem token | `shouldReturnUnauthorizedWithoutQueryingWhenTokenIsMissingOrInvalid` | passou |
| DET-11 log sem dado pessoal | `shouldLogOnlyIdsWithoutAnyPersonalDataWhenDetailIsRequested` | passou |
| DET-16 migration V4 | `shouldCreateOptionalCpfAndAddressColumnsWhenMigrationsRanFromScratch`, `shouldRejectCpfOutsideElevenDigitsWhenInsertingDirectlyInDatabase` | passou |
| DET-15 cliente anonimizado | não achei teste com esse nome; só `ClienteDetalheServiceTest` (unitário) pode cobrir | lacuna a confirmar |
| DET-17 OpenAPI | não achei teste de OpenAPI para o detalhe no HEAD | lacuna a confirmar |

F03a (ADR-017, `ClienteListagemIT`, 24 métodos de teste): cobre US-CLI-01a a 06a (busca por nome, e-mail e telefone, curinga, paginação, limiar de `Integer.MAX_VALUE`, 404, 405, 401, 400, 500 sem vazamento). Não conferi cada ID do ADR contra cada método.

Token expirado: `ClienteControllerTest.shouldReturnUnauthorizedWhenTokenIsExpired` (executado no `verify`, 401 com `$.status`).

F03c, F03d, F04: a matriz não foi montada porque o código e os testes não estão neste HEAD. Fica como lacuna do critério 4.

## 6. Erros e bordas da API

Rodei só o que os ITs e testes de controller exercitam (MockMvc com MySQL real): id inexistente (404), id inválido, vazio e fora da faixa (400), sem token e token inválido (401), token expirado (401), método não suportado (405 com `Allow`), falha de banco (500 sem vazamento). Não subi o `api.jar` nem fiz chamada HTTP manual nesta etapa. Corpo inválido de POST e PUT não foi exercitado: os endpoints não estão no HEAD.

## 7. LGPD

- Registro de finalidade, base legal e retenção existe em `docs/security/politica-dados-pessoais-cliente.md`, mas toda a política está como proposta (decisão P1 aberta). Cabeçalho do arquivo no HEAD declara revisão 2.
- Código de produção do backend: busca por log com dado pessoal (`log.*(cpf|telefone|email|nome)`) e por `show-sql` em `apps/api/src/main`: 0 ocorrências. Os 3 literais parecidos com CPF ou telefone em `apps/api/src/main` são `example` do OpenAPI com valores fictícios.
- App: `console.`, `AsyncStorage`, `fetch(` e cor hexadecimal em `apps/mobile/src/components` (fora de testes): 0. Em `apps/mobile/app`: 4 hexadecimais, todos em `*.test.tsx`.
- Log real: o IT `shouldLogOnlyIdsWithoutAnyPersonalDataWhenDetailIsRequested` passou. No log do `verify` vi só `clienteId`, `usuarioId`, `qLen`, `page`, `size`, `total`.
- Fixtures: 93 ocorrências de padrão de CPF em 29 arquivos de teste. Não validei uma a uma se o dígito verificador é válido. LG-05 (VIGIA) segue aberto.

## 8. Acessibilidade, quatro estados, paridade

Não executei. Não operei VoiceOver, TalkBack, teclado externo nem abri o app. Usei a conferência estática do ESQUADRO (`docs/design/F45-conferencia-paridade-wcag-sprint-02.md`) e os testes de componente. Cobertura do ESQUADRO: 7 telas x 4 estados; faltam frames de "preenchido" em criar e de "vazio" em editar. Contraste menor lido: 4,68:1 (passa AA). Sem capturas em `docs/design/f45-capturas/`.

## 9. Achados

Tamanho segue a definição do escopo (2 arquivos de produto, cerca de 30 linhas, sem contrato, ADR, schema, dependência nem decisão de produto). Limite de 5 correções pequenas atingido pela ORLA.

| ID | Sev. | Achado | Tamanho | Dono | Destino |
|---|---|---|---|---|---|
| CR-01 | Alta | F03c, F03d e F04 sem PR e fora da `main`; F35 chama endpoints que o backend do HEAD não tem (criar, editar, veículos). Clone limpo da `main` não reproduz a Sprint 02 | não pequeno | pessoa (ordem de merge), REGENTE | decidir a ordem dos PRs; feature de correção só se a ordem exigir ajuste |
| CR-02 | Alta | LG-02: P1, P2, P3, P4 abertas (base legal aprovada, rotina de anonimização, canal do titular, aviso). Bloqueia o primeiro cliente real | não pequeno | pessoa (P1, P3), ESPRESSO (P2), BUSSOLA (P4) | ressalva aceita com bloqueio de produção; prazo definido pela pessoa |
| CR-03 | Média | LG-01: política em 3 versões (revisão 2 no HEAD, duas revisões 7 divergentes) | não pequeno | VIGIA | feature "docs(security): consolidar revisão 8" antes do merge de F04 e F03d |
| CR-04 | Média | ADR-017, 018, 019, 029, 030, 031 todos `proposto` | não pequeno (decisão) | pessoa, CARTOGRAFO | aceite explícito antes de fechar a sprint |
| CR-05 | Média | Critério 12 da F35: histórico de OS vazio até a F06 | não pequeno | F06 | ressalva aceita (critério parcial até a F06) |
| CR-06 | Média | N-01, N-03, N-04: erro de campo sem ícone, nome acessível diferente do Figma, asterisco sem a cor do Figma (`text-field.tsx`, `strings.ts`, formulários) | não pequeno | ORLA com ESQUADRO | feature de correção "fix(mobile): alinhar erro e rótulo obrigatório do TextField" |
| CR-07 | Média | N-02: faixa de erro no topo, Figma a põe acima do Salvar | não pequeno (decisão de design) | pessoa, ESQUADRO | decisão, depois feature |
| CR-08 | Média | N-07: 5 frames propostos fora da seção F26 do Figma | não pequeno (decisão) | pessoa | decisão de mover ou não |
| CR-09 | Média | Sem verificação em aparelho: leitor de tela, teclado externo, autofill real, anel de foco, alvo de toque | não pequeno | ORLA, pessoa com aparelho | próxima etapa humana (seção 10) |
| CR-10 | Média | `f35-real-api.test.tsx`: 34 testes ignorados sem `QA_F35_API`, não rodados contra API | não pequeno | ORLA, ESPRESSO | rodar quando F03c, F03d e F04 estiverem na `main` |
| CR-11 | Baixa | N-08: foco inicial do diálogo de descarte, não verificado | não pequeno (sem verificação) | ORLA | feature de correção após teste em aparelho |
| CR-12 | Baixa | LG-05: CPF de fixture com dígito verificador válido, vários arquivos de teste | não pequeno | ESPRESSO, ORLA, VIGIA | feature "chore(test): trocar CPF de fixture" |
| CR-13 | Baixa | 15 avisos de lint `array-type` (13 corrigíveis com `--fix`) em vários arquivos | não pequeno (mais de 2 arquivos) | ORLA | feature "chore(mobile): array-type" |
| CR-14 | Baixa | LG-03 incluiu o campo Nome, além da lista do VIGIA | decisão pequena | pessoa | confirmar ou tirar o Nome |
| CR-15 | Baixa | DET-15 (anonimizado) e DET-17 (OpenAPI) sem teste de integração identificável no HEAD | a confirmar | ESPRESSO | conferir; teste de regressão se faltar |
| N-05, N-06, LG-04, N-09, LG-03 | Alta, Média, Baixa, Baixa, Baixa | corrigidos pela ORLA | pequeno | ORLA | corrigido nesta feature; vermelho e verde reproduzidos na seção 3 |

## 10. Decisões abertas dos PRDs

Só a F03b está no HEAD. As de F03a, F03c, F03d e F04 estão em branches e não foram relidas por mim.

| ID | Pergunta | Dono | Estado |
|---|---|---|---|
| D-B | Endereço em campo único ou estruturado | pessoa | aberta; padrão adotado: campo único |
| D-E | Aceite do risco P8 (CPF e endereço a qualquer token válido) | pessoa | aberta; sem aceite o merge não ocorre |
| D-F | Log sem CPF e telefone (desvio do card) | pessoa com VIGIA | aberta |
| D-G | Aceite dos ADR-018 e ADR-019 | pessoa com CARTOGRAFO | aberta |
| D-C | Formato da máscara de CPF na tela | movida à F35; parecer VIGIA: o da política | aplicada no app; aceite pendente |
| Prazo | nenhuma tem prazo | pessoa | sem prazo definido; critério 12 de aceitação não fecha |

## 11. Higiene

`git ls-files` sem `target/`, `.jar`, `.apk`, `.env` rastreado; 0 commits fora de Conventional Commits entre `origin/main` e o HEAD (antes deste relatório); 0 trailers de coautor. Não rodei gitleaks.

## 12. Perguntas do escopo

1. Estado vazio do histórico de OS é esperado até a F06: sim, mas só como "parcialmente coberto". Quem confirma é a pessoa.
2. Decisões pendentes: seção 10.
3. Em dúvida sobre "pequeno", quem decide: não há resposta registrada. Proponho o PO decidir, com quem executa recomendando.

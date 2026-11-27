# F45: relatório da revisão da Sprint 02 (Clientes e Veículos), rodada 2

Data: 2026-11-25. Branch `docs/f45-revisao-sprint-02-rodada-2`, base `00f3236` (`origin/main`).
Substitui a versão de 2026-11-20, que descrevia uma `main` sem F03c, F03d, F04 e F35 e já não vale.

> **Aviso do CRIVO (2026-11-25):** a seção 1 (linha "`apps/` desta branch = `main`") e a seção 3 (Maven "não repetido")
> ficaram desatualizadas: a branch tem 3 arquivos diferentes em `apps/` (`ClienteDetalheIT`, `VeiculoIT`, `jest.config.js`),
> e o Maven foi repetido no clone limpo da branch (418 testes, BUILD SUCCESS). As contagens por feature da seção 4 também
> estão antes da rodada 3 (F04 hoje 43 cobertos e 1 parcial). O estado vigente está em `F45-relatorio-crivo-final.md`.

Este relatório não aprova nada: o aceite é humano. Em cada linha digo **quem executou** o quê:
**TORRE** (eu, nesta etapa), **ESPRESSO** (API), **ORLA** (app), **ESQUADRO** (design e a11y),
**CRIVO** (matriz). O que não reproduzi está marcado como "relato".

## 1. Estado do repositório (verificado por TORRE)

| Fato | Comando | Resultado |
|---|---|---|
| Os quatro ramos estão na `origin/main` | `git merge-base --is-ancestor feat/<ramo> origin/main` | `feat/f03c-clientes-criar`, `feat/f03d-clientes-editar`, `feat/f04-veiculos` e `feat/f35-front-clientes-veiculos`: todos ancestrais |
| Ordem real de merge | `gh pr list --state all --json number,mergedAt,baseRefName` | #25 F03c 01:28:21Z, #27 F04 01:28:39Z, #30 F03d 01:28:57Z, #31 02:04:07Z, #34 02:06:51Z (todos em 25/11, base `main`). O #36 (F35) foi mergeado em 21/11 com base `docs/f35-cartografo-adrs`, **não** na `main` |
| `apps/` desta branch = `main` | `git diff --stat 00f3236 HEAD -- apps` | vazio |
| Trailer de coautor nesta branch | `git log origin/main..HEAD --format=%B \| grep -ci co-authored` | 0 |
| Segredo | `gitleaks detect --source . --redact` | `483 commits scanned ... no leaks found` |

Consequência para a "ordem de merge" da revisão humana: a ordem real foi F03c, F04, F03d e depois F35.
A `main` nunca teve tela chamando endpoint inexistente. O CR-01 do relatório antigo e a leitura de que
"a F35 entrou quatro dias antes" estão **errados** (o #36 não foi para a `main`). F35 está na `main`, sem
ressalva de PO a registrar por esse motivo.

## 2. Como cada ponto da revisão humana foi tratado

| Ponto | Situação | Tratamento |
|---|---|---|
| Obs. geral: F35 sem PR, ordem de merge | Resolvido por fato | Seção 1 |
| Critério 1 | Resolvido, com limite | Linhas refeitas na seção 4 depois do merge. Nenhuma "Aprovada" |
| Critério 2 | Resolvido por ESPRESSO | 410 testes (250 surefire + 160 failsafe) em clone limpo de `00f3236`. **TORRE não repetiu o Maven**: `apps/` não mudou |
| Critério 3 | Parcial | Lint, tipos e testes do app repetidos por TORRE (seção 3). `f35-real-api` rodou pela ORLA, em 3 invocações com semente manual, não numa execução limpa (LAC-01) |
| Critério 4 | Parcial | Matriz de 146 linhas pronta (`F45-matriz-gherkin-x-teste.md`). O texto dos cards de F03a, F03c, F03d e F35 **não está no repo**; depende da pessoa colar (LAC-05, LAC-06). L-02 a L-08: não achei esses IDs na Sprint 02; a pessoa precisa dizer onde estão |
| Critério 5 | Resolvido por ESPRESSO | 52 chamadas HTTP contra o jar e MySQL 8.4: seção 5 |
| Critério 6 | Parcial | Dígito verificador validado por TORRE (seção 6). Troca dos CPFs vira feature de correção. Política como proposta, com data (seção 8) |
| Critério 7 | **Não executado** | Sem `idb`, `adb` nem aparelho em nenhuma rodada. Só leitura estática e teste de componente. Bloqueio de ambiente |
| Critério 8 | Parcial | 8 capturas (preenchido, vazio, histórico vazio). Carregando e erro só em Jest. Lacuna de design: preenchido em criar e vazio em editar não têm frame na F26 |
| Critério 9 | Não atendido como pedido | Capturas são de iPhone 17 (402×874), não 360×740. F26 consta como aguardando aprovação. N-02 e N-07 esperam o PO |
| Critério 10 | Resolvido | Buscas com comando e saída pela ORLA e ESQUADRO: 0 texto fixo em JSX, 0 cor fora de `tokens.ts`, 0 chamada de rede em tela. Limites na seção 7 |
| Critério 11 | Resolvido, parcial até a F06 | Captura V2 (`app-V2-detalhe-veiculo-historico-vazio-ios-402x874.png`) |
| Critério 12 | Parcial | Datas propostas na seção 9. D-8: confirmado só em F03b e F04; PRDs de F03a, F03c e F03d não existem em nenhuma branch |
| Critério 15 | Gitleaks resolvido; trailer aberto | `03e7646` já está na `main` (52 mensagens com o trailer). Corrigir exige reescrever histórico publicado: decisão da pessoa (seção 8) |
| Features de correção e descrição do PR | Cards prontos (seção 10); PR em `F45-pr-rascunho-corpo.md` | Não abri card no painel (sem acesso) |

## 3. Lint, tipos e testes do app (executado por TORRE, `00f3236`)

    npm --prefix apps/mobile run lint        -> 15 problems (0 errors, 15 warnings), 13 corrigíveis com --fix
    npm --prefix apps/mobile run typecheck   -> tsc --noEmit, sem saída de erro
    npm --prefix apps/mobile test -- --silent

Quatro execuções completas da suíte nesta sessão:

| Execução | Resultado |
|---|---|
| 1 (disparada na mesma chamada que lint e typecheck, então em paralelo com eles) | **2 testes falharam em 2 suítes**: `Tests: 2 failed, 34 skipped, 889 passed, 925 total`; `Test Suites: 2 failed, 1 skipped, 96 passed`; 47 s. Só ficou visível `client-edit-screen.test.tsx:103` (`should fill the form with the client data once it is loaded`). **Não gravei o nome do outro teste nem da outra suíte** |
| 2 | `Tests: 34 skipped, 891 passed, 925 total`; 98 suítes passando; 19,5 s |
| 3 | idem, 891 passaram |
| 4 (com lint e typecheck em paralelo de propósito, para forçar carga) | 891 passaram, 40,6 s. **Não reproduziu a falha** |

Leitura: 1 falha em 4 execuções, e o CRIVO/PO já tinham visto 1 em 3 em 25/11 (`menu-routing.test.tsx:59`). O teste
visível usa `findBy*` com tempo padrão de 1 s. **Hipótese, não provada:** estouro de tempo sob carga.
Não é um defeito de produto provado. Fica como LAC-10 (feature de correção F-APP-10). Quem aceitar a
suíte como "verde" deve saber que ela é intermitente.

Sem cobertura: os 34 testes de `src/qa/f35-real-api.test.tsx` ficam ignorados sem `QA_F35_API`. **TORRE não os
rodou** (exigem API e MySQL). Resultado da ORLA: 34 passaram em 3 invocações (`F45-evidencia-app-orla-rodada-2.md`, seção 3).

Backend (relato do ESPRESSO, `F45-evidencia-api-espresso.md`, seção 1):

    apps/api/mvnw -B -f apps/api/pom.xml clean verify      (clone limpo de 00f3236, JDK 21.0.10)
    surefire 250 + failsafe 160 = 410 testes, 0 falha, 0 erro, 0 ignorado. BUILD SUCCESS, 01:47 min

Não repeti após as correções porque **nenhum código de produto mudou nesta etapa** (seção 11).

## 4. Status por feature (critério 1)

Nenhuma como Aprovada, nenhuma como Reprovada. "Execução" diz quem rodou depois do merge.

| Feature | Status | Evidência | Comando / execução |
|---|---|---|---|
| F03a Clientes listar | Com ressalva | Matriz: 14 cobertos, 4 parciais; ADR-017 `proposto`; texto do card ausente | `mvn clean verify`, ESPRESSO |
| F03b / F08 Clientes detalhe | Com ressalva | 6 cobertos, 3 parciais, 2 lacunas (DET-15 anonimizado e DET-17 OpenAPI, confirmados sem teste); D-B, D-E, D-F, D-G abertas | idem |
| F03c / F09 Clientes criar | Com ressalva | 10 cobertos, 3 lacunas (IDs sem registro); CPF repetido responde 409 e o card dizia 201 (ADR-020 `proposto`); CPF obrigatório na API contra "opcional" no app (LG-07, P9) | idem + 52 chamadas HTTP, ESPRESSO |
| F03d / F10 Clientes editar | Com ressalva | 10 cobertos, 1 parcial; deadlock real do MySQL não provado (LAC-07) | idem |
| F04 Veículos | Com ressalva | 37 cobertos, 7 parciais (LAC-08); formato de erro diferente do de Clientes (ESP-03) | idem |
| F26 Protótipo | Com ressalva | Aguardando aprovação; N-02 e N-07 sem decisão; 13 critérios só pelo relato do ESQUADRO | nenhum rodado por TORRE |
| F35 Front mobile | Com ressalva | 20 cobertos contra API simulada, 5 parciais, 2 lacunas, 3 manuais; histórico de OS vazio até a F06; sem aparelho | seção 3 |

F03c, F03d e F04 saem de "Não verificada" só porque o ESPRESSO rodou Maven e HTTP depois do merge. A decisão de
tratar essa execução como suficiente é do CRIVO.

## 5. Erros e bordas da API (relato do ESPRESSO, 52 chamadas)

Jar do clone limpo, MySQL 8.4, Flyway V1 a V8, token expirado forjado com chave descartável.

| Caso | Resultado | Formato ADR-011 |
|---|---|---|
| Sem token, token lixo, token expirado | 401, `erros: []` | sim |
| Cliente ou veículo inexistente | 404 | sim |
| id `abc`, `0`, `-1`, `99999999999999999999` | 400 `Parametro invalido: id` | sim |
| `{}` em POST e PUT | 400, 3 campos em `erros[]` | sim |
| JSON malformado / sem `Content-Type` | 400 / 415 | sim |
| CPF, e-mail, placa repetidos | 409 | sim |
| `DELETE /clientes/{id}` | 405 | sim |

Varredura das 52 respostas: 0 `Exception`, 0 `at pacote.Classe(`, 0 `org.springframework`. Dado enviado só volta em 2xx.
Achados novos: ESP-01 (número JSON gravado como nome, Baixa), ESP-02 (`//` responde 401 com `path:/error`, Baixa), ESP-03 (formato de erro diferente entre Clientes e Veículos, Baixa).

## 6. LGPD (critério 6)

**Dígito verificador dos CPFs de fixture (executado por TORRE).** Script `cpf-check.mjs` (scratchpad, fora do repo) sobre
`git ls-files apps docs`, com formato `000.000.000-00` e 11 dígitos soltos:

    total ocorrencias=289 validas=48 invalidas=241
    distintos validos=7

Os 7 valores válidos (mascarados): `111.***-35`, `123.***-09` (12 ocorrências), `168.***-09`, `390.***-05`,
`529.***-25` (24), `862.***-57`, `987.***-00` (7). São os CPFs de amostra mais conhecidos de tutoriais e
geradores, mas têm dígito verificador correto e, por isso, podem pertencer a uma pessoa real.
Distribuição, 18 arquivos: 10 de teste do app, 3 de teste da API (`ClienteCriarIT`, `MascaraDadoPessoalTest`,
`ClienteAtualizarServiceTest`, 7 ocorrências), 4 documentos e **1 comentário em código de produto**
(`apps/mobile/src/formatters/cpf-format.ts:6`).

Limite do script: pega qualquer sequência de 11 dígitos, então a contagem de "inválidas" inclui telefone e timestamps.
Por isso só interpreto a contagem de **válidas**.

**Por que a troca (LG-05, LG-06) não é pequena e não é só "trocar":**
- passa de 2 arquivos (18 arquivos com ocorrência válida);
- o app **valida o dígito verificador** (`apps/mobile/src/validators/cpf.ts`), então os testes do formulário e do
  validador **precisam** de CPF válido. A solução é um gerador marcado como fictício (`cpfFicticio`, F-APP-8),
  não substituir por número inválido;
- a API **não** valida o dígito (`ClienteRequest.java:25-26`: `@NotBlank` e regex de 11 dígitos), então os testes
  da API podem usar valor inválido (F-API-6);
- divergência nova, **LG-09 (Baixa)**: um CPF com dígito errado é recusado pelo app e aceito pela API. Mexe em contrato; decisão do PO junto com P9.

**Captura com dado sensível (novo, Baixa).** `docs/design/f45-capturas/app-E1-editar-cliente-preenchido-ios-402x874.png`
mostra o CPF `529.982.247-25` completo no campo de edição (e `maria@exemplo.invalid`, `(11) 90000-0001`).
É dado fictício, mas com dígito válido. Os outros dados nas capturas que abri (L1, E1) são fictícios
(`...Fictícia`, `exemplo.invalid`, `90000-xxxx`). Eu abri 2 das 9 imagens; as outras 7 **não conferi**.
A rodada 1 do CARTOGRAFO propôs um ADR-041 com CPF "sempre mascarado na tela", retirado na rodada 2
(`docs/architecture/F45-conformidade-adr-clientes-veiculos.md`, seção 5, item 5): a máscara na tela é a decisão D-C,
de produto e LGPD, e não vira ADR. O campo de edição mostra o valor inteiro por ser um input. Decisão de produto, não corrigi.

**Log real (relato do ESPRESSO).** Depois das 52 chamadas: CPF cru 0, telefone cru 0, e-mail 0, nome 0, placa crua 0, stack trace 0.
**TORRE não reproduziu**, porque não subi o jar.

**Política.** Finalidade, base legal e retenção estão em `docs/security/politica-dados-pessoais-cliente.md` e
`docs/security/lgpd-registro-dados-pessoais.md`, **como proposta (P1)**. Isso é ressalva e não aceite: seção 8.

## 7. Acessibilidade, quatro estados, paridade e componentização

**Não executado em aparelho por ninguém.** O que existe:
- leitura estática de 7 telas e contraste calculado sobre tokens (29 pares, 3 abaixo do alvo, todos contornos decorativos), ESQUADRO;
- 8 capturas do app no iPhone 17 (402×874) e 1 do Figma, em `docs/design/f45-capturas/` (9 PNG, 1,4 MB, o maior com 208 KB);
- estados carregando e erro só em Jest (RTL). Sem captura;
- **Não ouvi** o que VoiceOver ou TalkBack anunciam, **não testei** teclado externo (N-05) e **não medi** contraste no app renderizado.

Buscas do critério 10 (ORLA, `grep -rEn` em `apps/mobile/app` e `src`, sem `*.test.*`): texto em JSX 0; props de texto com literal 0;
`#hex` ou `rgb()` fora de `tokens.ts` 0; `fetch`/`axios`/`AsyncStorage` em tela 1 (um **comentário**, `session-restore-screen.tsx:16`);
import de `@/services/` em tela ou componente 0. O grep não acha texto montado em variável ou `Alert`; A-05 e A-07 vêm da leitura do ESQUADRO.

Divergências de paridade (ESQUADRO, seção 7 da auditoria): PA-01 (título de seção), PA-04 (rodapé ancorado ou em fluxo) Média; PA-02, PA-03 Baixa.
**Pedido de decisão ao PO:** N-02 (faixa de erro acima ou no topo do Salvar) e N-07 (5 frames propostos fora da seção F26).

## 8. Itens que dependem de pessoa (sem decisão ainda)

| Item | O que falta | Dono | Prazo proposto |
|---|---|---|---|
| Política de dados do cliente (P1, P2, P3, P4) | **Registrada como proposta**, não aprovada. Bloqueia o **primeiro cliente real** em produção | pessoa (P1, P3), ESPRESSO (P2), BUSSOLA (P4) | 2026-12-04 |
| Aceites escritos de D-E/P8, ADR-020 e P16 | O #22 dizia "merge só depois desses aceites" e foi mergeado; **os corpos dos PRs não registram aceite**. Não afirmo que não houve, afirmo que não há registro | pessoa | 2026-11-30 |
| Trailer `Co-Authored-By` em `03e7646` (e 52 mensagens na `main`) | Reescrever exige force-push na `main`. **Não fiz.** Aceitar como ressalva ou autorizar | pessoa | 2026-11-30 |
| ADR-041 a 043 (CARTOGRAFO) | **Retirados na rodada 2.** Nenhum passa no critério de ADR (D-C é decisão de produto e LGPD; tamanho de captura é higiene). Os números ficam marcados como não usados no `overview.md` | CARTOGRAFO | fechado em 2026-11-25 |
| N-02, N-07, PA-04 | Decisão de design | pessoa | 2026-11-28 |
| P9 (CPF obrigatório ou opcional) e LG-09 | Contrato | BUSSOLA, pessoa | 2026-12-02 |
| Aprovação da F26 | Aguardando | pessoa | 2026-11-28 |

## 9. Decisões abertas dos PRDs (critério 12)

Só existem PRDs de F03b e F04 no repo. F03a, F03c e F03d **não têm PRD em nenhuma branch nem no histórico**
(`git log --all -- 'docs/product/F03a*' ...` vazio, segundo o CARTOGRAFO); por isso D-8 só está confirmado
para essas duas. As datas abaixo são **proposta de TORRE, a confirmar pelo PO**; se a seção 6 do handoff da BUSSOLA
tiver outras, as dela prevalecem.

| ID | Pergunta | Dono | Prazo proposto | Estado |
|---|---|---|---|---|
| D-B | Endereço em campo único ou estruturado | pessoa | 2026-12-04 | aberta; campo único em uso |
| D-C | Formato da máscara de CPF na tela | pessoa com VIGIA | 2026-11-30 | aplicada no app; aceite pendente |
| D-E | Aceite do risco P8 (CPF e endereço a qualquer token válido) | pessoa | 2026-11-30 | aberta; **sem registro de aceite apesar do merge** |
| D-F | Log sem CPF e telefone (desvio do card) | pessoa com VIGIA | 2026-11-30 | aberta |
| D-G | Aceite dos ADR-018 e ADR-019 | pessoa com CARTOGRAFO | 2026-11-30 | aberta |

## 10. Achados: severidade, tamanho, dono e destino (critério 13)

Tamanho segue a definição do card. **Limite de 5 correções pequenas usado** (seção 11).

| ID | Sev. | Achado | Tamanho | Dono | Destino |
|---|---|---|---|---|---|
| N-05, N-06, LG-04, N-09, LG-03 | Alta, Média, Baixa, Baixa, Baixa | foco do cabeçalho, alvo de fechar aviso, autocomplete da busca, peso de fonte, autofill do formulário | pequeno | ORLA | **corrigidos nesta feature** (`919d39a`, `eed2d2b`, `d5a04b2`, `26acea2`, `301cdf4`) |
| A-01, A-02 | Média | "Limpar busca" com alvo de cerca de 34×20 e sem anel; "Fechar aviso" sem anel | pequeno, **excedente do limite** | ORLA | F-APP-2 |
| A-04, A-08, A-10 | Baixa | nome acessível em carregamento; tokens do ícone de alerta; chaves sem uso | pequeno, **excedente** | ORLA | F-APP-6 |
| N-01, N-03, N-04 | Média | erro de campo sem ícone, nome acessível e asterisco diferentes do Figma | não pequeno (3+ arquivos) | ORLA, ESQUADRO | F-APP-1 |
| A-03, N-08 | Média, Baixa | anúncio da faixa de erro; foco do diálogo de descarte | não pequeno (só fecha em aparelho) | ORLA, CRIVO | F-APP-4 |
| A-05 | Baixa | chaves de erro de campo fora de `area.componente.texto` | não pequeno (ADR-030) | CARTOGRAFO, ORLA | F-APP-9 (novo, proposto por TORRE) |
| A-06 | Média | app compara o texto exato do 409 | não pequeno (contrato) | ESPRESSO, ORLA, CARTOGRAFO | F-API-5 (novo, proposto por TORRE) |
| A-07, A-09 | Baixa | `Intl`, hooks `useVoltar` e de foco | não pequeno | ORLA | F-APP-6 |
| PA-01, PA-02, PA-03 | Média, Baixa, Baixa | título de seção, ícone de editar, texto no cartão sem OS | não pequeno | ORLA, ESQUADRO | F-APP-3 |
| N-02, N-07, PA-04 | Média | faixa de erro, frames fora da seção, rodapé | decisão de produto | pessoa | seção 8 |
| LAC-01 | Média | `f35-real-api` não roda em execução única | não pequeno | ORLA | F-APP-5 |
| LAC-10 | Média | suíte Jest intermitente (seção 3) | não pequeno (sem causa provada) | ORLA | F-APP-10 (novo, proposto por TORRE) |
| LG-05, LG-06 | Baixa | 7 CPFs com dígito válido em 18 arquivos | não pequeno | VIGIA, ORLA, ESPRESSO | F-APP-8 e F-API-6 |
| LG-07, LG-09 | Média, Baixa | CPF obrigatório na API contra "opcional"; app e API divergem no dígito | contrato | BUSSOLA, ESPRESSO, ORLA | F-API-4 e F-APP-7 |
| LG-01 | Média | política de dados em mais de uma revisão | não pequeno | VIGIA | F-DOC-2 |
| LG-02 | Alta | P1 a P4 abertas; bloqueia o primeiro cliente real | decisão | pessoa e donos da seção 8 | ressalva aceita pendente |
| ESP-01, ESP-02, ESP-03, LG-08 | Baixa | ver `F45-evidencia-api-espresso.md`, seções 2 e 4; decisões de ESP-02 e ESP-03 em `docs/architecture/F45-conformidade-adr-clientes-veiculos.md`, seção 5 | não pequeno | ESPRESSO, CARTOGRAFO | F-API-3 (ESP-01, LG-08); ESP-02 ressalva aceita; ESP-03 conforme ADR-023 |
| ARQ-02 a ARQ-16 | Baixa (ARQ-14 e ARQ-15 Média) | conformidade do código de Clientes e Veículos com os ADRs, com `file:line`, em `docs/architecture/F45-conformidade-adr-clientes-veiculos.md`, seção 4 | ver o documento | ESPRESSO, CARTOGRAFO, pessoa | F-API-1, F-API-2, F-API-7, F-API-8, F-DOC-1 e ressalvas |
| LAC-02, LAC-03, LAC-04, LAC-07, LAC-08 | Média, Baixa | testes de backend que faltam ou são parciais | não pequeno | ESPRESSO | F-API-1, F-API-2 e LAC-07 como ressalva |
| LAC-05, LAC-06 | Média | texto dos cards fora do repo | decisão | BUSSOLA, pessoa | pessoa cola o texto |
| CR-05 | Média | histórico de OS vazio até a F06 | não pequeno | F06 | ressalva aceita; "parcialmente coberto" |

Cartões a abrir, escopo resumido e dono (**eu não abri nenhum**, não tenho acesso ao painel; criar issue no GitHub seria publicar fora do combinado):

| Card | Título | Prazo proposto |
|---|---|---|
| F-APP-1 | `fix(mobile): alinhar erro e rótulo obrigatório do TextField` | 2026-12-02 |
| F-APP-2 | `fix(mobile): alvo de 48 e anel de foco no limpar busca e no fechar aviso` | 2026-12-02 |
| F-APP-3 | `fix(mobile): título de seção, ícone de editar e texto do cartão sem OS conforme o Figma` | 2026-12-04 |
| F-APP-4 | `fix(mobile): anúncio da faixa de erro e foco do diálogo de descarte` (só fecha com aparelho) | 2026-12-09 |
| F-APP-5 | `test(mobile): f35-real-api cria as próprias fixtures` | 2026-12-04 |
| F-APP-6 | `refactor(mobile): nome acessível em carregamento, Intl, tokens do ícone, hooks e chaves sem uso` | 2026-12-11 |
| F-APP-7 | `fix(mobile): CPF opcional conforme P9` (depende de F-API-4) | 2026-12-04 |
| F-APP-8 | `test(mobile): gerador cpfFicticio no lugar dos CPFs válidos fixos` | 2026-12-04 |
| F-APP-9 | `docs(architecture): alinhar chaves de erro de campo ao ADR-030` | 2026-12-04 |
| F-APP-10 | `test(mobile): estabilizar a suíte intermitente (findBy com tempo, act)` | 2026-12-04 |
| F-API-1 | `fix(api): completar o OpenAPI de Veículos e cobrir o do detalhe de cliente` | 2026-12-02 |
| F-API-2 | `test(api): cobrir cliente anonimizado no detalhe` | 2026-12-02 |
| F-API-3 | `fix(api): tolerância do token vencido e coerção de nome` | 2026-12-11 |
| F-API-4 | `fix(clientes): tornar CPF opcional conforme P9` | 2026-12-04 |
| F-API-5 | `fix(api): devolver erros[] no 409 de cliente` (só começa com ADR novo que substitua a regra 7 do ADR-023) | 2026-12-11 |
| F-API-6 | `test(api): trocar os CPFs de fixture por valores com dígito inválido` | 2026-12-04 |
| F-DOC-1 | `docs(architecture): alinhar arquitetura-backend.md aos ADRs` | 2026-12-02 |
| F-API-7 | `fix(api): ordenar a mensagem do 400 como erros[]` | 2026-12-11 |
| F-API-8 | `build(api): import-control do Checkstyle para as fronteiras do ADR-001` | 2026-12-11 |
| F-DOC-2 | `docs(security): consolidar a política de dados do cliente em uma revisão` | 2026-12-02 |

Dono de cada card: o da coluna "Dono" acima. F-APP-9, F-APP-10, F-API-5 e F-API-6 são **propostas novas de TORRE**; F-API-7 e F-API-8 são **propostas do CARTOGRAFO** (ESPRESSO executa; ANCORA liga a F-API-8 no CI); as demais vêm da ORLA e do ESPRESSO.

## 11. Correções pequenas e regressão (critérios 16 a 19)

O limite de 5 já foi usado pela ORLA, antes desta etapa. Cada uma com teste que falhou antes e passou depois
(`F45-correcoes-pequenas-app-sprint-02.md`, relato da ORLA): N-05 `Expected: true / Received: false`;
N-06 `Expected: >= 48 / Received: 22`; LG-04 `Expected: "off" / Received: undefined`; N-09 `Expected: "Inter_600SemiBold" / Received: undefined`;
LG-03 5 falhas. **TORRE não reverteu nem reexecutou o vermelho.**

Nesta etapa **não alterei nenhum código de produto**: uma 6ª correção violaria a US-REV-02-18 e a premissa 5 do card só deixa o PO
mudar o limite antes da revisão. A reexecução depois das correções (critério 19) é a da seção 3: sem teste que passava e passou a falhar,
**exceto a intermitência da seção 3**, que também apareceu na rodada do PO em 25/11. Não provei se ela é anterior às cinco correções.

## 12. Higiene (critério 15)

`git status` ao fechar: ver `F45-pr-rascunho-corpo.md`. Sem segredo (gitleaks, seção 1). Sem trailer de coautor nesta branch.
Capturas: 9 PNG, maior 208 KB, pasta de 1,4 MB. O limite de tamanho das capturas fica como regra de higiene do repositório, não como ADR (ADR-041 retirado na rodada 2).

## 13. Perguntas do escopo

1. Estado vazio do histórico de OS até a F06: esperado, registrado como "parcialmente coberto". Quem confirma é a pessoa.
2. Decisões pendentes: seção 9.
3. Quem decide "pequeno" em caso de dúvida: sem resposta registrada. Proposta: o PO decide e quem executa recomenda.

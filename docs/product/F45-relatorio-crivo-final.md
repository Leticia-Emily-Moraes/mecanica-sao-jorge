# F45: relatório final de QA (CRIVO), revisão da Sprint 02 (Clientes e Veículos)

Data: 2026-11-25. Branch `docs/f45-revisao-sprint-02-rodada-2`, HEAD `126d44d` (base `origin/main` = `00f3236`).
Este documento consolida os relatórios de TORRE, ESPRESSO, VIGIA, ESQUADRO e ORLA. **Não aprova a F45: o aceite é humano.**

Convenção de evidência em todas as tabelas:
- **VI** = vi rodar nesta etapa (comando e saída reais, abaixo).
- **RELATO** = outro agente executou; eu li o documento dele e não repeti.
- **SUPOSTO / NÃO VERIFICADO** = ninguém executou, ou não há como executar neste ambiente.

## 1. O que eu executei (VI)

Ambiente: macOS, JDK Temurin 21.0.10, Node do repo, Docker (MySQL 8.4 e Java 21 JRE descartáveis, removidos ao fim),
dados fictícios, segredo JWT descartável que não foi versionado. Tudo em clone limpo da branch no scratchpad, fora do repo.

| # | Comando (resumido) | Resultado real |
|---|---|---|
| 1 | `git clone` da branch em pasta nova; `apps/api/mvnw -B -f <clone>/apps/api/pom.xml clean verify` | `Tests run: 250, Failures: 0, Errors: 0, Skipped: 0` (surefire) + `Tests run: 168, Failures: 0, Errors: 0, Skipped: 0` (failsafe) = **418 testes**; `BUILD SUCCESS`; `Total time: 59.727 s`. O ESPRESSO contou 410 na `main` (`00f3236`); os 8 a mais são os testes de `ClienteDetalheIT` e `VeiculoIT` que a branch adiciona. As linhas `ERROR ... GlobalExceptionHandler` na saída são os logs esperados dos testes de caminho de erro (só classe da exceção e `path`) |
| 2 | `npm --prefix apps/mobile run lint` | `15 problems (0 errors, 15 warnings)`, 13 corrigíveis com `--fix` |
| 3 | `npm --prefix apps/mobile run typecheck` | `tsc --noEmit`, sem erro |
| 4 | `npm --prefix apps/mobile run format:check` | `All matched files use Prettier code style!` |
| 5 | `npm --prefix apps/mobile test -- --silent` | `Test Suites: 1 skipped, 98 passed, 98 of 99 total`; `Tests: 34 skipped, 891 passed, 925 total` (1 execução; não vi a intermitência LAC-10 nela) |
| 6 | MySQL 8.4 + `api.jar` do clone (Flyway aplicado) + usuário ADMIN fictício; `f35-real-api.test.tsx` com `QA_F35_API` | Invocação 1 (banco vazio, `-t "lista vazia"`): `1 passed, 33 skipped`. Invocação 2 (semente de 3 clientes, 1 veículo, 1 OS; `-t "^(?!.*lista vazia)"`): `33 passed, 1 skipped`. **34 de 34 passaram, em 2 invocações, não em uma** (a suíte não cria as próprias fixtures: F-APP-5) |
| 7 | Bateria HTTP contra o jar (`crivo-bordas.mjs`, `crivo-bordas2.mjs`, 38 chamadas, mais os logins; seção 3) | Tabela da seção 3 |
| 8 | Log do contêiner da API (67 linhas após a bateria HTTP; 132 após a suíte do app) com `grep -cE` por CPF, telefone, e-mail, nome, placa, senha, segredo, `Bearer`, `eyJ`, `Exception`, `at `, `Duplicate entry`, `WARN` | **0 ocorrência em todos os padrões**, nas duas leituras |
| 9 | Contraste medido em pixels de 3 capturas renderizadas (`contraste.mjs`, 12 regiões) | Menor razão **4,93:1** (rótulo cinza sobre o fundo claro); texto de corpo sobre branco 5,36:1; valor digitado 12,12:1; botão primário (branco sobre `#B5453D`) 5,41:1. Todas ≥ 4,5:1 |
| 10 | 4 buscas `grep -rnE` em `apps/mobile/app` e `src`, sem `*.test.*` e sem `qa/` (seção 4) | 0 ocorrência em cada uma; controle positivo do padrão de texto fixo: 7 em teste, 0 em produção |
| 11 | N-05: removi no clone as 3 linhas de foco de `header-icon-button.tsx`, rodei o teste, restaurei, rodei de novo | Sem a correção: `✕ should draw the white focus ring only while focused (F45 N-05, WCAG 2.4.7)`, `Expected: true / Received: false`, `1 failed, 5 passed`. Com a correção: `6 passed` |
| 12 | `gitleaks detect --source . --redact` | `496 commits scanned ... no leaks found` |
| 13 | `git log origin/main..HEAD` | 17 commits, **17 em Conventional Commits**, 0 com `co-authored`. 12 binários no diff, todos PNG de evidência em `docs/design/f45-capturas/` (tamanhos não remedidos por mim; TORRE relatou maior de 208 KB) |

## 2. Status por feature (critério 1)

Nenhuma como **Aprovada**. Quem decide aprovar é a pessoa.

| Feature | Status | Evidência | Comando |
|---|---|---|---|
| F03a Clientes listar | Com ressalva | VI: ITs de listagem passam no build 418. Matriz 14 cobertos, 4 parciais. ADR-017 ainda `proposto`; texto do card ausente no repo (LAC-06) | #1, `F45-matriz-gherkin-x-teste.md` |
| F03b / F08 Clientes detalhe | Com ressalva | VI: `ClienteDetalheIT` 14 testes passam. Matriz 8 cobertos, 3 parciais; DET-11 (500 sem vazar dado) e DET-16 (upgrade V3 para V4) sem teste. D-B, D-E, D-F, D-G abertas | #1 |
| F03c / F09 Clientes criar | Com ressalva (era "Não verificada") | VI: `ClienteCriarIT` 30 testes passam, jar real: 201, 400, 409 observados. CPF repetido responde **409**, o card dizia 201 (ADR-020 `proposto`). IDs 20.1, 20.2, 20.7 sem registro | #1, #7 |
| F03d / F10 Clientes editar | Com ressalva (era "Não verificada") | VI: `ClienteAtualizarIT` 33 testes passam; PUT 404 e 409 observados. Deadlock real do MySQL **não provado** (LAC-07) | #1, #7 |
| F04 Veículos | Com ressalva (era "Não verificada") | VI: `VeiculoIT` 56 e `VeiculoSegurancaIT` 5 passam. Matriz 43 cobertos, 1 parcial (C19a). Formato do 400 difere do de Clientes (ESP-03, conforme ADR-023) | #1, #7 |
| F26 Protótipo | **Não verificada** | Não tenho ferramenta do Figma. RELATO do ESQUADRO: 4 frames conferidos. Aprovação da F26 **não registrada**; N-02, N-07, PA-04, D-C sem decisão | nenhum meu |
| F35 Front mobile | Com ressalva | VI: lint 0 erros, tipos ok, 891 testes passam, 34 contra API real passam (2 invocações). Sem leitor de tela, teclado externo, captura 360 × 740, carregando e erro só em Jest | #2 a #6 |

## 3. Erros e bordas da API (VI, jar do clone, MySQL 8.4)

Resposta de erro observada sempre com `timestamp, status, erro, mensagem, path, erros[]`, o formato da ADR-011.
Em nenhuma das 38 respostas: stack trace, mensagem de banco (`jdbc`, `Duplicate entry`, `org.springframework`) nem dado enviado de volta em 4xx.

| Caso | Obtido |
|---|---|
| `GET /clientes`, `/clientes/1`, `/veiculos/1`, `POST /clientes`, `PUT /clientes/1`, `POST /clientes/1/veiculos` sem token | 401 `Nao autenticado`, `erros: []` |
| Token vencido (1 h, HS256 com a chave descartável), token lixo, assinatura errada | 401 igual |
| `GET /clientes/999999`, `GET /veiculos/999999` | 404 `Cliente nao encontrado` / `Veiculo nao encontrado` |
| `PUT /clientes/999999`, `POST /clientes/999999/veiculos`, `PUT /veiculos/999999` com corpo válido | 404 |
| `GET /clientes/abc`, `/0`, `/-1`, `/99999999999999999999`, `GET /veiculos/abc` | 400 `Parametro invalido: id` |
| `POST /clientes` com `{}` | 400, `cpf e obrigatorio; telefone e obrigatorio; nome e obrigatorio` |
| `PUT /clientes/1` com `{}` | 400 |
| JSON malformado / `Content-Type: text/plain` | 400 `Corpo da requisicao invalido` / 415 |
| nome com 151 caracteres, CPF com 10 dígitos, e-mail sem arroba | 400, um erro em `erros[]` com o campo |
| CPF repetido em `POST` e em `PUT` | 409 `CPF ja cadastrado`, sem o valor |
| Veículo com `{}`, placa inválida, ano 1800 | 400; a `mensagem` traz **chaves** (`veiculo.form.ano.faixa`) em vez de texto (ESP-03) |
| `DELETE /clientes/{id}` | 405 |
| `POST /clientes` com `nome: 12345` (número JSON) | **201** e grava `"12345"` (ESP-01, confirmado) |

Observação: com corpo inválido **e** id inexistente a API devolve 400 antes do 404 (validação antes da busca). Não é defeito; vale saber ao ler o teste.

## 4. Componentização e i18n (VI)

Comandos (cada um com `--include='*.ts*' --exclude='*.test.*' --exclude-dir=qa`, a partir da raiz do repo):

    A) grep -rnE '>[[:space:]]*[A-Za-zÀ-ú][^<>{}=]{2,}</' apps/mobile/app apps/mobile/src          -> 0 (texto entre tags)
    B) grep -rnE '(label|title|placeholder|accessibilityLabel|accessibilityHint|message|description)="[A-Za-zÀ-ú]' ...  -> 0
    C) grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\(' ... (exceto tokens.ts)                                -> 0
    D) grep -rnE '\b(fetch|axios|AsyncStorage|SecureStore)\b|Alert\.alert' app src/components src/hooks -> 0

Limites: o grep **não** acha texto montado em variável, valor de espaçamento numérico fora de `tokens.ts` (não busquei) nem
chave fora do padrão `area.componente.texto` (A-05, vem da leitura do ESQUADRO). Na primeira tentativa o zsh engoliu os globs sem aspas e o
resultado "vazio" era falso; refiz com aspas e com controle positivo.

## 5. Achados novos ou confirmados por mim

Severidade, tamanho (limite de 5 correções pequenas **já usado**) e destino. Nenhum código de produto foi alterado nesta etapa.

| ID | Sev. | Achado | Como reproduzir | Tamanho | Dono | Destino |
|---|---|---|---|---|---|---|
| **CRIVO-01** | Média | A tela de edição rotula Telefone e CPF como **"(opcional)"** (captura `app-E1-...png`), mas a API **recusa** criar e editar sem os dois: `POST /clientes` com `{}` devolve 400 `cpf e obrigatorio; telefone e obrigatorio`. Confirma LG-07 / P9 por observação | Subir a API; `POST /api/v1/clientes` com `{"nome":"X"}` e token válido; abrir "Novo cliente" no app, preencher só o nome e salvar | não pequeno (contrato) | BUSSOLA (decisão P9), ESPRESSO, ORLA | F-API-4 e F-APP-7, prazo 2026-12-02 (BUSSOLA decide antes) |
| **CRIVO-02** | Média | CPF **válido** `529.***.***-25` completo na captura `app-E1-...png` (vi a imagem) e em texto em `F45-relatorio-revisao-sprint-02.md:137` e `F45-pr-rascunho-corpo.md:37`; segundo VIGIA, também em 4 outros documentos. Vai para o corpo do PR | Abrir `docs/design/f45-capturas/app-E1-editar-cliente-preenchido-ios-402x874.png` | não pequeno (docs + recaptura + 18 arquivos de teste com CPF válido, LG-05/06) | ORLA, ESQUADRO, VIGIA | F-DOC-2 e F-APP-8, **antes de abrir o PR**: o corpo do PR não deve repetir o número inteiro |
| **CRIVO-03** | Baixa | Documentos da própria F45 com afirmação desatualizada: `F45-relatorio-revisao-sprint-02.md` seção 1 diz `git diff --stat 00f3236 HEAD -- apps` vazio e que o Maven não precisou repetir. **Falso hoje**: o diff tem 3 arquivos (`ClienteDetalheIT`, `VeiculoIT`, `jest.config.js`, 142 inserções). Na matriz, a linha 174 dizia F04 "41 + 3" | `git diff --stat 00f3236 HEAD -- apps` | pequeno, só documentação | CRIVO | **corrigido** na matriz (linha 174); a seção 1 do relatório da TORRE recebeu aviso apontando para este documento |
| ESP-01 | Baixa | número JSON aceito como nome (confirmado, seção 3) | seção 3 | não pequeno | ESPRESSO | F-API-3 |

Achados dos outros agentes (N-01 a N-09, A-01 a A-10, PA-01 a PA-06, LG-01 a LG-09, ESP-01 a ESP-03, ARQ-xx, LAC-xx) seguem na seção 10 do relatório da TORRE, sem mudança de severidade ou destino.
**Não reexecutei** o vermelho das outras quatro correções pequenas (N-06, LG-04, N-09, LG-03): só a N-05.

## 6. O que não foi verificado (nem por mim, nem por ninguém)

- **Leitor de tela (VoiceOver, TalkBack), teclado externo (anel de foco N-05) e anúncio de erro de formulário** nas 7 telas: não há aparelho, `idb` nem `adb` nesta sessão, e nenhum simulador estava ligado. Critério 7 **não atendido**.
- Capturas 360 × 740, carregando e erro com o app rodando, comparação lado a lado com o Figma: as capturas existentes são 402 × 874 (iPhone 17).
- Contraste: medido em 12 regiões de 3 capturas (D1, V2, E1). As outras 5 telas e os estados de erro, desabilitado e foco **não** foram medidos.
- F26 aprovada no Figma; decisões do PO (N-02, N-07, PA-04, PA-05, D-C).
- DET-11, DET-16, C19a, deadlock real do MySQL (LAC-07).
- `f35-real-api` em **uma** execução limpa: só em 2 invocações, com semente por SQL.
- Painel de tarefas: não tenho acesso. Nenhum card foi aberto (tarefa 14), nenhum PR foi aberto, nada foi enviado ao remoto.

## 7. Higiene do repositório (critério 15)

- `git status --short`: **2 linhas**, `?? .f45-clone/` (531 MB) e `?? .qa-wt/` (518 MB, é um `git worktree` em `00f3236`). Nenhum dos dois está rastreado nem ignorado.
- Tentei ignorá-los em `.git/info/exclude` (local, sem commit). **O Claude Code negou a escrita (arquivo sensível) e não contornei.** Para não os versionar, meu commit usa `git add` só com os dois arquivos de documentação, nunca `git add -A`. Opções para a pessoa: (a) apagar com `git worktree remove .qa-wt` e `rm -rf .f45-clone`; (b) acrescentar as duas linhas em `.git/info/exclude`; (c) acrescentar ao `.gitignore` versionado.
- O trailer `Co-Authored-By` do `03e7646` está na `main` (52 mensagens). Corrigir exige reescrever histórico publicado: **não fiz**. Decisão da pessoa.
- Segredo: gitleaks limpo (seção 1, #12). Meu segredo JWT, hash e senha de teste ficaram só no scratchpad.

## 8. O que precisa de decisão humana, com dono e prazo proposto

| Decisão | Dono | Prazo |
|---|---|---|
| Aprovar ou não a F45; registrar ressalva da F35 se for o caso (a revisão só fecha com F35 Concluída ou ressalva explícita do PO) | PO | 2026-11-28 |
| P9: CPF e telefone obrigatórios ou opcionais (CRIVO-01) | BUSSOLA | 2026-12-02 |
| Aprovação da F26; N-02, N-07, PA-04, PA-05, D-C | PO | 2026-11-28 |
| Política de dados do cliente (P1 a P4), hoje **proposta**; bloqueia o primeiro cliente real | pessoa, ESPRESSO, BUSSOLA | 2026-12-04 |
| Aceites escritos de D-E/P8, ADR-020, D-G | pessoa | 2026-11-30 |
| `03e7646`, `.f45-clone/`, `.qa-wt/` | pessoa | 2026-11-30 |
| Rodar leitor de tela e teclado externo num aparelho (critério 7) | pessoa com aparelho, ou CRIVO quando houver ambiente | 2026-12-09 (F-APP-4) |
| Abrir os cards F-APP-1 a F-APP-10, F-API-1 a F-API-8, F-DOC-1 e F-DOC-2 (textos prontos na seção 10 do relatório da TORRE) | pessoa | 2026-11-30 |

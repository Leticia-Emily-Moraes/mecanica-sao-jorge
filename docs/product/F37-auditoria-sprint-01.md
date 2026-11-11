# F37 — Matriz de auditoria da Sprint 01 (PR × teste × doc)

- Autor desta rodada: BUSSOLA (Product Owner)
- Data: 2026-11-09
- Etapa da rota: BUSSOLA (1/6) → ESPRESSO → VIGIA → ANCORA → PERGAMINHO → CRIVO
- Comando recebido: "Montar a matriz de auditoria por feature da Sprint 01
  (F00, F01, F02, F24, F25, F30, F33, F34) ligando cada critério a PR, teste
  e doc, e marcar onde falta evidência de PR em vez de assumir que existe."

> **Recorte desta rodada**: esta é a camada de PO da auditoria — liga cada
> feature a PR (via `gh pr list`/`gh pr view`, executado nesta sessão),
> confirma o que está ou não **rastreado pelo git** (via `git ls-files`/
> `git status`, executado nesta sessão) e localiza onde cada documento vive.
> **Não** inclui: rodar `mvn clean install`/Testcontainers de novo, rodar o
> gitleaks, nem corrigir qualquer gap achado — isso é US-REPO-04/03 e segue
> para ESPRESSO/ANCORA/CRIVO, conforme o "Fora do escopo" da F37. Toda linha
> abaixo cita o comando real que a sustenta; nada aqui foi assumido pela
> leitura do painel de features.

## 0. Contradição encontrada antes de montar a matriz (não resolvida por mim)

A instrução do comandante pede a F33 nesta matriz. O PRD da própria F37
("Fora do escopo") diz: *"Auditar a F33, que está em status Pronta e não
Concluída"* — ou seja, exclui F33 explicitamente. Hoje (2026-11-09) o painel
marca F33 como **"Em revisão"**, não "Concluída" nem "Pronta" — nenhum dos
dois rótulos que os dois textos usam bate exatamente com o estado atual.

Não decidi isso sozinha: **incluí F33 na matriz abaixo**, porque foi pedido
de forma explícita e direta por quem comanda a operação, mas marco a linha
inteira como "fora do escopo formal da F37 (ver §0)" em vez de misturar com
as sete features que a F37 lista para Concluída. Se REGENTE/PRUMO quiserem
F33 fora da matriz, é só remover a seção 1.8 abaixo — nenhuma outra linha
depende dela.

## 1. Matriz por feature

Legenda de evidência de PR: **PR** (aberto/mergeado, com número) · **Direto**
(commit direto na branch, sem PR) · **Branch aberta sem PR** (commitado, mas
só numa branch de feature ainda não mergeada).

Legenda de evidência de doc: **Commitado** · **Não rastreado** (existe no
working tree, `git status` mostra `??`, mas nunca foi commitado) ·
**Inexistente** (não encontrei o arquivo em lugar nenhum).

### 1.1 F00 — Setup do projeto

| Evidência | Resultado | Como verifiquei |
|---|---|---|
| PR | **Direto, sem PR.** Commit `e88e482` ("chore(api): fundação do backend Spring Boot (F00)") está direto em `main`, antes de qualquer merge de PR. | `git log main --first-parent --oneline`; `gh pr list --state all` não lista PR nenhum anterior a `#1` (2026-11-08), e `e88e482` é de 2026-11-03. |
| Teste | `GlobalExceptionHandlerTest.java` e `FlywayMigrationIT.java` **commitados no mesmo commit `e88e482`**, portanto rastreados desde a origem. Execução real: ver relatório CRIVO já anexado ao painel ("Tests run: 2... BUILD SUCCESS", Testcontainers com MySQL 8.4). | `git show e88e482 --stat`; `git ls-files apps/api/src/test` confirma os dois arquivos. Não re-executei `mvn` nesta sessão — reaproveito a execução real já documentada pelo CRIVO no painel, não assumi pela leitura do código. |
| Doc | **Inexistente.** Não há `docs/product/F00-*.md` em lugar nenhum (nem commitado, nem no working tree). | `find docs/product -iname '*F00*'` → vazio. |

### 1.2 F01 — Correção da fundação mobile

| Evidência | Resultado | Como verifiquei |
|---|---|---|
| PR | **Direto, sem PR.** Commits `d81a4a0`, `25c0290`, `d66e0ff`, `d51fa8f`, `112897e`, `cf2cea7`, `0e4f569` — todos direto em `main`, antes do primeiro PR (`#1`, 2026-11-08). | `git log main --first-parent --oneline`; datas dos commits (2026-11-03) vs. data do PR `#1` (2026-11-08). |
| Teste | IDs `US-MOBILE-00` a `US-MOBILE-05` no PRD commitado. Não localizei, nesta rodada, qual teste automatizado cobre cada achado A-D individualmente — precisa de confirmação de ESPRESSO/ORLA, não assumo que existe. | `grep -oE 'US-[A-Z0-9-]+-[0-9]{2}' docs/product/F01-correcao-fundacao-mobile.md`. |
| Doc | **Commitado.** `docs/product/F01-correcao-fundacao-mobile.md`. | `git ls-files docs/product` lista o arquivo. |

### 1.3 F02 — Fundação backend + Login

**Achado mais grave da auditoria.** O painel marca F02 como Concluída, mas:

| Evidência | Resultado | Como verifiquei |
|---|---|---|
| PR | **Sem PR — e pior: a implementação principal nunca foi commitada em lugar nenhum.** O que existe commitado (via PR `#1`, `fix/f02-appsec-login`) é só a correção pontual de timing-attack e segredo JWT de exemplo (`ae05822`) + `AuthServiceTest.java`. As 12 entidades JPA, `AuthController`, `dto/`, `mapper/`, `repository/`, `JwtConfig`, `RestAuthenticationEntryPoint`, a migration `V2__criar_schema_oficina.sql` e `AuthControllerTest.java` estão **hoje `??` no `git status`**, só no working tree da branch `feat/f30-mobile-login-perfil`. Se essa branch for descartada sem commit, a F02 desaparece do repositório. | `git status --porcelain apps/api` (nesta sessão, agora); `gh pr view 1 --json commits` não lista nenhum desses arquivos; `git ls-files apps/api/src/main/java/.../api/` mostra que `controller/`, `dto/`, `entity/`, `mapper/`, `repository/` não têm nenhum arquivo rastreado. |
| Teste | `AuthServiceTest.java` commitado (`ae05822`). `AuthControllerTest.java` e `FlywayMigrationIT.java` (versão com V2) **não commitados** — `FlywayMigrationIT.java` aparece como `M` (modificado em relação à versão da F00, que só testava V1), sem o commit que incorpora essa mudança. Execução real reportada pelo CRIVO no painel (16 testes unitários/controller + 3 de integração, `BUILD SUCCESS`) foi contra o **working tree atual**, não contra o que está no git. | `git status --porcelain apps/api/src/test`; `git diff --stat HEAD -- apps/api/src/test/.../FlywayMigrationIT.java` mostra divergência do commitado. |
| Doc | **Não rastreado.** `docs/product/F02-fundacao-backend-login.md` existe e é detalhado (premissas numeradas, LGPD, Gherkin para US-FUND-01/02/03 e US-AUTH-01), mas nunca foi commitado. | `git status --porcelain` lista `?? docs/product/F02-fundacao-backend-login.md`. |

### 1.4 F24 — Wireframe de baixa fidelidade

| Evidência | Resultado | Como verifiquei |
|---|---|---|
| PR | **PR `#3` (`docs/f24-wireframe-baixa-fidelidade`), mergeado em 2026-11-08**, mas cobre só `docs/design/F24-wireframe-baixa-fidelidade.md` (a especificação de ESQUADRO) — o commit do PR `#3` é único (`6eb31c9`). | `gh pr view 3 --json commits,mergedAt,baseRefName`. |
| Teste | Não aplicável por automação: o artefato é um arquivo Figma. O próprio CRIVO, no relatório já anexado ao painel, registra bloqueio de ferramenta (`mcp__figma-remote__whoami` negado) e marca todos os critérios como "Não verificado" por essa razão — não reproduzi a tentativa de acesso ao Figma nesta rodada de PO. | Relatório CRIVO citado no painel ("Entrega aprovada (CRIVO)" de F24). |
| Doc | **Parcial.** `docs/design/F24-wireframe-baixa-fidelidade.md` commitado (PR `#3`). `docs/product/F24-wireframe-baixa-fidelidade.md` (PRD com US-DES-01 a 08) **não rastreado**. | `git ls-files docs/design` vs. `git status --porcelain` (`?? docs/product/F24-wireframe-baixa-fidelidade.md`). |

### 1.5 F25 — Protótipo de alta fidelidade de Login e Perfil

| Evidência | Resultado | Como verifiquei |
|---|---|---|
| PR | **PR `#1` (`fix/f02-appsec-login`), mergeado em 2026-11-08**, inclui o commit `195490c` ("docs(design): registrar protótipo de alta fidelidade de Login e Perfil (F25)") — mas esse PR tem nome e branch de outro assunto (correção AppSec da F02); F25 "pegou carona" nele. | `gh pr view 1 --json commits` lista `195490c` entre os commits mergeados. |
| Teste | Não aplicável por automação (artefato Figma). CRIVO reportou o mesmo bloqueio de ferramenta da F24 e recalculou contraste/grafo de navegação por script próprio, não por inspeção visual direta. | Relatório CRIVO no painel ("Entrega aprovada (CRIVO)" de F25). |
| Doc | **Parcial.** O registro do protótipo vive dentro de `docs/design/figma.md` (seção "F25 · Protótipo alta fidelidade"), commitado junto no `195490c`. O PRD próprio da feature, `docs/product/F25-prototipo-login-perfil.md` (US-PROTO-LGN-01 a 10), **não está rastreado**. | `grep -n "F25" docs/design/figma.md` confirma a seção commitada; `git status --porcelain` lista o PRD como `??`. |

### 1.6 F30 — Front mobile de Login e Perfil

| Evidência | Resultado | Como verifiquei |
|---|---|---|
| PR | **Sem PR.** Todos os commits da F30 (`22afef3`, `adaf5e0`, `aaefcde`, `93afd70`, `7cb9c7f` e outros) estão só na branch atual `feat/f30-mobile-login-perfil`, que não tem PR aberto nem mergeado. | `gh pr list --state all` não lista essa branch; `git log --first-parent main` não contém esses commits. |
| Teste | Testes **commitados na branch** (`app/login.test.tsx`, `src/auth/auth-api.test.ts`, `src/auth/auth-context.test.tsx` etc.) — rastreados, mas só nesta branch não mergeada. Execução real contra API real já reportada pelo CRIVO no painel, com ressalva própria: `renderRouter` força fake timers, então um teste "já rodado contra API real" pode nunca ter de fato esperado a resposta de rede (achado registrado em memória, não investigado de novo nesta rodada). | `git ls-files apps/mobile \| grep test` lista os arquivos como rastreados nesta branch; relatório CRIVO no painel. |
| Doc | **Inexistente como PRD de produto.** Não há `docs/product/F30-*.md` com a visão e o Gherkin de US-LGN-FRONT-01 a NN assinado por BUSSOLA. O único arquivo com nome parecido, `docs/product/F30-appsec-lgpd-login-perfil.md`, é a **revisão AppSec/LGPD de VIGIA**, não o PRD de produto — os IDs `US-LGN-FRONT-*` aparecem só em código, teste e nesse doc de VIGIA, nunca num PRD de BUSSOLA. | `grep -rl "US-LGN-FRONT"` lista só código, teste e o doc de VIGIA; `head -15 docs/product/F30-appsec-lgpd-login-perfil.md` confirma a autoria de VIGIA, não de BUSSOLA. |

### 1.7 F34 — Protótipo de alta fidelidade do Menu principal

| Evidência | Resultado | Como verifiquei |
|---|---|---|
| PR | **PR `#2` (`feat/f34-prototipo-tab-bar`), mergeado em 2026-11-08**, inclui o commit `ce67ab4` ("docs(design): registrar protótipo de alta fidelidade da tab bar (F34)"). | `gh pr view 2 --json commits,mergedAt`. |
| Teste | Não aplicável por automação (artefato Figma). | Mesma lógica de F24/F25; não há relatório CRIVO específico de F34 isolado no painel — só citado dentro da auditoria de F33 (§5.2 do PRD de F33, "Concluída, aprovada por CRIVO"). |
| Doc | **Inexistente como arquivo próprio.** Não há `docs/product/F34-*.md`. O registro vive só dentro de `docs/design/figma.md`, commitado no PR `#2`. | `find docs/product -iname '*F34*'` → vazio; `git ls-files docs/design` confirma `figma.md` como o único lugar. |

### 1.8 F33 — Menu principal de navegação (fora do escopo formal da F37, ver §0)

| Evidência | Resultado | Como verifiquei |
|---|---|---|
| PR | **Sem PR.** Commits `5c879e5`, `ccb527b`, `7c49f67` só na branch atual, não mergeada. | `gh pr list --state all`; `git log --first-parent main`. |
| Teste | Commitados na branch atual: `menu-tab-bar.test.tsx`, `_layout.test.tsx` (modificado, `M`), `menu-routing.test.tsx`. Execução real contra API real já reportada pelo CRIVO no painel para US-MENU-01/02/03; US-MENU-06 (foco de teclado/leitor) sem confirmação em dispositivo; o teste temporário de QA (`qa-f33-real-api.test.tsx`) já não aparece no `git status` desta sessão — foi apagado após extrair a evidência, como o próprio PRD de F33 registra em §10. | `git ls-files apps/mobile \| grep test`; `find apps/mobile -iname 'qa-f33*'` → vazio nesta sessão. |
| Doc | **Parcial.** `docs/design/F33-especificacao-menu-tabbar.md` commitado (parte do commit `ccb527b`, na branch atual). `docs/product/F33-menu-principal-navegacao.md` (o PRD que especifica US-MENU-01 a 07, com a decisão de REGENTE de 2026-11-09 sobre "item único") **não está rastreado**. | `git ls-files docs/design`; `git status --porcelain` lista o PRD como `??`. |

## 2. Padrão que se repete em quase toda feature

Três gaps aparecem de forma consistente, não isolada:

1. **PRD de produto (`docs/product/`) quase nunca commitado.** De oito
   features auditadas, só **F01** tem PRD rastreado. F00 e F34 nem têm
   arquivo. F02, F24, F25, F33 têm o arquivo, mas só no working tree. F30 não
   tem PRD de produto — só a revisão AppSec de VIGIA, sob nome parecido (fácil
   de confundir os dois, deixo o alerta aqui).
2. **PR corresponde a assunto diferente do título.** Os três PRs que existem
   (`#1`, `#2`, `#3`) carregam, cada um, commits de mais de uma feature
   (ex.: PR `#1` tem o fix de AppSec da F02 **e** o registro do protótipo da
   F25 **e** o wireframe da F24, todos no mesmo PR). Isso dificulta rastrear
   "qual PR aprovou qual feature" — o vínculo que a matriz acima faz foi por
   inspeção de commit, não por leitura do título do PR.
3. **O trabalho mais recente (F02 completo, F30, F33) nunca passou por PR.**
   As features mais novas foram commitadas direto na branch de trabalho
   atual, sem abrir PR nenhum — e no caso da F02, boa parte nem chegou a ser
   commitada. Nenhuma suposição aqui: é o que `gh pr list` e `git status`
   mostram agora.

## 3. O que esta matriz não cobre (fica para ESPRESSO / ANCORA / CRIVO)

- Rodar `mvn clean install` de novo para confirmar que o build do working
  tree atual (incluindo os arquivos `??` da F02) realmente compila — a F37
  pede isso em US-REPO-04, depois de cada bloco de commit, não antes.
- Rodar o gitleaks sobre o diff antes do commit (US-REPO-03) — **gitleaks não
  está instalado nesta máquina** (`which gitleaks` não encontrou o binário);
  isso é um bloqueio a resolver antes do primeiro commit da F37, não uma
  suposição de que "não tem segredo".
- Decidir, por commit, se os arquivos `??` de F02 vão para uma branch própria
  (`feat/f02-fundacao-backend-login`, conforme a dúvida 1 já registrada no
  PRD da F37) antes ou depois de comparar contra `feat/f30-mobile-login-perfil`.
- Qualquer correção de gap funcional encontrado aqui (teste faltando, doc sem
  PRD) — por instrução explícita do "Fora do escopo" da F37, isso volta para
  a feature original ser reaberta, não é corrigido dentro desta auditoria.

## 4. Dados pessoais (LGPD)

Não aplicável. Esta auditoria não lê, processa nem expõe dado pessoal — só
metadados de git (autor/data de commit, já públicos no histórico) e nomes de
arquivo de documentação.

## 5. Dúvidas em aberto (numeradas, novas desta rodada)

1. (repete a contradição do §0) F33 entra ou sai da auditoria formal da F37?
   Preciso de decisão de REGENTE antes do relatório final ser consolidado por
   CRIVO.
2. O PRD de produto da F30 nunca existiu como arquivo próprio — só a revisão
   de VIGIA. Alguém escreveu esse PRD em algum momento e ele se perdeu (igual
   aconteceu com F02, F24, F25, F33), ou o PRD de F30 nunca foi formalizado
   por escrito? Preciso saber antes de decidir se escrevo um PRD retroativo
   para F30 ou se registro isso como gap de processo permanente.
3. Os PRs `#1`/`#2`/`#3` cobrem commits de mais de uma feature cada. Quando
   ESPRESSO abrir os PRs de recuperação da F37, cada PR deve corresponder a
   exatamente uma feature de origem (um PR por assunto, conforme US-REPO-02 e
   o Pronto da F37), ou mantém o padrão observado de agrupar por "bloco de
   trabalho" mesmo que isso misture features?

## 6. Próximo passo (handoff)

Para ESPRESSO: ver resumo de handoff na resposta desta etapa.

## 7. Checklist de auditoria por critério — para CRIVO executar (rodada BUSSOLA, 2026-11-11)

- Autor desta seção: BUSSOLA (Product Owner)
- Data: 2026-11-11
- Comando recebido do REGENTE: "Definir o checklist de auditoria por feature
  Concluída (PR, teste cobrindo cada critério, doc batendo com o repo) que o
  CRIVO vai executar. Fora de escopo: reabrir escopo de feature."

> **O que esta seção é e o que não é**: isto é o **protocolo** — o que
> checar e como checar — não a execução. Não rodei nenhum comando aqui além
> dos que usei para localizar os IDs de critério reais (`grep`/`git log`,
> listados em 7.9); não marquei nenhuma linha como "Passou". CRIVO preenche
> a coluna **Resultado** depois de rodar o comando de verdade. A seção 1
> (rodada de 2026-11-09) já responde PR e doc no nível da *feature*; esta
> seção quebra em nível de **critério individual** (US-REPO-09), que a
> seção 1 não tinha coberto, e reaproveita a seção 1 em vez de repetir
> trabalho onde ela já é suficiente.

### 7.0 Regras para CRIVO seguir em toda linha

1. **Resultado só pode ser "Passou" se o comando foi executado nesta sessão
   de auditoria** (não vale reaproveitar relato de outro agente sem rodar de
   novo — é o mesmo padrão que o próprio CRIVO já aplica, registrado em
   memória). Se reaproveitar uma execução anterior documentada (ex.: a
   seção 1 já cita `mvn clean install` do CRIVO), isso vale como "Passou
   (reaproveitado, ver §1.X)" — mas **nunca** para um critério que a seção 1
   não cobriu.
2. Três resultados possíveis por célula: **Passou** (comando rodado,
   evidência anexada), **Falhou** (comando rodado, resultado diferente do
   esperado) ou **Não existe** (não há teste/doc/PR correspondente —
   procurado e não encontrado, não "não procurei").
3. Nenhuma célula fica em branco no relatório final: se não deu para checar
   (bloqueio de ferramenta, ex. Figma), escrever "Não verificado" com o
   motivo, igual ao padrão que CRIVO já usa em F24/F25.
4. Gap encontrado (teste faltando, doc desatualizada, PR ausente) **não se
   corrige aqui** — vira linha na tabela de pendências da seção 8, apontando
   para a feature original ser reaberta. É literal do "Fora do escopo" do
   PRD da F37 e da instrução direta do REGENTE para esta rodada.
5. Onde o ID do critério não é localizável em nenhum arquivo do repositório
   (casos de F00 e parte de F30, ver abaixo), **não inventar o enunciado**:
   registrar "ID sem fonte rastreável no repo" e abrir dúvida (seção 9) em
   vez de assumir o texto.

### 7.1 F00 — Setup do projeto

**Alerta antes da tabela**: não existe `docs/product/F00-*.md` nem nenhum
outro arquivo no repositório com critérios numerados (`US-...`) para esta
feature — confirmado por `find docs -iname '*F00*'` (vazio). Os dois
critérios abaixo (C1, C2) são os únicos cujo enunciado completo eu tenho —
vieram do relatório do CRIVO já anexado ao painel da feature. Há um terceiro
critério ("A estrutura de pas[...]") cujo texto está cortado no painel que
recebi; **não vou completar esse enunciado por suposição** — ver dúvida 9.1.

| Critério | Enunciado | Checar PR | Checar teste | Checar doc | Resultado (CRIVO) |
|---|---|---|---|---|---|
| C1 | O projeto instala e roda localmente seguindo o README | `git log --all --oneline -- apps/api/README.md apps/mobile/README.md README.md`; confirmar se o commit que fecha F00 está em `main` via PR ou direto (já respondido em §1.1: direto, `e88e482`) | Rodar `docker compose up -d` (ou documentar por que não dá) + `mvn spring-boot:run`; `cd apps/mobile && npm install` seguindo o README literal e `npx expo start` | Ler `README.md`/`apps/api/README.md`/`apps/mobile/README.md` e confirmar que cada passo documentado corresponde ao comando que de fato funciona hoje | — |
| C2 | Lint e testes rodam com sucesso, com ao menos um teste de exemplo | mesmo commit de C1 | Backend: `mvn -B test checkstyle:check spotless:check verify` (rodar de novo nesta sessão); Mobile: `npm run lint` / `npm test`, que CRIVO ainda não rodou verde nesta feature ("mobile: FALHOU" no `npm install`) | Mesmo README | — |
| C3 | "A estrutura de pastas segue..." (texto cortado — **não tenho o enunciado completo**) | — | — | — | **Bloqueado**: pedir a REGENTE/PRUMO o texto íntegro antes de auditar |

### 7.2 F01 — Correção da fundação mobile

Fonte: `docs/product/F01-correcao-fundacao-mobile.md` (commitado, confirmado
em §1.2). Critérios `US-MOBILE-00` a `US-MOBILE-05` (6 IDs).

| Critério | Checar PR | Checar teste | Checar doc | Resultado (CRIVO) |
|---|---|---|---|---|
| US-MOBILE-00 a 05 (cada um individualmente) | Já respondido em §1.2: direto em `main`, sem PR — não precisa reauditar, só confirmar que os 4 achados (A-D) do PRD mapeiam para os commits citados (`git show <hash> --stat`) | Para cada ID: localizar o achado A/B/C/D correspondente e o teste automatizado em `apps/mobile`; rodar isolado (`npx jest <arquivo> --verbose`) e registrar passou/falhou | Reler o critério contra o estado atual do código citado (versão de dependência, lockfile) — confirmar que o que o PRD descreve como corrigido continua corrigido hoje | — (uma linha por ID) |

### 7.3 F02 — Fundação backend + Login

Fonte: `docs/product/F02-fundacao-backend-login.md` (não rastreado, `??`,
confirmado em §1.3). Os critérios reais e completos desta feature são só 4
— `US-FUND-01`, `US-FUND-02`, `US-FUND-03`, `US-AUTH-01` (linhas 50-53 e 180
do doc). `US-AUTH-02`/`US-AUTH-03` são citados no mesmo doc como
explicitamente fora desta feature ("ficam para depois", linha 14).

| Critério | Checar PR | Checar teste | Checar doc | Resultado (CRIVO) |
|---|---|---|---|---|
| US-FUND-01 (sem classe de template, compila) | `git status --porcelain apps/api` + `gh pr list --state all` — já respondido em §1.3: nada commitado em lugar nenhum, só `??` | `mvn -B clean install` rodado agora; `grep -rliE "class (Category\|Product\|User\|Itens)\b" apps/api/src/main/java` deve voltar vazio | doc linhas 185-213 contra `entity/`, `controller/`, `service/`, `repository/` reais | — |
| US-FUND-02 (migration V2 aditiva, subtotal GENERATED, enum STRING) | idem | `FlywayMigrationIT` do zero via Testcontainers; inspecionar `V2__criar_schema_oficina.sql` por `GENERATED ALWAYS ... STORED` e `VARCHAR` nas colunas de enum | doc linhas 214-256 contra o SQL real | — |
| US-FUND-03 (12 entidades JPA + 5 enums) | idem | confirmar se existe teste unitário dedicado ou se a cobertura é só indireta via `FlywayMigrationIT`/`AuthServiceTest` | doc linhas 257-300 contra `entity/*.java` | — |
| US-AUTH-01 (login por email/senha emitindo JWT) | commit `ae05822` (PR `#1`) cobre só a correção de timing-attack; `AuthController`/`AuthService` principal está `??` | `AuthServiceTest.java` (commitado) + `AuthControllerTest.java` (`??`) — rodar os dois via `mvn -B test`, registrar separadamente se cada um está rastreado | doc linhas 301+ contra `POST /api/v1/auth/login` real (`curl`) | — |

### 7.4 F24 — Wireframe de baixa fidelidade

Fonte: `docs/product/F24-wireframe-baixa-fidelidade.md` (não rastreado,
confirmado em §1.4). Critérios `US-DES-01` a `US-DES-08` (8 IDs).

| Critério | Checar PR | Checar teste | Checar doc | Resultado (CRIVO) |
|---|---|---|---|---|
| US-DES-01 a 08 (cada um individualmente) | PR `#3` cobre só `docs/design/F24-wireframe-baixa-fidelidade.md` — confirmar se cobre também o PRD de produto (provável: não, ver §1.4) | Sem automação (artefato Figma) — chamar `mcp__figma-remote__whoami`/`get_metadata` de novo nesta sessão (não reaproveitar bloqueio anterior sem tentar) e, se liberado, contar telas/estados contra o critério | Comparar `docs/design/F24-wireframe-baixa-fidelidade.md` × `docs/product/F24-wireframe-baixa-fidelidade.md` × o Figma real, se acesso liberado | — |

### 7.5 F25 — Protótipo de alta fidelidade de Login e Perfil

Fonte: `docs/product/F25-prototipo-login-perfil.md` (não rastreado,
confirmado em §1.5). Critérios próprios `US-PROTO-LGN-01` a `10` (10 IDs);
`US-AUTH-01` e `US-DES-07` aparecem só como dependência citada, não como
critério próprio.

| Critério | Checar PR | Checar teste | Checar doc | Resultado (CRIVO) |
|---|---|---|---|---|
| US-PROTO-LGN-01 a 10 (cada um individualmente) | commit `195490c` dentro do PR `#1` (de outro assunto, AppSec da F02) — confirmar se conta como PR da feature ou gap de processo (já flagado em §1.5 e §2.2) | Sem automação, inspeção manual no Figma (tentar acesso de novo) | `docs/design/figma.md` (seção "F25 · Protótipo alta fidelidade") × `docs/product/F25-prototipo-login-perfil.md` (não commitado) | — |

### 7.6 F30 — Front mobile de Login e Perfil

**Alerta mais grave que F00**: não existe arquivo com a lista completa dos
critérios `US-LGN-FRONT-NN`. `docs/product/F30-appsec-lgpd-login-perfil.md`
é a revisão de VIGIA (cita só `US-LGN-FRONT-02` de passagem), não o PRD de
produto (§1.6). Busca em `apps/mobile` (código e teste) só encontrou **4 IDs
com fonte real no repo**: `US-LGN-FRONT-01`, `-02`, `-06` (`app/index.tsx:13`),
`-07` (`src/api/http.ts:6`). Os demais só existiam no texto do painel desta
conversa — não é arquivo do repositório, não trato como fonte rastreável.

| Critério | Checar PR | Checar teste | Checar doc | Resultado (CRIVO) |
|---|---|---|---|---|
| US-LGN-FRONT-01 (login com sucesso → JWT, SecureStore, navega) | Sem PR — só na branch `feat/f30-mobile-login-perfil` (§1.6) | Localizar teste que exercita login contra API real (não mock de fetch); rodar com a API de pé e de novo com a API fora do ar, igual método do CRIVO — atenção ao achado "`renderRouter` força fake timers" | Não há PRD de produto; doc a checar é só o parcial de VIGIA | — |
| US-LGN-FRONT-02 (credenciais inválidas → erro genérico) | idem | idem (senha errada / email inexistente, mesmo texto de erro) | `src/i18n/strings.ts:17` citado pelo doc de VIGIA — confirmar texto real | — |
| US-LGN-FRONT-06 (guard de sessão decide Login ou Perfil) | idem | Testar `app/index.tsx` com e sem sessão armazenada | Nenhum doc de produto cobre isso explicitamente — gap a registrar | — |
| US-LGN-FRONT-07 (sessão expirada → aviso e redirect) | idem | Achado de memória: "sem gatilho real no app hoje" — rodar de novo para confirmar se ainda é verdade | idem | — |
| US-LGN-FRONT-03, -04, -05 e outros do briefing original | — | — | — | **Bloqueado**: pedir a REGENTE/PRUMO a lista completa e a fonte oficial antes de auditar (dúvida 9.2) |

### 7.7 F34 — Protótipo de alta fidelidade do Menu principal

Fonte: critérios citados dentro de `docs/design/F33-especificacao-menu-tabbar.md`
e `docs/design/figma.md` — não existe `docs/product/F34-*.md` nem
`docs/design/F34-*.md` próprio (§1.7). IDs `US-PROTO-MENU-01` a `05` (5 IDs).

| Critério | Checar PR | Checar teste | Checar doc | Resultado (CRIVO) |
|---|---|---|---|---|
| US-PROTO-MENU-01 a 05 (cada um individualmente) | PR `#2` (`feat/f34-prototipo-tab-bar`), mergeado (§1.7) | Sem automação (artefato Figma); inspeção manual se acesso liberado | `docs/design/F33-especificacao-menu-tabbar.md` (linhas 271-403) é onde o critério é tratado por extenso, mesmo sendo doc da F33 — registrar F34 sem doc próprio como gap (já flagado em §1.7) | — |

### 7.8 F33 — fora do escopo formal (não entra neste checklist)

Repito a decisão já registrada em §0: a F37 exclui F33 explicitamente, e a
instrução do REGENTE para esta rodada (2026-11-11) fala em "feature
Concluída" — F33 hoje está "Em revisão" no painel, nem Concluída nem
Pronta. Não criei tabela de critério a critério para F33; se REGENTE quiser
F33 dentro deste checklist, a seção 1.8 já tem o ponto de partida no nível
de feature.

### 7.9 Como localizei cada ID (rastreabilidade desta seção)

Comandos rodados nesta sessão para montar o checklist (não para auditar
critério — só para confirmar quais IDs existem e onde):

```
find docs -iname '*F00*' -o -iname '*F34*'
grep -oE 'US-[A-Z0-9-]+-[0-9]{2}' docs/product/F01-correcao-fundacao-mobile.md
grep -oE 'US-[A-Z0-9-]+-[0-9]{2}' docs/product/F02-fundacao-backend-login.md
grep -oE 'US-[A-Z0-9-]+-[0-9]{2}' docs/product/F24-wireframe-baixa-fidelidade.md
grep -oE 'US-[A-Z0-9-]+-[0-9]{2}' docs/product/F25-prototipo-login-perfil.md
grep -rohE 'US-LGN-FRONT-[0-9]+' . --include='*.md' --include='*.tsx' --include='*.ts'
grep -rohE 'US-AUTH-[0-9]+' . --include='*.md' --include='*.java'
grep -rohE 'US-FUND-[0-9]+(-[0-9]+)?' . --include='*.md' --include='*.java'
grep -rohE 'US-MOBILE-[0-9]+' . --include='*.md' --include='*.tsx' --include='*.ts'
grep -n "US-PROTO-MENU" docs/design/F33-especificacao-menu-tabbar.md
```

## 8. Pendências de processo abertas por esta rodada (não corrigidas aqui)

1. F00 critério C3 com enunciado cortado — reabrir o texto original com
   REGENTE/PRUMO antes de CRIVO auditar essa linha.
2. F30 sem lista completa e rastreável de critérios (`US-LGN-FRONT-03/04/05`
   e possíveis outros) — mesma causa raiz do PRD de produto nunca ter sido
   commitado (dúvida 5.2 da seção 5). Enquanto isso não for resolvido, CRIVO
   só pode auditar 01, 02, 06 e 07.
3. Nenhum gap de teste, doc ou PR encontrado ao montar este checklist foi
   corrigido — por instrução direta do REGENTE para esta rodada ("fora de
   escopo: reabrir escopo de feature") e pelo "Fora do escopo" do PRD da
   F37. Toda pendência vira reabertura da feature original, nunca uma
   mudança dentro da F37.

## 9. Dúvidas em aberto (numeradas, novas desta rodada)

1. Qual é o enunciado completo do terceiro critério de F00 ("A estrutura de
   pas[...]")? Preciso do texto íntegro antes de fechar a linha C3 da seção
   7.1 — hoje só tenho um fragmento cortado no painel.
2. Existe, fora deste repositório, a lista completa e original dos
   critérios `US-LGN-FRONT-NN` da F30? Se não existir, confirmo com REGENTE
   se devo tratar isso como "PRD nunca formalizado" (gap de processo
   permanente) em vez de "critério a auditar" — e se CRIVO deve auditar só
   os 4 IDs rastreáveis (01, 02, 06, 07) enquanto isso não é resolvido.
3. Para F33 (seção 7.8): confirmo que fica fora deste checklist até o
   status do painel virar "Concluída" de fato, ou REGENTE quer a tabela
   montada de qualquer forma, em paralelo, fora do contador oficial da F37?

# F44 — Revalidação dos critérios contra a `main` 348a43e e delimitação da etapa 2

- Dono: BUSSOLA (Product Owner) · Data: 2026-11-16
- Base: `main` = `origin/main` = `348a43e` (conferido com `git rev-parse main origin/main` depois de `git fetch origin`).
- Complementa `docs/product/F44-main-compilando-de-verdade.md` (versão de 2026-11-13, que vive no ramo do PR #14). Onde divergirem, vale este, por vir de instrução posterior do comandante e da revisão humana de 16/11.
- Rótulos: **Atendido** = visto rodar na `main` 348a43e com o comando citado. **Aberto** = não vale na `main` hoje, mesmo que valha em ramo ou PR. **Não verificado** = não rodei.

## 1. Ambiente e reprodução do erro

Clone limpo da `main` por `git archive main`, extraído fora do repositório. JDK 21 por contêiner `maven:3.9.9-eclipse-temurin-21` (Java 21.0.7). O host tem Maven 3.10.0 com JDK 27.0.1 por padrão (`mvn -v`).

| Comando | Onde | Saída real |
|---|---|---|
| `mvn -B -ntp clean compile` | host, JDK 27 padrão | `BUILD FAILURE` e `Fatal error compiling: java.lang.ExceptionInInitializerError: com.sun.tools.javac.tree.EndPosTable` |
| `docker run … maven:3.9.9-eclipse-temurin-21 mvn -B -ntp clean compile` | contêiner, JDK 21 | `Compiling 34 source files with javac (release 21)` e `BUILD SUCCESS` (14,4 s) |
| `docker run … -v /var/run/docker.sock:… maven:3.9.9-eclipse-temurin-21 mvn -B -ntp clean verify` | contêiner, JDK 21, Testcontainers | unitários `Tests run: 16, Failures: 0, Errors: 0`; `FlywayMigrationIT Tests run: 3, Failures: 0, Errors: 0`; `Successfully applied 2 migrations to schema mecanica_sao_jorge_it, now at version v2`; `BUILD SUCCESS` |

**A `main` compila e passa no `verify` com JDK 21 e falha só com JDK 27.** Não há erro de código a corrigir na etapa 1.

## 2. Critérios, um a um, contra a `main` 348a43e

| # | Situação | Comando que prova | Observação |
|---|---|---|---|
| 1 | **Atendido com ressalva** | `mvn -B -ntp clean compile` em contêiner JDK 21: `BUILD SUCCESS`; no host (JDK 27) falha | A `main` não tem `./mvnw`. A prova com `./mvnw` num clone limpo depois do merge do 1a segue **aberta**. |
| 2 | **Atendido na forma literal; aberto na forma pedida na revisão** | `mvn -B -ntp clean verify` em contêiner: 16 unitários + 3 `FlywayMigrationIT`, `BUILD SUCCESS` | A revisão pede 18 unitários + 3 IT com `./mvnw`. A `main` tem **16**; os 18 vêm do relato do ramo do PR #14 e eu não os contei. |
| 3 | **Atendido** | `git grep -nE "class (Category|User|Product|Itens) " main -- apps/api/src` sem saída, `exit=1` | A entidade é `Usuario`, não `User`. |
| 4 | **Atendido** | `git show main:apps/api/pom.xml` com grep de springfox, springdoc, mapstruct, flyway: springdoc 2.8.5, MapStruct 1.6.3, `spring-boot-starter-flyway`, `flyway-mysql`, `spring-boot-starter-oauth2-resource-server` (JWT); nenhuma linha de Springfox | A `main` segue em Spring Boot **4.1.0**; a 4.1.2 (CVE crítica) só existe no PR #14. |
| 5 | **Atendido** | `FlywayMigrationIT` 3/3 acima; `application.yml` da `main` tem `ddl-auto: validate` | Evidência = `FlywayMigrationIT` mais o teste do CRIVO contra MySQL vazio (tarefa 8). Não subi a API contra MySQL vazio nesta sessão. |
| 6 | **Aberto** | `git ls-tree -r main --name-only -- apps/api` filtrando `mvnw` e `.mvn`: vazio | Wrapper só no PR #14. Registrar na descrição do 1a as duas condições da revisão: Maven 3.9.9 vem do wrapper com `unzip`; sem `unzip` a conferência do SHA-256 falha. Exige `unzip` no runner e na imagem do Dockerfile. Não reproduzi nenhuma das duas. |
| 7 | **Aberto** | `git show main:.github/workflows/ci-api.yml` com grep de `compilacao`: só um comentário (linha 83), **sem job `compilacao` na `main`**. `gh api repos/Leticia-Emily-Moraes/mecanica-sao-jorge/branches/main/protection`: `required_status_checks` = `ci-api-ok`, `enforce_admins` = true | A proteção já exige `ci-api-ok`, mas o job que reprova erro de compilação ainda não está na `main`. No PR #14, `gh pr checks 14` mostra `compilacao pass 24s`. A prova com PR fora de rascunho mirando a `main`, depois do merge do #14, segue pendente; o #12 (rascunho) não vale. |
| 8 | **Aberto** | `gh pr view 14 --json body` | O #14 está aberto, mas a descrição **não traz** a causa raiz em duas camadas, a saída real do `verify` nem o que ficou sem cobertura. |
| 9 | **Aberto** | idem | A descrição do #14 tem o que mudou, por quê e como verificar, mas sem saída real nem estimativa. |
| 10 | **Aberto** | `gh pr view 11`: `MERGED`, base `fix/f44-main-compilando` | O #11 foi mergeado no ramo do 1a, não na `main`; chega junto com o #14 (`origin/fix/f44-main-compilando` = `d50a49b` contém `84f98c1`). Na prática 1a, 1b e 1c viraram um PR só; "rebasear o #11 sobre a main" perdeu o objeto. |
| 11 | **Atendido na `main`** | `git ls-tree -r main --name-only` filtrando `target`, `node_modules`, `.env`, `.jar`: vazio | No #14, `gh pr checks 14`: `segredo-vazado pass`. |
| 12 | **Aberto** | `git ls-tree -r main --name-only` filtrando `ADR-014`: vazio; `git branch -r` não lista o ramo `docs/f44-pr2a-adr014-mapa-telas` | Ramo só local (`9e13e5d`). **A premissa 6 é falsa:** o ADR-014 do ramo do PR 2a não tem nenhuma URL do Figma, só a chave `FPdB8RymAnN81pbKfizdzE`. A URL completa está em `docs/design/figma.md` do ramo da F41. Ver §5.4. |
| 13 | **Aberto na `main`** | idem | Os node-ids existem só na planilha da F41 (ramo local, sem push): Login `10:895` e `10:936`, Perfil `10:3842`, logout `10:3886`, tab bar `20:1102` e `20:1340`, cabeçalho `10:981` e `20:1079`. Li esses ids no documento do ESQUADRO; não os reabri no Figma. |
| 14 | **Aberto** | planilha da F41, §10, no ramo `feat/f41-paridade-fpdb8-codigo` | A F41 já marca cada linha como corrigida ou aberta. Falta o hash de commit por divergência e falta o documento estar na `main`. |
| 15 a 17 | **Não verificado** | — | Não existem PR 2b a 2d. Não rodei busca de valor fixo, contraste, lint nem testes de `apps/mobile`. Os contrastes C-01 a C-24 são cálculo do ESQUADRO; não recalculei. |
| 18 | **Aplica-se hoje** | `mcp__figma-remote__whoami` nesta sessão: `Claude requested permissions to use mcp__figma-remote__whoami, but you haven’t granted it yet.` (apóstrofo tipográfico aqui; o original é ASCII) | O Figma está negado para mim; não reverifiquei frame algum. O ESQUADRO relata `whoami` OK em 16/11; é relato, não prova minha. |

**Resumo:** atendidos na `main`: 3, 4, 5, 11 (e 1 e 2 só com JDK 21 e sem wrapper). Abertos: 6, 7, 8, 9, 10, 12, 13, 14, 18. Não verificados: 15, 16, 17.

## 3. Etapa 1 — estado real dos PRs

- **PR #14 (1a)**: aberto, base `main`, `MERGEABLE`, `mergeStateStatus UNSTABLE`. `gh pr checks 14`: `ci-api-ok`, `compilacao`, `build-e-integracao`, `lint`, `teste-unitario`, `imagem-docker`, `segredo-vazado` e `mudancas` em pass; **`auditoria-dependencia` em fail após 46 min 37 s**. Esse job não é check obrigatório (a proteção exige só `ci-api-ok`). Não li o log, então a causa **não está verificada**; o PRD de 13/11 atribuía falhas anteriores do mesmo job a HTTP 524 do NVD.
- O #14 carrega o #11 (job `compilacao`) e o #13 (segurança). Os cortes 1a, 1b e 1c viraram um PR só. Isso é um risco para o critério 9 (máximo 3 dias, PR mergeável sozinho): decisão D-3.
- Pré-condição da pessoa: o #14 só entra depois do aceite do ADR-016, hoje `proposto`.
- **Número do ADR (pessoa diz 12, relatório diz 016).** Conferi: `ADR-012-remover-template-generico-do-backend.md` já está na `main` e trata da remoção do template na F38; `ADR-016-fixar-jdk-21-no-build-com-enforcer-e-maven-wrapper.md` está no ramo do #14 e trata da trava de JDK 21. A causa raiz tem uma camada em cada um. Não renumerei nada: D-1.

## 4. Causa raiz de a F38 não chegar funcionando (para a descrição do PR #14)

Duas camadas:

1. **Código (até 2026-11-12).** A `main` anterior às PRs #4 e #5 tinha `AuthService` sem `dto`, `entity`, `mapper` e `repository`. Afirmação da revisão humana; **não reproduzi** essa `main` antiga. Verifiquei que #4 e #5 estão `MERGED` em 2026-11-12 e que depois delas a `main` compila em JDK 21 (§1).
2. **Ambiente (permanece).** O Maven do Homebrew usa JDK 27; o Lombok falha no javac 27 com `ExceptionInInitializerError: com.sun.tools.javac.tree.EndPosTable`. Reproduzido nesta sessão (§1, linha 1).

Segue não verificada a hipótese de a pessoa ter visto a falha numa `main` local defasada (dúvida D1 do PRD de 13/11).

## 5. Etapa 2 — delimitada como o resíduo que a F41 não fecha

### 5.1 Regra de corte

Fica **fora** da F44 tudo o que a planilha da F41 marca **corrigido** (`docs/design/F41-planilha-fpdb8.md`, §10, ramo `feat/f41-paridade-fpdb8-codigo`, `937a3d1`). Fica **dentro** só o que ela marca **aberto**, e só depois de a F41 estar na `main`.

### 5.2 Fato que muda o plano: a F41 não está na `main`

`git log --oneline main..feat/f41-paridade-fpdb8-codigo` lista **14 commits**; `git rev-parse origin/feat/f41-paridade-fpdb8-codigo` falha (o ramo não existe no remoto); `gh pr list --state open` só mostra o #14. O código de Login, Perfil, logout e tab bar da F41 existe só no disco. **Os PRs 2b a 2d não podem abrir antes de a F41 mergear**: mexeriam nos mesmos arquivos e duplicariam escopo.

### 5.3 O resíduo (tudo o que está "aberto" na §10 da F41)

Todos os itens abaixo estão parados por **decisão da pessoa**, não por falta de código. A F44 não ajusta o que não foi decidido.

| Tela | Divergência aberta (ID da F41) | O que destrava |
|---|---|---|
| Login | L-02 escudo ausente | D2: ativo e licença da imagem |
| Login | L-06 placeholder (Dawn reprova AA, está Flint); L-07 borda de repouso (Westar reprova 3:1, está `slate500`) | aprovar o quadro de cores AA C1 (`85:744`) |
| Login | L-09 "Mostrar senha" não existe no frame | P-06 |
| Login | L-16 a L-19: carregando, preenchido, erro de conexão, sessão expirada | aprovar os frames propostos L1 a L4 (`82:1990`, `82:2024`, `82:2058`, `82:2098`) |
| Perfil | P-12 carregando, P-13 erro | aprovar P1 `83:712` e P2 `83:754` |
| Perfil | P-02 e P-08, "corrigido, confirmar" (iniciais, texto "Funcionário") | P-14 e P-15 |
| Logout | nenhuma aberta (D-01 a D-05 corrigidos); sombra no Android só aproximada | aparelho Android |
| Tab bar | T-04 ícones (Ionicons no lugar dos do arquivo) | P-10: `react-native-svg` e licença |
| Tab bar | T-06 selecionado em branco no lugar de Crail (2,24:1 reprova) | aprovar o C1 |
| Tab bar | T-09 desabilitado, T-10 foco | aprovar T1 `83:817` e T2 `83:844` |
| Tab bar | T-11 `/inicio`, "implementado, confirmar" | P-01 do PRD da F41 |
| Todas | foco de teclado e leitor de tela em aparelho (US-MENU-06), Android, aparelho físico | aparelho da pessoa (P-02) |

Efeito nos PRs: o **2c** (Perfil e logout) fica quase vazio; **2b** e **2d** dependem quase só de aprovação. Proposta: reavaliar se viram um único PR "aplicar decisões aprovadas da F41", aberto quando a pessoa responder C1, L1 a L4, P1, P2, T1, T2 e P-10 (D-6).

### 5.4 PR 2a (ADR-014): três fatos a decidir

1. **Duas rotas para a `main`.** O ADR-014 está no ramo do PR 2a (`9e13e5d`, base antiga `3067954`) e no ramo da F41 (`db89d04` e `cf1576d`, esta com a referência aprovada FPdB8). Mergear as duas conflita no mesmo arquivo (D-2).
2. **Sem URL.** Nenhuma das duas cópias traz a URL do Figma, só a chave. O critério 12 exige o link. Antes do commit, o texto recebe `https://www.figma.com/design/FPdB8RymAnN81pbKfizdzE`, a mesma que `docs/design/figma.md` da F41 registra.
3. **Links quebrados.** O ADR cita `docs/design/f39-frames/pares-contraste.csv` e `contraste.mjs`. Essa pasta (6 arquivos de texto, cerca de 25 KB) existe só em `docs/f39-wireframe-redesenho`, não na `main` nem no ramo do PR 2a. Recomendo incluí-la no mesmo PR para o ADR não nascer com referência morta; a decisão é da pessoa.

O ramo do PR 2a precisa de rebase sobre a `main` 348a43e antes de abrir, e o commit do ADR sai com `git commit` por pathspec, como primeiro commit e em commit próprio de docs.

## 6. Como cada ponto da revisão humana foi tratado

| Ponto | Tratamento |
|---|---|
| Critério 1 | Provado na `main` sem wrapper (§1); forma com `./mvnw` marcada aberta. A prova do ramo `d8b0153` não foi usada como se fosse da `main`. |
| Critério 2 | Contei 16 unitários e 3 IT na `main`. Os 18 do pedido não foram contados por mim. |
| Critério 6 | As duas condições do `unzip` e o requisito no runner e no Dockerfile estão no §2, para constar na descrição do PR. Não reproduzi. |
| Critério 7 | Registrado o que a prova nova exige: PR fora de rascunho, `main` já com o job, `mergeStateStatus BLOCKED`, `ci-api-ok` reprovado. Não executada: depende do merge do #14. |
| Critério 8 | Causa raiz em duas camadas redigida na §4. A descrição do #14 **não foi editada**, porque a pessoa pediu o aceite do ADR antes. Número do ADR em D-1. |
| Critério 10 | O #11 foi para o ramo do 1a, não para a `main` (§2, §3). Nenhum force-push feito. |
| Critério 12 | Ramo do PR 2a só local; falta URL e a pasta `f39-frames` (§5.4). Nada foi enviado ao remoto. |
| Critério 18 | `whoami` negado para mim, saída real no §2. PR 2a segue sem abrir. |
| 500 em JSON malformado no login | A pessoa pediu feature própria antes da F03a. **Não criei a feature.** O relato do CRIVO não foi reproduzido por mim. Proposta em D-5. |

## 7. Dúvidas em aberto

- **D-1.** Citar o ADR 012 (remoção do template, F38, na `main`), o 016 (trava de JDK 21, proposto, no #14) ou os dois? Recomendo os dois, com o papel de cada um.
- **D-2.** O ADR-014 entra pelo PR 2a (premissa 8) ou pela F41? Recomendo uma rota só: o PR 2a, com a versão de `cf1576d`, e a F41 rebaseada depois.
- **D-3.** O #14 junta 1a, 1b e 1c (63 arquivos de diff contra a base antiga). Aceita como um PR só, contra o limite de 3 dias, ou divide?
- **D-4.** `auditoria-dependencia` falhou em 46 min no #14: quem investiga o log (ANCORA)?
- **D-5.** Feature própria para o 500 em JSON malformado no login, antes da F03a. Escopo mínimo proposto: corpo malformado devolve 400 no formato do handler global (timestamp, status, erro, mensagem, path), sem vazar o corpo no log; teste de controller e de integração; README sem mudança com o motivo.
- **D-6.** Depois que a F41 mergear, 2b a 2d continuam três PRs ou viram um?
- **D-7.** Quem libera o Figma para o CRIVO e para mim (critério 18)?

## 8. Dados pessoais (LGPD)

Esta revisão não coleta nem trata dado pessoal. As saídas anexadas não têm senha, token nem e-mail real; `joao.silva` na planilha da F41 é conta fictícia, segundo o próprio relato. O inventário LGPD de `clientes` e `veiculos` (no #14) depende da aprovação da oficina como controladora e segue pendente.

## 9. Verificado e não verificado

**Verificado nesta sessão:** `git rev-parse main origin/main`; busca das classes do template; trechos de `pom.xml`, `application.yml` e `ci-api.yml` da `main`; `mvn compile` no host (falha, JDK 27) e em contêiner (sucesso, JDK 21); `mvn clean verify` em contêiner com Testcontainers; `gh pr list`, `gh pr view 11, 13, 14`, `gh pr checks 14`; proteção da `main` por `gh api`; presença do ADR-014 por ramo; planilha da F41 (lida, não executada).

**Não verificado:** qualquer coisa do Figma; os 18 unitários do #14; o log de `auditoria-dependencia`; o `./mvnw` (com e sem `unzip`); lint e testes de `apps/mobile`; a `main` anterior às PRs #4 e #5.

## 10. Correção de um número neste documento

Nos itens D-3 (§7) o texto cita "63 arquivos" para o #14. O número está errado: ele veio de um `git diff --stat` entre dois ramos, não do PR. O valor real é o de `gh pr view 14 --json changedFiles,additions,deletions`: **14 arquivos, +999 -38**. A pergunta de D-3 continua válida (1a, 1b e 1c viraram um PR só), mas o argumento de tamanho é bem menor do que o texto sugere. A frase do §3 sobre o critério 9 deve ser lida com esse número.

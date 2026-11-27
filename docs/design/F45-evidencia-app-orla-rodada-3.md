# F45, rodada 3: lint, tipos e testes do app em clone limpo (ORLA)

Data: 2026-11-25. Branch `docs/f45-revisao-sprint-02-rodada-2`, HEAD `0daa687`.
Plataforma de tudo o que está aqui: **macOS (Darwin), Node 24.13.1, npm 11.8.0, Jest (`jest-expo`)**.
Nenhuma execução em simulador, aparelho, leitor de tela ou teclado externo.

## 1. Clone limpo da `main`

`.f45-clone` está em `00f3236` (igual a `origin/main` depois de `git fetch`), `git status --short`
com 0 linhas. Instalei com `npm --prefix .f45-clone/apps/mobile ci` (1084 pacotes, sem alterar
`package-lock.json`). Comandos dos scripts do `apps/mobile/package.json`:

    npm --prefix .f45-clone/apps/mobile run lint
    ✖ 15 problems (0 errors, 15 warnings)   (@typescript-eslint/array-type, 13 corrigíveis com --fix)

    npm --prefix .f45-clone/apps/mobile run typecheck
    > tsc --noEmit            (sem saída de erro)

    npm --prefix .f45-clone/apps/mobile run format:check
    All matched files use Prettier code style!

    npm --prefix .f45-clone/apps/mobile test
    Test Suites: 1 skipped, 98 passed, 98 of 99 total
    Tests:       34 skipped, 891 passed, 925 total

Os 34 ignorados são os de `src/qa/f35-real-api.test.tsx` (só rodam com `QA_F35_API`). **Não os
repeti nesta rodada**; a execução contra a API real está na seção 3 de
`F45-evidencia-app-orla-rodada-2.md` (34 passaram, mas em três invocações, não numa só).

## 2. `apps/mobile/jest.config.js`

A alteração que estava pendente já foi commitada pelo BUSSOLA (`9009dee`). Li o diff: acrescenta
`testTimeout: 30000` e um comentário. Decisão: **manter**. Não muda código de produto, não altera
nenhum teste e protege contra queda por tempo na carga fria (LAC-10). Com ela, no working tree da
branch (`apps/` difere da `main` só nesse arquivo e em dois `*IT.java`), o resultado é o mesmo:
98 suítes passando, 891 testes passando, 34 ignorados.

Limite: não reproduzi a queda por cache frio; a justificativa é o relato do ESPRESSO e do BUSSOLA.

## 3. Correções de paridade, acessibilidade, componentização e i18n

**Não alterei código de produto.** O limite de 5 correções pequenas (US-REV-02-18) já foi usado:
N-05 (`919d39a`), N-06 (`eed2d2b`), LG-04 (`d5a04b2`), N-09 (`26acea2`), LG-03 (`301cdf4`). A
premissa 5 do card só permite ao PO mudar o limite antes de a revisão começar, e não há registro
disso. Fora o limite, o resto do que a ESQUADRO apontou também não é pequeno ou depende de decisão:

| Achado (ESQUADRO) | Por que não corrigi | Destino |
|---|---|---|
| N-01, N-03, N-04 (erro de campo, nome acessível, asterisco) | Passa de 2 arquivos de produto | F-APP-1 |
| A-01, A-02 (alvo e anel de foco de Limpar busca e Fechar aviso) | Excede o limite | F-APP-2 |
| PA-01, PA-02, PA-03 | Excede o limite; PA-02 sem glifo confirmado no Figma | F-APP-3 |
| A-03, N-08 (anúncio de erro e foco do diálogo) | Só se fecha em aparelho | F-APP-4 |
| PA-05 (botões centrados nos estados de erro, L5, D3, V4) | Depende da decisão do PO (P2 do F41 ou F26) | F-APP-9, depois da decisão |
| PA-06 (X no `ConfirmDialog`) | Recomendação: manter o app e ajustar o Figma | Sem código; ajuste no Figma (ESQUADRO) |
| N-02, N-07, PA-04, D-C | Decisão de produto | PO, prazo proposto 2026-11-28 |

F-APP-5 a F-APP-8 e F-DOC-2 seguem como em `F45-evidencia-app-orla-rodada-2.md`, seção 5.
Os cards **não estão abertos no painel** (sem acesso); a tarefa 14 fica com a pessoa.

Se o PO subir o limite, a ordem que eu seguiria (cada uma em commit `fix(...)` próprio, teste que
falha antes) é: A-01, A-02, PA-01, PA-03. Não é decisão minha.

## 4. O que não verifiquei

- VoiceOver, TalkBack, teclado externo e anel de foco real (N-05); sem `idb` nem `adb`.
- Capturas 360 x 740 e qualquer coisa em Android.
- Os quatro estados com o app rodando e o contraste medido no app renderizado.
- Paridade com o Figma: usei só o que a ESQUADRO registrou; não tenho ferramenta do Figma.
- `f35-real-api.test.tsx` nesta rodada.

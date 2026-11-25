# F45, rodada 2: evidência do app Expo depois do merge (ORLA)

Branch `docs/f45-revisao-sprint-02-rodada-2`, base `00f3236` (a `main` já tem F03a a F03d, F04 e F35).
`git diff --stat 00f3236 HEAD -- apps` saiu vazio, então o código de `apps/` é o da `main`.
Data: 2026-11-25. Plataforma de tudo o que está aqui: **macOS, Jest (`jest-expo`) e API real em
processo local**. Nenhuma execução em simulador, aparelho iOS/Android, leitor de tela ou teclado
externo foi feita por mim. As capturas e o simulador iOS (iPhone 17) são da ESQUADRO
(`F45-auditoria-codigo-i18n-tokens-a11y.md`, seção 7).

## 1. O que a instrução pediu e o que não fiz

A instrução pedia corrigir os achados pequenos de paridade, acessibilidade, componentização e
tokens apontados pela ESQUADRO. **Não alterei código de produto.** Motivo: o limite de 5 correções
pequenas por revisão (US-REV-02-18) já foi usado na etapa anterior (`919d39a` N-05, `eed2d2b` N-06,
`d5a04b2` LG-04, `26acea2` N-09, `301cdf4` LG-03; ver `F45-correcoes-pequenas-app-sprint-02.md`).
Uma 6ª correção quebraria o critério. A premissa 5 do card só deixa o PO mudar o limite **antes** da
revisão começar, e não há registro disso. Se o PO quiser subir o limite agora, é decisão dele; sem
ela, tudo abaixo vai para feature de correção (seção 5).

## 2. Lint, tipos e testes do app (executado por mim, `00f3236`)

    npm --prefix apps/mobile run lint
    ✖ 15 problems (0 errors, 15 warnings)   (todos @typescript-eslint/array-type; 13 com --fix)

    npm --prefix apps/mobile run typecheck
    > tsc --noEmit            (sem saída de erro)

    npm --prefix apps/mobile run format:check
    All matched files use Prettier code style!

    npm --prefix apps/mobile test
    Test Suites: 1 skipped, 98 passed, 98 of 99 total
    Tests:       34 skipped, 891 passed, 925 total

Na etapa anterior (`581a50d` + 5 correções) eram 86 suítes e 851 testes. Não rastreei de onde vêm
as 12 suítes e 40 testes a mais; a base mudou com os merges da `main`.

## 3. `f35-real-api.test.tsx` contra a API completa (os 34 ignorados)

Ambiente que subi só para isso e desliguei depois: MySQL 8.4 em contêiner novo (`orla-f45-mysql`,
porta 33917 em 127.0.0.1), `apps/api/target/api.jar` (Maven considerou o jar de 00:45 atual, pois
`apps/` não mudou), Flyway V1 a V8 aplicadas, usuário ADMIN fictício, `SERVER_PORT=18461`. Login real
devolveu 200. Segredos descartáveis e locais, nada versionado.

A suíte tem **pré-condições que ela não cria**: banco vazio para o primeiro teste e três clientes de
apoio para os testes de detalhe e veículo. Por isso rodei em três invocações:

| # | Preparação | Comando (filtro `-t`) | Resultado |
|---|---|---|---|
| 0 | Banco com restos de uma tentativa minha sem semente | suíte inteira | 27 passaram, 7 falharam. **Descartada**: faltavam fixtures (`cliente fixture ausente`) e erro meu na semente |
| 1 | `TRUNCATE` de `ordens_servico`, `veiculos`, `clientes` | `"lista vazia"` | 1 passou, 33 ignorados |
| 2 | SQL: `Cliente Sem Contato` (CPF `52998224725`), `Cliente Sem Cpf`, `Cliente Com Os` com 1 veículo e 1 OS | `"^(?!.*lista vazia)"` | 32 passaram, 1 falhou, 1 ignorado |
| 3 | Corrigi a semente: o CPF `52998224725` tinha ido parar em outro cliente na rodada 0 | `"duplicate CPF error from the API on edit"` | 1 passou |

Resultado: os 34 testes passaram, **mas não numa execução única e limpa**. A falha da invocação 2
(`Já existe um cliente com este CPF.` não apareceu na edição) foi minha, de semente, e some com o
dado certo; não é defeito do app.
O teste do histórico (`[crit 12]`) passou e **caracteriza o F-4**: com 1 OS no banco, a API devolve
`historicoOs: []`. O critério de histórico de OS segue parcialmente coberto até a F06.
Os `afterEach` do arquivo conferem que log de console não contém CPF nem telefone das fixtures nem o
token: passaram nos 34.

Recomendação (feature de correção F-APP-5): o arquivo deveria criar as próprias fixtures e rodar em
uma execução só, ou o README do app deveria documentar a ordem.

## 4. Critério 10: buscas de texto fixo, cor e camada (executado por mim)

Script `busca-i18n.sh` (fora do repo, no scratchpad), `grep -rEn` em `apps/mobile/app` e
`apps/mobile/src`, excluindo `*.test.*`:

| Busca | Saída |
|---|---|
| (a) texto literal entre tags JSX: `>[[:space:]]*[A-Za-zÀ-ÿ][^<>{}]{2,}</` | 0 ocorrências |
| (b) `label|title|placeholder|accessibilityLabel|accessibilityHint|message|alt` com literal | 0 ocorrências |
| (c) `#hex` ou `rgb(a)` fora de `tokens.ts` | 0 ocorrências |
| (d) `fetch(`, `axios`, `AsyncStorage`, `SecureStore`, `Authorization` em `app`, `components`, `screens` | 1 linha, um **comentário** em `session-restore-screen.tsx:16` |
| (e) import de função de `@/services/` em tela ou componente | 0 ocorrências |

Limite: o grep acha literal em JSX e em props de texto conhecidas; não acha texto montado em
variável nem em `Alert`. As 3 junções com separador fixo (A-07) e as chaves fora de
`area.componente.texto` (A-05) vêm da leitura da ESQUADRO, não desta busca.

## 5. Destino de cada achado do app (nenhum corrigido aqui)

Todos são "feature de correção". Os cards abaixo estão prontos para abrir; **não tenho acesso ao
painel**, então a tarefa 14 fica com a pessoa.

| Card | Achados | Escopo resumido | Dono | Prazo proposto |
|---|---|---|---|---|
| F-APP-1 | N-01, N-03, N-04 | `TextField`: ícone e 13 px no erro, nome acessível "obrigatório, erro: ..." e asterisco em cor própria. Mexe em `text-field.tsx`, `strings.ts` e dois formulários | ORLA | 2026-12-02 |
| F-APP-2 | A-01, A-02 | "Limpar busca" com alvo de 48 e anel de foco; anel no "Fechar aviso". Teste que mede o botão | ORLA | 2026-12-02 |
| F-APP-3 | PA-01, PA-02, PA-03 | Título de seção em Flint com `letterSpacing` 0,9; ícone de editar; texto centralizado no cartão sem OS. PA-02 precisa confirmar o glifo no Figma | ORLA, ESQUADRO | 2026-12-04 |
| F-APP-4 | A-03, N-08 | Anúncio da faixa de erro em iOS e Android sem leitura dupla; foco inicial do diálogo de descarte. **Só se fecha com VoiceOver e TalkBack em aparelho** | ORLA, CRIVO | 2026-12-09 |
| F-APP-5 | LAC-01 | `f35-real-api.test.tsx` cria as próprias fixtures e roda em execução única | ORLA | 2026-12-04 |
| F-APP-6 | A-04, A-07, A-08, A-09, A-10 | Nome acessível do botão em carregamento; `Intl.NumberFormat`; tokens do ícone de alerta; hooks `useVoltar` e de foco; chaves sem uso | ORLA | 2026-12-11 |
| F-APP-7 | LG-07 (lado app) | Depois da decisão P9 do PO: tirar "obrigatório" do CPF na validação do app. Depende de F-API-4 | ORLA, BUSSOLA | 2026-12-04 |
| F-APP-8 | LG-05, LG-06 (lado app) | `test-utils/cpfFicticio` e trocar os CPFs de teste com dígito verificador válido | ORLA, VIGIA | 2026-12-04 |
| F-DOC-2 | LG-01 | Consolidar a política em uma revisão só (VIGIA). Não é código do app | VIGIA | já com prazo da VIGIA |

N-02 e N-07 (frame D6 a L8 na página errada) e PA-04 (rodapé ancorado ou em fluxo) esperam a
**decisão do PO**; recomendação da ESQUADRO na seção 7.7 do documento dela. A F26 continua
aguardando aprovação.

## 6. O que continua sem verificar (por mim)

- **VoiceOver, TalkBack, teclado externo e anel de foco real (N-05)**: não rodei. Exige simulador com
  acessibilidade ou aparelho; sem `idb` nem `adb` aqui.
- **Capturas 360 x 740 e Android**: não fiz. O que existe é iPhone 17 (402 x 874), da ESQUADRO, 8 pares.
- **Quatro estados com o app rodando**: carregando e erro de rede só foram provocados nos testes de
  Jest e no `f35-real-api` (RTL), não em captura. Preenchido em criar e vazio em editar não têm frame
  na F26 (lacuna de design).
- **Contraste medido no app renderizado**: só o cálculo sobre os tokens (ESQUADRO, 29 pares).
- **Histórico de OS vazio**: coberto por teste real (`[crit 12]`) e por captura V2 da ESQUADRO;
  parcial até a F06.
- **Suíte real em execução única**: ver seção 3.

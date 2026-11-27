# F45, rodada 2: conferência Figma × app dos estados e auditoria WCAG (ESQUADRO)

Branch `docs/f45-revisao-sprint-02-rodada-2`. Data: 2026-11-25. Sessão Figma
`da323728-dbb7-408b-860a-a43c4422b53c`, arquivo `FPdB8RymAnN81pbKfizdzE`, **somente leitura**
(`get_metadata`, `get_screenshot`, `get_variable_defs`). Nada foi escrito no Figma. Nenhum código de
`apps/` foi alterado (limite de 5 correções pequenas já usado; ver
`F45-evidencia-app-orla-rodada-2.md`, seção 1).

Este documento **complementa** `F45-conferencia-paridade-wcag-sprint-02.md` (N-01 a N-09) e a seção 7
de `F45-auditoria-codigo-i18n-tokens-a11y.md` (PA-01 a PA-04, 29 pares de contraste). Só traz o que
é novo: PA-05, PA-06 e a conferência dos estados de erro, carregando e descarte.

## 1. O que li no Figma e o que bateu

| Frame | Nó | Estado | Resultado |
|---|---|---|---|
| L4 | `109:2402` | Lista, carregando | **Bate** com `LoadingState`: spinner 36, texto Flint 14, 12 de distância, textos iguais |
| L5 | `109:2453` | Lista, erro ao carregar | Textos **batem**. Posição dos botões **diverge** (PA-05) |
| D3 | `109:2574` | Detalhe do cliente, erro | Textos batem; mesma divergência de posição (PA-05) |
| V4 | `109:2723` | Detalhe do veículo, erro | Só li o registro em `F26-prototipo-clientes-veiculos.md`; **não li a estrutura do frame**; assumo PA-05 igual a L5/D3 |
| C3 | `106:2409` | Criar cliente, erro | Textos batem. Ícone e 13 px do erro de campo já são N-01 |
| E2 | `110:2718` | Editar cliente, salvando | Texto "Salvando…" bate |
| X2 | `119:976` | Diálogo "Descartar alterações?" | Textos, padding 20 e espaçamento 14/10 **batem**. O frame **não tem X de fechar** (PA-06) |

Tokens: petro `#1E3A3F`, primary `#B5453D`, Pampas `#F7F5F2`, Flint `#6E6A66` conferem com
`apps/mobile/src/theme/tokens.ts`. Capturas do Figma (410 × 790, só o frame, sem dado pessoal real):

- `docs/design/f45-capturas/figma-f26-L4-carregando-109-2402.png`
- `docs/design/f45-capturas/figma-f26-L5-erro-109-2453.png`
- `docs/design/f45-capturas/figma-f26-X2-descartar-119-976.png`

## 2. Divergências novas (para a ORLA)

| ID | Frame (nó) | Tela | Elemento | Figma | App | Sev. | Correção esperada |
|---|---|---|---|---|---|---|---|
| PA-05 | L5 `109:2453`, D3 `109:2574`, V4 `109:2723` | Lista de clientes, detalhe do cliente, detalhe do veículo (estado erro) | Posição do grupo ícone + título + mensagem + botões | Tudo **centrado junto**: ícone, título, mensagem e, 10 abaixo do texto, "Tentar novamente" e "Voltar" com 288 de largura. Cabeçalho, busca e barra de abas continuam visíveis | `ErrorState` (padrão P2 do F41, frame `83:759`) **ancora os botões na base** com até 328 de largura (`layout.stateActionsMaxWidth`); o comentário do componente diz "sem cabeçalho nem tab bar", o que não vale nessas telas | Média | Dar ao `ErrorState` uma variante de posição: centrada (telas da F26, ação 288) e ancorada (restaurar sessão). Corrigir o comentário. **Depende de decisão do PO** sobre qual frame prevalece (P2 do F41 × F26) |
| PA-06 | X1 `119:905` a X4 | Os quatro diálogos de descarte | Botão X de fechar | Não existe | `ConfirmDialog` desenha `CloseButton` (padrão do F38) com rótulo `comum.botaoFechar.rotulo` | Baixa | **Manter o app** e acrescentar o X aos frames só depois da aprovação da F26. Decisão do PO. Observação de acessibilidade: o card tem `accessibilityRole="alert"` e `accessibilityLiveRegion="assertive"` junto de `accessibilityViewIsModal`; pode haver leitura dupla e o foco inicial não está definido (N-08). **Não verifiquei em aparelho** |

Alvo de toque do X: visual 32 (`size.closeButton`) mais `hitSlop` de `spacing.sm` (8) em cada lado dá
**48 × 48 de área tocável** (tokens.ts l.116, l.201; `close-button.styles.ts`). Isso é cálculo sobre
o código; não medi no aparelho, e `hitSlop` não aumenta o tamanho visual nem o que o leitor de tela
enxerga.

## 3. Cobertura das 7 telas × 4 estados

Telas: lista de clientes, criar cliente, detalhe do cliente, editar cliente, detalhe do veículo,
criar veículo, editar veículo.

| Estado | Frame na F26 | Código do app | Captura do app | Observação |
|---|---|---|---|---|
| Vazio | L2, D (histórico vazio), V2 | Sim | Sim (L2, V2, C1, N1, iPhone 17) | OK |
| Carregando | L4, D2, V3 | Sim (`LoadingState`) | **Não** | Só provado em Jest |
| Erro | L5, D3, V4; erro de campo C3 | Sim | **Não** | Só provado em Jest; PA-05 |
| Preenchido | L1, D1, E1, M1 | Sim | Sim (L1, D1, E1, M1) | OK |

Lacunas de **desenho** (sem frame na F26): preenchido em criar cliente, vazio em editar cliente. Não
inventei frame; ficam como lacuna para o PO e para o ESQUADRO desenhar depois da aprovação.
Histórico de OS vazio segue parcialmente coberto até a F06.

## 4. Acessibilidade (WCAG 2.2 AA)

| Critério | Resultado | Como sei |
|---|---|---|
| 1.4.3 / 1.4.11 contraste | 29 pares calculados sobre os tokens; textos e ícones atingem o alvo; C06, C07, C08 são contornos decorativos | Cálculo (seção 7 da auditoria). **Não medi no app renderizado** |
| 4.1.2 nome e papel | `ErrorState`: `alert` + `assertive`; `LoadingState`: `progressbar` + `polite` + `announceForAccessibility`; botão X: `button` com rótulo | Leitura de código |
| 2.4.7 foco visível | Anel existe nos controles, **exceto** "Limpar busca" e "Fechar aviso" (A-02), e nos botões do cabeçalho o N-05 foi corrigido | Código e testes; **sem teclado externo**, anel não visto |
| 2.5.8 alvo mínimo | X do diálogo 48 (cálculo); "Limpar busca" cerca de 34 × 20 (A-01) | Cálculo |
| 4.1.3 mensagens de status | Erro e carregamento anunciados por código; leitura dupla em iOS e Android é suposição | Código |

## 5. O que não consegui verificar e por quê

- **VoiceOver, TalkBack e teclado externo**: não há `idb` nem `adb` neste ambiente; só `xcrun simctl`
  com simuladores desligados.
- **Capturas 360 × 740**: sem emulador Android; existem só as de iPhone 17 (402 × 874).
- **Estados carregando e erro com o app rodando**: sem como provocá-los no simulador sem `idb`.
- **Contraste no renderizado**: só cálculo sobre tokens.
- **Comparação lado a lado em imagem composta**: sem `magick` nem biblioteca de imagem; a comparação
  é por tabela e capturas separadas.
- **Estrutura de V4**: não li o frame, ver seção 1.
- **`get_design_context` e `get_comments`**: não usados nesta rodada (falha e negação anteriores).

## 6. Decisões pedidas ao PO (prazo proposto 2026-11-28)

N-02, N-07, PA-04, D-C (já registradas), mais **PA-05** (qual posição prevalece) e **PA-06**
(manter o X no app e ajustar o Figma). Registrar também a aprovação da F26, que segue pendente.

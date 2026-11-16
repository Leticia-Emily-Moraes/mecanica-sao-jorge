# F41 · Planilha de valores FPdB8 × código (linha de base, sem captura)

Autor: ESQUADRO · Data: 2026-11-16 · Código conferido: ramo `feat/f41-paridade-fpdb8-codigo` em `937a3d1` · Arquivo de referência: `FPdB8RymAnN81pbKfizdzE`, página `20:2132`.
Substitui, por decisão de 16/11, o critério dos "pares lado a lado" (US-PAR-01, 08, 12, 13). Cada tela e estado tem uma linha por valor do frame (nó, token, medida, texto), o valor no código e o teste que o trava. A planilha de divergências com a história das decisões continua em `docs/design/F41-planilha-fpdb8.md`.

## 1. O que eu li e o que não consegui ler (US-PAR-11)

- **Nesta sessão não li o Figma.** O ambiente informou que o servidor `figma-remote` exige autenticação e a sessão não é interativa; nenhuma ferramenta `mcp__figma-remote__*` ficou disponível para mim. Não houve chamada, então **não existe saída de `whoami` desta sessão**. Para liberar: `claude mcp login figma-remote` numa sessão interativa. Não tentei contornar.
- **Origem dos valores do "Figma" abaixo:** leitura do ESQUADRO em 16/11 (sessão `0aa749b1-35d2-40cf-aabc-92c54f24f036`, `whoami` e `get_metadata`, `get_design_context`, `get_variable_defs` sem erro), registrada em `F41-planilha-fpdb8.md` e `figma.md`. **Não foi relida hoje.** Onde não existe valor lido, a linha diz "não lido" e não inventei.
- Conferi hoje, por leitura, as capturas "antes" dos frames propostos P1, P2, T1, T2 e C1 em `docs/design/f41-capturas/` (as de L1 a L4 não existem em arquivo).
- **Lado código:** li os arquivos citados em `937a3d1`. Rodei `npm --prefix apps/mobile test -- --silent`: **33 suítes, 186 testes, todos passando** (saída na §8).

## 2. Protocolo de referência (US-PAR-04, reescrito)

Referência = **simulador iPhone 17, iOS 27.0, Expo Go, retrato, escala de fonte padrão, tema claro**, sem captura anexada. Valor de aparência vem desta planilha mais os testes de componente.

**Sem cobertura, declarado:** aparelho físico; Android (a sombra do diálogo e do cartão usa `elevation`, aceita e registrada, ver D-16); escala de fonte do sistema; foco de teclado e leitor de tela em aparelho (US-MENU-06, não alcançável sem aparelho). O Jest **não mede layout nem toque real**: os testes travam estilo declarado e props, não o pixel renderizado nem a área de toque efetiva.

## 3. Como ler a coluna "Trava"

- **Token**: o teste compara com `color.x` / `size.x` do `tokens.ts`. Trava o **uso**; se alguém mudar o hex no `tokens.ts`, o teste continua verde. O hex só fica travado com o teste de tokens da §6 (**ainda não existe**: `src/theme/tokens.test.ts` não está no ramo).
- **Texto**: o teste procura a string literal.
- **FALTA**: nenhum teste lê esse valor hoje. Vai para a lista da §6.
- Estado da linha: **igual** (código = frame), **aberta** (código ≠ frame aprovado, correção é do ORLA), **bloqueada** (depende do Figma ou de ativo).

## 4. Valores por tela e estado

### 4.1 Login (`10:895`, `10:936`; L1 a L4 aprovados em `82:1990`, `82:2024`, `82:2058`, `82:2098`)

| ID | Estado | Valor no FPdB8 (nó) | Código | Trava | Estado |
|---|---|---|---|---|---|
| V-L01 | todos | fundo Pampas `#F7F5F2` (`10:895`) | `color.surface.background` em `screen-container.tsx` | `screen-container.test` "Pampas background" (token) | igual |
| V-L02 | todos | margem lateral 16 + 12 = 28, conteúdo 304 em 360 (`10:895`) | `LOGIN_HORIZONTAL_PADDING` em `login.tsx` | `screen-container.test` "custom side margin (Login uses 28)" | igual |
| V-L03 | vazio | escudo 84 × 96, centralizado, acima do título (`10:895`) | **ausente** | — | **bloqueada**: ativo sem origem/licença (§7) |
| V-L04 | vazio | título "MECÂNICA SÃO JORGE", Barlow Condensed Bold 30, espaçamento 0,6, petro (`10:895`) | `login.titulo`, `typography.brandTitle` | `brand-header.test` (família, 30, 0,6, `color.text.primary`); `login.test` (texto do subtítulo) | igual |
| V-L05 | vazio | subtítulo "Gestão da oficina", Inter 13, Flint | `login.subtitulo`, `typography.subtitle` | `brand-header.test`, `login.test` (texto) | igual |
| V-L06 | vazio | rótulo "Usuário", Inter Medium 13, Flint, 6 até o campo | `login.campoEmail.rotulo`, `typography.fieldLabel`, `spacing.s6` | `login.test` (texto "Usuário", e "E-mail" ausente); estilo do rótulo **FALTA** | igual (estilo sem trava) |
| V-L07 | vazio | placeholders "Seu usuário" e "Sua senha", cor Flint (aprovado 16/11) | `login.campoEmail.placeholder`, `login.campoSenha.placeholder`, `color.text.placeholder` | `text-field.test` (token); textos **FALTA** | igual; hex depende do §6 (hoje já Flint) |
| V-L08 | vazio | campo altura 46, raio 8, borda 1 px, margem interna 14, fundo branco, texto Inter 15 | `size.field`, `radius.sm`, `borderWidth.hairline`, `FIELD_PADDING` | `text-field.test` "46 of height… hitSlop 48" e "1 px at rest" (token); **raio, margem interna e Inter 15: FALTA** | igual |
| V-L09 | vazio | borda de repouso `#8C8780` (aprovado 16/11) | `color.border.default` = `slate500` `#64748B` | `text-field.test` (token) | **aberta**: trocar para `#8C8780` |
| V-L10 | foco | borda de 2 px Crail `#B5453D` no campo (`10:895`, leitura do ESQUADRO) | `color.border.focusField`, `borderWidth.field` | `text-field.test` "2 px Crail border while focused" | igual |
| V-L11 | vazio, preenchido | botão Entrar 50, raio 8, Crail, Inter SemiBold 15 branco, 304 de largura (`20:1073`) | `size.button`, `radius.sm`, `typography.button` | `button.test` "50 of height with radius 8" e "primary Crail with white text" (token); fonte e 304 em 320/430: **FALTA** | igual |
| V-L12 | vazio | ritmo: 16 entre grupos, rótulo→campo 6, bloco do logo com 10 entre itens e 14 abaixo | `spacing.md`, `spacing.s6`, `brand-header.tsx` | **FALTA** | igual (sem trava) |
| V-L13 | preenchido (L1 `82:1990`) | ação na senha com texto visível "**Mostrar**" | visível "Mostrar senha" (`login.campoSenha.mostrar`) | `login.test` "toggle password visibility" | **aberta** (texto): visível "Mostrar"/"Ocultar", nome acessível "Mostrar senha"/"Ocultar senha" (WCAG 2.5.3); duas chaves novas |
| V-L14 | carregando (L2 `82:2024`) | "Entrando…" com indicador, campos preenchidos | `login.botaoEntrar.carregando` = "Entrando..." e `ActivityIndicator`; botão a opacidade 0,5 (`opacity.disabled`) | `button.test` "loading label, busy" | **aberta a conferir**: frame não lido hoje; sugestão da planilha é não esmaecer o botão. Texto com reticências: "…" do frame × "..." do código **não lido** |
| V-L15 | erro de credencial (`10:936`) | caixa Pot Pourri `#F6E7E5`, borda Rose Fog `#E2B5B0` 1 px, raio 8, margem 13, ícone 18, texto El Salva `#923631` Inter 14 / 19,6, entre senha e botão | `InlineAlert`, `AlertIcon` | `inline-alert.test` (cores por token; sem altura fixa), `alert-icon.test` (círculo, 18, El Salva), `login.test` (posição entre senha e botão); **14/19,6, margem 13, gap 10, raio 8: FALTA** | igual |
| V-L16 | erro de credencial | texto "Usuário ou senha incorretos. Confira os dados e tente novamente." | `login.erroCredencial.mensagem` | `login.test` (texto) | igual |
| V-L17 | erro de credencial | os **dois** campos com borda de 2 px Crail | `invalid` nos dois `TextField` | `login.test` "mark both fields with a 2 px error border" (token) | igual |
| V-L18 | erro de conexão (L3 `82:2058`) | **caixa de erro** entre a senha e o botão, no estilo de `10:967`; redação proposta "Sem conexão. Verifique a internet da oficina e tente de novo." | popup `ErrorRetryModal` com "Não foi possível conectar." | `login.test` "network error modal" trava o **popup** | **aberta** (estrutura, texto): trocar o popup pela caixa. Texto exato do frame L3 **não lido hoje**, ler em `82:2058` |
| V-L19 | sessão expirada (L4 `82:2098`) | aviso no topo do formulário, caixa do erro | `InlineAlert` "Sua sessão expirou. Faça login novamente." acima do e-mail | **FALTA** (nenhum teste de sessão expirada na tela) | **aberta a conferir**: texto do frame **não lido hoje** |
| V-L20 | validação de campo | "Informe seu usuário" / "Informe sua senha" abaixo do campo | `login.campoEmail.erroVazio`, `login.campoSenha.erroVazio` | `login.test` (texto) | **sem frame**: o texto é do código (não há frame de validação no FPdB8); registrado como "não se aplica ao frame", mantido |

### 4.2 Perfil (`10:3842`; P1 `83:712`, P2 `83:754` aprovados)

| ID | Estado | Valor no FPdB8 (nó) | Código | Trava | Estado |
|---|---|---|---|---|---|
| V-P01 | preenchido | cabeçalho petro altura 56; título "Perfil" Barlow Condensed SemiBold 21, espaçamento 0,21, branco (`20:2083`) | `ScreenHeader`, `typography.appBarTitle` | `screen-header.test` (petro, branco, 56); família/21/0,21: **FALTA** | igual |
| V-P02 | preenchido | seta de voltar em botão 36 × 36, raio 8, branco 12%, ícone 18 (`20:2083`) | `HeaderIconButton`, `size.iconButton`, `iconSize.appBar` | `header-icon-button.test` (36, raio, translúcido, hitSlop 48) | igual; ícone é Ionicons (D-10) |
| V-P03 | preenchido | avatar círculo 84 Spectra `#33575D`, iniciais Barlow SemiBold 32 branco | `Avatar`, `size.avatar`, `color.surface.avatar` | `avatar.test` (84, raio 42, Spectra, branco) | igual |
| V-P04 | preenchido | nome "João da Silva", Barlow SemiBold 24 petro, centralizado | `perfil.tsx` `styles.name` | `perfil.test` (texto); **estilo FALTA** | igual (estilo sem trava) |
| V-P05 | preenchido | selo pill `999` petro, "ADMIN" Inter SemiBold 12 branco, sob o nome | `AccessProfileBadge` | `access-profile-badge.test` "petro pill with white text" | igual |
| V-P06 | preenchido | cartão branco, borda 1 px Westar `#E2DEDA`, raio 8, margem 15, sombra `0 1 1 rgba(30,58,63,.06)` | `InfoCard`, `shadow.card` | `info-card.test` trava só conteúdo e ordem; **borda, raio, margem, sombra: FALTA** | igual (sem trava) |
| V-P07 | preenchido | 3 linhas: rótulo Flint 14, valor petro Inter Medium 14 à direita: "Usuário", "Perfil de acesso", "Versão do app" | `perfil.rotuloUsuario`, `rotuloPerfil`, `rotuloVersao`; `typography.rowLabel/rowValue` | `info-card.test` (rótulo+valor), `perfil.test` (e-mail sob "Usuário"; versão) | igual |
| V-P08 | preenchido | valor de "Usuário" no frame: "joao.silva"; decisão 16/11: **e-mail sob o rótulo Usuário** | `usuario.email` | `perfil.test` "e-mail under the Usuário label" | igual (dado ≠, decidido) |
| V-P09 | preenchido | "Versão do app" = "1.0.0" no frame; decisão 16/11: **versão real 0.1.0** | `getAppVersion()` de `app.config.ts` | `app-version.test`, `perfil.test` "reads the version from the Expo config" | igual (dado ≠, decidido) |
| V-P10 | preenchido | "Administrador" (cartão) e "ADMIN" (selo); **Funcionário no estilo do selo ADMIN** (decisão 16/11) | `describeAccessProfile` | `access-profile.test`, `access-profile-badge.test`, `perfil.test` "FUNCIONARIO" | igual |
| V-P11 | preenchido | "Sair da conta": contorno Westar 1 px, sem fundo, texto Crail Inter SemiBold 15, altura 50, raio 8, no rodapé | `Button variant="outlineAccent"`, `styles.footer` | `button.test` "outlineAccent… Westar outline and Crail text" (token); rodapé: **FALTA** | igual |
| V-P12 | preenchido | **sem** tab bar | Perfil fora de `(menu)` | `perfil.test` "without a tab bar" | igual |
| V-P13 | preenchido | fundo Pampas, margem 16, 12 entre blocos, 20 acima do avatar e 8 abaixo | `ScreenContainer`, `styles.identity` (36 acima, 20 entre selo e cartão, medido em 10:3842) | `screen-container.test`; ritmo **FALTA** | igual (sem trava) |
| V-P14 | carregando (P1 `83:712`) | fundo Pampas, indicador petro e texto **visível** "Carregando sessão…" abaixo | `StateView loading`: só o indicador; o texto existe só como nome acessível | `state-view.test` (progressbar, busy, anúncio) | **aberta** (estrutura, texto): mostrar o texto visível em Flint |
| V-P15 | erro (P2 `83:754`) | **tela cheia** sem cabeçalho e sem tab bar: ícone de sem conexão em círculo, título "Não foi possível carregar" (Barlow, petro), mensagem "Verifique a internet da oficina e tente de novo. Se continuar, entre novamente.", **botão cheio Crail "Tentar novamente" e botão de contorno "Entrar novamente"** (ajuste de 16/11) | popup `ErrorRetryModal` com ⚠ sobre o conteúdo; "Tentar novamente" cheio e "Entrar novamente" contorno petro; mensagem "Verifique sua conexão e tente novamente." | `state-view.test` (popup), `index.test` "retry modal" | **aberta** (estrutura, ícone, texto). O frame `83:754` ainda desenha os **dois** botões em contorno: ajustar o frame (bloqueado, §7) e o código |

### 4.3 Diálogo de logout (`10:3886`)

| ID | Valor no FPdB8 | Código | Trava | Estado |
|---|---|---|---|---|
| V-D01 | título "Sair da conta?", Barlow Condensed Bold 22 petro, à esquerda | `perfil.dialogoLogout.titulo`, `typography.dialogTitle` | `perfil.test` (texto); fonte **FALTA** | igual |
| V-D02 | mensagem "Você vai precisar do usuário e senha para entrar de novo." Inter 14 / 21 Flint | `perfil.dialogoLogout.mensagem`, `typography.dialogMessage` | `perfil.test` (texto), `confirm-dialog.test` (presença); 14/21 **FALTA** | igual |
| V-D03 | botões lado a lado: Cancelar (contorno petro) e Sair (Crail), 50, raio 8, 10 entre eles | `ConfirmDialog`, `spacing.s10` | `confirm-dialog.test` "Cancelar before Sair, side by side"; `button.test` (variantes) | igual |
| V-D04 | cartão branco, raio 10, margem 20, 14 entre blocos, 22 do lado da tela | `radius.dialog`, `spacing.s20`, `spacing.s14`, `spacing.s22` | **FALTA** | igual (sem trava) |
| V-D05 | sombra `0 12 16 rgba(0,0,0,.25)` | `shadow.dialog` (iOS exato; Android `elevation` 8) | **FALTA** | igual no iOS; Android aproximado (D-16) |
| V-D06 | scrim petro a 55% `rgba(30,58,63,.55)` | `color.surface.overlay` | **FALTA** | igual |
| V-D07 | rótulos "Cancelar" e "Sair" | `perfil.dialogoLogout.botaoCancelar`, `botaoConfirmar` | `perfil.test` (Cancelar mantém a sessão; Sair limpa o token) | igual |

### 4.4 Tab bar (`20:1102` Ordens, `20:1340` Clientes; T1 `83:817`, T2 `83:844` aprovados)

| ID | Estado | Valor no FPdB8 (nó) | Código | Trava | Estado |
|---|---|---|---|---|---|
| V-T01 | padrão | 4 itens na ordem Ordens, Clientes, Catálogo, Financeiro, sem Perfil | `ENTRIES` em `menu-tab-bar.tsx` | `menu-tab-bar.test` "four Figma items… no Perfil" e "Figma order" | igual |
| V-T02 | padrão | rótulos "Ordens", "Clientes", "Catálogo", "Financeiro" | `menu.tabbar.*.rotulo` | `menu-tab-bar.test` "short Figma labels" | igual |
| V-T03 | padrão | barra 62, células 90 × 62, ícone 22, rótulo 11, 4 entre ícone e rótulo (`20:1102`) | `size.tabBar`, `iconSize.tab`, `spacing.xs` | `menu-tab-bar.test` "explicit height of 62"; ícone 22 e gap: **FALTA** | igual |
| V-T04 | padrão | fundo petro, sem borda | `color.surface.brand` | **FALTA** | igual |
| V-T05 | inativo | ícone e rótulo Tide `#B7B2AC`, rótulo Inter Medium 11 | `color.text.onBrandMuted`, `typography.tabLabel` | `tab-bar-item.test` "11 label in Medium… Tide" (token) | igual |
| V-T06 | selecionado | ícone e rótulo **`#EE8279`** (aprovado 16/11), Inter SemiBold 11, sem pílula, anúncio "selecionado" | `color.text.tabSelected` = **branco `#FFFFFF`** (PROVISÓRIO) | `tab-bar-item.test` "selected label in SemiBold", "no pill", `accessibilityState.selected` (token) | **aberta**: trocar para `#EE8279`. Nenhum item é selecionável no app; só o teste do componente isolado prova |
| V-T07 | desabilitado (T2 `83:844`) | 4 itens a **50%** de opacidade, nenhum selecionado, anunciados como indisponíveis | `opacity.unavailable` = **0,6** | `menu-tab-bar.test` "every item disabled… none selected"; opacidade **FALTA** | **aberta**: 0,6 → 0,5 (valor lido na legenda do frame T2) |
| V-T08 | foco (T1 `83:817`) | anel **branco** de 2 px com respiro de 2 px no item (legenda: 12,12:1 sobre petro) | `useFocusRing`: borda **petro** + halo branco | `tab-bar-item.test` "focus ring only while focused" (existência, não a cor) | **aberta**: sobre a barra petro o anel petro some; usar anel branco (token `focus.ringOnBrand`, hoje inexistente) |
| V-T09 | todos | ícones de linha do arquivo (documento, pessoas, caixa, cartão) | Ionicons `document-text-outline`, `people-outline`, `cube-outline`, `card-outline` | **FALTA** | **exceção registrada** (D-10): Ionicons mantidos; desenho difere do arquivo |
| V-T10 | não navega | desabilitado não chama `onPress` | `unavailable` + `disabled` | `menu-tab-bar.test` "not navigate when disabled item is pressed" | igual |

### 4.5 Cabeçalho com botão de usuário (`20:1079`, `10:981`)

| ID | Valor no FPdB8 | Código | Trava | Estado |
|---|---|---|---|---|
| V-H01 | barra petro 56, título Barlow SemiBold 21 branco, pl 16 / pr 12 | `ScreenHeader` | `screen-header.test` (petro, branco, 56) | igual |
| V-H02 | botão de usuário 36 × 36, raio 8, branco 12%, ícone de pessoa 18, canto direito | `HeaderIconButton icon="person-outline"` | `header-icon-button.test` | igual; ícone Ionicons (D-10) |
| V-H03 | nome acessível "Perfil", papel botão, alvo ≥ 48 por `hitSlop` | `cabecalho.usuario.rotulo` | `screen-header.test` "user button with its accessible name", `header-icon-button.test` "hitSlop to 48" | igual |
| V-H04 | ordem de foco: seta, título, botão de usuário | `ScreenHeader` | `screen-header.test` "focus order" | igual |
| V-H05 | barra de status clara sobre petro | `StatusBar style="light"` | `screen-header.test` "light status bar" | igual (barra é plataforma; o estilo definido pelo app é real) |

### 4.6 Início (tela pós-login, P-01 opção A)

**Sem frame aprovado.** Pelas decisões de 16/11, **Início só vale depois de a pessoa aprovar o frame proposto**, e eu não consegui criar o frame (§7). O código já tem `/inicio` (cabeçalho "Início" com botão de usuário, `StateView empty` "Em breve", tab bar dos 4 itens desabilitados). **Nenhuma linha de Início conta como paridade.** A proposta de conteúdo para o frame está na §13.

## 5. Estados "não se aplica" (premissa 5)

| Estado | Justificativa |
|---|---|
| Perfil, estado vazio | O Perfil sempre tem usuário autenticado; sem dado, a rota manda ao Login. Não existe nos dois lados. |
| Tab bar com item selecionado em execução | Nenhum módulo está programado; nenhum item é navegável. Provado só pelo componente isolado (`tab-bar-item.test`), foco real em aparelho segue em US-MENU-06. |
| Login, validação de campo vazio (V-L20) | O FPdB8 não tem frame de validação de campo; o texto é do código e foi mantido. |

## 6. Lacunas de teste (para o ORLA) e valores literais

Os testes de hoje comparam com o token e por isso **não travam o hex**. Para travar o valor do Figma, o ORLA cria `apps/mobile/src/theme/tokens.test.ts` com os literais abaixo (valores do FPdB8 já aprovados; as três linhas marcadas ★ mudam no `tokens.ts` na mesma entrega):

| Token | Valor literal | Origem |
|---|---|---|
| `color.surface.background` | `#F7F5F2` | Pampas |
| `color.surface.brand` | `#1E3A3F` | petro |
| `color.surface.errorTint` | `#F6E7E5` | Pot Pourri |
| `color.surface.avatar` | `#33575D` | Spectra |
| `color.surface.overlay` | `rgba(30, 58, 63, 0.55)` | scrim |
| `color.surface.onBrandControl` | `rgba(255, 255, 255, 0.12)` | botão de ícone |
| `color.text.secondary` | `#6E6A66` | Flint |
| `color.text.placeholder` ★ | `#6E6A66` | Flint (aprovado; remover o comentário PROVISÓRIO) |
| `color.text.onBrandMuted` | `#B7B2AC` | Tide |
| `color.text.tabSelected` ★ | `#EE8279` | aprovado (hoje `#FFFFFF`) |
| `color.text.errorOnBanner` | `#923631` | El Salva |
| `color.border.default` ★ | `#8C8780` | aprovado (hoje `#64748B`) |
| `color.border.divider` | `#E2DEDA` | Westar, decorativo |
| `color.border.errorBanner` | `#E2B5B0` | Rose Fog |
| `color.border.focusField` e `color.action.primaryBackground` | `#B5453D` | Crail |
| `size` | `field 46, button 50, appBar 56, tabBar 62, avatar 84, iconButton 36` | medidas do FPdB8 |
| `iconSize` | `tab 22, appBar 18, banner 18` | medidas do FPdB8 |
| `opacity.unavailable` | `0.5` (hoje 0,6) | T2 aprovado |

**Testes novos pedidos (critério 9):**
1. `tokens.test.ts` com a tabela acima.
2. Tab bar: `opacity` dos itens desabilitados em 0,5; anel de foco **branco** no item; item selecionado com `#EE8279`, SemiBold e `accessibilityState.selected`.
3. P2: botão **cheio** "Tentar novamente" e botão de **contorno** "Entrar novamente".
4. Iniciais: "João da Silva" = `JS`, "Maria de Souza Lima" = `ML`, "Ana" = `A`, nome vazio = vazio. Leitura do `get-initials.ts`: ele pega a primeira e a última palavra e **não filtra** da/de/do/dos/das; nos quatro casos pedidos o resultado já é o esperado. A regra decidida só muda o resultado se a primeira ou a última palavra for uma partícula (por exemplo "Maria da" ou "de Souza"); o ORLA decide se filtra e cobre com um teste desse caso. Não executei esses quatro casos nesta sessão: a conclusão é por leitura.
5. `hitSlop` do campo (já existe em `text-field.test` "touch area of at least 48").
6. Larguras em 320 e 430: o conteúdo do Login e o botão sem largura fixa (nenhum teste hoje; o Jest só prova que não há `width` numérico no estilo).
7. Estilo declarado que falta: rótulo do campo (Inter Medium 13), campo (raio 8, margem 14, Inter 15), caixa de erro (14 / 19,6, margem 13, gap 10), nome do Perfil, cartão (borda, raio, margem), diálogo (raio 10, margem, scrim, título 22), ícone da tab bar 22.
8. Login: caixa de erro de conexão (L3), sessão expirada (L4), "Mostrar"/"Ocultar" visível com nome acessível "Mostrar senha"/"Ocultar senha".
9. Perfil carregando com texto visível; erro em tela cheia.

## 7. Bloqueado e aberto

**Bloqueado por falta de acesso ao Figma nesta sessão (não executei):**
- criar no FPdB8 as 3 variáveis (`placeholder` = Flint, `borda de campo` = `#8C8780`, `aba selecionada` = `#EE8279`) e religar os frames afetados (L1 a L4, C1, T1, T2, `20:1102`, `20:1340`); sem isso **US-PAR-07 não fecha**;
- ajustar o frame P2 `83:754` (botão cheio + contorno);
- propor o frame **Início** e esperar a aprovação da pessoa;
- atualizar T1 (`83:817`) para o coral `#EE8279` (hoje desenhado em Crail `#B5453D`, 2,24:1);
- reler os textos exatos de L2, L3 e L4 (§4.1).

**Bloqueado por ativo:** o **escudo** 84 × 96. Exportar o nó do escudo do `10:895` exige o Figma e a liberação de uso. **Origem e liberação: sem registro** (a D2 do ADR-014 pede licença). O código não pode inventar um substituto.

**Aberto, mesmo sem Figma (divergência real entre código e frame aprovado; correção do ORLA):** V-L09, V-L13, V-L14 (a conferir), V-L18, V-L19 (a conferir), V-P14, V-P15, V-T06, V-T07, V-T08. **A F41 não fecha com zero divergência real aberta** (US-PAR-08).

## 8. Decisões de 16/11 registradas (lado corrigido)

Numeração D-10 em diante é minha e continua a do PRD (D-01 a D-09). O texto das respostas P-01 a P-16 da pessoa **não está no material que recebi**; registrei só as decisões que o pedido de revisão cita. As demais respostas (por exemplo P-01 do PRD, P-04, P-11) não foram registradas por mim.

| # | Decisão | Lado corrigido |
|---|---|---|
| D-10 | Ícones: **Ionicons mantidos como exceção** (sem `react-native-svg` e sem licença da biblioteca do arquivo) | código mantido; exceção registrada, vale para tab bar e cabeçalho |
| D-11 | "Mostrar senha" **mantido** | código mantido; o texto visível segue L1 (V-L13) |
| D-12 | Versão real **0.1.0** | código (já lê do `app.config.ts`) |
| D-13 | E-mail sob o rótulo **Usuário** no Perfil | código (já feito) |
| D-14 | Iniciais ignoram **da, de, do, dos, das** | código (a conferir, §6 item 4) |
| D-15 | **Funcionário** no estilo do selo ADMIN | código (já feito) |
| D-16 | **Glifo nativo** (teclado, barra de status, caret) é plataforma; **sombra é real** e `elevation` no Android é aceita e registrada | sem correção; Android sem cobertura (§2) |
| D-17 | Cores: placeholder = Flint, borda de campo = `#8C8780`, aba selecionada = `#EE8279` | `tokens.ts` (ORLA) e variáveis do FPdB8 (ESQUADRO, bloqueado) |
| D-18 | B5 e B6 são **decorativas** (WCAG 1.4.11); itens desabilitados da tab bar são **isentos** | sem correção; justificativa na §9 desta planilha e em `F41-contraste.py` |
| D-19 | Sem pares lado a lado, sem aparelho físico; `docs/design/f41-capturas` sai do ramo **se a REGENTE confirmar antes do merge** | **não removi** nada (as capturas "antes" do Figma continuam no ramo) |

## 9. Contraste AA recalculado com os valores finais (US-PAR-15)

Rodado hoje: `python3 -I docs/design/F41-contraste.py` → **saída 0**, todos os pares obrigatórios passam. Fórmula WCAG 2.x. Alvo: texto 4,5:1; ícone e borda de controle 3:1.

| Par | Uso | Razão | Resultado |
|---|---|---|---|
| T3 | placeholder Flint sobre campo branco | 5,36:1 | passa |
| B1 / B1b | borda de campo `#8C8780` contra branco / contra Pampas | 3,56:1 / 3,28:1 | passa |
| T18 / I2 | aba selecionada `#EE8279` sobre petro, rótulo de 11 px / ícone | 4,68:1 | passa |
| T13 | texto "Sair da conta" Crail sobre Pampas | 4,97:1 | passa |
| T17 / I1 | aba inativa Tide sobre petro | 5,76:1 | passa |
| F1 / F2 | anel de foco branco sobre petro (T1) / petro sobre branco | 12,12:1 | passa |
| B5 | borda do botão "Sair da conta" Westar sobre Pampas | 1,23:1 | **decorativa** (WCAG 1.4.11): o texto Crail a 4,97:1 identifica o botão |
| B6 | borda do cartão Westar sobre Pampas | 1,23:1 | **decorativa**: o conteúdo é texto |
| D1 | item desabilitado da tab bar (Tide a 50% sobre petro) | 2,58:1 | **isento** (componente inativo) |

O selecionado `#EE8279` contra o inativo Tide dá só 1,23:1: ele se distingue por matiz, peso SemiBold e anúncio "selecionado" do leitor de tela (WCAG 1.4.1 não exige contraste entre os dois estados). Os demais pares (T1 a T16, I3, I4, B2 a B4) estão na saída do script, todos acima do alvo.

## 10. Saída real da suíte do app (hoje, em `937a3d1`)

```
$ npm --prefix apps/mobile test -- --silent
Test Suites: 33 passed, 33 total
Tests:       186 passed, 186 total
Time:        2.151 s
```

Cobertura: nenhuma medida de pixel, de toque ou de foco em aparelho; só estilo declarado, props e texto.

## 11. Onde a linha de base fica (critério 13)

Esta planilha e `docs/design/F41-planilha-fpdb8.md`, versionadas em git (texto, sem binário), mais os testes de componente e o `tokens.test.ts` da §6. F35, F36, F42 e F43 partem daqui. Vale o protocolo do simulador da §2.

## 12. Verificado × não verificado (ver também a §13)

**Verificado hoje:** leitura do código em `937a3d1`; suíte de 186 testes; `F41-contraste.py` (saída 0); leitura visual das capturas P1, P2, T1, T2 e C1.
**Não verificado hoje:** qualquer nó do Figma (sem acesso); textos de L2, L3, L4; escudo; capturas do app (dispensadas); Android; aparelho físico; foco e leitor de tela em aparelho.

## 13. Proposta de frame "Início" (para a pessoa aprovar; **não construído no Figma**)

Motivo de não estar no Figma: sem acesso nesta sessão (§1). Isto é só a especificação em texto, para eu ou o próximo ESQUADRO montar quando o login do `figma-remote` voltar. Nada abaixo é valor lido do arquivo, exceto onde cita o nó.

- **Estrutura (de cima para baixo):** cabeçalho petro 56 como `20:1079`, com o título "Início" e o botão de usuário 36 × 36 à direita; corpo Pampas com o estado vazio centralizado; tab bar dos 4 itens como T2 `83:844` (a 50%, nenhum selecionado).
- **Estado vazio:** mesmo padrão do `1c` `10:981` (ícone em círculo, título, mensagem), **sem botão**. Medidas do círculo, do ícone e do título: **não lidas**, ler no `10:981`. Textos (já em chave de i18n no código): título "Em breve", mensagem "Os módulos da oficina chegam nas próximas versões." Redação do código, não do Figma.
- **Tokens:** fundo Pampas, título Barlow Condensed SemiBold 21 branco, título do vazio petro, mensagem Flint; nenhum token novo.
- **Estados:** não tem carregando nem erro (a tela não chama API). Vazio é o único estado; carregando, erro e sucesso: "não se aplica", justificativa: a tela é estática.
- **Acessibilidade:** ordem de foco título, botão de usuário (nome "Perfil"), conteúdo, tab bar; o leitor anuncia "Início", "Perfil, botão", "Em breve", a mensagem e cada item como "Ordens, indisponível nesta versão" etc. Contraste: Flint sobre Pampas 4,93:1 (passa).
- **Diferença hoje no código:** o estado vazio usa `StateView empty` com ícone `file-tray-outline` de 48, título 14 SemiBold e mensagem 16. Quando o frame for aprovado, o código se ajusta a ele (D-02).

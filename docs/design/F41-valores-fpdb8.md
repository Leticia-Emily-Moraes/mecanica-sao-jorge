# F41 · Planilha de valores FPdB8 × código (linha de base, sem captura)

Autor: ESQUADRO · Data: 2026-11-16 · Código conferido: ramo `feat/f41-paridade-fpdb8-codigo` em `937a3d1` · Arquivo de referência: `FPdB8RymAnN81pbKfizdzE`, página `20:2132`.
**Atualização de 16/11, sessão com acesso ao Figma (ESQUADRO): a §15 substitui a §1 (acesso), a §7 (bloqueios) e as linhas de estado "aberta/bloqueada" que ela reclassifica.** As seções 1 a 14 ficam como histórico da sessão sem acesso. **A §20 (17/11) é a leitura mais recente** e substitui a §19.7 e a §19.8; as marcas de lacuna da §4 foram reconciliadas nela (§20.7).
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
- **Sem trava**: nenhum teste lê esse valor; a lacuna fica listada na §20.3. (Reconciliado em 17/11: as marcas de lacuna da primeira leitura foram trocadas por evidência de teste ou por lacuna declarada.)
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
| V-L06 | vazio | rótulo "Usuário", Inter Medium 13, Flint, 6 até o campo | `login.campoEmail.rotulo`, `typography.fieldLabel`, `spacing.s6` | `login.test` (texto "Usuário", e "E-mail" ausente); estilo do rótulo (Inter Medium 13): sem trava, lacuna §20.3 | igual (estilo sem trava) |
| V-L07 | vazio | placeholders "Seu usuário" e "Sua senha", cor Flint (aprovado 16/11) | `login.campoEmail.placeholder`, `login.campoSenha.placeholder`, `color.text.placeholder` | `text-field.test` (token); textos "Seu usuário" e "Sua senha" em `login.test` (linhas 84 e 85) | igual; hex Flint travado em `tokens.test` (linha 36) e variável no Figma (§15.1) |
| V-L08 | vazio | campo altura 46, raio 8, borda 1 px, margem interna 14, fundo branco, texto Inter 15 | `size.field`, `radius.sm`, `borderWidth.hairline`, `FIELD_PADDING` | `text-field.test` "46 of height… hitSlop 48" e "1 px at rest" (token); raio 8 e margem interna 14 + 1 de borda em `text-field.test` (linha 191); Inter 15: sem trava, lacuna §20.3 | igual |
| V-L09 | vazio | borda de repouso `#8C8780` (aprovado 16/11) | `color.border.default` = `slate500` `#64748B` | `text-field.test` (token) | **aberta**: trocar para `#8C8780` |
| V-L10 | foco | borda de 2 px Crail `#B5453D` no campo (`10:895`, leitura do ESQUADRO) | `color.border.focusField`, `borderWidth.field` | `text-field.test` "2 px Crail border while focused" | igual |
| V-L11 | vazio, preenchido | botão Entrar 50, raio 8, Crail, Inter SemiBold 15 branco, 304 de largura (`20:1073`) | `size.button`, `radius.sm`, `typography.button` | `button.test` "50 of height with radius 8" e "primary Crail with white text" (token); sem `width` fixo em 320 e 430 em `login.test` (linhas 278 a 286); fonte Inter SemiBold 15 e os 304: sem trava, lacuna §20.3 | igual |
| V-L12 | vazio | ritmo: 16 entre grupos, rótulo→campo 6, bloco do logo com 10 entre itens e 14 abaixo | `spacing.md`, `spacing.s6`, `brand-header.tsx` | sem trava, lacuna §20.3 | igual (sem trava) |
| V-L13 | preenchido (L1 `82:1990`) | ação na senha com texto visível "**Mostrar**" | visível "Mostrar senha" (`login.campoSenha.mostrar`) | `login.test` "toggle password visibility" | **aberta** (texto): visível "Mostrar"/"Ocultar", nome acessível "Mostrar senha"/"Ocultar senha" (WCAG 2.5.3); duas chaves novas |
| V-L14 | carregando (L2 `82:2024`) | "Entrando…" com indicador, campos preenchidos | `login.botaoEntrar.carregando` = "Entrando..." e `ActivityIndicator`; botão a opacidade 0,5 (`opacity.disabled`) | `button.test` "loading label, busy" | **aberta a conferir**: frame não lido hoje; sugestão da planilha é não esmaecer o botão. Texto com reticências: "…" do frame × "..." do código **não lido** |
| V-L15 | erro de credencial (`10:936`) | caixa Pot Pourri `#F6E7E5`, borda Rose Fog `#E2B5B0` 1 px, raio 8, margem 13, ícone 18, texto El Salva `#923631` Inter 14 / 19,6, entre senha e botão | `InlineAlert`, `AlertIcon` | `inline-alert.test` (cores por token; sem altura fixa), `alert-icon.test` (círculo, 18, El Salva), `login.test` (posição entre senha e botão); 14/19,6, margem 13 e gap 10 em `inline-alert.test` (linhas 48 a 61); raio 8: sem trava, lacuna §20.3 | igual |
| V-L16 | erro de credencial | texto "Usuário ou senha incorretos. Confira os dados e tente novamente." | `login.erroCredencial.mensagem` | `login.test` (texto) | igual |
| V-L17 | erro de credencial | os **dois** campos com borda de 2 px Crail | `invalid` nos dois `TextField` | `login.test` "mark both fields with a 2 px error border" (token) | igual |
| V-L18 | erro de conexão (L3 `82:2058`) | **caixa de erro** entre a senha e o botão, no estilo de `10:967`; redação proposta "Sem conexão. Verifique a internet da oficina e tente de novo." | popup `ErrorRetryModal` com "Não foi possível conectar." | `login.test` "network error modal" trava o **popup** | **aberta** (estrutura, texto): trocar o popup pela caixa. Texto exato do frame L3 **não lido hoje**, ler em `82:2058` |
| V-L19 | sessão expirada (L4 `82:2098`) | aviso no topo do formulário, caixa do erro | `InlineAlert` "Sua sessão expirou. Faça login novamente." acima do e-mail | `login.test` (linhas 40 e 227: texto e posição acima do campo Usuário) e `use-login.test` (linha 182) | **fechada**: texto e posição idênticos ao frame (§15.2, §17.2) |
| V-L20 | validação de campo | "Informe seu usuário" / "Informe sua senha" abaixo do campo | `login.campoEmail.erroVazio`, `login.campoSenha.erroVazio` | `login.test` (texto) | **sem frame**: o texto é do código (não há frame de validação no FPdB8); registrado como "não se aplica ao frame", mantido |

### 4.2 Perfil (`10:3842`; P1 `83:712`, P2 `83:754` aprovados)

| ID | Estado | Valor no FPdB8 (nó) | Código | Trava | Estado |
|---|---|---|---|---|---|
| V-P01 | preenchido | cabeçalho petro altura 56; título "Perfil" Barlow Condensed SemiBold 21, espaçamento 0,21, branco (`20:2083`) | `ScreenHeader`, `typography.appBarTitle` | `screen-header.test` (petro, branco, 56); família, 21 e 0,21: sem trava, lacuna §20.3 | igual |
| V-P02 | preenchido | seta de voltar em botão 36 × 36, raio 8, branco 12%, ícone 18 (`20:2083`) | `HeaderIconButton`, `size.iconButton`, `iconSize.appBar` | `header-icon-button.test` (36, raio, translúcido, hitSlop 48) | igual; ícone é Ionicons (D-10) |
| V-P03 | preenchido | avatar círculo 84 Spectra `#33575D`, iniciais Barlow SemiBold 32 branco | `Avatar`, `size.avatar`, `color.surface.avatar` | `avatar.test` (84, raio 42, Spectra, branco) | igual |
| V-P04 | preenchido | nome "João da Silva", Barlow SemiBold 24 petro, centralizado | `perfil.tsx` `styles.name` | `perfil.test` (texto); estilo em `perfil.test` (linhas 73 a 81) | igual |
| V-P05 | preenchido | selo pill `999` petro, "ADMIN" Inter SemiBold 12 branco, sob o nome | `AccessProfileBadge` | `access-profile-badge.test` "petro pill with white text" | igual |
| V-P06 | preenchido | cartão branco, borda 1 px Westar `#E2DEDA`, raio 8, margem 15, sombra `0 1 1 rgba(30,58,63,.06)` | `InfoCard`, `shadow.card` | `info-card.test` (linhas 42 a 56) trava borda 1 px, raio 8, margem 15 e sombra | igual |
| V-P07 | preenchido | 3 linhas: rótulo Flint 14, valor petro Inter Medium 14 à direita: "Usuário", "Perfil de acesso", "Versão do app" | `perfil.rotuloUsuario`, `rotuloPerfil`, `rotuloVersao`; `typography.rowLabel/rowValue` | `info-card.test` (rótulo+valor), `perfil.test` (e-mail sob "Usuário"; versão) | igual |
| V-P08 | preenchido | valor de "Usuário" no frame: "joao.silva"; decisão 16/11: **e-mail sob o rótulo Usuário** | `usuario.email` | `perfil.test` "e-mail under the Usuário label" | igual (dado ≠, decidido) |
| V-P09 | preenchido | "Versão do app" = "1.0.0" no frame; decisão 16/11: **versão real 0.1.0** | `getAppVersion()` de `app.config.ts` | `app-version.test`, `perfil.test` "reads the version from the Expo config" | igual (dado ≠, decidido) |
| V-P10 | preenchido | "Administrador" (cartão) e "ADMIN" (selo); **Funcionário no estilo do selo ADMIN** (decisão 16/11) | `describeAccessProfile` | `access-profile.test`, `access-profile-badge.test`, `perfil.test` "FUNCIONARIO" | igual |
| V-P11 | preenchido | "Sair da conta": contorno Westar 1 px, sem fundo, texto Crail Inter SemiBold 15, altura 50, raio 8, no rodapé | `Button variant="outlineAccent"`, `styles.footer` | `button.test` "outlineAccent… Westar outline and Crail text" (token); rodapé: sem trava, lacuna §20.3 | igual |
| V-P12 | preenchido | **sem** tab bar | Perfil fora de `(menu)` | `perfil.test` "without a tab bar" | igual |
| V-P13 | preenchido | fundo Pampas, margem 16, 12 entre blocos, 20 acima do avatar e 8 abaixo | `ScreenContainer`, `styles.identity` (36 acima, 20 entre selo e cartão, medido em 10:3842) | `screen-container.test`; ritmo: sem trava, lacuna §20.3 | igual (sem trava) |
| V-P14 | carregando (P1 `83:712`) | fundo Pampas, indicador petro e texto **visível** "Carregando sessão…" abaixo | `StateView loading`: só o indicador; o texto existe só como nome acessível | `state-view.test` (progressbar, busy, anúncio) | **aberta** (estrutura, texto): mostrar o texto visível em Flint |
| V-P15 | erro (P2 `83:754`) | **tela cheia** sem cabeçalho e sem tab bar: ícone de sem conexão em círculo, título "Não foi possível carregar" (Barlow, petro), mensagem "Verifique a internet da oficina e tente de novo. Se continuar, entre novamente.", **botão cheio Crail "Tentar novamente" e botão de contorno "Entrar novamente"** (ajuste de 16/11) | popup `ErrorRetryModal` com ⚠ sobre o conteúdo; "Tentar novamente" cheio e "Entrar novamente" contorno petro; mensagem "Verifique sua conexão e tente novamente." | `state-view.test` (popup), `index.test` "retry modal" | **aberta** (estrutura, ícone, texto). O frame `83:754` ainda desenha os **dois** botões em contorno: ajustar o frame (bloqueado, §7) e o código |

### 4.3 Diálogo de logout (`10:3886`)

| ID | Valor no FPdB8 | Código | Trava | Estado |
|---|---|---|---|---|
| V-D01 | título "Sair da conta?", Barlow Condensed Bold 22 petro, à esquerda | `perfil.dialogoLogout.titulo`, `typography.dialogTitle` | `perfil.test` (texto); fonte em `tokens.test` (linha 130) | igual |
| V-D02 | mensagem "Você vai precisar do usuário e senha para entrar de novo." Inter 14 / 21 Flint | `perfil.dialogoLogout.mensagem`, `typography.dialogMessage` | `perfil.test` (texto), `confirm-dialog.test` (presença); 14/21 em `tokens.test` (linha 134) | igual |
| V-D03 | botões lado a lado: Cancelar (contorno petro) e Sair (Crail), 50, raio 8, 10 entre eles | `ConfirmDialog`, `spacing.s10` | `confirm-dialog.test` "Cancelar before Sair, side by side"; `button.test` (variantes) | igual |
| V-D04 | cartão branco, raio 10, margem 20, 14 entre blocos, 22 do lado da tela | `radius.dialog`, `spacing.s20`, `spacing.s14`, `spacing.s22` | `confirm-dialog.test` (linhas 73 a 86: raio 10, margem 20, 14 entre blocos; o lado de 22 não foi conferido no teste) | igual |
| V-D05 | sombra `0 12 16 rgba(0,0,0,.25)` | `shadow.dialog` (iOS exato; Android `elevation` 8) | `confirm-dialog.test` (linhas 83 a 86: `0 12 16` a 25%, iOS) | igual no iOS; Android aproximado (D-16) |
| V-D06 | scrim petro a 55% `rgba(30,58,63,.55)` | `color.surface.overlay` | `confirm-dialog.test` (linhas 94 a 96 travam o estilo do fundo; o literal do scrim não foi conferido na leitura) | igual |
| V-D07 | rótulos "Cancelar" e "Sair" | `perfil.dialogoLogout.botaoCancelar`, `botaoConfirmar` | `perfil.test` (Cancelar mantém a sessão; Sair limpa o token) | igual |

### 4.4 Tab bar (`20:1102` Ordens, `20:1340` Clientes; T1 `83:817`, T2 `83:844` aprovados)

| ID | Estado | Valor no FPdB8 (nó) | Código | Trava | Estado |
|---|---|---|---|---|---|
| V-T01 | padrão | 4 itens na ordem Ordens, Clientes, Catálogo, Financeiro, sem Perfil | `ENTRIES` em `menu-tab-bar.tsx` | `menu-tab-bar.test` "four Figma items… no Perfil" e "Figma order" | igual |
| V-T02 | padrão | rótulos "Ordens", "Clientes", "Catálogo", "Financeiro" | `menu.tabbar.*.rotulo` | `menu-tab-bar.test` "short Figma labels" | igual |
| V-T03 | padrão | barra 62, células 90 × 62, ícone 22, rótulo 11, 4 entre ícone e rótulo (`20:1102`) | `size.tabBar`, `iconSize.tab`, `spacing.xs` | `menu-tab-bar.test` "explicit height of 62"; ícone 22 em `tokens.test` (linha 88; trava o token, não o uso) e gap 4 em `tab-bar-item.test` (linha 191) | igual |
| V-T04 | padrão | fundo petro, sem borda | `color.surface.brand` | sem trava, lacuna §20.3 | igual |
| V-T05 | inativo | ícone e rótulo Tide `#B7B2AC`, rótulo Inter Medium 11 | `color.text.onBrandMuted`, `typography.tabLabel` | `tab-bar-item.test` "11 label in Medium… Tide" (token) | igual |
| V-T06 | selecionado | ícone e rótulo **`#EE8279`** (aprovado 16/11), Inter SemiBold 11, sem pílula, anúncio "selecionado" | `color.text.tabSelected` = **branco `#FFFFFF`** (PROVISÓRIO) | `tab-bar-item.test` "selected label in SemiBold", "no pill", `accessibilityState.selected` (token) | **aberta**: trocar para `#EE8279`. Nenhum item é selecionável no app; só o teste do componente isolado prova |
| V-T07 | desabilitado (T2 `83:844`) | 4 itens a **50%** de opacidade, nenhum selecionado, anunciados como indisponíveis | `opacity.unavailable` = 0,5 | `menu-tab-bar.test` "every item disabled… none selected"; opacidade 0,5 em `tokens.test` (linha 96) e `tab-bar-item.test` (linha 205) | **fechada** no código (§14) e lida no frame T2 (§19.4) |
| V-T08 | foco (T1 `83:817`) | anel **branco** de 2 px com respiro de 2 px no item (legenda: 12,12:1 sobre petro) | `useFocusRing`: borda **petro** + halo branco | `tab-bar-item.test` "focus ring only while focused" (existência, não a cor) | **aberta**: sobre a barra petro o anel petro some; usar anel branco (token `focus.ringOnBrand`, hoje inexistente) |
| V-T09 | todos | ícones de linha do arquivo (documento, pessoas, caixa, cartão) | Ionicons `document-text-outline`, `people-outline`, `cube-outline`, `card-outline` | sem trava dos nomes dos ícones; lacuna §20.3 | **exceção registrada** (D-10): Ionicons mantidos; desenho difere do arquivo |
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

## 14. Rodada do ORLA em 16/11 (código corrigido; Figma não tocado)

Autor: ORLA. Ramo `feat/f41-paridade-fpdb8-codigo`. **O Figma continua inacessível:** `mcp__claude_ai_Figma__whoami` voltou "Claude requested permissions to use mcp__claude_ai_Figma__whoami, but you haven't granted it yet" e o `figma-remote` pede login. Nenhum valor abaixo foi relido no arquivo; todos vêm da planilha do ESQUADRO.

| ID | Resultado no código | Trava |
|---|---|---|
| V-T06 | `color.text.tabSelected` = `#EE8279`, comentário PROVISÓRIO removido | `tokens.test`, `tab-bar-item.test` |
| V-L09 | `color.border.default` = `#8C8780` (primitivo `slate500` removido por falta de uso) | `tokens.test`, `text-field.test` |
| V-L07 | placeholder = Flint, comentário PROVISÓRIO removido | `tokens.test`, `text-field.test` |
| V-T07 | `opacity.unavailable` = 0,5 | `tokens.test`, `tab-bar-item.test` |
| V-T08 | anel de foco branco de 2 px com respiro de 2 px (`color.focus.ringOnBrand`, `useFocusRing({ onBrand })`) | `tab-bar-item.test` (branco sim, petro não) |
| V-L13 | texto visível "Mostrar"/"Ocultar", nome acessível "Mostrar senha"/"Ocultar senha" (chaves `login.campoSenha.mostrarTexto` e `ocultarTexto`) | `login.test`, `inline-action-button.test` |
| V-L18 | caixa de erro (`InlineAlert`) entre a senha e o botão, sem popup; texto "Sem conexão. Verifique a internet da oficina e tente de novo." | `login.test` (posição, sem `Modal`, campos sem borda de erro, repetir pelo "Entrar") |
| V-P14 | texto visível "Carregando sessão…" em Flint sob o indicador petro | `state-view.test`, `index.test` |
| V-P15 | erro de tela cheia: ícone `cloud-offline-outline` em círculo, título sem ponto, mensagem da planilha, botão cheio "Tentar novamente" e contorno "Entrar novamente"; `ErrorRetryModal` removido | `state-view.test`, `index.test` |
| D-14 | iniciais ignoram da/de/do/dos/das (se só houver partículas, elas contam) | `get-initials.test` |
| V-L19 | **só testado**: aviso de sessão expirada como alerta acima do formulário; texto do frame **não lido** | `login.test` |

**Valores do ORLA que não vêm do Figma (o ESQUADRO confere em `83:754` e `10:981`):** círculo de 84 e ícone de 48 do P2 (reaproveitam `size.avatar` e `iconSize.empty`), cores do círculo (Pot Pourri) e do ícone (El Salva), título em `typography.title` (24), mensagem em 16, texto do P1 em Inter 14 Flint, as reticências "…" do P1/P2.

**Continua aberto:** V-L14 (L2): o código mantém "Entrando..." e o botão a 50% de opacidade, porque o frame L2 não foi relido e o texto com "…" é só a transcrição da planilha. As 3 variáveis do FPdB8, o frame P2 `83:754` com botão cheio, T1 em coral, o escudo e o frame Início seguem com o ESQUADRO e a pessoa. **US-PAR-07 e US-PAR-08 não fecham sem isso.**

**Testes novos (§6):** `tokens.test.ts` com os literais; tab bar (50%, anel branco, `#EE8279`, SemiBold, ícone 22, gap 4); P2 com botão cheio e contorno; iniciais (João da Silva = JS, Maria de Souza Lima = ML, Ana = A, vazio); `hitSlop` do campo já existia; larguras 320 e 430 sem `width` fixo no Login (`find-fixed-widths`); estilo do rótulo e do campo, da caixa de erro, do cartão, do diálogo e do nome do Perfil; Login L3 e L4. O Jest **não mede layout nem toque**.

**Capturas do app em simulador (iPhone 17, iOS 27.0, Expo Go, 16/11):** feitas só como conferência do ORLA, fora do git (scratchpad), por rota temporária apagada em seguida. 11 arquivos, 11 md5 distintos. Vi p1, p2, login-vazio, login-erro-rede, perfil, inicio e dialogo-isolado; não abri login-preenchido, login-carregando nem login-erro-credencial. O diálogo em cima da tela de Perfil não apareceu (modal não apresentado), por isso o diálogo foi fotografado isolado. Prova só aparência: login e fluxo contra a API real não foram executados pelo ORLA.

## 15. Sessão com acesso ao Figma (ESQUADRO, 16/11): releitura, variáveis e o que sobra para o ORLA

Autor: ESQUADRO · Sessão Figma `dabe8d86-f507-4d5c-8b04-08048d17d893` · Código lido no ramo `feat/f41-paridade-fpdb8-codigo` em `99dbe7e` · Arquivo `FPdB8RymAnN81pbKfizdzE`.

**Acesso (US-PAR-11):** `whoami` passou nesta sessão (saída real colada em `docs/design/figma.md`, seção "Sessão de 16/11 com acesso ao Figma"). A §1 e a §7 desta planilha descrevem a sessão anterior, sem acesso. Tudo abaixo foi lido no arquivo hoje, nó por nó; o lado do código foi lido nos arquivos citados, **sem rodar a suíte** (não alterei código).

### 15.1 Lado Figma feito (US-PAR-07)

| Token | Código (`tokens.ts`) | Figma (variável, lida por `get_variable_defs`) | Nós ligados | Resultado |
|---|---|---|---|---|
| `color.text.placeholder` | `flint` `#6E6A66` | `color/text/placeholder` `89:716` = `#6e6a66` | `10:926`, `10:933`, `82:2117`, `82:2122` | **valores idênticos nos dois lados** |
| `color.border.default` | `stone` `#8C8780` | `color/border/default` `89:717` = `#8c8780` | `10:932`, `82:2008`, `82:2013`, `82:2042`, `82:2047`, `82:2076`, `82:2081`, `82:2116`, `82:2121` | **idênticos** |
| `color.text.tabSelected` | `coral` `#EE8279` | `color/text/tabSelected` `89:718` = `#ee8279` | rótulo e ícone em `20:1102` e `20:1340` (T1 herda) | **idênticos** |

Os três primitivos (`primitive/flint`, `stone`, `coral`) têm o mesmo hex de `primitiveColor` em `tokens.ts`. A coleção só tem essas 6 variáveis; as demais linhas da tabela do ADR-014 **não foram criadas** (ver §15.5).

### 15.2 Linhas que mudam de estado

| ID | Era | Agora | Evidência |
|---|---|---|---|
| V-L07 (placeholder) | igual, hex "depende do §6" | **fechada** nos dois lados | 15.1 |
| V-L09 (borda de campo) | aberta | **fechada** nos dois lados (o `tokens.ts` já estava em `#8C8780`) | 15.1 |
| V-T06 (aba selecionada) | aberta | **fechada** nos dois lados; T1 `83:817` lido com 5 elementos em `#EE8279` e nenhum em Crail | 15.1 |
| V-L18 (L3, erro de conexão) | aberta a conferir o texto | **fechada** no texto: frame **"Sem conexão. Verifique a internet da oficina e tente de novo."** = `login.erroRede.mensagem` (`strings.ts:30`, texto idêntico); caixa Pot Pourri/Rose Fog/El Salva, 13 de margem, 10 de espaço, ícone 18, Inter 14 / 19,6, entre a senha e o botão | `82:2092`, `82:2095`; ORLA já trocou o popup pela caixa (§14) |
| V-L19 (L4, sessão expirada) | aberta a conferir | **fechada** no texto e na posição: **"Sua sessão expirou. Faça login novamente."**, mesma caixa, acima do campo Usuário; código `login.sessaoExpirada.mensagem` (`strings.ts:31`) com texto idêntico; "Carregando sessão…" do P1 = `sessao.inicializando.rotulo` (`strings.ts:56`), idêntico, com `…` | `82:2131`, `82:2134`, `83:753` |
| V-P15 (P2, botões) | aberta | **lado Figma fechado**: "Tentar novamente" cheio (Crail, texto branco) e "Entrar novamente" em contorno petro; 328 × 50, raio 8 | `83:770`, `83:815`; captura conferida |
| V-L14 (L2, carregando) | aberta a conferir | **aberta, real, com a leitura que faltava** (15.3) | `82:2049`, `82:2137` |
| iconSize.empty, typography.title (P2), typography.body (P2), typography.rowLabel (P1), opacity.disabled, focusRingRadius, typography.caption | "a conferir" no ADR-014 | **lidas** (15.3 e 15.4) | abaixo |

### 15.3 Divergências reais abertas, com o valor lido no Figma e o do código (para o ORLA)

Todas são **reais** (o Figma manda, D-02); nenhuma é de plataforma. Nenhuma foi corrigida por mim: não alterei código.

| # | Tela, estado | Figma (nó) | Código hoje (arquivo) | O que fazer |
|---|---|---|---|---|
| R-1 | Login carregando (L2) | texto **"Entrando…"** (um caractere `…`, U+2026) em `82:2049` | `login.botaoEntrar.carregando` = `Entrando...` (três pontos) em `strings.ts:26` | trocar a chave por `Entrando…` e ajustar o teste que procura o texto |
| R-2 | Login carregando (L2) | botão Crail a **100%** de opacidade; indicador branco 16 × 16, arco de 270°, à esquerda do texto (`82:2137`) | `Button` com `loading` entra em `isDisabled` e aplica `opacity.disabled` **0,5** (`button.tsx:69`, `:120`) | no estado carregando não esmaecer; manter `opacity.disabled` só para o botão desabilitado de verdade (sem frame). Indicador branco sobre Crail: 5,41:1 (par I7) |
| R-3 | Login, ação "Mostrar" na senha (L1, L2, L3) | Inter **Medium 13**, Flint (`82:2023`, `82:2057`) | `InlineActionButton` usa `typography.caption` (Inter Regular 12) (`inline-action-button.tsx:72`) | usar o estilo do rótulo de campo (`typography.fieldLabel`: Inter Medium 13), que já tem o mesmo desenho. `typography.caption` segue valendo só para a validação de campo (sem frame) |
| R-4 | Perfil erro (P2), círculo | **72**, preenchimento `#EDE9E4` (`color/grey/91`) (`83:763`) | `size.avatar` = 84, fundo `color.surface.errorTint` (Pot Pourri) (`error-state.tsx:21`, `:78`) | círculo de 72 e `#EDE9E4`: **token novo** nos dois lados (sugestão de nome: `size.stateIcon` = 72, `color.surface.neutral` = `#EDE9E4`) |
| R-5 | Perfil erro (P2), ícone | **32**, Spectra (`83:764`) | `iconSize.empty` = 48 (`error-state.tsx:46`) | 32. O token `iconSize.alert` já vale 32 e **não tem consumidor** (achado 14 do ADR): pode ser reaproveitado. `iconSize.empty` passa a ser 32 ou sai de uso, conforme o ORLA decidir (o Início proposto também usa 32) |
| R-6 | Perfil erro (P2), título | Barlow Condensed SemiBold **20**, petro (`83:767`) | `typography.title` (Barlow Condensed SemiBold 24) (`error-state.tsx:84`) | estilo novo de 20 (sugestão: `typography.stateTitle`); `typography.title` 24 continua para o nome do Perfil |
| R-7 | Perfil erro (P2), mensagem | Inter Regular **14 / 21**, Flint, centralizada, 289 de largura (`83:769`) | `typography.body` (Inter Regular 16) (`error-state.tsx:91`) | 14 / 21 é o mesmo desenho de `typography.dialogMessage`: reaproveitar, sem estilo novo |
| R-8 | Tab bar, foco (T1) | anel `84:786`: **86 × 58, raio 10**, traço **branco** de 2 px **por dentro**, a 2 px da borda da célula de 90 × 62 | `focusRingRadius` = `radius.sm + 2 + 2` = **12** (`tokens.ts:178`); o anel do botão é desenhado **por fora** do controle (`button.tsx:92-95`) | medir o anel do item da tab bar no app e deixar a caixa externa em 86 × 58 com raio 10. Não consegui medir o app; a diferença de raio (10 × 12) vem da leitura dos dois arquivos |
| R-9 | Perfil carregando (P1) | indicador **36**, petro, traço 3; texto "Carregando sessão…" (`…`) Inter Regular 14, Flint, **12** abaixo do indicador | `StateView loading` usa `typography.rowLabel` (Inter Regular 14) (`state-view.tsx:94`) | estilo igual. Conferir o espaço de 12 e o `…`; o tamanho do indicador é desenhado pelo sistema (D-16, plataforma) e fica de fora |

**Os valores que a tabela do ADR-014 chamava "a conferir" ficaram assim:** `iconSize.empty` (P2) = 32 (R-5); `typography.title` no P2 = 20 (R-6); `typography.body` no P2 = 14 / 21 (R-7); `typography.rowLabel` no P1 = 14 Regular (**igual**); `opacity.disabled` no L2 = 100% (R-2); `focusRingRadius` = 10 no T1 (R-8); `typography.caption` na ação "Mostrar" = Inter Medium 13 (R-3).

### 15.4 Frame proposto novo: Início (I1 `89:971`)

Criado hoje na seção `82:1989`. Textos, ícone de documento de 32 e posições são **proposta minha**, não valor do Figma de referência. **Aguarda aprovação da pessoa** (D-20: fora do aceite da F41; sem aprovação nenhuma linha de Início conta como paridade). Quatro estados: vazio é o único que existe; carregando, erro e sucesso são "não se aplica" (a tela é estática, não chama API).

Contraste (script `docs/design/F41-contraste.py`, saída 0, rodado hoje): título petro sobre Pampas 11,14:1; mensagem Flint sobre Pampas 4,93:1; título do cabeçalho branco sobre petro 12,12:1; ícone Spectra sobre `#EDE9E4` 6,53:1 (par I5); itens da tab bar a 50%: isentos (D1).
Acessibilidade do I1: ordem de foco cabeçalho (título, botão de usuário com nome "Perfil"), conteúdo, tab bar; o leitor deve anunciar "Início", "Perfil, botão", "Em breve", a mensagem e cada aba como indisponível.

### 15.5 Não feito, e por quê

- **Escudo** 84 × 96: não exportado. Origem e liberação de uso seguem sem registro; D-21 o deixa fora do aceite. Nada inventado.
- **Coleção completa do ADR-014** (cores restantes, medidas, raios, espaçamentos, estilos e efeitos): só criei as 3 variáveis que a pessoa aprovou. US-PAR-07 está **fechada para esses três tokens**; **não** está fechada para o restante da tabela do ADR, que continua com "Figma: criar e ligar". Quem decide se isso entra na F41 é a pessoa/BUSSOLA.
- **R-4, R-5, R-6 criam token novo ou alteram token** (`color.surface.neutral`, tamanho 72, `typography.stateTitle`, `iconSize.empty`): quando o ORLA os criar, **as variáveis ou estilos do Figma entram na mesma entrega** (US-PAR-07). Combinar com ESQUADRO.
- Capturas em arquivo: o shell bloqueou o download dos PNGs; conferi por `get_screenshot` em linha (P2, T1, L4 e I1) e **não gravei imagem** no repositório.
- Suíte do app **não rodada** nesta sessão (não alterei código). O último resultado registrado é o da §10 (186 testes em `937a3d1`) e o do ORLA na §14; não confirmei nenhum dos dois hoje.

### 15.6 Quadro de fechamento (US-PAR-08), sem pares lado a lado (D-19)

| Condição de fechamento | Estado |
|---|---|
| 3 variáveis no Figma com o mesmo valor do código | **feito** (15.1) |
| P2 `83:754` com botão cheio e contorno | **feito** |
| T1 `83:817` em `#EE8279` | **feito** |
| Releitura de L2, L3 e L4 com o valor em cada linha | **feita**; L3 e L4 batem com o código, **L2 não** (R-1, R-2) |
| Frame Início aprovado | **proposto, sem aprovação**; fora do aceite (D-20) |
| Escudo exportado | **não feito**; fora do aceite (D-21) |
| Zero divergência real aberta | **não**: R-1 a R-9 abertas, todas do lado do código (ORLA) |

A F41 **não fecha** enquanto R-1 a R-9 estiverem abertas.

## 16. Correções de código R-1 a R-9 (ORLA, 16/11)

Autor: ORLA · ramo `feat/f41-paridade-fpdb8-codigo` · partida em `875898d`. **Nenhum valor foi lido no Figma por mim:** o `whoami` desta sessão voltou `Claude requested permissions to use mcp__figma-remote__whoami, but you haven't granted it yet.` Os números abaixo são os da §15.3, lidos pelo ESQUADRO. O que o Jest trava é o valor de estilo, não o layout medido no aparelho.

| # | Estado | Commit | O que mudou no código | Teste que trava |
|---|---|---|---|---|
| R-1 | **corrigida no código** | `5597caa` | `login.botaoEntrar.carregando` = `Entrando…` (U+2026) | `strings.test.ts` |
| R-2 | **corrigida no código** | `5ab9b7b` | `Button` só esmaece com `disabled`; `loading` bloqueia o toque e fica a 100% | `button.test.tsx` (3 testes novos) |
| R-3 | **corrigida no código** | `2357422` | `InlineActionButton` usa `typography.fieldLabel` (Inter Medium 13, Flint) | `inline-action-button.test.tsx` |
| R-4 | **corrigida no código; token novo sem variável no Figma** | `855606c` | círculo `size.stateIcon` = 72, fundo `color.surface.neutral` = `#EDE9E4` | `error-state.test.tsx`, `tokens.test.ts` |
| R-5 | **corrigida no código; token novo sem variável no Figma** | `855606c` | ícone `iconSize.alert` = 32, cor `color.icon.state` = Spectra `#33575D` | `error-state.test.tsx`, `tokens.test.ts` |
| R-6 | **corrigida no código; estilo novo sem estilo no Figma** | `855606c` | `typography.stateTitle` = Barlow Condensed SemiBold 20 | `error-state.test.tsx`, `tokens.test.ts` |
| R-7 | **corrigida no código** | `855606c` | mensagem em `typography.dialogMessage` (Inter 14 / 21) | `error-state.test.tsx` |
| R-8 | **corrigida no código; token novo sem variável no Figma** | `f364285` | célula com 2 de folga e anel dentro dela, raio `radius.tabFocus` = 10 | `tab-bar-item.test.tsx` |
| R-9 | **corrigida no código** | `0182046` | espaço de 12 (`spacing.s12`) entre indicador e texto | `state-view.test.tsx` |

**Achados meus, não listados na §15.3 (ESQUADRO confere):**
- **R-5b, cor do ícone do P2:** o código usava El Salva (`errorOnBanner`); a §15.3 diz Spectra para o nó `83:764`. Troquei para Spectra (`color.icon.state`). Contraste do par: 6,53:1 (I5, `F41-contraste.py`).
- **R-10, largura dos botões do P2:** a §15.2 lê 328 × 50 e o código limitava a coluna a 320 (`layout.dialogMaxWidth`), 8 a menos num aparelho de 360. Criei `layout.stateActionsMaxWidth` = 328. Só leitura dos dois arquivos, sem medida no app.

**Tokens que o ESQUADRO precisa espelhar no Figma na mesma entrega (US-PAR-07), com o valor idêntico:**

| Token no código | Valor | Variável ou estilo no Figma a criar |
|---|---|---|
| `color.surface.neutral` | `#EDE9E4` | ligar à variável `color/grey/91` que o `83:763` já usa |
| `color.icon.state` | `#33575D` | ligar ao Spectra do `83:764` |
| `size.stateIcon` | 72 | medida do `83:763` |
| `typography.stateTitle` | Barlow Condensed SemiBold 20 | estilo do `83:767` |
| `radius.tabFocus` | 10 | raio do `84:786` |
| `layout.stateActionsMaxWidth` | 328 | largura dos `83:770` e `83:815` |

**Decisão sobre `iconSize.empty` (R-5):** continua 48. Ele só serve o estado vazio do `StateView`, que o Início usa, e o Início não tem frame aprovado (D-20). Mudar para 32 alteraria uma tela sem referência. O P2 passou a usar `iconSize.alert` (32).

**Não corrigido, por falta de medida:** a mensagem do P2 tem 289 de largura no frame (`83:769`) e o código não limita a largura do texto; o desenho do indicador (36) é do sistema (D-16). V-L19 já estava fechada pela §15.2 (texto e posição idênticos); V-L14 fecha no código com R-1 e R-2, mas só fecha de verdade depois da captura no aparelho.

**Quadro:** R-1 a R-9 estão corrigidas **no código**. A F41 continua **não fechada**: as 6 linhas da tabela acima não têm variável no Figma, não há captura no aparelho e a F41 depende da aprovação da pessoa sobre o Início (fora do aceite).

## 17. Segunda sessão com acesso ao Figma (ESQUADRO, 16/11): variáveis dos 6 tokens, releitura por valor, Início I1 e capturas

Autor: ESQUADRO · Sessão `f942924b-db78-4ddd-9c88-84d37812bdd6` · Arquivo `FPdB8RymAnN81pbKfizdzE` · Código lido em `fef803e` (`tokens.ts`, `state-view.tsx`, `button.tsx`); **não alterei código e não rodei a suíte do app** nesta sessão. **Esta seção substitui o quadro da §16 e a §15.5 no que diz respeito às variáveis.** Li o arquivo hoje, nó por nó; a CRIVO pode conferir pelos ids.

**Acesso (US-PAR-11), saída real do `whoami` (e-mail omitido de propósito):**
`{"whoami":{"user_id":"1126488233271433922","handle":"Leticia Moraes","plans":[{"name":"Time Pessoal","seat":"Full","tier":"student","key":"team::1274094162661077353","role":"admin","specs_enabled":true,"code_layers_enabled":true}]}}`
`create_session` → `f942924b-db78-4ddd-9c88-84d37812bdd6`. Nenhum erro de permissão em `use_figma`, `get_variable_defs` e `get_screenshot`.
**Método:** a instrução `figma-use` não pôde ser carregada (nem `get_figma_skill` nem leitura de recurso `skill://` existem nesta sessão). Cada escrita foi um passo pequeno, com leitura antes e depois.

### 17.1 Variáveis criadas e ligadas (US-PAR-07): os 6 tokens do ORLA + o do Início

Coleção `OP-002 Identidade v2` (`VariableCollectionId:89:712`), de 6 para **14 variáveis**. Valor do Figma lido de volta por `get_variable_defs`; valor do código lido em `tokens.ts` (`fef803e`).

| Token no código | Variável / estilo no Figma | Id | Valor no Figma | Valor no código | Resultado |
|---|---|---|---|---|---|
| `color.surface.neutral` | `color/surface/neutral` → `primitive/grey91` | `92:763` → `92:761` | `#EDE9E4` | `primitiveColor.grey91` `#EDE9E4` | **idêntico** |
| `color.icon.state` | `color/icon/state` → `primitive/spectra` | `92:764` → `92:762` | `#33575D` | `primitiveColor.spectra` `#33575D` | **idêntico** |
| `size.stateIcon` | `size/stateIcon` | `92:765` | 72 | 72 | **idêntico** |
| `typography.stateTitle` | estilo de texto `OP-002/stateTitle` | `S:31e4908e…` | Barlow Condensed SemiBold 20, altura de linha automática, espaçamento 0 | `displaySemiBold`, 20 | **idêntico** |
| `radius.tabFocus` | `radius/tabFocus` | `92:767` | 10 | 10 | **idêntico** |
| `layout.stateActionsMaxWidth` | `layout/stateActionsMaxWidth` | `92:768` | 328 | 328 | **idêntico** |
| `iconSize.alert` (exigido pelo Início I1 e já usado pelo P2) | `iconSize/alert` | `92:766` | 32 | 32 | **idêntico** |

Os dois primitivos novos (`primitive/grey91`, `primitive/spectra`) têm o mesmo hex de `primitiveColor`. `grey91` repete o valor de `color/grey/91` (variável automática da importação), que continua existindo e ligada em outros nós.

**Nós ligados (confirmado por `get_variable_defs` em `83:754`, `89:971` e `83:817`):**
- círculo `83:763` (P2) e `89:979` (I1): preenchimento → `color/surface/neutral`; largura e altura → `size/stateIcon` (72 × 72). Raio mantido em 36 (valor fixo, sem variável);
- ícone `83:764` (P2) e `89:980` (I1): largura e altura → `iconSize/alert` (32); os 2 traços de vetor → `color/icon/state`;
- título `83:767` (P2) e `89:983` (I1): estilo `OP-002/stateTitle`;
- botões `83:770` e `83:815` (P2): largura → `layout/stateActionsMaxWidth` (328);
- anel `84:786` (T1): os 4 raios de canto → `radius/tabFocus` (10).

**Erro meu, corrigido na mesma sessão:** liguei os 4 raios dos círculos a `size/stateIcon`, e o raio saltou de 36 para 72. Desfiz as ligações, voltei o raio a 36 em `83:763` e `89:979` e tirei o escopo de raio da variável (`92:765` ficou só com largura e altura). Medida lida depois: 72 × 72, raio 36. Visualmente o círculo não chegou a mudar (72 é o teto do raio), mas o valor lido estava errado até a correção.

**R-5b:** o traço do ícone do P2 ficou em Spectra `#33575D` depois da ligação; comparei a captura de antes (`f41-capturas/figma-fpdb8-proposto-perfil-erro-83-754.png`) com a de agora: o ícone continua verde-petróleo, sem mudança de cor. **Antes de ligar eu não li o hex do traço** (só a captura): a conclusão vem do valor que a variável hoje devolve (`#33575D`) e da comparação visual das duas imagens.

### 17.2 Releitura por valor de L2, L3 e L4 (nós lidos hoje, `use_figma`)

| ID | Nó | Valor lido no Figma | Código (`fef803e`) | Resultado |
|---|---|---|---|---|
| V-L14 (texto) | `82:2049` botão 304 × 50, Crail `#B5453D`, traço 1, raio 8 | texto **"Entrando…"** (`…` único, Inter SemiBold 15, branco) | `login.botaoEntrar.carregando` = `Entrando…` (R-1, `5597caa`) | **igual** |
| V-L14 (opacidade) | `82:2049` e o texto | opacidade **100%** (nenhum `opacity` diferente de 1) | `Button` com `loading` não esmaece (R-2, `5ab9b7b`) | **igual** |
| V-L14 (indicador) | `82:2137` elipse 16 × 16 branca, arco 0 → 4,7 rad (≈ 270°), raio interno 0,7; a **6,5** do texto (indicador em x 90–106 do botão, texto a partir de x 112,5) | `ActivityIndicator` com `gap: spacing.sm` = **8** (`button.tsx:126`) | **R-11 aberta** (ver 17.6) |
| V-L18 | `82:2092` caixa 304 × 66, Pot Pourri `#F6E7E5`, traço Rose Fog `#E2B5B0` 1, raio 8, margem 13, espaço 10; ícone 18; texto 250 × 40 | "Sem conexão. Verifique a internet da oficina e tente de novo." Inter Regular 14 / 19,6, El Salva `#923631` | `login.erroRede.mensagem` com texto idêntico (§15.2) | **igual** (texto e estilo) |
| V-L19 | `82:2131` caixa 304 × 66, mesmo estilo, a y = 299, **acima** do campo Usuário | "Sua sessão expirou. Faça login novamente." | `login.sessaoExpirada.mensagem` com texto idêntico (§15.2) | **igual** (texto e posição) |

O texto de L3 e L4 e as medidas das caixas batem com a §15.2; releitura confirma. A posição de L3 (y = 467, entre a senha e o botão a y = 508) também.

### 17.3 Início I1 `89:971`, lido por valor (aprovado pela pessoa em 16/11; D-20 cai)

Tela `89:976` 362 × 742, Pampas `#F7F5F2`, borda Westar 1 interna, raio 10. Posições relativas à tela.

| ID | Elemento (nó) | Valor no Figma | Token / variável |
|---|---|---|---|
| V-I01 | cabeçalho `89:996` (instância do cabeçalho `20:1079`) | 360 × 56, petro `#1E3A3F`, título "Início", botão de usuário 36 × 36 | `color.surface.brand`, `size.appBar`, `size.iconButton` |
| V-I02 | círculo `89:979` | 72 × 72, raio 36, `#EDE9E4`, centrado em x (145) | `size/stateIcon`, `color/surface/neutral` |
| V-I03 | ícone `89:980` | documento, 32 × 32, traço Spectra, dentro do círculo (20 de margem) | `iconSize/alert`, `color/icon/state` |
| V-I04 | título `89:983` | "Em breve", Barlow Condensed SemiBold 20, petro, centralizado; **16 abaixo do círculo** (caixa a 10 + 6 de respiro superior) | `OP-002/stateTitle`, `color.text.primary` |
| V-I05 | mensagem `89:985` | "Os módulos da oficina chegam nas próximas versões." Inter Regular **14 / 21**, Flint `#6E6A66`, centralizada, **289 de largura**, **10 abaixo** do título | `typography.dialogMessage`, `color.text.secondary` |
| V-I06 | bloco (círculo, título, mensagem) | centralizado na vertical entre o cabeçalho (fim em y 57) e a tab bar (início em y 679): bloco de y 286 a 450, centro 368 = centro da área | — |
| V-I07 | tab bar `89:1003` | 360 × 62, 4 itens a 50%, nenhum selecionado | `opacity.unavailable` |

**Diferenças reais para o ORLA (o Figma manda, D-02).** Li `state-view.tsx` em `fef803e`: o estado vazio do `/inicio` usa `Ionicons file-tray-outline` de 48 em Flint, **sem círculo**, título `typography.label` (Inter SemiBold 14, `marginTop: spacing.md` = 16), mensagem `typography.body` (Inter Regular **16**, `marginTop: spacing.xs` = 4).

| # | Diferença | Figma (I1) | Código hoje |
|---|---|---|---|
| I-1 | círculo atrás do ícone | 72, `#EDE9E4` | ausente |
| I-2 | ícone | 32, Spectra, documento | 48 (`iconSize.empty`), Flint, bandeja de arquivo |
| I-3 | título | Barlow Condensed SemiBold 20, petro (`stateTitle`) | Inter SemiBold 14 |
| I-4 | mensagem | Inter 14 / 21, largura 289 | Inter 16, sem limite de largura |
| I-5 | espaço círculo → título → mensagem | 16 e 10 | 16 e 4 |
| I-6 | ícone de documento | desenho do arquivo (D-10: Ionicons mantidos, exceção registrada) | Ionicons; escolher `document-text-outline` (o mesmo da aba Ordens) |

Sugestão, não decisão minha: o P2 já tem círculo 72 + ícone 32 + título 20 + mensagem 14 / 21 no `error-state.tsx`; o Início tem a mesma forma, sem botões. Reaproveitar a estrutura em vez de duplicar. `iconSize.empty` (48) só serve o estado vazio antigo; se o Início passar ao desenho acima, ele fica sem consumidor.
Quatro estados do Início: vazio é o único; carregando, erro e sucesso são **não se aplica** (a tela é estática, não chama API).

### 17.4 Pendências de leitura da pessoa, agora fechadas no lado Figma

| Item | Leitura | Resultado |
|---|---|---|
| R-5b, ícone do P2 | traço do ícone `83:764` = `#33575D` (Spectra), 32 × 32 | confirmado (ressalva em 17.1) |
| R-10, botões do P2 | `83:770` e `83:815`: **328 × 50**, raio 8 | confirmado; o código tem `layout.stateActionsMaxWidth` = 328 |
| T1 `83:817` em `#EE8279` | `get_variable_defs` do T1 devolve `color/text/tabSelected` = `#ee8279` e **nenhuma** `color/red/47` (Crail); anel `84:786` 86 × 58, traço branco 2 interno, raio 10 | confirmado |

### 17.5 Capturas dos frames (só lado Figma), exportadas em `docs/design/f41-capturas/final-2026-11-16/`

15 PNGs de 4,6 KB a 95 KB (máximo 94 742 bytes; total ≈ 0,8 MB), todos com md5 distintos, baixados de `get_screenshot` hoje, depois de criar as variáveis: `login-vazio-10-895`, `login-preenchido-L1-82-1990`, `login-carregando-L2-82-2024`, `login-erro-credencial-10-936`, `login-erro-conexao-L3-82-2058`, `login-sessao-expirada-L4-82-2098`, `perfil-carregando-P1-83-712`, `perfil-erro-P2-83-754`, `perfil-preenchido-10-3842`, `dialogo-logout-10-3886`, `tabbar-ordens-selecionado-20-1102`, `tabbar-clientes-selecionado-20-1340`, `tabbar-foco-T1-83-817`, `tabbar-desabilitada-T2-83-844`, `inicio-vazio-I1-89-971`. Cobrem Login (5 estados + sessão expirada), Perfil (carregando, erro, preenchido), diálogo, tab bar (selecionado, foco, desabilitada) e o Início. Só mostram dados fictícios do próprio arquivo ("João da Silva" etc.); nenhum token ou dado real.
**Não há captura do app** (P-03: sem aparelho e sem pares lado a lado). Abri três delas (P2, I1 e T1) para conferir o conteúdo; **não abri as outras 12**, só conferi tamanho e hash.
Os rótulos de cima dos frames `L1` a `L4`, `P1`, `P2`, `T1`, `T2` e `I1` ainda dizem "proposto" (aparecem nas capturas). Não alterei os textos: o rótulo é do arquivo, e trocá-lo por "aprovado em 16/11" exige reexportar as 9 capturas.

### 17.6 Aberto

- **R-11 (nova, pequena, real):** no L2, o indicador (16) fica a **6,5** do texto e o texto fica **centralizado no botão** (x 112,5 a 191,5 de 304); o código agrupa indicador e texto com `gap` 8 e centraliza o grupo, o que desloca o texto uns 12 para a direita. Medida só por leitura dos dois lados, sem medir no app. Decisão para o ORLA: aceitar como diferença de layout do React Native (registrar) ou posicionar o indicador à esquerda do texto com o texto centralizado.
- **Escudo 84 × 96 (D-21):** não exportado, fora do aceite, nada inventado.
- **Aba selecionada em execução:** sem decisão da pessoa ("não se aplica hoje" ou programar); só o componente isolado prova.
- **Restante da tabela do ADR-014** (~70 linhas: medidas, raios, espaçamentos, estilos de texto e efeitos): **não criado**. As 7 variáveis acima mais as 3 de antes cobrem os tokens que a F41 criou ou alterou; US-PAR-07 está fechada para eles. Quem decide se o restante entra na F41 é a pessoa/BUSSOLA.
- **Ligações não feitas:** `typography.dialogMessage` (Inter 14 / 21) e `size.avatar` etc. continuam sem variável no Figma; só os 7 tokens acima foram criados, os que a F41 mudou ou o Início exigiu.
- **Suíte do app não rodada hoje** por mim; os últimos números são os da §14 e da §16, do ORLA.

| Condição de fechamento | Estado em 16/11 (fim da sessão) |
|---|---|
| 6 tokens novos + `iconSize/alert` no Figma, valor idêntico ao `tokens.ts` | **feito**, lido de volta (17.1) |
| Releitura de L2, L3, L4 por valor | **feita** (17.2); L2 tem R-11 |
| I1 lido por valor | **feito** (17.3); código diverge em I-1 a I-6 |
| R-5b, R-10, T1 em `#EE8279` | **confirmados** (17.4) |
| Capturas dos frames | **exportadas**, só Figma (17.5) |
| Zero divergência real aberta | **não**: I-1 a I-6 e R-11 abertas, todas do lado do código (ORLA) |

## 18. Correção de código do ORLA (16/11, depois da §17)

**Acesso ao Figma (US-PAR-11):** esta sessão do ORLA não tem nenhuma ferramenta `figma-remote`, então não existe saída de `whoami` para colar. Chamei o ESQUADRO para criar as variáveis; ele respondeu que também não tem a ferramenta nesta sessão e parou sem tocar no arquivo. Ninguém contornou. Tudo do lado Figma abaixo está **pendente**.

| Item | Código | Commit | Prova | Figma |
|---|---|---|---|---|
| I-1 círculo 72 `#EDE9E4` | `StateIllustration` (`size.stateIcon`, `color.surface.neutral`) | `3c8df54` | `state-illustration.test`, `inicio.test` | lido na §17.3 |
| I-2 ícone 32 Spectra, documento | `document-text-outline`, `iconSize.alert`, `color.icon.state` | `3c8df54` | `inicio.test` | lido na §17.3 |
| I-3 título Barlow SemiBold 20 petro | `typography.stateTitle` | `3c8df54` | `state-illustration.test`, `inicio.test` | lido na §17.3 |
| I-4 mensagem Inter 14/21, 289 | `typography.dialogMessage`, **token novo `layout.stateMessageMaxWidth` = 289** | `3c8df54` | `tokens.test`, `inicio.test`, `state-view.test` (P2 R-7 também) | **variável não criada** |
| I-5 espaços 16 e 10 | `spacing.md` e `spacing.s10` | `3c8df54` | `inicio.test` | lido na §17.3 |
| I-6 bloco centrado | `flex: 1`, `justifyContent: center` no contêiner do vazio | já era assim | `inicio.test` (estilo; não medido no aparelho) | lido na §17.3 |
| R-11 indicador a 6,5 do texto, texto centrado | caixa de 16 (**token novo `size.loadingIndicator` = 16**), `gap` = `spacing.s6` (6) e espelho de 16 do outro lado | `7f9db9f` | `button.test` | **variável não criada**; 6 contra 6,5 é diferença de 0,5, sem token para 6,5 |

Efeitos colaterais: o erro P2 passou a usar a mesma `StateIllustration` (24 sob o círculo, 8 sob o título, mensagem com `maxWidth` 289, o que fecha a R-7 que estava "não corrigida por falta de medida"). `iconSize.empty` (48) foi removido porque ficou sem uso.

**Pendente para o ESQUADRO, com Figma:** criar `layout/stateMessageMaxWidth` (289) e `size/loadingIndicator` (16) com valor idêntico ao `tokens.ts` e ligar aos nós `83:769`, `89:985` e `82:2137`; reler o I1 e o L2 contra o código novo; decidir se 6 contra 6,5 passa. **Sem isso a US-PAR-07 e a US-PAR-08 não fecham.**

## 19. Terceira sessão com acesso ao Figma (ESQUADRO, 16/11, noite): 2 variáveis, I1 e L2 relidos, R-11 decidida, lista fechada

Autor: ESQUADRO · Sessão `82501eec-57a2-4d20-be22-fcb0a288a02d` · Arquivo `FPdB8RymAnN81pbKfizdzE` · Código lido no ramo `feat/f41-paridade-fpdb8-codigo` em `361989a` (`tokens.ts`, `button.tsx`, `state-illustration.tsx`, `state-view.tsx`, `error-state.tsx`, `menu-tab-bar.tsx`, `strings.ts`). **Não alterei código e não rodei a suíte do app.** Só toquei nos nós `83:769`, `89:985` e `82:2137` e criei 2 variáveis; nenhum frame fora de Login, Perfil, diálogo, tab bar e Início foi editado.

**Acesso (US-PAR-11), saída real do `whoami` (e-mail omitido de propósito):**
`{"whoami":{"user_id":"1126488233271433922","handle":"Leticia Moraes","plans":[{"name":"Time Pessoal","seat":"Full","tier":"student","key":"team::1274094162661077353","role":"admin","specs_enabled":true,"code_layers_enabled":true}]}}`
Nenhum erro de permissão em `create_session`, `use_figma`, `get_variable_defs` e `get_screenshot`. A instrução `figma-use` não pôde ser carregada (não há `get_figma_skill` nem leitura de `skill://` nesta sessão); cada escrita foi um passo pequeno, com leitura antes e depois.

### 19.1 US-PAR-07: as 2 variáveis que faltavam (valor lido de volta)

Coleção `OP-002 Identidade v2` (`VariableCollectionId:89:712`): de 14 para **16 variáveis**. Escopo só `WIDTH_HEIGHT`, para não repetir o erro do raio da §17.1.

| Token no código (`tokens.ts`) | Variável no Figma | Id | Valor no Figma | Valor no código | Nós ligados | Resultado |
|---|---|---|---|---|---|---|
| `layout.stateMessageMaxWidth` | `layout/stateMessageMaxWidth` | `94:712` | 289 | 289 (`tokens.ts:223`) | `83:769` (P2) e `89:985` (I1), largura | **idêntico** |
| `size.loadingIndicator` | `size/loadingIndicator` | `94:713` | 16 | 16 (`tokens.ts:179`) | `82:2137` (L2), largura e altura | **idêntico** |

Leitura de volta por dois caminhos: `use_figma` (`boundVariables` dos 3 nós) e `get_variable_defs` de `89:971` (devolve `layout/stateMessageMaxWidth: 289`), de `83:754` (idem, mais `layout/stateActionsMaxWidth: 328`) e de `82:2024` (devolve `size/loadingIndicator: 16`). Medidas dos nós antes e depois da ligação: iguais (289 × 42, 289 × 42, 16 × 16). Com isso, **todos os tokens que a F41 criou ou alterou têm variável (ou estilo) com o mesmo valor**: `placeholder`, `border/default`, `tabSelected`, `surface/neutral`, `icon/state`, `stateIcon`, `stateTitle` (estilo de texto), `tabFocus`, `stateActionsMaxWidth`, `stateMessageMaxWidth`, `loadingIndicator` e `iconSize/alert` (12 itens: 11 variáveis mais o estilo de texto `stateTitle`; com os 5 primitivos a coleção tem 16 variáveis). **Ainda não ligadas** (sem token novo, só valor igual): `size/avatar` e `typography/dialogMessage`. Não confirmei no arquivo se `spacing.s6` e `spacing.s10` têm variável própria; só vi `item spacing/6` e `item spacing/9`, `item spacing/12` na leitura.

### 19.2 Releitura contra o código novo do ORLA (`3c8df54`, `7f9db9f`)

**I1 `89:971` (tela `89:976`, 362 × 742):** posições relativas à tela, lidas hoje.

| ID | Valor lido no Figma | Código | Resultado |
|---|---|---|---|
| V-I01 | cabeçalho 360 × 56, título "Início" SemiBold 21 (família não lida hoje; a V-P01 registra Barlow Condensed), botão de usuário 36 × 36 (`89:996`) | `ScreenHeader` com `inicio.titulo` = "Início" | igual (texto idêntico) |
| V-I02, V-I03 | círculo `89:979` 72 × 72, y 286, centrado em x 145; ícone `89:980` 32 × 32 a 20 de margem | `StateIllustration`: `size.stateIcon` 72, `iconSize.alert` 32, `color.surface.neutral`, `color.icon.state` | igual (lido por valor; o desenho do ícone é Ionicons, D-10) |
| V-I04 | título "Em breve", SemiBold 20, texto a y 374 = **16** abaixo do círculo (fim em 358) | `titleGap={spacing.md}` (16), `typography.stateTitle`, `inicio.vazio.titulo` = "Em breve" | igual |
| V-I05 | mensagem 289 × 42 (duas linhas), Inter 14 / 21, a y 408 = **10** abaixo do texto do título (fim em 398) | `messageGap={spacing.s10}`, `layout.stateMessageMaxWidth`, `typography.dialogMessage`; texto "Os módulos da oficina chegam nas próximas versões." idêntico | igual |
| V-I06 | bloco centrado entre cabeçalho (fim em 57) e tab bar (início em 679) | `flex: 1` + `justifyContent: center` | igual por leitura do estilo; **não medido no aparelho** |
| V-I07 | tab bar 360 × 62, 4 células 90 × 62 a **50%** (`opacity` do pai 0,5), ícone 22, rótulo Inter Medium 11 | `opacity.unavailable` 0,5, `iconSize.tab` 22, `typography.tabLabel` | igual |

I-1 a I-6 estão **fechadas** no lado Figma e no código, por leitura dos dois lados.

**L2 `82:2024`:** botão `82:2049` 304 × 50, Crail `#B5453D`, opacidade 1, texto "Entrando…" (um `…`), Inter SemiBold 15, texto a x 112,5 (centro 152 = centro do botão), indicador `82:2137` 16 × 16 branco, arco 0 → 4,7 rad, centro vertical 25 = centro do botão e do texto. Código: `button.tsx` com `loadingSlot` de 16 (`size.loadingIndicator`), `gap: spacing.s6`, espelho de 16 do outro lado, sem esmaecer em `loading`. R-1, R-2 e R-11 (estrutura) batem.

### 19.3 R-11 decidida (US-PAR-06): lado corrigido = **Figma**, código mantido

Indicador a **6,5** do texto no frame, **6** no código. Decisão: **aceitar 6 e atualizar o Figma** (premissa 2). Motivo: 6 é o token `spacing.s6` e existe nos dois lados (`item spacing/6`); 6,5 não tem token em nenhum deles, e criar um token por meio pixel só para chegar a um valor sem uso é pior do que mover um círculo de 16.
**Feito no Figma:** `82:2137` movido de x 102 para **102,5** (relativo ao pai `82:2031`), ou seja, de 90 para **90,5** relativo ao botão. Lido depois: indicador x 90,5 / y 17 / 16 × 16, texto x 112,5, **espaço indicador→texto = 6**, ainda ligado a `size/loadingIndicator` (largura e altura). PNG `docs/design/f41-capturas/final-2026-11-16/login-carregando-L2-82-2024.png` reexportado (md5 `11a60b76…` → `0afa468f…`, 59 032 bytes) e conferido visualmente. Nenhum outro frame mudou de aparência (as ligações de variável não alteram valor), então os outros 14 PNGs seguem válidos.
**R-11: fechada.**

### 19.4 Tab bar e Perfil: confirmações pedidas pelo BUSSOLA e pelo comandante

| Pergunta | Leitura no Figma | Resultado |
|---|---|---|
| O frame do Perfil `10:3842` desenha tab bar? | busca por nome "navega" ou "tab" em toda a árvore: **nenhum nó**; filhos da tela: cabeçalho, bloco de identidade, cartão, botão "Sair da conta" | **não desenha** (igual a `perfil.test` "without a tab bar") |
| T2 `83:844`: opacidade, rótulo | 4 itens, pai a **0,5**, rótulos Inter **Medium 11**, Tide `#B7B2AC` (183, 178, 172) | igual ao código (`opacity.unavailable` 0,5; `tabLabel`) |
| T1 `83:817`: anel | `84:786` **86 × 58**, raio **10** (ligado a `radius/tabFocus`), traço **branco** de 2, alinhamento **dentro**; "Clientes" SemiBold `#EE8279`, os outros Medium Tide | igual (R-8, V-T06, V-T08) |
| `20:1102` e `20:1340` | **desenham um item selecionado**: "Ordens" em `20:1102` e "Clientes" em `20:1340`, SemiBold `#EE8279`, os demais Tide | **divergência real aberta, depende da pessoa (P-01)**: o código nunca renderiza selecionado (`menu-tab-bar.tsx:62`, `selected={false}`) |
| I1 `89:1003` | 4 itens a 50%, nenhum selecionado | igual ao código |

Ou seja: **T1 e T2 e I1 batem com o código; só `20:1102` e `20:1340` (frames aprovados da tab bar, com item ativo) não têm equivalente em execução.** A pessoa escolhe entre (a) "não se aplica hoje", com justificativa na premissa 5, e (b) programar o selecionado numa feature própria; se (a), o frame é o único lugar onde o estado existe.

### 19.5 Divergências novas que achei no P2 `83:754` (reais, do lado do código)

Li a estrutura da tela `83:759` por valor (auto layout). Coluna `83:761`, margem 16, **gap 12**; filhos: bloco da ilustração `83:762` (328 × 584, centrado na vertical, gap 10), botão cheio `83:770` (y 613) e botão de contorno `83:815` (y 675), ambos 328 × 50. Os botões ficam **ancorados na base** (fim em y 725 de 742, ou seja 16 da borda interna), e a ilustração fica centrada **na área acima deles**. Círculo termina em 329; título (texto) a 345; mensagem a 379.

| # | Elemento | Figma (nó) | Código hoje (arquivo) | O que fazer |
|---|---|---|---|---|
| R-12 | espaço círculo → título; título → mensagem | **16** e **10** (`83:763` → `83:767` → `83:769`), os mesmos do I1 | `titleGap={spacing.lg}` (**24**) e `messageGap={spacing.sm}` (**8**) em `error-state.tsx:37-38` | usar 16 (`spacing.md`) e 10 (`spacing.s10`), os mesmos do estado vazio em `state-view.tsx:77-78` |
| R-13 | posição dos botões | ancorados na base, 16 da borda; ilustração centrada na área restante | `actions` dentro do mesmo grupo centrado, `marginTop: spacing.lg` (**24**) abaixo da mensagem (`error-state.tsx:63-68`) | separar: ilustração em `flex: 1` centrada; botões embaixo, com 12 entre a área e o primeiro botão |
| R-14 | espaço entre os dois botões | **12** (`83:770` fim 663, `83:815` início 675) | `gap: spacing.s10` (**10**) | 12 (`spacing.s12` já existe em `tokens.ts`) |

**Teste que o ORLA deve pedir:** `error-state.test`/`index.test` com os gaps 16 e 10, a coluna dos botões depois do bloco centrado e o gap 12. **Estas três não criam token novo** (todos os valores já existem em `spacing`). Não medi o app: a conclusão vem da leitura dos dois arquivos.

### 19.6 Outras conferências, sem divergência encontrada

- **P1 `83:712`:** indicador 36 em y 338,5, texto "Carregando sessão…" Inter 14 Regular a 12 abaixo (y 386,5), conjunto centrado na tela inteira (centro 371). Código: R-9 com `spacing.s12`. Igual por leitura.
- **Diálogo `10:3886`:** cartão 316 × 186, raio 10, margem 20, gap 14, a 22 de cada lado, centrado (278 a 464); título Bold 22; mensagem Inter 14, 276 × 42; botões 133 × 50 com 10 entre eles; textos idênticos às chaves `perfil.dialogoLogout.*`. Igual por leitura. **Ponto a conferir (não é divergência provada):** o texto do frame traz quebra de linha depois de "senha" ("...usuário e senha⏎para entrar de novo."); a chave do código é uma frase corrida. Se a quebra natural do RN em 276 de largura cair em outro ponto, são duas linhas diferentes. Só se vê no aparelho; fica como risco declarado, não como divergência.
- **Perfil preenchido `10:3842`:** ritmo de 36 do cabeçalho ao avatar, 20 entre selo e cartão, cartão a 12 do bloco, botão "Sair da conta" ancorado na base: bate com V-P13.
- **Contraste (US-PAR-15):** nenhuma cor mudou nesta sessão. `python3 -I docs/design/F41-contraste.py` → saída 0, "OK: todos os pares obrigatórios atingem o alvo".

### 19.7 Lista fechada para o ORLA (o que ainda diverge)

| # | Divergência real | Lado a corrigir | Token novo? |
|---|---|---|---|
| R-12 | P2: gaps 24 e 8 devem ser 16 e 10 | código | não |
| R-13 | P2: botões ancorados na base, ilustração centrada acima | código | não |
| R-14 | P2: gap de 12 entre os botões (hoje 10) | código | não |
| P-01 | tab bar: frames `20:1102` e `20:1340` têm item selecionado, o código nunca renderiza | **decisão da pessoa** (a ou b, §19.4) | não |

**Declaração:** fora essas quatro linhas, **nada mais diverge** no que li em Login (L1 a L4 e `10:895`/`10:936`), Perfil (P1, `10:3842`, P2), diálogo, tab bar (T1, T2) e Início (I1). R-1 a R-11 e I-1 a I-6 estão fechadas. O escudo 84 × 96 fica fora do aceite (D-21), sem registro de origem e licença, e não foi inventado.
**Limite do que afirmo:** "igual" significa valor lido no Figma = valor lido no código-fonte, travado por teste de estilo declarado. **Não medi layout em aparelho nem em simulador**, e a suíte do app não foi rodada por mim hoje.

### 19.8 Fechamento (US-PAR-07, US-PAR-08)

| Condição | Estado |
|---|---|
| Variáveis dos tokens da F41 no Figma com valor idêntico ao `tokens.ts` | **feito** (§17.1, §19.1) |
| I1 e L2 relidos contra o código novo | **feito** (§19.2) |
| R-11 | **fechada**, lado Figma (§19.3) |
| Zero divergência real aberta | **não**: R-12, R-13, R-14 (ORLA) e P-01 (pessoa) |

**US-PAR-07 fecha** (lida no arquivo). **US-PAR-08 não fecha** até R-12 a R-14 serem corrigidas e P-01 decidida. O PR #16 deve continuar em rascunho.

## 20. Quarta sessão com acesso ao Figma (ESQUADRO, 17/11): R-15, O-1 a O-3, anotação da tab bar, escudo e reconciliação das marcas de lacuna

Autor: ESQUADRO · Sessão `11c14d87-2e3a-4429-be87-0133cebb0a28` · Arquivo `FPdB8RymAnN81pbKfizdzE` · Código lido no ramo `feat/f41-paridade-fpdb8-codigo` em `5e02e57`. **Esta seção substitui a §19.7 e a §19.8 no estado de R-15, O-2, P-01 e do escudo.** Li o arquivo hoje, nó por nó; a CRIVO pode conferir pelos ids. Não alterei código do app.

**Acesso (US-PAR-11), saída real do `whoami` (e-mail omitido de propósito):**
`{"whoami":{"user_id":"1126488233271433922","handle":"Leticia Moraes","plans":[{"name":"Time Pessoal","seat":"Full","tier":"student","key":"team::1274094162661077353","role":"admin","specs_enabled":true,"code_layers_enabled":true}]}}`
`create_session` devolveu `11c14d87-2e3a-4429-be87-0133cebb0a28`. Sem erro de permissão em `use_figma`, `get_variable_defs`, `get_screenshot` e `get_metadata`. **Negado nesta sessão:** `download_assets` ("Claude requested permissions to use mcp__figma-remote__download_assets, but you haven't granted it yet."). Não repeti: troquei por `get_screenshot` (frames) e por `exportAsync` dentro do `use_figma` (escudo). A instrução `figma-use` não pôde ser carregada (não há `get_figma_skill` nem leitura de `skill://` nesta sessão); cada escrita foi um passo pequeno, com leitura antes e depois.

### 20.1 R-15: campo em carregamento do L2 `82:2024` (decisão de 16/11: a favor do código, o Figma muda). Lado corrigido: **Figma**

| Item | Figma (lido hoje) | Código (`5e02e57`) | Resultado |
|---|---|---|---|
| fundo do campo Usuário `82:2042` e Senha `82:2047` | preenchimento `#f1f5f9`, **ligado** à variável `color/surface/skeleton` (`VariableID:98:713`, alias de `primitive/slate100` `98:712` = `#f1f5f9`) | `color.surface.skeleton` = `primitiveColor.slate100` = `#F1F5F9` (`tokens.ts:35` e `:49`), aplicado por `inputRowDisabled` (`text-field.tsx:139-141`) quando `editable` é falso | **idêntico** |
| borda dos mesmos campos | `#8c8780`, 1 px, ligada a `color/border/default` (`89:717`), raio 8 | `color.border.default` = `#8C8780`, `borderWidth.hairline`, `radius.sm`; a borda de repouso continua no campo desabilitado | **idêntico** |
| texto digitado `82:2043` e `82:2048` | petro `#1e3a3f` (`color/cyan/18`), Inter Regular 15 | `typography.input` e `color.text.primary` | igual |
| `get_variable_defs` do `82:2024` | devolve `color/surface/skeleton: #f1f5f9`, `color/border/default: #8c8780`, `size/loadingIndicator: 16` | , | confirma a ligação |

**Achado de processo, declarado:** a variável `color/surface/skeleton` (`98:713`) e a ligação já estavam no arquivo quando cheguei, e o PNG do L2 já estava alterado na árvore de trabalho, **sem nenhum registro meu ou de outro agente**. Não sei quem fez nem quando (não li o histórico de versões). O que afirmo é só o estado de hoje, lido por valor. PNG reexportado hoje: `login-carregando-L2-82-2024.png`, md5 `2aa84cf0bdd4ddffee13f8912c972e71`, idêntico ao arquivo modificado na árvore (o commitado tinha `0afa468f…`, da §19.3). Abri a imagem: campos em cinza-azulado, botão "Entrando…" com indicador à esquerda.

**Isenção do campo desabilitado:** registrada em `docs/design/F41-contraste.py` como pares `D2` (valor petro sobre skeleton, 11,07:1) e `D3` (borda `#8C8780` contra skeleton, 3,25:1), tipo `isento` (componente inativo, WCAG 1.4.3 e 1.4.11). `python3 -I docs/design/F41-contraste.py` → saída 0, "OK: todos os pares obrigatórios atingem o alvo". As razões passam sozinhas; a isenção só garante que um valor futuro não derrube o script por um campo inativo.

**Aberto, do ORLA:** o teste que trava a cor do campo desabilitado **não existe**. `text-field.test.tsx` só cobre `editable={false}` e `accessibilityState` (linhas 92 a 98) e `tokens.test.ts` não tem `#F1F5F9`. Sugestão: asserção de `backgroundColor` = `#F1F5F9` no `text-field-box` com `editable={false}`, e `['skeleton', color.surface.skeleton, '#F1F5F9']` na tabela do `tokens.test`.

### 20.2 O-1, O-2 e O-3: classificação e lado corrigido (US-PAR-05 e US-PAR-06)

| # | Diferença | Classe | Decisão (16/11) | Lado corrigido | Evidência |
|---|---|---|---|---|---|
| O-1 | P2 `83:754`, ícone do círculo: o frame desenha um ícone de rede cortado; o app usa `cloud-offline-outline` (Ionicons) | **real, coberta pela exceção D-10** | Ionicons mantidos | **nenhum** (nem código, nem Figma) | par `app-2026-11-16-orla/lado-a-lado-perfil-erro.png` (ORLA); ver D-10 na §8 |
| O-2 | `10:936` não tinha "Mostrar" no campo Senha; o app (e L1 a L4) tem | **real**, frame antigo | a favor do **código** | **Figma** | nó `98:714` lido hoje (abaixo) e PNG reexportado |
| O-3 | P1 `83:712`: anel contínuo no frame; `ActivityIndicator` nativo no app | **só de plataforma** (ADR-014:216, D-16) | nada muda | **nenhum** | par `app-2026-11-16-orla/lado-a-lado-perfil-carregando.png` (ORLA) |

**O-2, valor lido em `10:936`:** o campo Senha `10:965` (304 × 46, borda de erro de 2 px Crail, raio 8) já contém o texto `98:714` "Mostrar" (nome "Mostrar senha"): **Inter Medium 13**, linha 21, preenchimento `#6e6a66` **ligado** a `color/grey/42` (`1:41`, Flint), `x` 239, `y` 12,5, 49 × 21. Conferência da posição: 304 − 2 (borda de erro) − 14 (margem interna) − 49 = 239, que é a regra do código (`FIELD_PADDING` com a borda compensada, `text-field.tsx:102-133`); no L1 a borda é de 1 px e o texto fica em 240. O texto bate com `login.campoSenha.mostrarTexto`. PNG `login-erro-credencial-10-936.png` reexportado hoje: md5 `d8d823aa…` → `edbf416b5e4b6c2c0dc2a914172e1af5`, e conferido visualmente ("Mostrar" à direita da senha, caixa de erro abaixo, botão Entrar). **Mesmo achado de processo da §20.1:** o nó `98:714` (faixa de ids da sessão que criou `98:713`) já existia sem registro. **O par `lado-a-lado-login-credencial.png` foi montado pelo ORLA antes dessa edição**, então o lado Figma dele deve mostrar o frame sem "Mostrar": serve como prova da divergência de antes, **não** como prova do estado de hoje. Não abri esse par nesta sessão; a conclusão vem da ordem dos fatos, não de olhar a imagem.

**R-15 e O-2 não mudam código.** O-1 e O-3 não mudam código nem Figma.

### 20.3 Tab bar: anotação "estado futuro" em `20:1102` e `20:1340` (P-01, decidido: "não se aplica ainda")

Antes: `annotations: []` nos dois nós (ambos `COMPONENT` 360 × 62, 4 itens). Agora, lido de volta, os dois têm **uma anotação nativa** com o texto: "Estado futuro (F41, P-01 decidido em 16/11: "não se aplica ainda"). Este frame desenha um item selecionado, mas hoje as 4 abas estão desabilitadas e nenhuma navega, então o app não renderiza item selecionado. Reabrir quando uma aba for habilitada. A referência de paridade atual da tab bar é T2 (83:844, tudo desabilitado a 50%) e T1 (83:817, foco)." Anotação nativa não aparece na exportação: os PNGs `tabbar-ordens-selecionado-20-1102.png` (md5 `35b51e76…`) e `tabbar-clientes-selecionado-20-1340.png` (md5 `7fdf5668…`) saíram **idênticos** aos já versionados. Reabrir quando a primeira aba for habilitada; a S-3 do PRD (anel de foco desenhado em item selecionado em T1) segue como dúvida da pessoa.

### 20.4 Escudo 84 × 96 (D-21, US-PAR-19): exportado; **origem lida e licença sem registro**

**O que o arquivo diz (lido hoje):**

| Campo | Valor |
|---|---|
| Nó no estado vazio | `10:906`, instância "Component 1" em `10:895`, 84 × 96, `x` 110, `y` 0 |
| Componente | `variant=1` (`10:9`) do conjunto `10:696` "Component 1" (175 variantes, quase todas ícones de 13 a 32 px) |
| Onde cada variante é usada | `variant=1` em `10:895`, L1 `82:1990`, L2 `82:2024`, L3 `82:2058`, L4 `82:2098`; `variant=2` (`10:22`) só em `10:936`. **O SVG das duas é byte a byte igual** (conferido por `exportAsync`): é o mesmo desenho |
| Desenho | 6 camadas vetoriais: escudo branco com contorno petro de 5 px, faixa vertical Crail, roda de leme com 8 raios e miolo petro. Cores só da paleta do projeto: `#1E3A3F`, `#B5453D`, branco |
| Descrição do componente, links de documentação | vazios |
| Autoria e licença | **sem registro no arquivo**: busca nos textos das 3 páginas por "licen", "crédit", "autor", "direitos", "copyright", "©", "fonte:", "source", "escudo", "brasão" não achou crédito algum |
| Origem técnica (**inferência minha, não registro**) | os nomes "div", "span", "Component 1" e "variant=N" são de importação de HTML para o Figma; o desenho foi trazido por essa importação, não desenhado como componente de biblioteca. Não sei de onde veio o desenho antes disso |

**Licença: SEM REGISTRO. A S-2 do PRD continua sem resposta da pessoa, e eu não preencho.** O que fica registrado é o estado: ativo vetorial simples, nas cores da marca do projeto, dentro do arquivo da conta da pessoa (`whoami`: plano "Time Pessoal"; **não verifiquei o dono do arquivo**). Para o portão jurídico fechar basta a pessoa responder por escrito: **"o escudo é da marca do projeto e pode ser usado no app"** (ou dizer de onde veio e sob que licença). Até lá, a exportação técnica está pronta e o **portão jurídico segue aberto**; a decisão de o ORLA programar antes ou depois dessa resposta é da pessoa/REGENTE (a D-21 da revisão de 16/11 já pôs o escudo no aceite).

**Arquivos exportados (US-PAR-19 A), em `docs/design/f41-ativos/escudo/`:** convenção de nomes do React Native (`escudo-login.png`, `@2x`, `@3x`), fundo transparente (PNG RGBA, profundidade 8), tamanho lógico 84 × 96. Cada PNG foi gerado por `exportAsync` do nó `10:906` e validado depois de gravado (assinatura PNG, CRC de todos os blocos, dimensões e tamanho em bytes iguais aos do Figma).

| Arquivo | Pixels | Bytes | md5 |
|---|---|---|---|
| `escudo-login.png` (1x) | 84 × 96 | 3 169 | `f012e3b0ecb2e11aee06bbccbae4985b` |
| `escudo-login@2x.png` | 168 × 192 | 5 605 | `09a7b6573da837c9dba323a6c400bb06` |
| `escudo-login@3x.png` | 252 × 288 | 8 367 | `c47497c58d980efce419b88052c81d3b` |
| `escudo-login.svg` | 84 × 96 | 932 | `975c70032ab07094f7c7f4b3d55e8c3e` |

Todos bem abaixo do limite de 50 KB que o PRD propôs. O SVG vai só como fonte e para conferência: o app **não tem** `react-native-svg` (PRD, §US-PAR-19), então o ORLA usa os PNGs. Uma camada do SVG (`fill="black"` num caminho de segmentos sem área) não aparece no desenho; é sobra da importação e foi mantida como o Figma exporta, sem edição manual. **Acessibilidade para o ORLA:** o título "MECÂNICA SÃO JORGE" logo abaixo já nomeia a marca, então o escudo é **decorativo**: fora da árvore de acessibilidade (`accessible={false}` e `importantForAccessibility="no"`), sem rótulo, sem foco. Tem 84 × 96 fixos no frame; os campos e o botão continuam sem largura fixa.

### 20.5 Capturas dos frames aprovados, reexportadas hoje (só lado Figma)

15 nós aprovados reexportados por `get_screenshot` em `docs/design/f41-capturas/final-2026-11-16/` (mesmos nomes). **13 saíram com hash idêntico ao já versionado; 2 mudaram, as duas por decisão de 16/11** (R-15 e O-2).

| Frame (nó) | md5 de hoje | Em relação ao versionado |
|---|---|---|
| Login vazio `10:895` | `a4ade874308190ca1a5be3ceaaea1149` | idêntico |
| Login preenchido L1 `82:1990` | `c3160c373559707389bf96f56ac4b7cc` | idêntico |
| **Login carregando L2 `82:2024`** | `2aa84cf0bdd4ddffee13f8912c972e71` | **mudou (R-15)**; igual ao arquivo modificado na árvore |
| **Login erro de credencial `10:936`** | `edbf416b5e4b6c2c0dc2a914172e1af5` | **mudou (O-2)** |
| Login erro de conexão L3 `82:2058` | `843ae92dc1fb77198e072fa9a7a82ad8` | idêntico |
| Login sessão expirada L4 `82:2098` | `c271673d0b4beaae22b2e073b4c90963` | idêntico |
| Perfil carregando P1 `83:712` | `2faf569f5798c0c8d09c3c2b2f38bfd3` | idêntico |
| Perfil erro P2 `83:754` | `f2b9703516e28f130b5cda84f118976e` | idêntico |
| Perfil preenchido `10:3842` | `841354797578261fe078d255de7b0e91` | idêntico |
| Diálogo de logout `10:3886` | `56caddde1bed560d963f1749a8f8e521` | idêntico |
| Tab bar `20:1102` | `35b51e7687e29a46c61e6da24a5ca655` | idêntico |
| Tab bar `20:1340` | `7fdf5668ca63091d93eed1af1b04827f` | idêntico |
| Tab bar foco T1 `83:817` | `8c0bd4bcba3af29362e2fba19a1a6b09` | idêntico |
| Tab bar desabilitada T2 `83:844` | `dde6610eb53b23d06d8f8cec775fbca9` | idêntico |
| Início I1 `89:971` | `be50ec421f047c6f8d2d859745297c0a` | idêntico |

Abri só os dois que mudaram (L2 e `10:936`); **os outros 13 conferi por hash, não por olho**. Só dados fictícios do próprio arquivo ("joao.silva", senha em pontos); nenhum token, senha ou dado real. Nenhuma captura do app foi feita por mim.

### 20.6 Estado de I-1 a I-6, R-11 e R-15 (pedido do comandante)

O pedido dizia "I-1 a I-6, R-11 e R-15 ainda abertos". **Não os encontrei abertos, exceto R-15 no lado do teste.** Estado real:

| Item | Estado hoje | Base |
|---|---|---|
| I-1 a I-6 (Início) | **fechadas** em Figma e código | leitura por valor na §19.2 (16/11); código em `3c8df54`. **Não reli o I1 hoje**; o código do app não mudou desde `c242b6f` (`git diff --stat c242b6f HEAD -- apps` sem saída), então a leitura da §19.2 continua sendo a base |
| R-11 (indicador do L2 a 6 do texto) | **fechada**, lado Figma | §19.3 (indicador movido para x 90,5); código em `7f9db9f` |
| R-15 (campo do L2) | **fechada no Figma e no script de contraste** (§20.1); **teste do ORLA aberto** | §20.1 |
| O-1, O-2, O-3 | **classificadas e registradas** (§20.2) | §20.2 |
| P-01 (tab bar selecionada) | **"não se aplica ainda"**, anotado nos dois frames (§20.3) | §20.3 |
| R-12 a R-14 (P2) | **corrigidas no código** em `c242b6f` | commit; **não reli o P2 por valor hoje** |

### 20.7 Marcas de lacuna da planilha (T32): 22 reconciliadas

As 22 marcas "FALTA" desta planilha (21 linhas de tabela mais a definição da §3) foram trocadas por **evidência de teste com número de linha** ou por **lacuna declarada**; a palavra não aparece mais no arquivo (conferido pelo script de troca, que parou se alguma linha não batesse). Antes de trocar, procurei a asserção em cada teste e rodei a suíte: `npm --prefix apps/mobile test -- --silent` → **37 suítes, 289 testes, todos passando** (leitura da saída final; só o aviso `DEP0040` do `punycode`). "Coberto" aqui quer dizer que a asserção existe no teste que passa; **não fiz mutação** para provar que o teste cai se o valor mudar.

**Cobertas por teste (13):** V-L07 (textos), V-L08 (raio 8 e margem 14 + 1), V-L15 (14/19,6, margem 13, gap 10), V-L19 (texto e posição), V-P04, V-P06, V-D01, V-D02, V-D04, V-D05, V-D06 (só o estilo do fundo, o literal do scrim não foi conferido), V-T03 (ícone 22 só como token, gap 4 no uso), V-T07 (0,5).

**Lacunas declaradas, sem teste (9), para o ORLA decidir se cobre:**

| ID | O que não tem trava | Asserção sugerida |
|---|---|---|
| V-L06 | estilo do rótulo do campo (Inter Medium 13, Flint, 6 até o campo) | `text-field.test`: estilo do `Text` do rótulo |
| V-L08 | Inter 15 do texto digitado | `text-field.test`: `fontFamily` e `fontSize` do `TextInput` |
| V-L11 | Inter SemiBold 15 do botão e os 304 de largura | `button.test`: estilo do texto; a largura de 304 é layout e o Jest não mede |
| V-L12 | ritmo 16 / 6 / 10 / 14 do bloco do logo e do formulário | `brand-header.test` e `login.test`: `gap` e `margin` declarados |
| V-P01 | família, 21 e 0,21 do título do cabeçalho (`typography.appBarTitle`) | `screen-header.test` ou `tokens.test` |
| V-P11 | posição do botão "Sair da conta" no rodapé | `perfil.test`: o botão vem depois do cartão, no contêiner do rodapé |
| V-P13 | ritmo do Perfil (36, 20, 12) | `perfil.test`: margens declaradas |
| V-T04 | fundo petro da tab bar, sem borda | `menu-tab-bar.test`: `backgroundColor` = `#1E3A3F` |
| V-T09 | nomes dos ícones (`document-text-outline` etc.) | exceção D-10; teste só se a pessoa quiser travar o desenho |

Nenhuma dessas lacunas é divergência com o frame: todas são "igual por leitura, sem trava de teste". Pelo desenho do critério do PRD (US-PAR-01, "uma linha por estado com nó, valor lido, valor do código e teste"), as 9 ficam como **lacuna aceita ou a cobrir**, decisão do BUSSOLA e do ORLA.

### 20.8 Quadro de fechamento (US-PAR-08), depois desta sessão

| Condição | Estado |
|---|---|
| L2 `82:2024` na cor do skeleton, ligada à variável, PNG reexportado (R-15) | **feito** (§20.1) |
| `10:936` com "Mostrar", PNG reexportado (O-2) | **feito** (§20.2) |
| Anotação "estado futuro" em `20:1102` e `20:1340` | **feito** (§20.3) |
| O-1, O-2, O-3 registradas com lado e decisão | **feito** (§20.2) |
| Isenção do campo desabilitado em `F41-contraste.py`, saída 0 | **feito** (§20.1) |
| Escudo exportado, origem registrada | **feito** o lado técnico (§20.4); **licença sem registro**, depende da S-2 |
| Escudo programado com teste | **não**: é do ORLA |
| Teste que trava a cor do campo desabilitado | **não**: é do ORLA |
| Marcas "FALTA" reconciliadas | **feito** (§20.7), com 9 lacunas declaradas |
| Zero divergência real aberta | **não**: faltam o escudo no código (L-02) e a licença; as demais divergências reais conhecidas estão fechadas |

**US-PAR-08 continua aberto** até o escudo estar programado e a S-2 respondida. Limite do que afirmo: "igual" é valor lido no Figma = valor lido no código-fonte; **não medi layout em aparelho nem em simulador** e não rodei fluxo contra a API.

## 21. Quinta sessão com acesso ao Figma (ESQUADRO, 17/11, tarde): exportação final, I1 relido, escudo registrado e lista para o ORLA

Autor: ESQUADRO · Sessão `832c13c4-9343-493d-b0ff-0546cb9da51b` · Arquivo `FPdB8RymAnN81pbKfizdzE` · Código lido no ramo `feat/f41-paridade-fpdb8-codigo` em `db1c281`. Não alterei o Figma (só leitura) nem o código do app.

### 21.1 Acesso (US-PAR-11): saída real do `whoami` (e-mail omitido de propósito)

`{"whoami":{"user_id":"1126488233271433922","handle":"Leticia Moraes","plans":[{"name":"Time Pessoal","seat":"Full","tier":"student","key":"team::1274094162661077353","role":"admin","specs_enabled":true,"code_layers_enabled":true}]}}`

Sem erro de permissão em `create_session`, `get_screenshot` e `use_figma` (só leitura). **Não tentei** `download_assets` (a sessão de 17/11 de manhã teve esse conector negado, §20): usei `get_screenshot` e baixei o PNG pela URL que ele devolve. A instrução `figma-use` não pôde ser carregada (sem `get_figma_skill` nem leitura de `skill://` nesta sessão); por isso só fiz leituras em `use_figma`, nenhuma escrita.

### 21.2 Exportação final dos 15 frames aprovados (nomeados pelo nó)

Exportei os 15 frames por `get_screenshot` (tamanho padrão do conector: 410 × 804 para telas, 360 × 62 para a tab bar e 470 × 180 para T1 e T2) e baixei para uma pasta nova fora do repositório. **Os 15 hashes são idênticos aos de `docs/design/f41-capturas/final-2026-11-16/`**, então **nenhum PNG foi alterado**: as capturas finais já versionadas são as de hoje. Comparei por `md5`, não por olho.

| Tela | Estado | Nó | Arquivo em `final-2026-11-16/` | md5 (hoje = versionado) |
|---|---|---|---|---|
| Login | vazio | `10:895` | `login-vazio-10-895.png` | `a4ade874308190ca1a5be3ceaaea1149` |
| Login | preenchido | `82:1990` | `login-preenchido-L1-82-1990.png` | `c3160c373559707389bf96f56ac4b7cc` |
| Login | carregando | `82:2024` | `login-carregando-L2-82-2024.png` | `2aa84cf0bdd4ddffee13f8912c972e71` |
| Login | erro de credencial | `10:936` | `login-erro-credencial-10-936.png` | `edbf416b5e4b6c2c0dc2a914172e1af5` |
| Login | erro de conexão | `82:2058` | `login-erro-conexao-L3-82-2058.png` | `843ae92dc1fb77198e072fa9a7a82ad8` |
| Login | sessão expirada (extra) | `82:2098` | `login-sessao-expirada-L4-82-2098.png` | `c271673d0b4beaae22b2e073b4c90963` |
| Perfil | carregando | `83:712` | `perfil-carregando-P1-83-712.png` | `2faf569f5798c0c8d09c3c2b2f38bfd3` |
| Perfil | erro | `83:754` | `perfil-erro-P2-83-754.png` | `f2b9703516e28f130b5cda84f118976e` |
| Perfil | preenchido | `10:3842` | `perfil-preenchido-10-3842.png` | `841354797578261fe078d255de7b0e91` |
| Diálogo de logout | aberto | `10:3886` | `dialogo-logout-10-3886.png` | `56caddde1bed560d963f1749a8f8e521` |
| Tab bar | Ordens selecionado (estado futuro) | `20:1102` | `tabbar-ordens-selecionado-20-1102.png` | `35b51e7687e29a46c61e6da24a5ca655` |
| Tab bar | Clientes selecionado (estado futuro) | `20:1340` | `tabbar-clientes-selecionado-20-1340.png` | `7fdf5668ca63091d93eed1af1b04827f` |
| Tab bar | foco (T1) | `83:817` | `tabbar-foco-T1-83-817.png` | `8c0bd4bcba3af29362e2fba19a1a6b09` |
| Tab bar | 4 abas desabilitadas (T2) | `83:844` | `tabbar-desabilitada-T2-83-844.png` | `dde6610eb53b23d06d8f8cec775fbca9` |
| Início (com a tab bar) | vazio | `89:971` | `inicio-vazio-I1-89-971.png` | `be50ec421f047c6f8d2d859745297c0a` |

**Não abri nenhuma das 15 imagens hoje**; a conferência é por hash contra arquivos que a §20.5 já tinha aberto (L2 e `10:936`) ou conferido por hash. A tab bar com Início aparece em I1 (`89:1003`, instância dentro da tela) e em T2 (as mesmas 4 abas a 50%). Só dado fictício do arquivo ("joao.silva", senha em pontos); nenhum token, senha ou dado real.

### 21.3 I1 `89:971` relido por valor (ninguém o tinha relido em 17/11)

Leitura por `use_figma`, sem escrita. Tudo bate com V-I01 a V-I07 (§17.3):

| Elemento | Lido hoje | Código lido hoje (`db1c281`) |
|---|---|---|
| Tela `89:976` | 362 × 742, `#F7F5F2`, raio 10 | `ScreenContainer` |
| Círculo `89:979` | 72 × 72, raio 36, `#EDE9E4`, `x` 145, `y` 286 | `size.stateIcon` = 72, `color.surface.neutral` (`state-illustration.tsx:57-60`) |
| Ícone `89:980` | instância 32 × 32, dentro do círculo a 20 | `iconSize.alert` (valor numérico **não relido hoje**) |
| Título `89:983` | "Em breve", Barlow Condensed SemiBold 20, `#1E3A3F`; caixa `89:981` a `y` 368 (6 de respiro) | `typography.stateTitle` 20 (`tokens.ts:140`), `inicio.vazio.titulo` = "Em breve" |
| Mensagem `89:985` | "Os módulos da oficina chegam nas próximas versões.", Inter Regular 14, linha 21, `#6E6A66`, 289 × 42, `y` 408 (10 abaixo da caixa do título) | `typography.dialogMessage` 14 / 21 (`tokens.ts:155`), `inicio.vazio.mensagem` com o mesmo texto; `messageGap` 10, `titleGap` 16 em `state-view.tsx:75-78`; largura 289 por `layout.stateMessageMaxWidth` (**valor não relido hoje**) |
| Cabeçalho `89:996` | 360 × 56, `#1E3A3F`, título "Início" Barlow SemiBold 21 branco, botão de usuário 36 × 36 | `inicio.titulo` = "Início", `ScreenHeader` |
| Tab bar `89:1003` | 360 × 62, 4 itens de 90 a 50% de opacidade, rótulos Inter Medium 11 `#B7B2AC`: Ordens, Clientes, Catálogo, Financeiro | `size.tabBar` = 62, `opacity.unavailable` = 0.5, mesma ordem e rótulos (`menu-tab-bar.tsx:23-48`, `strings.ts:64-70`) |

Quatro estados do Início: só "vazio" existe; carregando, erro e preenchido são **não se aplica** (tela estática, sem chamada de API), como na §17.3.

### 21.4 Anotações da tab bar (P-01) confirmadas

`20:1102` e `20:1340` (ambos `COMPONENT` 360 × 62) continuam com **uma anotação** cada, com o texto "Estado futuro (F41, P-01 decidido em 16/11: "não se aplica ainda") …" (lida de volta hoje). Referência atual de paridade da tab bar: T2 `83:844` e T1 `83:817`.

### 21.5 Escudo: origem e licença registradas em arquivo próprio

`docs/design/f41-ativos/escudo/ORIGEM-E-LICENCA.md`. Resumo: o componente `10:9` é **local ao arquivo** (`remote: false`), sem descrição nem links; o SVG de `10:906` reexportado hoje tem 932 bytes, igual ao versionado, e os 4 hashes dos arquivos batem com a §20.4. **Autor e licença: sem registro. A S-2 segue sem resposta literal da pessoa** e o campo de resposta no arquivo está vazio. Não preenchi.

### 21.6 O que o código ainda diverge do Figma (lista objetiva para o ORLA)

**Real e aberta: 1 linha.**

| # | Divergência | Frames | Figma (lido) | Código (lido) | Lado a corrigir | Bloqueio |
|---|---|---|---|---|---|---|
| L-02 | Escudo ausente | `10:895`, L1 `82:1990`, L2 `82:2024`, `10:936`, L3 `82:2058`, L4 `82:2098` | 84 × 96, centrado, primeiro elemento do bloco da marca, 10 acima do título; medidas em `ORIGEM-E-LICENCA.md` §4 | `brand-header.tsx` só tem título e subtítulo (comentário nas linhas 12-15); `apps/mobile/assets` não existe; sem `Image` no app | código | **S-2 (licença) e a decisão da pessoa/REGENTE de programar antes dela** |

Quando a S-2 abrir: copiar os 3 PNGs para `apps/mobile/assets`, `Image` 84 × 96 como primeiro filho do `BrandHeader` (o `gap` de 10 já existe), `accessible={false}` e `importantForAccessibility="no"`, teste em `brand-header.test.tsx` (existência, tamanho, fora da árvore de acessibilidade), e conferir se L3, L4 e `10:936` ficam com o bloco em y 126 como no Figma. Sem token novo. Se o par escudo + `ScreenContainer centered` empurrar o formulário em tela baixa, registrar como divergência de plataforma ou nova linha, não ajustar no olho.

**Não são divergência, são lacunas de trava de teste (9, §20.7):** V-L06, V-L08, V-L11, V-L12, V-P01, V-P11, V-P13, V-T04, V-T09. Recomendação do BUSSOLA: V-T04, V-L06 e V-L08, de uma linha cada; V-T09 é exceção D-10.

**Fora desta lista, por decisão registrada:** O-1 (D-10, Ionicons), O-3 (plataforma), P-01 (tab bar selecionada, "não se aplica ainda"), D-26 (sem captura nova).

**Limite:** não encontrei outra divergência nos itens que li hoje (§21.3). Login, Perfil, diálogo e T1/T2 não foram relidos por valor hoje; para eles vale a leitura de §17 a §20 e o fato de `git diff --stat 5e02e57 HEAD -- apps` listar só `text-field.test.tsx` e `tokens.test.ts` (21 linhas de teste, nenhum estilo). Não medi layout em simulador nem rodei a suíte hoje.

### 21.7 Quadro de fechamento (US-PAR-08), depois desta sessão

| Condição | Estado |
|---|---|
| 15 frames aprovados exportados e nomeados pelo nó | **feito**, sem mudança de pixel (§21.2) |
| I1 e anotações da tab bar relidos | **feito** (§21.3, §21.4) |
| Origem do escudo registrada | **feito** (lida no arquivo) |
| Licença do escudo | **sem registro**, aguarda a pessoa (S-2) |
| Escudo programado | **não**, é do ORLA e depende da S-2 |
| Zero divergência real aberta | **não**: L-02 |

**US-PAR-08 continua aberto só pelo escudo (L-02).**

# F40 · Especificação dos componentes base (ESQUADRO, 2026-11-13)

Entrada para ORLA. Refatoração **sem mudança visual e sem mudança de comportamento**: cada componente abaixo é extraído do que o código já faz hoje. Nada aqui altera layout, fluxo ou endpoint.

## 1. O que li e o que não consegui ler

**Figma** (arquivo `DLqbSzzKRxiN2eyvXG73Lr`, sessão `aaf9d409-b033-47cb-bcbc-f82b4abbf6da`, `whoami` sem bloqueio):

- `get_metadata` da página `28:2` (F25): 9 frames de Login/Perfil mais a anotação `80:2`. Ids usados: Login `29:2` vazio, `29:20` carregando, `29:35` erro de rede, `29:56` erro de validação, `29:79` preenchido; Perfil `33:2`, `33:14`, `33:33`, `33:49`.
- `get_screenshot` de `29:79` e `33:33`; `get_variable_defs` de `29:79`: `color/surface/brand #1e3a3f`, `color/text/onBrand #ffffff`, `color/text/secondary #334155`, `color/surface/default #ffffff`, `color/border/default #64748b`, `color/action/primary/background #b5453d`, `color/text/onPrimaryAction #ffffff`, `color/focus/ring #1e3a3f`, `color/focus/ring-offset #ffffff`. Todos batem com `tokens.ts`.
- Medidas do Figma: campo 328×48, botão 328×52 (código usa `minHeight 48`), alvo do olho 44×44 (código usa 48), anel de foco 2 px petro + 2 px branco.

**Código** lido por inteiro: `app/login.tsx`, `app/index.tsx`, `app/(menu)/perfil.tsx`, `src/components/{button,text-field,confirm-dialog,error-retry-modal,menu-tab-bar}.tsx`, `src/theme/{tokens,use-focus-ring}.ts`, `src/i18n/strings.ts`, `src/auth/auth-context.tsx`.

**Não li / não verifiquei:**
- A coleção de variáveis `28:3` inteira. Só vi as variáveis presas ao nó `29:79` (todas de cor). Não sei se existem variáveis de espaçamento, raio e tipografia no Figma.
- Nenhum quadro de "vazio" de lista existe no Figma de alta fidelidade (Login e Perfil não têm lista). A referência é o texto da F24 (`F24-wireframe-baixa-fidelidade.md` linhas 104-107): ícone ilustrativo, frase e ação primária.
- Leitor de tela e foco por teclado em aparelho real: sem dispositivo nesta sessão. Os anúncios abaixo vêm da leitura do código, não de gravação.
- Não rodei teste nem app. Esta etapa não escreveu código.

## 2. Achados que ORLA precisa saber antes de mexer

1. **Figma e código já divergem em Login e Perfil.** O Figma aprovado tem faixa petro no topo (120 px no Login, 96 px no Perfil), subtítulo "Entre com sua conta", avatar com iniciais e ícone de olho para mostrar senha. O código tem título solto sobre fundo branco, sem subtítulo nem avatar, e o botão de senha é texto ("Mostrar senha"). Isso é **escopo da F41**. A F40 reproduz o código de hoje. O `ScreenHeader` abaixo tem só `title` e `align` para a F41 trocar o visual sem tocar nas telas.
2. **Estilo dentro de tela.** `login.tsx` declara estilo de aviso de erro e do botão de senha. `perfil.tsx` declara campo somente leitura e selo de perfil. `index.tsx` declara o contêiner. Isso viola US-COMP-01, por isso há componentes novos além dos quatro pedidos (seção 4).
3. **Valores fixos que escapam do `tokens.ts`** (US-COMP-03): `borderWidth: 1`, opacidades 0.85/0.5/0.6, `radius.md + 4`, `minHeight: 48` no campo, `maxWidth: 320` e `480`, `size={22}` do ícone da aba, `fontSize: 32` do ⚠, `radius: spacing.sm` no anel do botão de senha. Tokens novos na seção 3.
4. **US-COMP-12 conflita com o modal de erro.** O erro hoje é popup `Modal` (padrão aprovado na F24/F25/F30, US-DES-13). Um modal com `accessibilityViewIsModal` move o foco do leitor para dentro dele, por definição. "Anunciado sem o foco sair do lugar" é cumprível para **carregando**, não para o erro em modal. Proponho: carregando anuncia sem mover foco; erro mantém o comportamento do F30 (foco vai ao diálogo, anunciado como alerta). **Dúvida para BUSSOLA confirmar**; não mudei o padrão aprovado.
5. **Largura em tela larga.** O Login e o Perfil não têm largura máxima: em 1280 px o formulário estica. A tab bar tem `maxWidth 480`. Não corrijo na F40 (mudaria o visual). Registrado para F41.
6. **Referência da F41.** O PRUMO reteve a F40 até a F41 aprovar a linha de base. Esta especificação não depende disso, mas ORLA só abre a F40 depois que o PRUMO liberar.

## 3. Tokens: acrescentar sem alterar valor (premissa 2)

`tokens.ts` já tem `spacing`, `radius`, `typography`, `minTouchTarget`, `focusRingWidth`, `focusRingOffset` (confirmado, resolve a dúvida 2). Acrescentar, com o valor que o código usa hoje:

| Token novo | Valor | Substitui |
|---|---|---|
| `borderWidth.hairline` | 1 | `borderWidth: 1` em botão secundário, campo, selo |
| `opacity.pressed` | 0.85 | botão pressionado |
| `opacity.disabled` | 0.5 | botão desabilitado |
| `opacity.unavailable` | 0.6 | item de aba indisponível (ícone e rótulo) |
| `focusRingRadius` | `radius.md + focusRingWidth + focusRingOffset` (= 16) | `radius.md + 4` |
| `iconSize.tab` | 22 | `size={22}` na aba |
| `iconSize.alert` | 32 | `fontSize: 32` do ⚠ |
| `layout.dialogMaxWidth` | 320 | `maxWidth: 320` (2 diálogos) |
| `layout.tabBarMaxWidth` | 480 | `LARGURA_MAXIMA` |
| `glyph.alert` | `'⚠'` | literal no `ErrorRetryModal`; é glifo decorativo, escondido do leitor, não texto de interface |

Ajustes sem token novo: `minHeight: 48` do campo passa a `minTouchTarget` (mesmo valor); `borderRadius: spacing.sm` do anel do botão de senha passa a `radius.sm` (mesmo valor 8); `spacing.xs / 2` da aba (= 2) já deriva de token e fica.

**Figma:** pela regra do projeto, token novo entra nos dois lados juntos. Eu crio as variáveis numéricas correspondentes na coleção do arquivo assim que ORLA confirmar os valores commitados. Ainda não criei nenhuma (esta etapa foi só leitura). Aguardo também a F41, para não criar variável sobre linha de base que pode mudar (ADR-014, D3 aberta).

## 4. Componentes

Caminhos seguem a proposta do CARTOGRAFO (`components/ui`, `components/<área>`, `hooks`, `services`). O ADR-015 estava como "proposto" e **não estava gravado no repositório** quando li; se o aceite mudar os caminhos, as props abaixo não mudam. Regra de `components/ui`: sem texto fixo, sem importar `i18n`, `hooks` ou `services`; todo texto chega por prop.

Nomes de arquivo em kebab-case e de símbolo em inglês, como pede a convenção da casa. Os símbolos exportados hoje (`Button`, `TextField`, `ConfirmDialog`, `ErrorRetryModal`) mantêm o nome.

### 4.1 `Button` (existe; só trocar valores fixos)
- Props atuais mantidas: `label`, `onPress`, `variant: 'primary' | 'secondary'`, `loading`, `loadingLabel`, `disabled`, `accessibilityLabel`.
- Papel `button`. Nome acessível: `accessibilityLabel ?? label`. Estado: `disabled` e `busy` (quando `loading`). Em `loading` o botão fica desabilitado e mostra `loadingLabel ?? label`.
- Foco: anel duplo via `useFocusRing` no wrapper. Alvo mínimo `minTouchTarget` (48).
- Tokens: trocar `radius.md + 4` por `focusRingRadius`, `borderWidth: 1` por `borderWidth.hairline`, opacidades por `opacity.*`.
- Teste de componente: rótulo e papel; `onPress` dispara; `disabled` e `loading` não disparam; `loading` mostra `loadingLabel` e `busy=true`; foco liga o anel; variante secundária tem borda.

### 4.2 `TextField` (existe; só trocar valores fixos)
- Props atuais mantidas (`label`, `value`, `onChangeText`, `errorMessage`, `secureTextEntry`, `editable`, `keyboardType`, `autoCapitalize`, `textContentType`, `rightAccessory`, `accessibilityLabel`) e `ref` repassado ao `TextInput` (o Login usa para focar o primeiro campo com erro).
- Nome acessível do input: `accessibilityLabel ?? (errorMessage ? "<rótulo>, <erro>" : rótulo)`. Mantém exatamente assim (premissa 6).
- Erro: `Text` com papel `alert` e `accessibilityLiveRegion="polite"`, sempre com texto, nunca só borda (WCAG 1.4.1).
- Desabilitado: `accessibilityState.disabled` e fundo `color.surface.skeleton`.
- Tokens: `minHeight 48` → `minTouchTarget`, `borderWidth.hairline`, `focusRingRadius`.
- Observação para CRIVO: o erro é anunciado duas vezes em potencial (rótulo do input e região viva). Isso já era assim no F30, não mudo.
- Teste: rótulo visível e nome acessível com e sem erro; `onChangeText`; erro renderiza com papel `alert`; `editable=false` marca `disabled`; `ref` focável; `rightAccessory` renderiza.

### 4.3 `ScreenHeader` (novo, `ui/`)
- **Justificativa:** Login e Perfil declaram o mesmo estilo de título (`typography.title`, `color.text.primary`, `marginBottom: spacing.lg`) em cada tela. Nenhum componente existente resolve.
- Props: `title: string`, `align?: 'start' | 'center'` (padrão `start`; Login usa `center`, Perfil `start`).
- Papel `header` (`accessibilityRole="header"`). Mesmo anúncio de hoje: o título.
- Sem subtítulo, sem faixa petro: isso é F41 (achado 1).
- Teste: papel `header`, texto, alinhamento por `align`.

### 4.4 `StateView` (novo, `ui/`): vazio, carregando e erro
- **Justificativa:** pedido da feature; hoje o carregando vive solto em `index.tsx` e o erro em `ErrorRetryModal`. A F35 usa o vazio na primeira lista.
- União discriminada por `state`, todo texto por prop:
  - `state: 'loading'`: `loadingLabel: string`. Spinner grande centralizado (igual ao `index.tsx` de hoje), `color.text.primary`. Preenche o contêiner (`flex: 1`, centro).
  - `state: 'empty'`: `title: string`, `message?: string`, `actionLabel?: string`, `onAction?: () => void`. Bloco centralizado: ícone ilustrativo (decorativo, escondido do leitor), `title` em `typography.label`/`color.text.primary`, `message` em `typography.body`/`color.text.secondary`, ação como `Button` primário. Referência: F24 linhas 104-107. `actionLabel` e `onAction` andam juntos (tipo exige os dois ou nenhum).
  - `state: 'error'`: `visible: boolean`, `title`, `message`, `retryLabel`, `onRetry`, `secondaryLabel?`, `onSecondaryPress?`. É o `ErrorRetryModal` atual, 1:1, incluindo `visible` (mantém o fade; sem `visible` o popup sumiria sem animação ao sair do erro, o que seria mudança visual).
- `ErrorRetryModal` passa a ser peça interna de `StateView`; `login.tsx` e `index.tsx` usam `StateView state="error"`.
- Acessibilidade:
  - carregando: região viva `polite` no contêiner, nome = `loadingLabel`, e `AccessibilityInfo.announceForAccessibility(loadingLabel)` ao montar (iOS não tem região viva). **Melhoria** sobre o F30, onde o spinner só tinha `accessibilityLabel`. Sem mover foco.
  - vazio: `title` e `message` como texto lido em ordem; ação como botão com o foco natural. Sem região viva (não é mudança de estado após ação; se a F35 precisar anunciar após filtro, decide lá).
  - erro: igual ao F30 (`accessibilityViewIsModal`, papel `alert`, região viva `assertive`, ⚠ escondido do leitor, `onRequestClose = onRetry`). Ver achado 4.
- Tokens: `iconSize.alert`, `glyph.alert`, `layout.dialogMaxWidth`, `color.surface.overlay`.
- Teste (US-COMP-05, 12): um por estado: carregando expõe `loadingLabel` e chama `announceForAccessibility`; vazio mostra título, mensagem e ação opcional que dispara; erro com `visible` verdadeiro mostra título, mensagem e dois botões (retry e secundário), e `visible` falso não mostra nada.

### 4.5 `InlineAlert` (novo, `ui/`)
- **Justificativa:** `login.tsx` declara estilo para dois avisos (credencial inválida, sessão expirada). Não são estado de tela (o formulário continua) e não cabem no `StateView`.
- Props: `message: string`. Papel `alert`, `accessibilityLiveRegion="polite"`, texto `color.text.error`, centralizado, `marginBottom: spacing.md`.
- O texto é sempre legível, nunca só cor. Mantém os anúncios de hoje.
- Teste: papel `alert`, texto, região viva.

### 4.6 `InlineActionButton` (novo, `ui/`)
- **Justificativa:** o botão "Mostrar/Ocultar senha" é montado dentro de `login.tsx` com `Pressable`, anel de foco e estilo próprios. `Button` não serve: é largo, preenchido, 16/600; este é sem fundo, `typography.caption`, `color.text.secondary`, alvo mínimo 48×48.
- Props: `label: string`, `onPress`, `disabled?: boolean`.
- Papel `button`; nome acessível = `label`; foco com `useFocusRing` (anel com `radius.sm`); alvo `minTouchTarget` nos dois eixos.
- O Login passa `label={mostrarSenha ? t('login.campoSenha.ocultar') : t('login.campoSenha.mostrar')}` ao `rightAccessory` do `TextField`. Comportamento idêntico ao de hoje.
- Fica de fora (F41): trocar texto por ícone de olho como no Figma (`29:12`-`29:15`).
- Teste: papel e nome; `onPress`; `disabled` não dispara; foco liga o anel.

### 4.7 `ReadOnlyField` (novo, `ui/`)
- **Justificativa:** o Perfil declara `campo`/`rotulo`/`valor` (rótulo 14/600 `text.secondary`, valor 16 `text.primary`). É o par rótulo-valor, equivalente de leitura do `TextField`.
- Props: `label: string`, `value?: string`, `children?: ReactNode` (para o selo de perfil). Sem papel especial: lê rótulo e depois valor, como hoje.
- Teste: renderiza rótulo e valor; renderiza `children` no lugar do valor.

### 4.8 `AccessProfileBadge` (novo, `components/perfil/`)
- **Justificativa:** o selo "ADMIN" está estilizado dentro de `perfil.tsx`. Não é o "badge de status" que o briefing adia para a F35 (é o perfil de acesso, não um status). Se a F35 criar um `Badge` genérico, este componente deve ser substituído por ele; registrado como dívida consciente.
- Props: `label: string`. Visual de hoje: `color.surface.skeleton`, borda `border.default` de `borderWidth.hairline`, `radius.pill`, `typography.label`. Lê o texto, sem papel.
- Teste: renderiza o rótulo.

### 4.9 `ScreenContainer` (novo, `ui/`)
- **Justificativa:** os três contêineres de tela repetem `flex: 1`, `padding: spacing.lg`, `backgroundColor: color.surface.default`.
- Props: `children`, `centered?: boolean` (`justifyContent: 'center'`, como o Login). `index.tsx` usa `ScreenContainer` com `StateView` de carregamento, que já se centraliza; o padding de 24 px em volta de um item centralizado não muda onde ele aparece.
- Sem papel e sem anúncio.
- Teste: renderiza filhos; `centered` aplica o alinhamento.

### 4.10 `ConfirmDialog` e `MenuTabBar` (existem)
- `ConfirmDialog`: só trocar `maxWidth: 320` por `layout.dialogMaxWidth`. Props, papel `alert`, região viva `assertive`, `accessibilityViewIsModal` ficam.
- **Revisão 2026-11-13 (R1, US-COMP-01), implementada por ORLA:** o item da aba saiu do `MenuTabBar` e virou o componente base `TabBarItem` (`ui/tab-bar-item.tsx`; props `icon`, `label`, `accessibilityLabel`, `selected`, `unavailable?`, `onPress?`; sem texto fixo, sem `i18n`). O `MenuTabBar` ficou só com o contêiner da barra e da área segura e monta os 5 itens com `t(...)`. O estilo do layout `app/(menu)/_layout.tsx` (achado na busca de `StyleSheet.create` em `app/**`) foi para `components/menu/menu-shell.tsx`. Papéis, rótulos, estados e ordem de foco abaixo não mudaram. **ESQUADRO: confirmar esta revisão da §4.10.**
- `MenuTabBar` (texto original, anterior à revisão): trocar `size={22}` por `iconSize.tab`, `opacity: 0.6` por `opacity.unavailable`, `LARGURA_MAXIMA` por `layout.tabBarMaxWidth`. Papéis, rótulos acessíveis e estados (`selected`, `disabled`) e a ordem de foco Perfil → Clientes e Veículos → Catálogo → Ordens de Serviço → Financeiro ficam **idênticos** ao F34/F33. Sem texto fixo: os 5 itens já vêm de `t(...)`, mas o array é montado na carga do módulo; se a F40 mover para a camada `ui` ou `menu`, os rótulos continuam vindo de chave.

## 5. Matriz de anúncio ao leitor de tela (premissa 6)

| Elemento | Hoje (F30/F33) | Depois | Mudou? |
|---|---|---|---|
| Título de tela | papel `header`, lê o título | igual | não |
| Campo | rótulo; com erro "rótulo, erro"; erro como `alert` polite | igual | não |
| Botão | papel `button`, rótulo, `disabled`/`busy` | igual | não |
| Mostrar/ocultar senha | botão com o texto atual | igual | não |
| Aviso de credencial / sessão expirada | `alert`, polite | igual | não |
| Carregando da sessão (`index`) | spinner com rótulo, sem região viva | região viva polite + `announceForAccessibility` | **sim, melhoria** |
| Erro de rede (modal) | `alert`, assertive, modal | igual | não |
| Diálogo de saída | `alert`, assertive, modal | igual | não |
| Aba | papel `tab`, rótulo com estado, `selected`/`disabled` | igual | não |

## 6. Textos (US-COMP-13)

Os componentes `ui` não carregam texto: tudo chega por prop. As chaves que as telas passam já existem em `strings.ts` (`login.*`, `perfil.*`, `sessao.*`, `menu.tabbar.*`). Nenhuma chave nova é necessária para Login, Perfil e aba. As chaves do `StateView` vazio ficam com a F35 (quem consome). Nota para o grep de CRIVO: o glifo ⚠ sai do componente e vai para `glyph.alert` em `tokens.ts`; a busca por texto literal deve passar a excluir só `tokens.ts` (premissa 3).

## 7. Responsividade

Componentes sem largura fixa, exceto `layout.dialogMaxWidth` (320) e `layout.tabBarMaxWidth` (480), que já existem. Conferir em 360, 768 e 1280 px que a aparência não mudou. Em 1280 o formulário estica (achado 5); não é regressão, é como está hoje.

## 8. Como provar "sem mudança visual" (dúvida 1)

Proposta que aceito: capturas de Login (vazio, erro de credencial, carregando, erro de rede), Perfil (preenchido, diálogo de saída) e tab bar, antes e depois, no mesmo simulador e na mesma largura. As capturas **antes** têm de ser tiradas antes de ORLA mexer em qualquer arquivo. O lado Figma não muda nesta feature (o frame aprovado já difere do código; ver achado 1), então a conferência da F40 é código contra código.

## 9. Figma nesta etapa

Nenhum nó foi criado ou alterado. Só leitura.

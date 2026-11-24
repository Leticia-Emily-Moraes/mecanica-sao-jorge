# F41 · Planilha de divergências Figma `FPdB8` × app (refeita do zero)

Autor: ESQUADRO · Data: 2026-11-16 · Base do código: `main` em `348a43e` (F40 incluída) · Arquivo de referência: `FPdB8RymAnN81pbKfizdzE`, página `20:2132`.
**Atualização de 16/11 (revisão humana, ESQUADRO):** a pessoa aprovou os frames L1 a L4, P1, P2 (com botões ajustados), T1 e T2, as três cores AA e o ADR-014, e **dispensou captura e pares lado a lado**. A prova passa a ser a planilha de valores `docs/design/F41-valores-fpdb8.md` (uma linha por valor, com o teste que o trava) mais os testes de componente. Onde esta planilha falar em captura ou imagem composta, vale a decisão de 16/11. Contraste refeito com os valores finais (§5). **Nesta sessão o Figma não estava acessível** (detalhe em `F41-valores-fpdb8.md`, §1): as variáveis novas, o ajuste do P2 e o frame Início **não foram feitos**.

**Atualização de 16/11, sessão com acesso (ESQUADRO):** as variáveis, o P2, o T1 e a releitura de L2 a L4 foram feitos; o resultado e as divergências reais que sobram (R-1 a R-9, todas do código) estão em `docs/design/F41-valores-fpdb8.md` §15. Onde este arquivo diz "Figma inacessível" ou "bloqueado", vale a §15.

Estado da feature: **NÃO fechada.** Faltam o frame Início aprovado, o escudo exportado com origem e liberação, as variáveis no Figma, o ajuste do P2 e as correções de código listadas em `F41-valores-fpdb8.md` §7. Esta planilha substitui por inteiro a de 2026-11-13 (`docs/design/F41-planilha-divergencias.md` na branch `docs/f41-rodada-figma-fpdb8`, feita contra o arquivo `DLqb…`).

Regra de classificação (D-02, ADR-014): o Figma manda. **Só são "de plataforma"** barra de status e áreas do sistema, renderização de uma mesma família de fonte do sistema e tamanho de aparelho. Todo o resto (estrutura, hierarquia, texto, token, família de fonte, ícone, estado) é **real**.

## 1. Acesso ao Figma e o que foi (e não foi) feito (US-PAR-11)

`whoami` em 2026-11-16: respondeu com o plano "Time Pessoal" (`team::1274094162661077353`, papel admin). `get_metadata`, `get_screenshot`, `get_design_context` e `get_variable_defs` do arquivo `FPdB8…` funcionaram sem erro de permissão. Sessão `0aa749b1-35d2-40cf-aabc-92c54f24f036`.

Não consegui carregar as instruções da ferramenta `use_figma` (`figma-use`) nesta sessão: não há ferramenta nem recurso para lê-las. Trabalhei em passos pequenos e conferi cada um por captura. Escrevi **só** na seção nova `82:1989` "F41 — estados propostos" da página `20:2132`. Nenhum frame de referência foi editado e nenhuma variável foi criada.

**Lado Figma: feito.** 7 capturas "antes" em `docs/design/f41-capturas/figma-fpdb8-*.png`, mais 7 capturas dos frames propostos (`figma-fpdb8-proposto-*.png`), todas abaixo de 100 KB.
**Lado app: NÃO feito.** Não há captura do app nesta rodada: o aparelho e o modo de execução seguem com a pessoa (P-02), e o simulador já foi instável antes. Por isso **não há imagem composta** (Figma à esquerda, app à direita) e **nenhuma linha abaixo foi medida em pixel no app**: o valor "App hoje" vem da leitura do código em `348a43e`. Quando ORLA capturar, cada linha ganha a medida e a classe "plataforma × real" é confirmada.

## 2. Frames de referência e frames propostos

Referência (todos verificados por `get_metadata` em 16/11, lista viva em `docs/design/figma.md`): Login `10:895`, Login erro `10:936`, cabeçalho com botão de usuário `10:981` / `20:1079`, Perfil `10:3842`, logout `10:3886`, tab bar `20:1102` (componente, Ordens ativo) e `20:1340` (Clientes ativo); `20:1103` é a instância do componente dentro do frame 1c.

Propostos (sufixo "— proposto"; **aguardam aprovação da pessoa**, D-06):

| Frame proposto | Nó | Estado que cobre | Base |
|---|---|---|---|
| L1 Login preenchido | `82:1990` | preenchido, com ação "Mostrar" na senha | clone de `10:895` |
| L2 Login carregando | `82:2024` | "Entrando…" com indicador, campos preenchidos | clone de `10:895` |
| L3 Login erro de conexão | `82:2058` | caixa de erro entre a senha e o botão | caixa de `10:967` |
| L4 Login sessão expirada | `82:2098` | aviso no topo do formulário | caixa de `10:967` |
| P1 Perfil carregando | `83:712` | indicador e "Carregando sessão…" | fundo Pampas de `10:3842` |
| P2 Perfil erro ao carregar | `83:754` | padrão 1c sem cabeçalho e sem tab bar, 2 ações | clone de `10:981` |
| T1 Tab bar com foco | `83:817` | anel branco 2 px no item selecionado | instância de `20:1340` |
| T2 Tab bar desabilitada | `83:844` | 4 itens a 50%, nenhum selecionado | instância de `20:1102` |
| C1 Cores AA propostas | `85:744` | placeholder, borda de campo, aba selecionada | — |

Os textos desses frames (por exemplo "Sem conexão. Verifique a internet da oficina e tente de novo.") são **proposta de redação minha**, não texto do Figma de referência. As variáveis do arquivo têm nome automático por matiz e não foram religadas nos frames propostos (cores copiadas dos nós de referência onde possível, hex direto no C1).

## 3. Planilha de divergências

Coluna **PRD** liga à numeração N-xx citada no PRD. **Lado** = onde corrigir: "código" é o padrão (D-02). **Plat.?** só é preenchida como "possível plataforma" quando a captura do app puder confirmar.

### 3.1 Login (`10:895`, `10:936`)

| ID | PRD | Elemento | Figma | App hoje (`login.tsx` e componentes) | Classe | Lado / decisão |
|---|---|---|---|---|---|---|
| L-01 | — | Fundo da tela | Pampas `#F7F5F2` | `color.surface.default` branco (`screen-container.tsx`) | real | código; token novo `surface.background` |
| L-02 | N-02 | Escudo | 84 × 96 acima do título, centralizado | ausente | real | código; **bloqueado (16/11):** o escudo 84 × 96 de `10:895` ainda não foi exportado e a origem e a liberação de uso não estão registradas. Sem substituto improvisado. Fecha só com o ativo exportado e a liberação anotada |
| L-03 | N-06 | Título | "MECÂNICA SÃO JORGE" (caixa alta), Barlow Condensed Bold 30, espaçamento 0,6, petro, centralizado | "Mecânica São Jorge", fonte do sistema, 24/700 (`login.titulo`) | real (texto, família, tamanho) | código; texto na chave `login.titulo`; **bloqueado por P-05** para a fonte |
| L-04 | — | Subtítulo | "Gestão da oficina", Inter Regular 13, Flint | ausente | real | código; chave nova `login.subtitulo` |
| L-05 | N-01 | Rótulo do campo de entrada | "Usuário", Inter Medium 13, Flint | "E-mail", 14/600, slate700 (`login.campoEmail.rotulo`) | real (texto, família, peso, tamanho, cor) | código (D-03): texto "Usuário"; **o campo continua enviando e-mail** |
| L-06 | — | Placeholder | "Seu usuário" e "Sua senha", Inter 15, Dawn | sem placeholder | real (texto, estado) | código; chaves novas. **Decidido 16/11:** o Figma usa Dawn `#A8A39D` (2,50:1, reprova); o código usa **Flint `#6E6A66`** (5,36:1 sobre branco). Aprovado, remover o comentário PROVISÓRIO do `tokens.ts` e criar a variável no FPdB8 (bloqueado, §7 de `F41-valores-fpdb8.md`) |
| L-07 | N-04 | Campo | altura 46, raio 8, borda 1 px Westar, margem interna 14, fundo branco, texto Inter 15 | `minHeight` 48, raio 12, borda 1 px slate500, margem 16, 16 px do sistema | real | código; ver P-04: visível 46, área de toque ≥ 48 por `hitSlop`. **Borda de repouso:** Figma Westar `#E2DEDA` (1,34:1, reprova 3:1); **decidido 16/11: `#8C8780`** (3,56:1 sobre branco, 3,28:1 sobre Pampas); hoje `tokens.ts` tem `slate500` provisório: trocar e remover o PROVISÓRIO |
| L-08 | — | Foco de campo | borda de 2 px Crail (campo Usuário em `10:895`; **leitura minha**: o frame não nomeia o estado) | anel duplo petro com halo branco (`use-focus-ring.ts`) | real | código; confirmar com a pessoa que `10:895` é o foco (P-11) |
| L-09 | N-05 | Ação "Mostrar senha" | ausente no frame | `InlineActionButton` "Mostrar senha/Ocultar senha" | real (estado sem frame) | **Decidido 16/11: "Mostrar senha" mantido** (o frame de referência `10:895` não tem o controle; L1 `82:1990` tem, com o texto visível "Mostrar"). Código: texto visível "Mostrar"/"Ocultar" e nome acessível "Mostrar senha"/"Ocultar senha", em chaves de i18n. Hoje o texto visível é "Mostrar senha": **divergência de texto aberta** |
| L-10 | R-02 | Caixa de erro de credencial | caixa Pot Pourri `#F6E7E5`, borda Rose Fog 1 px, raio 8, margem 13, ícone círculo com "!" 18, texto El Salva Inter 14 / 19,6, entre a senha e o botão | `InlineAlert`: texto simples Crail centralizado, sem caixa nem ícone, **acima** do campo de e-mail | real (estrutura, posição, ícone, token) | código. **R-02 reconferido**: o ícone é círculo com "!" em contorno, **não** o triângulo cheio da rodada antiga; o `AlertIcon` de `6b3c082` não serve |
| L-11 | R-03 | Altura da caixa de erro | sem altura fixa: margem 13 + 1 borda; **2 linhas = 67**, 1 linha ≈ 48 | (rodada antiga: `inlineAlertMinHeight` 44) | real | código. **R-03 reconferido**: o valor 44 não vale; a caixa se dimensiona pelo texto e pela margem |
| L-12 | — | Texto do erro de credencial | "Usuário ou senha incorretos. Confira os dados e tente novamente." | "E-mail ou senha incorretos." (`login.erroCredencial.mensagem`) | real (texto) | código, na chave i18n; mensagem continua genérica |
| L-13 | — | Bordas em erro de credencial | os **dois** campos com 2 px Crail | campos não mudam | real (estado) | código |
| L-14 | — | Botão Entrar | altura 50, raio 8, Crail, Inter SemiBold 15 branco, 304 de largura | `minHeight` 48, raio 12, 16/600 do sistema, anel de foco | real | código; P-04 |
| L-15 | — | Espaçamento | margem 16 + 12 laterais (conteúdo 304 de 360), 16 entre grupos, rótulo→campo 6, bloco do logo com 10 entre itens e 14 abaixo, conteúdo centrado na vertical | margem 24, `marginBottom` 16 por campo, rótulo→campo 4 | real | código |
| L-16 | — | Estado carregando | **sem frame** (proposto L2 `82:2024`) | `Button` com `ActivityIndicator` e "Entrando..." com opacidade 0,5 | real (estado sem frame) | **L2 `82:2024` aprovado em 16/11.** Código segue o frame aprovado; a opacidade 0,5 do botão em carregamento e o "..." contra o "…" do frame **não foram conferidos hoje** (frame não relido): conferir em `82:2024` antes de fechar |
| L-17 | — | Estado preenchido | **L1 `82:1990` aprovado em 16/11** (preenchido, com "Mostrar" na senha) | existe | real | código; ver L-09 para o texto "Mostrar" |
| L-18 | — | Erro de conexão | **sem frame no Login**; o `1c` `10:981` é o padrão global em tela de lista: ícone de sem conexão, título "Sem conexão", mensagem, botão "Tentar novamente" | `StateView error` abre o popup `ErrorRetryModal` "Não foi possível conectar." | real (estado sem frame, padrão de apresentação diferente) | **L3 `82:2058` aprovado em 16/11** (caixa entre a senha e o botão). Código ainda abre o popup: **divergência aberta**. Texto exato de L3 **não lido hoje** |
| L-19 | — | Sessão expirada | **sem frame** (proposto L4 `82:2098`) | `InlineAlert` acima do e-mail | real (estado sem frame) | **L4 `82:2098` aprovado em 16/11.** Texto do frame **não lido hoje**; o código mostra "Sua sessão expirou. Faça login novamente." sem teste de tela: conferir o texto no Figma e cobrir com teste |
| L-20 | A-01 | Barra de status | o frame não mostra a barra; Login tem fundo claro | `userInterfaceStyle: automatic`; o app não define `StatusBar` por tela | **real** (ADR-014: o estilo definido pelo app é real) | código: ícones **escuros** sobre Pampas (Login) e **claros** sobre petro (cabeçalho). **A-01 reconferido**: vale por tela, não só "claro". Conteúdo da barra é plataforma |

### 3.2 Perfil (`10:3842`) e cabeçalho com botão de usuário (`20:1079`, `10:981`)

| ID | PRD | Elemento | Figma | App hoje (`perfil.tsx`) | Classe | Lado / decisão |
|---|---|---|---|---|---|---|
| P-01 | N-07 | Cabeçalho do Perfil | petro, altura 56, seta de voltar em botão 36 × 36 (raio 8, branco 12%, ícone 18) e título "Perfil" Barlow Condensed SemiBold 21 (espaçamento 0,21) branco | `ScreenHeader`: título 24/700 petro no corpo branco; sem seta | real | código; seta com nome acessível e destino a definir (P-01 do PRD) |
| P-02 | — | Avatar | círculo 84, Spectra `#33575D`, iniciais Barlow SemiBold 32 branco | ausente | real | código; **regra das iniciais não está no Figma** (P-14) |
| P-03 | — | Nome | "João da Silva", Barlow SemiBold 24 petro, centralizado | `ReadOnlyField` "Nome" com rótulo e valor | real | código |
| P-04 | — | Selo de perfil | pill petro (999), "ADMIN" Inter SemiBold 12 branco, centralizado sob o nome | `AccessProfileBadge`: pill claro com borda slate, à esquerda, dentro de um campo "Perfil de acesso" | real | código |
| P-05 | — | Cartão | branco, borda 1 px Westar, raio 8, margem 15, sombra 0 1 1 `rgba(30,58,63,.06)`; 3 linhas rótulo Flint 14 / valor petro Inter Medium 14 à direita: "Usuário", "Perfil de acesso" (texto "Administrador"), "Versão do app" | três campos empilhados: Nome, E-mail, Perfil de acesso | real (estrutura, textos, hierarquia) | código |
| P-06 | N-10 | Versão do app | linha "Versão do app" = "1.0.0" | ausente | real | código (D-04): ler a versão de `app.config.ts` por `expo-constants` (hoje `0.1.0`); diferença `0.1.0` × "1.0.0" é **dado**, não desenho (P-07 do PRD) |
| P-07 | — | Valor da linha "Usuário" | "joao.silva" | o app exibe o **e-mail**; a API não devolve nome de usuário separado | real (dado) | **P-09**: mostrar o e-mail sob o rótulo "Usuário" |
| P-08 | — | Texto do perfil | "Administrador" (cartão) e "ADMIN" (selo) | `usuario.perfil` cru (`ADMIN`, `FUNCIONARIO`) | real | código; chave de mapeamento; **não há frame para FUNCIONARIO** (P-15) |
| P-09 | — | Botão "Sair da conta" | contorno Westar 1 px, sem fundo, texto Crail Inter SemiBold 15, altura 50, raio 8, **no rodapé** | botão **cheio** Crail "Sair" logo abaixo dos campos (`perfil.botaoSair.rotulo`) | real (variante, texto, posição) | código |
| P-10 | N-12 | Tab bar no Perfil | **sem** tab bar | Perfil dentro de `(menu)` com `MenuShell` e tab bar | real | código (D-05): Perfil sai do grupo `(menu)` |
| P-11 | — | Fundo, margem e ritmo | Pampas, margem 16, 12 entre blocos, avatar com 20 acima e 8 abaixo | branco, margem 24, 16 | real | código |
| P-12 | — | Perfil carregando | **sem frame** (proposto P1 `83:712`); no código é a reidratação de sessão em `app/index.tsx` | `StateView loading` sobre fundo branco | real (estado sem frame) | **P1 aprovado em 16/11.** Frame: fundo Pampas, indicador petro e o texto **visível** "Carregando sessão…" abaixo (capturei e li `83:712` hoje). O código mostra só o indicador (o texto é só o nome acessível): **divergência aberta** |
| P-13 | — | Perfil erro | **sem frame** (proposto P2 `83:754`); no código é `sessao.erroInicializacao` | popup `ErrorRetryModal` com "Tentar novamente" e "Entrar novamente" | real (estado sem frame) | **P2 aprovado em 16/11, com os botões ajustados:** "Tentar novamente" **cheio** (Crail) e "Entrar novamente" em **contorno**. O frame `83:754` ainda desenha os dois em contorno (li a captura hoje): **ajustar o frame** (bloqueado, sem acesso ao Figma) e o código. O desenho aprovado é tela cheia, sem cabeçalho nem tab bar, com ícone de sem conexão em círculo, título "Não foi possível carregar" e mensagem "Verifique a internet da oficina e tente de novo. Se continuar, entre novamente."; o código tem popup com ⚠ e outro texto: **divergência aberta** |
| P-14 | N-12 | Botão de usuário no cabeçalho | 36 × 36, raio 8, branco 12%, ícone de pessoa 18, canto direito do cabeçalho de 56 (pl 16 / pr 12) | ausente | real | código (D-05): nome acessível "Perfil" (chave), área de toque ≥ 48 por `hitSlop` |

### 3.3 Diálogo de logout (`10:3886`)

| ID | PRD | Elemento | Figma | App hoje (`confirm-dialog.tsx`) | Classe | Lado / decisão |
|---|---|---|---|---|---|---|
| D-01 | — | Título | "Sair da conta?", Barlow Condensed Bold 22 petro, à esquerda | "Deseja realmente sair?" 14/600, centralizado | real (texto, família, alinhamento) | código; chave `perfil.dialogoLogout.titulo` |
| D-02 | — | Mensagem | "Você vai precisar do usuário e senha para entrar de novo." Inter 14 / 21 Flint | ausente | real | código; chave nova |
| D-03 | — | Botões | lado a lado: Cancelar (contorno petro) e Sair (Crail), 50 de altura, raio 8, 10 entre eles | empilhados, largura total: Cancelar (borda slate500) acima, Sair abaixo | real (ordem, posição, token) | código |
| D-04 | — | Cartão | branco, raio 10, margem 20, 14 entre blocos, sombra 0 12 16 `rgba(0,0,0,.25)`, 22 do lado da tela | raio 16, margem 24, largura máxima 320, sem sombra | real | código |
| D-05 | — | Scrim | petro a 55% (`rgba(30,58,63,.55)`) | `rgba(0,0,0,.5)` | real (token) | código |
| D-06 | — | Rótulo "Sair" | "Sair" | "Sair" | igual | — |

### 3.4 Tab bar (`20:1102`, `20:1340`)

| ID | PRD | Elemento | Figma | App hoje (`menu-tab-bar.tsx`, `tab-bar-item.tsx`) | Classe | Lado / decisão |
|---|---|---|---|---|---|---|
| T-01 | N-12 | Itens | **4**: Ordens, Clientes, Catálogo, Financeiro, nesta ordem | **5**: Perfil, Clientes e Veículos, Catálogo, Ordens de Serviço, Financeiro | real | código (D-05) |
| T-02 | N-13 | Rótulos | "Ordens", "Clientes" | "Ordens de Serviço", "Clientes e Veículos" | real (texto) | código, chaves i18n |
| T-03 | — | Altura e células | barra 62; 4 células de 90 × 62; ícone 22 em y 11,5; rótulo em y 37,5; 4 entre ícone e rótulo | célula `minHeight` 48 + margens; 5 células; **altura real não medida** | real | código; medir na captura; alvo `size/tabBar` 62 |
| T-04 | — | Ícones | família de linha própria do arquivo (documento, pessoas, caixa, cartão) | Ionicons `person`, `car-outline`, `list-outline`, `construct-outline`, `cash-outline` | real (ícone) | **Decidido 16/11: Ionicons como exceção registrada** (o arquivo tem família de linha própria: documento, pessoas, caixa, cartão; sem `react-native-svg` e sem licença da biblioteca). Vale para tab bar, botão de usuário e seta. A diferença de desenho continua visível e aceita; não conta como aberta |
| T-05 | — | Rótulo | Inter 11; **SemiBold** no selecionado, **Medium** no inativo | `caption` 12/400 e `label` 600, fonte do sistema | real | código. **Correção ao PRD:** a medida lida é **11**, não 10,5 (`get_design_context` de `20:1102`) |
| T-06 | — | Selecionado | sem pill; ícone e rótulo em Crail `#B5453D` | pill Crail com ícone e rótulo brancos | real | código. Figma: ícone e rótulo Crail `#B5453D` (2,24:1 sobre petro, reprova). **Decidido 16/11: `#EE8279`** (4,68:1), SemiBold 11, sem pílula, anúncio "selecionado". Hoje o `tokens.ts` tem branco provisório: **trocar para `#EE8279`** e remover o PROVISÓRIO. Nenhum item é navegável: provado só pelo teste do `TabBarItem` isolado |
| T-07 | — | Inativo | ícone e rótulo Tide `#B7B2AC` (5,76:1) | branco com opacidade 0,6 | real (token) | código |
| T-08 | — | Fundo | petro, sem borda | `surface.brand` | igual | — |
| T-09 | — | Estado desabilitado | **sem frame** (proposto T2 `83:844`); no Figma os 4 itens são navegáveis | os 4 itens `unavailable`, opacidade 0,6, `disabled` | real (estado sem frame) | **T2 aprovado em 16/11:** 4 itens a **50%** de opacidade, nenhum selecionado, anunciados como indisponíveis (legenda do `83:844`, li a captura hoje). O código usa `opacity.unavailable` = 0,6: **trocar para 0,5** |
| T-10 | — | Estado com foco | **sem frame** (proposto T1 `83:817`) | anel duplo petro + halo branco (`use-focus-ring.ts`); **a aparência sobre a barra petro não foi vista nesta rodada** (a borda petro sobre petro não se distingue; só o halo branco apareceria) | real (estado sem frame) | **T1 aprovado em 16/11:** anel **branco** de 2 px com respiro de 2 px no item (legenda de `83:817`: 12,12:1 sobre petro). O código desenha anel petro + halo branco, que some sobre a barra petro: **trocar para anel branco** (token `focus.ringOnBrand`, ainda inexistente). O frame T1 está desenhado com o item em Crail: religar à variável `#EE8279` (bloqueado). Foco real em aparelho segue em US-MENU-06 |
| T-11 | — | Tela inicial pós-login | **não há frame** de "pós-login" sem módulo | Perfil | real | **Aberta (16/11):** Início só vale depois de a pessoa aprovar o frame proposto. O frame **não foi criado** (Figma inacessível nesta sessão); a especificação em texto está em `F41-valores-fpdb8.md` §13. Nenhuma linha de Início conta como paridade até lá |

## 4. Diferenças de token (US-PAR-07), Figma como fonte

Variáveis lidas por `get_variable_defs` em `10:895` (nomes automáticos; papel inferido por mim). Comparação com `apps/mobile/src/theme/tokens.ts` na `main`.

| Papel | Figma (valor) | `tokens.ts` hoje | Situação |
|---|---|---|---|
| Marca escura / texto primário | `#1E3A3F` (`color/cyan/18`) | `petro900` `#1E3A3F` | igual |
| Ação primária / Crail | `#B5453D` (`color/red/47`) | `primary600` | igual |
| Fundo de tela | Pampas `#F7F5F2` | **ausente** (`surface.default` é branco) | divergência real |
| Texto secundário | Flint `#6E6A66` | `slate700` `#334155` (azulado) | divergência real |
| Placeholder | Dawn `#A8A39D` | **ausente** | real e **reprova AA** (C-03) |
| Borda de campo em repouso / divisor | Westar `#E2DEDA` | `slate500` `#64748B` | real e **reprova AA como borda de controle** (C-22) |
| Aba inativa | Tide `#B7B2AC` | branco a 60% | real |
| Avatar | Spectra `#33575D` | **ausente** | real |
| Caixa de erro: fundo, borda, texto | Pot Pourri `#F6E7E5`, Rose Fog `#E2B5B0`, El Salva `#923631` | **ausentes** (`text.error` = Crail) | real |
| Botão de ícone no cabeçalho | branco 12% | **ausente** | real |
| Scrim | petro 55% | `rgba(0,0,0,.5)` | real |
| Espaçamentos | 4, 6, 9, 10, 12, 14, 16 | 4, 8, 16, 24, 32 | real (faltam 6, 12, 14) |
| Raios | 8 (campo, botão, cartão), 10 (diálogo), 42 (avatar), 999 (selo) | 8, 12, 16, 999 | real |
| Medidas | campo 46, botão 50, cabeçalho 56, tab bar 62, avatar 84, escudo 84 × 96, ícone 18 e 22, botão de ícone 36 | `minTouchTarget` 48, ícone de aba 22 | real (P-04) |
| Fontes | Barlow Condensed (títulos), Inter (corpo) | fonte do sistema | real; **P-05** |
| Sombras | cartão 0 1 1 `rgba(30,58,63,.06)`; diálogo 0 12 16 `rgba(0,0,0,.25)` | nenhuma | real (P-08 do ADR sobre Android) |

`inlineAlertMinHeight` (citado no pedido) **não existe** na `main`: era da branch `feat/f41-paridade-correcoes` e a medida 44 não vale mais (L-11). `placeholder`, `divider`, `errorTint` e `ringOnBrand` também não existem na `main` (ADR-014, regra 14).

Nenhuma variável do Figma foi criada nem alterada, e `tokens.ts` não foi tocado. Token novo ou alterado só entra **depois da aprovação**, nos dois lados na mesma entrega.

## 5. Contraste AA (US-PAR-15), com as cores do arquivo novo

Calculado com a fórmula WCAG 2.x (luminância relativa sRGB) em um script meu, rodado nesta sessão sobre os hex lidos no Figma. Botão de ícone 36 = branco a 12% sobre petro = `rgb(57,82,86)`. Alvo: texto 4,5:1; ícone e borda de controle 3:1.

| Par | Uso | Razão | Resultado |
|---|---|---|---|
| C-01 | marca petro sobre Pampas | 11,14:1 | passa |
| C-02 | Flint sobre Pampas (subtítulo e rótulos) | 4,93:1 | passa |
| **C-03** | **placeholder Dawn sobre branco** | **2,50:1** | **reprova** |
| C-04 | valor digitado petro sobre branco | 12,12:1 | passa |
| C-05 | branco sobre Crail (botão) | 5,41:1 | passa |
| C-06 | El Salva sobre Pot Pourri (erro) | 6,26:1 | passa |
| C-07 | branco sobre petro (cabeçalho, selo) | 12,12:1 | passa |
| C-08 | branco sobre Spectra (avatar) | 7,89:1 | passa |
| C-09 | petro sobre Pampas (nome) | 11,14:1 | passa |
| C-10 | Flint sobre branco (cartão, diálogo) | 5,36:1 | passa |
| C-11 | Crail sobre Pampas ("Sair da conta") | 4,97:1 | passa |
| C-12 | Tide sobre petro (aba inativa, texto e ícone) | 5,76:1 | passa |
| C-13 | branco sobre o botão de 36 (ícone de usuário e seta) | 8,35:1 | passa |
| C-14 | Crail 2 px sobre branco (foco e erro do campo) | 5,41:1 | passa |
| C-15 | petro sobre branco (borda do Cancelar) | 12,12:1 | passa |
| **C-18** | **rótulo da aba selecionada, Crail sobre petro (11 px)** | **2,24:1** | **reprova** |
| **C-19** | **ícone da aba selecionada, Crail sobre petro** | **2,24:1** | **reprova** |
| **C-22** | **borda do campo em repouso, Westar sobre branco / sobre Pampas** | **1,34:1 / 1,23:1** | **reprova** (é a única pista da caixa de um campo vazio) |
| C-23 | borda do botão "Sair da conta", Westar sobre Pampas | 1,23:1 | **a decidir (P-16)**: o texto Crail (C-11) já identifica o botão; sem 3:1 na borda, a borda é decorativa para o WCAG 1.4.11 |
| C-24 | borda do cartão, Westar sobre Pampas | 1,23:1 | decorativa, isenta |

**Mais um par que reprova do que o PRD listava:** a borda do campo em repouso (C-22). O erro de campo e a caixa de erro passam.

### Recálculo com os valores finais (16/11)

Script refeito e rodado hoje: `python3 -I docs/design/F41-contraste.py` (saída 0). Os pares reprovados acima (C-03, C-18, C-19, C-22) passam com as cores aprovadas: **placeholder Flint 5,36:1 sobre branco; borda de campo `#8C8780` 3,56:1 sobre branco e 3,28:1 sobre Pampas; aba selecionada `#EE8279` 4,68:1 sobre petro (texto de 11 px e ícone); texto "Sair da conta" Crail 4,97:1 sobre Pampas.** C-23 e C-24 (bordas Westar de 1,23:1 no botão "Sair da conta" e no cartão) são **decorativas** pelo WCAG 1.4.11, porque o botão tem texto a 4,97:1 e o cartão se lê pelo conteúdo. Os itens desabilitados da tab bar (Tide a 50% sobre petro, 2,58:1) são **isentos** (componente inativo). A tabela completa, com a razão de cada par, está em `F41-valores-fpdb8.md` §9 e na saída do script.

### Propostas de cor (quadro C1 `85:744`; **aprovadas em 16/11**, entram nos dois lados juntos)

| Item | Atual | Proposta | Razão da proposta | Observação |
|---|---|---|---|---|
| Placeholder | `#A8A39D` (2,50:1) | `#756F6A` | 4,95:1 sobre branco; 4,55:1 sobre Pampas | alternativa sem token novo: Flint `#6E6A66` (5,36:1), a do ADR-014; fica mais perto do rótulo |
| Borda de campo em repouso | `#E2DEDA` (1,34:1) | `#8C8780` | 3,56:1 sobre branco; 3,28:1 sobre Pampas | é o Natural Gray do ADR-014 |
| Aba selecionada (ícone e rótulo) | `#B5453D` (2,24:1) | `#EE8279` | 4,68:1 sobre petro | o ADR-014 deixou a cor para a pessoa; coral claro da mesma matiz |

Candidatas descartadas, com a razão calculada: `#EB7F76` 4,52:1 (margem curta), `#E8776E` 4,21:1 (reprova no texto de 11 px). Coral `#EE8279` contra Tide é só 1,23:1: o item selecionado se distingue por matiz, peso (SemiBold) e anúncio "selecionado" do leitor de tela, não só por cor — **P-12** pergunta se isso basta ou se entra uma marca.

## 6. Perguntas para a pessoa (respondidas em 16/11)

**Respostas que o pedido de revisão cita (as únicas que registro):** P-09 e-mail sob o rótulo "Usuário"; P-10 Ionicons como exceção; P-12 aba selecionada em cor + SemiBold + anúncio, sem marca extra (os critérios 3 e 7 fixam `#EE8279`, SemiBold e o anúncio "selecionado"); P-13 L3 como caixa no Login e P2 em tela cheia (L1 a L4, P1 e P2 aprovados); P-14 iniciais ignoram da/de/do/dos/das; P-15 "Funcionário" no estilo do selo ADMIN; P-16 bordas B5 e B6 decorativas; "Mostrar senha" mantido; versão real 0.1.0. **P-11 (o contorno de 2 px é o foco?) não aparece no pedido: sem resposta registrada por mim.** O texto das respostas P-01 a P-16 não está no material que recebi.

Numeradas para não colidir com P-01 a P-07 do PRD.

| # | Pergunta | Bloqueia | Recomendação |
|---|---|---|---|
| P-09 | A linha "Usuário" do Perfil mostra "joao.silva", mas a API só devolve e-mail. Mostrar o e-mail sob o rótulo "Usuário"? | P-07 desta planilha | Sim: é o identificador que a pessoa digita no login |
| P-10 | Ícones da tab bar e do cabeçalho: SVG do Figma (exige `react-native-svg`, dependência nova) ou Ionicons parecidos (diferença visível)? Origem e licença da biblioteca de ícones do arquivo: **não consegui confirmar pelo MCP** | T-04, L-10, P-14 | SVG exportado do Figma, se a licença permitir; senão decisão registrada de usar Ionicons como exceção |
| P-11 | O contorno de 2 px Crail no campo Usuário de `10:895` é o foco? | L-08 | Sim (leitura minha); confirmar |
| P-12 | Aba selecionada: basta cor + peso + leitor de tela, ou acrescentar uma marca? | C-18/C-19 | Manter o Figma (cor + peso) |
| P-13 | O padrão "Sem conexão" do `1c` (ícone, título, mensagem, botão) vale também no Login e no Perfil, no lugar do popup `ErrorRetryModal`? | L-18, P-13 | Sim para tela cheia (Perfil, P2); caixa no formulário no Login (L3) |
| P-14 | Regra das iniciais do avatar (primeira letra do primeiro e do último nome)? | P-02 | Sim |
| P-15 | Selo e texto para o perfil FUNCIONARIO ("Funcionário")? Não existe frame | P-08 | Mesmo estilo do ADMIN; aprovar texto |
| P-16 | A borda do botão "Sair da conta" (1,23:1) é decorativa? | C-23 | Sim, o texto Crail identifica o botão |

As perguntas P-01 a P-07 do PRD seguem como estão (P-04 e P-06 têm recomendação minha acima: seguir 46/50/62 com `hitSlop`, manter "Mostrar").

## 7. Registros pedidos na revisão

**Decisões de 16/11 com o lado corrigido (critérios 5 e 6):**

| Decisão | Lado corrigido | Linhas |
|---|---|---|
| "Mostrar senha" mantido | código mantido; texto visível "Mostrar"/"Ocultar" segue L1 | L-09 |
| Ionicons como exceção (sem `react-native-svg`, sem licença da biblioteca) | código mantido; exceção registrada | T-04, P-01 (seta), P-14 |
| Versão real 0.1.0 (o frame mostra "1.0.0" como dado de exemplo) | código | P-06 |
| E-mail sob o rótulo "Usuário" | código | P-07 |
| Iniciais ignoram da/de/do/dos/das | código (ORLA confere) | P-02 |
| "Funcionário" no estilo do selo ADMIN | código | P-08 |
| Placeholder Flint; borda `#8C8780`; aba `#EE8279` | `tokens.ts` e variáveis do FPdB8 na mesma entrega (Figma bloqueado nesta sessão) | L-06, L-07, T-06 |
| Glifo nativo é plataforma; sombra é real; `elevation` no Android aceita e registrada | sem correção; Android sem cobertura | D-04 (diálogo), P-05 (cartão) |
| L1 a L4, P1, P2 (botões ajustados), T1, T2 aprovados | código se ajusta; frame P2 precisa do ajuste (bloqueado) | L-16 a L-19, P-12, P-13, T-09, T-10 |
| Início só depois da aprovação do frame proposto | frame não criado; especificação em `F41-valores-fpdb8.md` §13 | T-11 |

**Decisão geral de 16/11 (US-PAR-06), registrada:** o Figma manda; o código se ajusta, inclusive N-01 (L-05), N-10 (P-06) e N-12 (T-01, P-10, P-14). Divergência de texto se corrige na chave de i18n. Lado corrigido em todas as linhas reais acima: **código**, salvo as que dependem de aprovação (frames propostos, cores AA, P-xx).

**Texto proposto para a exceção temporária do briefing** (o briefing é da pessoa/REGENTE; **não o editei**): *"A exceção 'redesenho aguardando código' deixa de valer para Login, Perfil, diálogo de logout e tab bar. A F41 leva essas quatro telas direto ao Figma `FPdB8RymAnN81pbKfizdzE` (página `20:2132`), que passa a ser a referência de paridade delas por decisão de 16/11/2026. Não há frame 'aguardando código' para essas telas, e a linha de base 'antes' é a `main` em `348a43e`. A F41 passa a ser a linha de base das telas seguintes."*

**Texto proposto para a premissa 7 e o "fora do escopo" do briefing da F41:** *"A feature altera aparência, estrutura e, por decisão da pessoa em 16/11, três comportamentos: rótulo 'Usuário' (o campo segue enviando e-mail), a linha 'Versão do app' lida da configuração do Expo e o acesso ao Perfil por botão no cabeçalho, com a tab bar de 4 itens. Não altera endpoint nem contrato: `POST /api/v1/auth/login` é o único e leva o e-mail."* O PRD de BUSSOLA já traz o mesmo texto em §3.

**O arquivo FPdB8 é "a v2 da F39"?** Não. A F39 não editou nenhum nó; ele é a inspiração externa dela e vira referência da F41 por decisão da pessoa. `20:2131` é a **página** "01 — Wireframes" e `20:968` é um **nó de texto** (legenda), verificado por `get_metadata`.

**Novidade no arquivo:** a seção `62:1529` "Complementos de fluxo — 9 telas de alta fidelidade" apareceu depois da leitura de 14/11. Não é Login, Perfil, logout nem tab bar e **não foi tocada**; ORLA e CRIVO não devem usá-la como referência da F41.

## 8. Testes de componente a ajustar depois das correções (US-PAR-09)

Os arquivos `alert-icon.test` (não existe na `main`: o `AlertIcon` ainda não entrou), `inline-alert.test`, `screen-header.test`, `tab-bar-item.test`, `menu-tab-bar.test`, `menu-shell.test`, `(menu)/_layout.test`, `menu-routing.test`, `perfil.test`, `login.test`, `confirm-dialog.test`, `text-field.test` e `button.test` seguem o desenho antigo. Não rodei a suíte nesta rodada (não alterei código).

## 9. Verificado × não verificado

**Verificado (lido ou executado nesta sessão):** `whoami` e leituras do Figma citadas; ids e medidas por `get_metadata`; valores de cor, fonte e tamanho por `get_design_context` e `get_variable_defs`; capturas dos frames de referência e dos propostos conferidas a olho; contrastes por script; código do app lido em `348a43e` (arquivos citados na §3).

**Não verificado:** qualquer medida do app em pixel (sem captura); qualquer par lado a lado; foco e leitor de tela em aparelho (US-MENU-06, "não alcançável sem aparelho"); a origem da biblioteca de ícones; a regra das iniciais; o estado do `use_figma` sem a instrução `figma-use` (conferi por captura); a quebra de linha dos textos propostos em fonte do sistema.

**Sem cobertura:** composição lado a lado, medida no app, protocolo de captura (tarefas 3, 5, 7, 9, 11, 19 e 20), tokens e variáveis (tarefa 17) e teste de componente (tarefa 18).

## 10. Resultado da correção de código (ORLA, 2026-11-16)

> **Nota de 16/11 (ESQUADRO):** as capturas `par-*.png` citadas aqui deixam de ser prova de paridade pela decisão de dispensar capturas e pares lado a lado. A prova é `F41-valores-fpdb8.md`. Os arquivos continuam no ramo; remover `docs/design/f41-capturas` só se a REGENTE confirmar antes do merge, e eu não removi nada.

Branch `feat/f41-paridade-fpdb8-codigo`, base `348a43e`. Capturas do app em `docs/design/f41-capturas/par-*.png` (Figma à esquerda, app à direita), tiradas no commit `ef54855` (o único commit seguinte, `README`, não toca código). **Aparelho: simulador iPhone 17, iOS 27.0, Expo Go, retrato, barra de status em 9:41, escala de fonte padrão.** Não é o aparelho físico da premissa 9 da feature: a pessoa não informou o aparelho (P-02), então é um desvio registrado. Android não foi verificado. As capturas são de uma rota temporária (apagada, nunca versionada) que monta as telas reais com sessão fictícia `joao.silva` e componentes reais com props fixas nos estados de erro, sem passar pela API: provam aparência, não fluxo.

Legenda: **corrigido** = código igual ao frame, visto na captura; **aberto** = divergência real que continua, com a causa.

### Login
| ID | Resultado | Observação |
|---|---|---|
| L-01, L-03, L-04, L-05, L-07, L-10, L-11, L-12, L-13, L-14, L-15, L-20 | corrigido | Pampas, título e subtítulo, rótulo "Usuário", campo 46 / raio 8, faixa de erro com círculo "!" sem altura fixa, mensagem do frame, as duas bordas de 2 px em erro, botão 50, margens 28/16/6/10/14, `StatusBar` escura no Login e clara nos cabeçalhos |
| L-02 | **aberto** | Escudo: bloqueado pela D2 (licença da imagem, ADR-014 regra 7b). Sem substituto improvisado. Na captura o bloco da marca sobe sem a imagem |
| L-06 | **aberto** | Texto e placeholders corrigidos. A cor Dawn reprova AA (C-03); está com Flint (5,36:1) até a pessoa aprovar o C1 |
| L-07 (borda) | **aberto** | Borda de repouso continua `slate500` (4,76:1) porque Westar reprova 3:1 (C-22); aguarda C1 |
| L-08 | corrigido, confirmar | Foco com borda de 2 px Crail, pela leitura do ESQUADRO de `10:895`. P-11 continua com a pessoa. Foco de teclado em aparelho segue em US-MENU-06 |
| L-09 | **aberto** | "Mostrar senha" mantido (P-06); não existe no frame |
| L-16, L-17, L-18, L-19 | **aberto** | Frames L1 a L4 propostos e não aprovados. Código: carregando, preenchido, popup de conexão e aviso de sessão expirada (este já com o desenho novo da faixa) |

### Perfil e cabeçalho
| ID | Resultado | Observação |
|---|---|---|
| P-01, P-03, P-04, P-05, P-06, P-07, P-08, P-09, P-10, P-11, P-14 | corrigido | Cabeçalho petro 56 com seta, nome, selo petro, cartão com Usuário / Perfil de acesso / Versão do app, "Sair da conta" em contorno no rodapé, Perfil fora da tab bar, botão de usuário 36 × 36 com nome acessível "Perfil". Espaçamento medido nas imagens compostas e ajustado (36 acima do avatar, 20 entre selo e cartão) |
| P-02 | corrigido, confirmar | Avatar com iniciais pela regra proposta na P-14 (primeira letra do primeiro e do último nome) |
| P-06 (dado) | linha de dado | O app mostra `0.1.0` (lido de `app.config.ts`); o frame mostra "1.0.0" (P-07 do PRD) |
| P-07 (dado) | linha de dado | O app mostra o e-mail sob "Usuário" (P-09); a captura usa `joao.silva` como e-mail fictício para igualar o dado do frame |
| P-08 | corrigido, confirmar | Texto de FUNCIONARIO ("Funcionário") é proposta minha (P-15) |
| P-12, P-13 | **aberto** | Frames P1 e P2 não aprovados. Código: reidratação de sessão com `StateView` e popup de erro, como antes |

### Diálogo de logout
D-01 a D-05 **corrigidos** (título Barlow 22, mensagem, Cancelar e Sair lado a lado, cartão raio 10 com margem 22, scrim petro 55%). A sombra do diálogo no Android é aproximada por `elevation` (P-08 do ADR-014, sem aparelho Android para ver).

### Tab bar
| ID | Resultado | Observação |
|---|---|---|
| T-01, T-02, T-03, T-05, T-07 | corrigido | 4 itens na ordem do Figma, rótulos "Ordens" e "Clientes", barra de 62, ícone 22, rótulo 11, inativo em Tide |
| T-04 | **aberto** | Ícones Ionicons (`document-text-outline`, `people-outline`, `cube-outline`, `card-outline`); desenho difere do arquivo. P-10 (SVG exige `react-native-svg`) |
| T-06 | **aberto** | Sem pílula. O selecionado usa branco (12,12:1) no lugar do Crail (2,24:1 reprova) até a pessoa aprovar o C1. **Não aparece no app em execução** (nenhum item é selecionável): é provado só pelo teste do componente `TabBarItem` |
| T-09, T-10 | **aberto** | Frames T1 e T2 não aprovados. Desabilitado = opacidade 0,6 (valor antigo); foco = anel petro + halo branco (valor antigo, **não visto sobre a barra petro**) |
| T-11 | implementado, confirmar | P-01 opção A: `/inicio` com cabeçalho, estado vazio e tab bar de 4 itens desabilitados |

### Tokens (US-PAR-07)
`tokens.ts` recebeu os valores do FPdB8 da §4. Nenhuma variável do Figma foi criada ou alterada. Valores que **não** entraram como estão por reprovarem AA: placeholder, borda de campo em repouso e aba selecionada. Ao aprovar o C1, `tokens.ts` (`text.placeholder`, `border.default`, `text.tabSelected`) e as variáveis do Figma mudam juntos.

### Achados de layout que a captura revelou (e foram corrigidos)
O botão ficava 8 px mais estreito que o campo (a moldura do anel de foco ocupava layout) e a tab bar saía cortada na base (o Yoga media a barra só pela moldura do anel; medido: raiz 874, conteúdo 832). Ambos corrigidos e cobertos por teste de componente.

### O que continua sem prova
Foco de teclado e leitor de tela em aparelho (US-MENU-06), tudo em Android, o aparelho físico do protocolo, o fluxo contra a API local (US-PAR-10; ver o relatório) e o estado selecionado da tab bar em execução.

## 11. Decisões da revisão humana de 16/11, 22:28 (BUSSOLA, PRD v4)

Registro de produto. O lado Figma é do ESQUADRO e o lado código é do ORLA; o texto completo e os critérios estão em `docs/product/F41-prd-paridade-figma-fpdb8.md` (v4). Esta seção **substitui o estado** das linhas T-06, T-09, T-10, T-11 e L-02 da §3 e da §10 acima, que foram escritas antes dessas decisões.

| Linha | Decisão da pessoa (16/11) | Lado | Estado depois desta seção |
|---|---|---|---|
| T-06 (aba selecionada) e P-01 | **não se aplica ainda**: as 4 abas estão desabilitadas e nenhuma navega, então não há rota para ficar selecionada | nenhum | **fechada** como "não se aplica ainda". Anotação "estado futuro" **gravada** em `20:1102` e `20:1340` pelo ESQUADRO em 17/11 (`F41-valores-fpdb8.md` §20.3). **Reabre quando uma aba for habilitada.** |
| T-11 (Início) | o Início **entra no aceite, por valor** (D-20 cai) | código e Figma já alinhados | frame I1 `89:971` aprovado; conferido por valor em `F41-valores-fpdb8.md` §17.3 e §19.2; deixa de ser "aberta" |
| L-02 (escudo 84 × 96) | **entra no aceite** (D-21 cai): o ESQUADRO exporta o nó e registra origem e licença; o ORLA programa em PNG 1x, 2x e 3x, com teste | código | **aberta**, dentro do aceite (US-PAR-19). **Exportado em 17/11** (PNG 1x, 2x, 3x e SVG em `docs/design/f41-ativos/escudo/`); origem lida, **licença sem registro** (S-2 do PRD sem resposta); código e teste são do ORLA. Ver `F41-valores-fpdb8.md` §20.4 |
| R-15 (L2, campo em carregamento cinza) | a favor do **código** | **Figma** | **lado Figma fechado em 17/11**: L2 `82:2024` com o fundo ligado a `color/surface/skeleton` (`#F1F5F9`, idêntico ao `tokens.ts`), PNG reexportado, e `F41-contraste.py` com o campo desabilitado isento (D2 e D3, saída 0). **Aberto, do ORLA:** o teste que trava a cor do campo desabilitado (`F41-valores-fpdb8.md` §20.1) |
| O-1 (ícone do círculo do P2) | exceção D-10: Ionicons mantidos | nenhum | **decidida** |
| O-2 (`10:936` sem "Mostrar") | a favor do **código** (o frame é antigo) | **Figma** | **fechada em 17/11, lado Figma**: `10:936` com "Mostrar" no campo Senha (nó `98:714`, Inter Medium 13, Flint), PNG reexportado (`F41-valores-fpdb8.md` §20.2) |
| O-3 (spinner nativo do P1) | só de plataforma (ADR-014:216) | nenhum | **decidida** |
| `f41-capturas` | os 6 `par-*.png` antigos enganam | repositório | **removidos** (histórico no git); referência = `final-2026-11-16` e `app-2026-11-16-orla`; `LEIA-ME.md` na pasta |

**Não verificado por mim:** nenhum nó do Figma (não tenho a ferramenta nesta sessão), nenhum teste executado, nenhuma imagem aberta.

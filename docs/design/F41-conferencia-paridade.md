# F41 · Conferência de paridade Figma × código — Login, Perfil, diálogo de saída e tab bar

Autor: ESQUADRO · Data: 2026-11-13 · Branch: `feat/f40-componentizacao-mobile` · Estado: **etapa 2 de 4 concluída (seção 12); feature não fechada: decisões da pessoa e divergências reais de código em aberto. Atenção: a seção 12.5 corrige afirmações das seções 8 e 11.6 sobre variáveis do Figma.**

## 1. O que foi lido e o que não foi

| Item | Situação |
|---|---|
| Acesso ao Figma (US-PAR-11) | **Sem bloqueio.** `whoami` respondeu: handle "Leticia Moraes", plano "Time Pessoal", `team::1274094162661077353`. Sessão `create_session` aberta no arquivo `DLqbSzzKRxiN2eyvXG73Lr`. |
| Link dos frames aprovados (dúvida 1) | Confirmado no repositório (`docs/design/figma.md`): o mesmo arquivo da operação. F25 = página `28:2`; F34 = página `39:2`. |
| Frames lidos | `get_metadata` das duas páginas; `get_design_context` de `29:79`, `29:56`, `29:35`, `33:49`, `33:14`, `39:3`; `get_screenshot` dos 12 frames abaixo. |
| Lado código | **Leitura estática** dos arquivos, não captura. Cada achado cita arquivo e linha. |
| Capturas do app no aparelho | **Não feitas.** Ver seção 6. |

Não consegui ler: a cor de preenchimento do avatar (`33:36`, vem como SVG), a cor do traço do botão Fechar (X) e a tipografia como variável (a coleção `OP-002 Tokens de cor` só tem cores; os tamanhos de fonte dos frames são valores soltos). Não li `33:2` e `39:31`/`39:58` por `get_design_context`, só por metadata e screenshot.

## 2. Capturas dos frames aprovados (lado Figma)

Pasta: `docs/design/f41-capturas/`, 360 px de largura (1x), 3,9 a 49 KB cada (total ≈ 245 KB). Local e limite por arquivo ainda dependem da dúvida 4; estão aqui provisoriamente, como o PRD recomenda.

| Estado | Frame | Arquivo |
|---|---|---|
| Login vazio (pós-logout) | `29:2` | `figma-login-vazio-29-2.png` |
| Login carregando | `29:20` | `figma-login-carregando-29-20.png` |
| Login falha de conexão | `29:35` | `figma-login-erro-rede-29-35.png` |
| Login credencial inválida + validação | `29:56` | `figma-login-erro-validacao-29-56.png` |
| Login preenchido (foco no Entrar) | `29:79` | `figma-login-preenchido-29-79.png` |
| Perfil carregando | `33:2` | `figma-perfil-carregando-33-2.png` |
| Perfil erro | `33:14` | `figma-perfil-erro-rede-33-14.png` |
| Perfil preenchido (foco no Sair) | `33:33` | `figma-perfil-preenchido-33-33.png` |
| Diálogo de saída | `33:49` | `figma-perfil-confirmar-saida-33-49.png` |
| Tab bar selecionado | `39:3` | `figma-tabbar-selecionado-39-3.png` |
| Tab bar padrão | `39:31` | `figma-tabbar-padrao-39-31.png` |
| Tab bar foco | `39:58` | `figma-tabbar-foco-39-58.png` |

Mapa dos estados pedidos: o frame "erro de validação" (`29:56`) traz o banner de credencial inválida **e** os erros de campo vazio no mesmo frame; "falha de conexão" é o `29:35`. Não existe frame de Login "erro de credencial" separado.

## 3. O que já está igual (verificado nos dois lados)

- Todos os hex de cor: petro `#1E3A3F`, primary `#B5453D`, slate-700/500/200/100, branco, scrim 50 %. `tokens.ts:9-45` = variáveis do Figma.
- Textos: "Mecânica São Jorge", "E-mail", "Senha", "Entrar", "Entrando...", "E-mail ou senha incorretos.", "Informe seu e-mail", "Informe sua senha", "Não foi possível conectar.", "Verifique sua conexão e tente novamente.", "Tentar novamente", "Perfil", "Sair", "Deseja realmente sair?", "Cancelar", "Não foi possível carregar.", rótulos da tab bar.
- Ordem da tab bar: Perfil, Clientes e Veículos, Catálogo, Ordens de Serviço, Financeiro (`menu-tab-bar.tsx:22-58`).
- Itens desabilitados: opacidade 0,6 e ícone em traço (`tokens.ts:91-95`, `tab-bar-item.tsx:61`).
- Anel de foco duplo (2 px petro + 2 px halo branco) em botão e campo (`use-focus-ring.ts`).
- Ordem Cancelar → Sair no diálogo; Sair em `primary`, Cancelar em contorno.

## 4. Lista de divergências

Classificação: **P** = só de plataforma (não conta); **R** = real. A evidência do lado Figma é o frame/nó citado; a do lado código é `arquivo:linha`.

### 4.1 Só de plataforma (não contam)
- P-1: fonte Inter nos frames × fonte do sistema no app (`tokens.ts` não define `fontFamily`).
- P-2: barra de status, ilha dinâmica e área segura inferior; altura do aparelho (800 px do frame × tela do aparelho).
- P-3: sombra do popup (`0 4 16 rgba(0,0,0,.25)`): aceitar `elevation`/`shadow*` de cada sistema.

### 4.2 Login (tela `app/login.tsx`)

| ID | Divergência real | Figma | Código |
|---|---|---|---|
| L-01 | Cabeçalho | Faixa petro 360×120, título 20 branco Bold à esquerda (`29:80`, `29:81`) | Sem faixa; título 24 petro centralizado sobre branco (`screen-header.tsx:22-31`, `login.tsx:31`) |
| L-02 | Subtítulo | "Entre com sua conta", 13 branco (`29:82`) | Não existe; falta chave i18n (`login.subtitulo`) |
| L-03 | Placeholders | "seu@email.com" e "Sua senha" (`29:2` e `29:56`) | `TextField` não aceita placeholder (`text-field.tsx:16-28`); faltam chaves |
| L-04 | Mostrar/ocultar senha | Ícone de olho em alvo 44×44 (`29:89`–`29:92`); olho aberto em `80:2` | Texto "Mostrar senha" 12 px (`inline-action-button.tsx:36`, `login.tsx:61-68`) |
| L-05 | Tipografia de campo | Rótulo 13 Medium; valor 15 | Rótulo 14/600; valor 16 (`tokens.ts:62-68`) |
| L-06 | Forma de campo e botão | Raio 8; borda 1,25 | Raio 12 (`radius.md`); borda 1 (`tokens.ts:55-60,87-89`) |
| L-07 | Credencial inválida | Faixa de fundo `rgba(181,69,61,.08)`, borda 1,25 error, ícone ⚠, texto 13 Medium à esquerda (`29:60`–`29:62`) | Texto vermelho centralizado, sem faixa nem ícone (`inline-alert.tsx:14-28`) |
| L-08 | Campo em erro | Borda 1,5 error em e-mail e senha (`29:64`, `29:68`) | Só a mensagem; borda continua `border/default` (`text-field.tsx:95-103`) |
| L-09 | Carregando | Botão "Entrando..." em cor cheia; campos com borda `border/skeleton` (`29:25`, `29:30`) | Botão com opacidade 0,5 (`button.tsx:108-110`): rótulo branco sobre primary a 50 % = **2,18:1**; borda do campo desabilitado segue `border/default` |
| L-10 | Popup de falha de conexão | Botão Fechar (X) 44×44 no canto; raio 12; padding 20; mensagem 13; fundo mostra campos desabilitados + "Entrando..." (`29:48`, `79:2`) | Sem X; raio 16; padding 24; mensagem 16; fundo é o formulário editável (`error-retry-modal.tsx:59-92`) |
| L-11 | Posição vertical | Conteúdo começa em y=150, abaixo do cabeçalho; campo→botão 24 px; entre campos 6 px | Conteúdo centralizado na vertical; 16 px entre campos (`screen-container.tsx:26-28`, `text-field.tsx:83-85`) |

### 4.3 Perfil (tela `app/(menu)/perfil.tsx`)

| ID | Divergência real | Figma | Código |
|---|---|---|---|
| P-01 | Cabeçalho | Faixa petro 360×96, título 20 branco (`33:34`, `33:35`) | Igual a L-01 |
| P-02 | Avatar | Círculo 64 com iniciais ("AB"), `33:36`, `33:37` | Não existe; precisa regra de iniciais (comportamento novo de apresentação) |
| P-03 | Rótulos | Nome 17 semi, e-mail 13, sem rótulos "Nome", "E-mail", "Perfil de acesso" (`33:38`, `33:39`) | Três `ReadOnlyField` com rótulo e valor 16 (`perfil.tsx:40-44`) |
| P-04 | Selo do perfil | Pílula petro 72×22, texto 11 branco (`33:40`, `33:41`) | Pílula slate-100 com borda e texto petro 14/600 (`access-profile-badge.tsx:23-38`) |
| P-05 | Divisor | Linha sob o bloco de dados, y=212 (`33:42`) | Não existe |
| P-06 | Posição do Sair | Fixo na parte de baixo (y=600) | Logo após o conteúdo (`perfil.tsx:46-50`) |
| P-07 | Carregando | Perfil com esqueleto (avatar, nome, e-mail, selo) e "Sair" esmaecido (`33:2`) | Não existe: o carregamento é um spinner em tela em branco na rota de entrada (`index.tsx:32-34`, `state-view.tsx:48-66`), sem cabeçalho |
| P-08 | Erro | Popup sobre o Perfil esmaecido, com X e só "Tentar novamente"; "Sair" fora da área esmaecida (`33:14`) | Popup sobre tela em branco, com "Tentar novamente" **e** "Entrar novamente", sem X (`index.tsx:36-45`) |

### 4.4 Diálogo de saída

| ID | Divergência real | Figma | Código |
|---|---|---|---|
| D-01 | Mensagem de apoio | "Você precisará entrar novamente com seu e-mail e senha." (`33:64`) | Não existe; falta chave `perfil.dialogoLogout.mensagem` (`confirm-dialog.tsx:34`) |
| D-02 | Botão Fechar (X) | 44×44 no canto (`79:5`) | Não existe |
| D-03 | Forma e tipografia | Título 17 semi; raio 12; contorno do Cancelar 1,5; 4 px entre os botões | Título 14/600; raio 16; contorno 1; 8 px (`confirm-dialog.tsx:47-75`) |

### 4.5 Tab bar

| ID | Divergência real | Figma | Código |
|---|---|---|---|
| T-01 | Pílula do selecionado | 56×32 só atrás do ícone; rótulo fora (`39:4`) | Pílula envolve ícone e rótulo (`tab-bar-item.tsx:56,99-101`) |
| T-02 | **Foco** | Anel branco 2 px, 68×60, sobre fundo petro (`39:64`) | Anel duplo petro + halo; ao focar o `View` da célula ganha fundo **branco** (`use-focus-ring.ts:25-30`, `tab-bar-item.tsx:45`). Ícone e rótulo são brancos: branco sobre branco = **1:1**. Anel petro sobre a barra petro some. Achado de leitura; falta confirmar em aparelho |
| T-03 | Ícones | Formas geométricas de referência: pessoa, carro, caixa, prancheta, barras (`39:7`–`39:29`) | Ionicons `person`, `car-outline`, `list-outline`, `construct-outline`, `cash-outline` (`menu-tab-bar.tsx:22-58`). O `figma.md` já diz que o desenho do Figma é placeholder |
| T-04 | Tipografia do rótulo | 10 px; Semi Bold só no selecionado, Regular nos demais | 12 px e 600 em todos (`tab-bar-item.tsx:105-111`) |
| T-05 | Altura | Célula 72×64 + 20 de área segura | `minHeight` 48 + inset (`tab-bar-item.tsx:84-90`) |
| T-06 | Estado "Padrão" (Perfil não selecionado, `39:31`) | Existe no Figma | `MenuTabBar` fixa `selected: true` (`menu-tab-bar.tsx:28`); `TabBarItem` suporta `selected=false`, mas o app não chega a esse estado na Sprint 01 |

## 5. Contraste AA (US-PAR-15)

Calculado com a fórmula de luminância relativa do WCAG, script Python rodado nesta sessão (`python3 -I`, não versionado; as razões abaixo são a saída real):

| Par | Razão | Mínimo | Resultado |
|---|---|---|---|
| petro sobre branco (texto) | 12,12:1 | 4,5 | passa |
| slate-700 sobre branco | 10,35:1 | 4,5 | passa |
| slate-700 sobre slate-100 (campo desabilitado) | 9,45:1 | 4,5 | passa |
| branco sobre petro (cabeçalho, tab bar) | 12,12:1 | 4,5 | passa |
| branco sobre primary-600 (botão, pílula) | 5,41:1 | 4,5 | passa |
| primary-600 sobre branco (erro de campo) | 5,41:1 | 4,5 | passa |
| primary-600 sobre faixa `rgba(181,69,61,.08)` (Figma `29:60`) | 4,83:1 | 4,5 | passa |
| petro sobre slate-100 (selo do código) | 11,07:1 | 4,5 | passa |
| branco 60 % sobre petro (rótulo e ícone desabilitados) | 5,47:1 | 4,5 / 3 | passa |
| slate-500 sobre branco (borda de campo) | 4,76:1 | 3 | passa |
| slate-500 sobre slate-100 (borda do selo do código) | 4,34:1 | 3 | passa |
| anel petro sobre branco | 12,12:1 | 3 | passa |
| anel branco sobre petro (tab bar, Figma) | 12,12:1 | 3 | passa |
| halo branco sobre primary-600 | 5,41:1 | 3 | passa |
| anel petro sobre primary-600, sem halo | 2,24:1 | 3 | abaixo; já compensado pelo halo branco |
| rótulo branco sobre botão primary a 50 % (código em "Entrando...") | 2,18:1 | 4,5 | **abaixo**, vira L-09 |
| borda slate-200 sobre branco (campo desabilitado) | 1,23:1 | 3 | abaixo; controle desabilitado é isento no WCAG, e o Figma usa o mesmo token |
| branco sobre branco (foco da tab bar no código) | 1:1 | 3 / 4,5 | **abaixo**, vira T-02 |

Não calculei o contraste do traço do botão Fechar (X) nem do avatar: cores não lidas.

## 6. O que ficou bloqueado e por quê

1. **Capturas do app (tarefas 7, 9, 11, 19) e protocolo de aparelho (tarefas 3 e 5).** O simulador iPhone 17 (iOS 27.0) está ligado, mas na tela inicial, sem o app. Não há Maestro nem idb (`command -v` achou só `cliclick`), e a F40 já provou que `cliclick` não entrega toque nem digitação de forma confiável (`F40-evidencia-paridade-visual.md`). A premissa 9 pede o aparelho físico, e a dúvida 2 (modelo, sistema, resolução, Expo Go ou build) segue sem resposta. Não subi Metro nem API: sem como tocar e digitar, só o Login vazio seria capturável, e isso não fecha US-PAR-02/03/04.
2. **Dúvida 4** (onde ficam as capturas finais e o limite por arquivo).
3. **Divergências do lado código não foram confirmadas por captura.** São leitura de código. A exceção é T-02, que é a de maior risco e precisa de confirmação em aparelho.

## 7. Decisões que dependem da pessoa (tarefa 14)

Padrão para as demais divergências (L-01 a L-11, P-01 a P-06, D-01, D-03, T-01, T-04, T-05): **o código se ajusta ao Figma** (premissa 1). Pedem decisão:

| # | Pergunta | Recomendação |
|---|---|---|
| 1 | O botão Fechar (X) de L-10, P-08 e D-02 entra no código? É interação nova (fechar sem repetir nem sair), em conflito com "nada de mudança de comportamento". | Entrar, com chave i18n `…fechar` e o foco voltando ao controle de origem, como a legenda do Figma descreve. |
| 2 | P-03: tirar os rótulos "Nome", "E-mail" e "Perfil de acesso" como no Figma? | Seguir o Figma na vista, mas manter o nome acessível completo ("Nome: Ana Beatriz Souza") para o leitor de tela. |
| 3 | T-03: Ionicons são o ícone definitivo? | Sim, e atualizar o Figma na mesma entrega (premissa 2), pois o desenho atual é placeholder. |
| 4 | T-06: o estado "Padrão" da tab bar precisa existir no app? | Registrar como "não se aplica na Sprint 01", com `TabBarItem` já cobrindo `selected=false` em teste. |
| 5 | P-07 e P-08: a decisão da F30 foi não ter carregamento próprio no Perfil. O código passa a desenhar o esqueleto do Perfil na rota de entrada? | Sim, só visual: mesmo gatilho, mesma tela, esqueleto no lugar do spinner. "Entrar novamente" do popup fica como está até decidir. |
| 6 | Dúvida 5: a F39 (ADR-014, "Proposto") altera estes frames? `figma.md` registra que nenhum nó foi alterado na F39. | Tratar os frames atuais de `28:2` e `39:2` como referência até a F39 ser aceita. |
| 7 | Dúvidas 2 e 4 (aparelho e local das capturas). | Bloqueiam as capturas do app. |

## 8. Tokens (US-PAR-07)

Corrigir L-05, L-06, T-04 e P-03 exige tamanhos de fonte que não existem em `typography` (13, 15, 17, 11, 10) e a borda 1,25/1,5. No Figma, a coleção só tem cores. Se o código seguir o Figma, esses valores entram em `tokens.ts` **e** como variáveis numéricas na coleção `VariableCollectionId:28:3` na mesma entrega. Nenhum token foi alterado nesta etapa.

## 9. Pendências que não mudam

- US-MENU-06 (foco de teclado e leitor de tela em aparelho) segue onde está.
- Ordem das fases: a F40 já refatorou `TabBarItem` e `MenuShell` antes desta conferência, então o "antes" da F40 não vira linha de base de captura. A linha de base passa a ser o frame aprovado do Figma mais as capturas do app a serem feitas depois das correções.

## 10. README principal

README sem mudança: esta etapa só registra documentação e capturas, sem alterar instalação, execução, teste, configuração nem funcionalidade.

## 11. Rodada do ORLA (2026-11-13): correções de código e capturas do app

Autor: ORLA. Estado: **correções feitas e capturadas; feature NÃO fechada** (Figma bloqueado, decisões da pessoa em aberto, estados sem captura).

### 11.1 Figma nesta sessão (US-PAR-11)

`mcp__figma-remote__create_session` e `mcp__figma-remote__whoami` voltaram, ambos: `Claude requested permissions to use … but you haven't granted it yet.` Nenhum nó e nenhuma variável do Figma foi lido ou alterado nesta rodada. O lado Figma é o das 12 capturas e da leitura do ESQUADRO (seção 2). Por isso a feature fica aguardando.

### 11.2 Protocolo de captura realmente usado (desvio da premissa 9)

| Item | Valor |
|---|---|
| Aparelho | **Simulador** iPhone 17, iOS 27.0, 1206×2622 (3x, 402×874 pt); **não** o aparelho físico da premissa 9 (dúvida 2 sem resposta) |
| Mac | macOS 27.0.1 |
| Modo de execução | Expo Go 54, Metro em modo dev na porta 8082 (CI=1, sem recarga), `EXPO_PUBLIC_API_BASE_URL=http://localhost:8080` |
| Tema / escala de fonte / orientação | Claro (padrão) / padrão / retrato |
| Barra de status | `simctl status_bar override` 9:41, bateria cheia, sinal cheio (sem notificação, sem dado pessoal) |
| Dados | Usuário fictício `ana.souza@exemplo-ficticio.com.br`, senha fictícia, MySQL descartável em contêiner local; contêiner removido ao fim |
| Redução | 402 px de largura (1x), 35 a 59 KB por arquivo |

### 11.3 O que as capturas do app provam e o que não provam

Arquivos `docs/design/f41-capturas/app-*.png` (7). **Só `app-login-vazio.png` é a rota real `app/login.tsx`** (API real no ar, Login sem sessão). As outras 6 vêm de uma rota temporária de captura, **apagada e não versionada**, que compõe os mesmos componentes reais (`ScreenContainer`, `ScreenHeader`, `TextField`, `IconButton`, `Button`, `InlineAlert`, `StateView`, `ProfileSummary`, `ConfirmDialog`, `MenuShell`) com props fixas, aberta por deep link. Elas provam a **aparência** dos componentes, não o fluxo contra a API real: não foi digitado nem tocado nada.

- Toque e digitação seguem impossíveis: `cliclick c:` + `t:` não mudou o app (conferido visualmente, não só por hash); `osascript` não enxerga a janela do Simulator (`Não é possível obter window 1`) e `screencapture` falha (`could not create image from display`).
- Lição: a primeira leva tinha 7 hashes diferentes e todas eram a tela "Unmatched Route" (Expo Go com bundle antigo). Hash distinto não prova estado distinto; cada foto foi aberta e conferida a olho.
- **Sem captura do app:** Perfil carregando e Perfil erro (não existem no código, ver 11.5), foco real de teclado/leitor (US-MENU-06), tab bar com foco (o foco não pode ser forçado de fora do componente) e estado "Padrão" da tab bar.
- A conferência lado a lado foi feita por mim olhando os pares; **não há diff automático nem montagem lado a lado em um arquivo**.

### 11.4 Divergências corrigidas no código (o código se ajusta ao Figma, premissa 1)

Commits `a2b809f`, `e01f9bb`, `ef14ede`, `6a09001`, `bc7e4ce`, `892b35c`. Suíte: 152 testes verdes (eram 119), `tsc` e `eslint` limpos.

| ID | Resultado | Evidência |
|---|---|---|
| L-01, L-02 | Faixa petro com título à esquerda e subtítulo "Entre com sua conta" (chave `login.subtitulo`) | `app-login-vazio.png` |
| L-03 | Placeholders "seu@email.com" e "Sua senha" (chaves i18n) | `app-login-vazio.png` |
| L-04 | Olho em alvo 48×48 (Ionicons), nome acessível "Mostrar/Ocultar senha" mantido; olho cortado quando oculta, como no frame | `app-login-*.png` |
| L-05, L-06 | Rótulo 13/500, valor 15, raio 8, borda 1,25 | idem |
| L-07 | Faixa de erro com fundo, borda, ⚠ e texto à esquerda | `app-login-erro-validacao.png` |
| L-08 | Borda 1,5 de erro no campo | idem |
| L-09 | "Entrando..." em cor cheia (era 2,18:1), campo desabilitado com borda `border/skeleton` | `app-login-carregando.png` |
| L-11 (parcial) | Conteúdo sob a faixa, 24 do campo ao botão, 6 entre campos | pares de Login |
| P-01 | Faixa petro no Perfil | `app-perfil-preenchido.png` |
| P-02 | Avatar com iniciais das duas primeiras palavras ("AB"), oculto do leitor | idem |
| P-03 | Rótulos "Nome", "E-mail", "Perfil de acesso" saem da vista (**por recomendação do ESQUADRO, decisão 2 ainda não confirmada**); o bloco tem um nome acessível único "Nome: …. E-mail: …. Perfil de acesso: …" | idem + `profile-summary.test.tsx` |
| P-04, P-05, P-06 | Selo petro com texto branco 11, divisor, botão Sair fixo no rodapé | idem |
| D-01, D-03 | Mensagem de apoio (chave `perfil.dialogoLogout.mensagem`), título 17, raio 12, contorno 1,5, 4 px entre botões | `app-perfil-confirmar-saida.png` |
| L-10 (parcial) | Raio 12, padding 20, mensagem 13 | `app-login-erro-rede.png` |
| T-01, T-04, T-05 | Pílula 56×32 só atrás do ícone, rótulo 10 (600 só no selecionado), célula 64 | `app-perfil-preenchido.png` |
| T-02 | Foco da tab bar: anel branco 2 px sem preenchimento (antes: fundo branco com ícone/rótulo brancos, 1:1). **Só por teste de componente; sem captura em aparelho** | `tab-bar-item.test.tsx` |
| **T-07 (nova)** | Achada só na captura: rótulos "Clientes e Veículos" e "Ordens de Serviço" eram cortados com reticências; o frame quebra em duas linhas. Corrigido (`numberOfLines={2}`) e ícones alinhados pelo topo | `app-perfil-preenchido.png` |

Também: `InlineActionButton` (texto) foi substituído por `IconButton` e removido; `ScreenContainer` perdeu `centered` e ganhou `header` e `footer`; o anel de foco passou a ter margem negativa para a borda visível do controle alinhar com o resto (os componentes deixam de ficar 4 px para dentro).

### 11.5 O que NÃO foi corrigido, e por quê

- **Decisões da pessoa pendentes** (seção 7): botão Fechar (X) em L-10, P-08 e D-02; carregando e erro do Perfil (P-07, P-08, incluindo o "Entrar novamente" que o Figma não tem); T-03 (Ionicons como ícone final); T-06 (estado "Padrão" como "não se aplica"); F39. Seguem como **divergência real em aberto**: US-PAR-08 não fecha.
- **L-10 resto:** o fundo do popup de rede no Figma mostra campos desabilitados e "Entrando..."; no código o estado `erroRede` deixa o formulário editável. Mudar isso é mudança de comportamento (US-PAR-10).
- **Quebra de linha do diálogo** ("e-/mail" no app, "com / seu e-mail" no Figma): diferença de fonte (Inter × fonte do sistema), classificada como só de plataforma (P-1).
- **Divisor do Perfil:** o Figma não permitiu ler a cor (MCP bloqueado); usei `border.divider = petro` a partir da captura. **Confirmar o nó `33:42`.**
- **Frames do Figma inconsistentes entre si:** em `29:20` (carregando) o segundo campo está 14 px mais abaixo que em `29:79`. Segui `29:79` para todos os estados. Para o ESQUADRO decidir qual é o certo.
- **Placeholder:** usei `slate-500` (4,76:1); no Figma o texto de "seu@email.com" parece mais escuro. Não confirmado.

### 11.6 Tokens (US-PAR-07): lado código feito, **lado Figma pendente**

Entraram em `tokens.ts`: tipografia `header` 20/700, `subtitle` 13/400, `labelSmall` 13/500, `field` 15/400, `heading` 17/600, `micro` 11/600, `tab` 10/400, `tabSelected` 10/600; borda `field` 1,25 e `emphasis` 1,5; espaço `field` 6 e `card` 20; cor `surface.errorTint` (rgba 181,69,61,0,08), `text.placeholder` (slate-500), `border.divider` (petro), `focus.ringOnBrand` (branco); `layout.tabItemHeight/tabPill*/avatarSize`; `iconSize.action`. Os valores vêm dos frames, mas **não existem como variáveis na coleção `28:3`**: a premissa 3 (nos dois lados ao mesmo tempo) está descumprida até o ESQUADRO criá-las com Figma acessível.

### 11.7 Contraste dos pares novos

Mesma fórmula da seção 5, sobre os hex dos tokens: pílula do selo (branco/petro) 12,12:1; ⚠ e texto de erro sobre a faixa 4,83:1; "Entrando..." em cor cheia 5,41:1 (era 2,18:1); anel branco da tab bar sobre petro 12,12:1; placeholder slate-500 sobre branco 4,76:1. Não recalculei com script nesta rodada: reaproveitei as razões do ESQUADRO para os mesmos pares.

### 11.8 Verificação executada

`npm test` 152 passed / 28 suites; `npm run typecheck` e `npm run lint` sem saída de erro. API real: login `200` com a senha fictícia e `401` "Credenciais inválidas" com a errada (curl), Flyway V1+V2 aplicadas num MySQL 8.4 novo. Backend não foi alterado.

### 11.9 README

README sem mudança: nenhuma instalação, comando, variável, porta ou funcionalidade mudou; só aparência de tela, testes e documentação.

## 12. Rodada do ESQUADRO (2026-11-13): recaptura no Figma e tabela de pares contra as capturas de `fbfca93`

Autor: ESQUADRO. Estado: **conferência feita nos estados que existem; feature NÃO fechada** (decisões da pessoa, estados sem captura e divergências reais de código em aberto).

### 12.1 Acesso ao Figma (US-PAR-11)

`mcp__figma-remote__whoami` respondeu: handle "Leticia Moraes", plano "Time Pessoal" (`team::1274094162661077353`). `create_session` no arquivo `DLqbSzzKRxiN2eyvXG73Lr` devolveu sessão. Sem bloqueio nesta sessão (a rodada do ORLA tinha sido negada; não é mais o caso).

Recapturei os 12 frames por `get_screenshot` e comparei com `docs/design/f41-capturas/figma-*.png`: **os 12 têm o mesmo tamanho em bytes** e o hash do primeiro é idêntico, ou seja, os frames não mudaram desde a leitura anterior. Depois disso troquei só duas capturas, `figma-tabbar-padrao-39-31.png` e `figma-tabbar-foco-39-58.png`, porque corrigi os frames (12.4).

### 12.2 Como medi (e o limite da medição)

Não há Pillow nem ImageMagick no ambiente. Escrevi um leitor de PNG mínimo (`zlib`, sem biblioteca externa) em Python, **fora do repositório** (scratchpad), que lista as transições de cor ao longo de uma coluna ou linha. Medi o Figma a 360 de largura e o app a 402 pt de largura (1x). Margem: ±1 pt. As medidas de altura do app **incluem a área da barra de status** (plataforma), então só comparo distâncias entre elementos de dentro da tela. Não há diff automático nem montagem lado a lado em um arquivo: a comparação de cada par foi feita abrindo as duas imagens.

### 12.3 Pares e estados (US-PAR-01, 02, 03)

| Tela / estado | Frame | Captura do app | Situação |
|---|---|---|---|
| Login vazio | `29:2` | `app-login-vazio.png` (rota real) | Par feito |
| Login carregando | `29:20` | `app-login-carregando.png` (rota temporária, só aparência) | Par feito; frame inconsistente (L-16) |
| Login credencial inválida + campos vazios | `29:56` | `app-login-erro-validacao.png` (temporária) | Par feito. Não existe frame só de credencial inválida |
| Login falha de conexão | `29:35` | `app-login-erro-rede.png` (temporária) | Par feito |
| Login preenchido (foco no Entrar) | `29:79` | `app-login-preenchido.png` (temporária) | Par feito **sem o anel de foco** (não dá para forçar foco de fora) |
| Perfil carregando | `33:2` | nenhuma | **Real**: estado não existe no código (P-07) |
| Perfil erro | `33:14` | nenhuma | **Real**: estado não existe no código (P-08) |
| Perfil preenchido (foco no Sair) | `33:33` | `app-perfil-preenchido.png` (temporária) | Par feito **sem foco**; o app mostra a tab bar, o frame não (P-10) |
| Diálogo de saída | `33:49` | `app-perfil-confirmar-saida.png` (temporária) | Par feito |
| Tab bar selecionado | `39:3` | faixa inferior de `app-perfil-preenchido.png` | Par feito |
| Tab bar padrão | `39:31` | nenhuma | "Não se aplica na Sprint 01" **se a decisão 4 for aceita**; senão, real (T-06) |
| Tab bar foco | `39:58` | nenhuma | **Sem captura**: foco só testado em componente |

Tab bar: nos dois lados a ordem é Perfil, Clientes e Veículos, Catálogo, Ordens de Serviço, Financeiro, e os quatro últimos aparecem esmaecidos, com ícone e rótulo. Verificado nas imagens.

### 12.4 Defeitos do próprio Figma achados nesta rodada

| ID | Defeito | Ação |
|---|---|---|
| **T-09** | Em `39:31` e `39:58` os ícones dos cinco itens estavam com `x` negativo (`-392`, `-812` etc.): coordenada absoluta da página em vez da relativa ao frame. A captura mostrava a tab bar **sem nenhum ícone**. | **Corrigido por mim, só no Figma** (`use_figma`): somei o `x` do frame aos 10 nós (`39:34`, `39:40`, `39:44`, `39:51`, `39:56`, `39:62`, `39:69`, `39:73`, `39:80`, `39:85`). Agora ficam em x = 28, 98, 171, 244, 316, iguais a `39:3`. Conferido por `get_screenshot` e capturas trocadas. |
| L-16 | `29:20` (carregando) tem "Senha", campo e botão **14 px mais abaixo** que `29:79` (rótulo y=238 contra 224; botão y=330 contra 316; confirmei no pixel). O formulário "pularia" ao entrar em carregando. | **Não alterei** (frame aprovado). Decisão 12. O código já segue `29:79`. |
| P-09 | O divisor `33:42` é `#000000` (medi o pixel), reaproveita o mesmo SVG das linhas de legenda (`5d1a6.svg`) e **não está ligado a nenhuma variável**. O código usa petro. | Decisão 9. |
| T-08 | Rótulo "Perfil" fica em y=44 no selecionado (`39:8`) e em y=38 no padrão (`39:35`); os outros quatro ficam em y=38. O código mantém todos alinhados. | Decisão 13. |

### 12.5 Correção de afirmações anteriores (verificado hoje)

1. **A coleção `28:3` não tem só cores.** `use_figma` (leitura) listou, além das 24 cores, as variáveis: cores `color/surface/errorTint` e `color/focus/ring-on-brand`; `font/size/{header,subtitle,labelSmall,field,heading,micro,tab}`; `font/weight/{header,subtitle,labelSmall,field,heading,micro,tab,tabSelected}`; `border/width/{field,emphasis}`; `space/{field,card}`; `size/tab/{itemHeight,pillWidth,pillHeight}`; `size/avatar`; `size/icon/action`. Os valores batem com `tokens.ts` (20, 13, 13, 15, 17, 11, 10; 1,25 e 1,5; 6 e 20; 64, 56, 32, 64, 22). **Não sei quem as criou nem quando**: os documentos da F40, da F41 (§8, §11.6) e do BUSSOLA diziam que não existiam. A premissa 3 está cumprida para esses tokens.
2. **Faltam no Figma duas variáveis de cor que existem em `tokens.ts`:** `color/text/placeholder` e `color/border/divider`. Não as criei: o próprio Figma usa `text/secondary` no placeholder e `#000000` sem variável no divisor (decisões 8 e 9). Criar agora fixaria um valor que a decisão pode inverter.
3. **Divisor do Perfil (`33:42`)**: a cor que o ORLA pediu para confirmar é `#000000`. O código usa petro (`border.divider`).
4. **Avatar**: preenchimento `#1E3A3F` (petro), iniciais brancas. Igual ao código.
5. **Botão Fechar (X)**: traço `#334155` (slate-700), 10,35:1 sobre branco.

### 12.6 Divergências novas (somam-se às da seção 4)

Padrão da premissa 1: **o código se ajusta ao Figma**. As marcadas "default" não precisam de decisão; o ORLA corrige.

| ID | Real? | Figma | Código (medido ou lido) | Caminho |
|---|---|---|---|---|
| L-12 | Real | Placeholder em `text/secondary` slate-700, 15 (`29:8`, `29:11`): fica tão escuro quanto o valor | `text.placeholder` slate-500 (`tokens.ts:37`, `text-field.tsx:72`) | **Decisão 8** |
| L-13 | Real | Valor digitado em `text/secondary` slate-700 (`29:85`, `29:88`) | `color.text.primary` petro (`text-field.tsx:128`) | default |
| L-14 | Real | Campo com 48 de altura externa (`29:7`, `29:84`) | `minHeight` 48 + borda 1,25 dos dois lados = ~50 (medi 50 no app) | default |
| B-01 | Real | Botão de página (Entrar, Sair) **52** de altura (`29:16`, `33:43`); botão de diálogo e popup **44** (`33:65`, `33:67`) | `minHeight` 48 em todos (`button.tsx:92`; medi 48 no app) | página: default. Diálogo 44: **decisão 10** |
| L-15 | Real | Em carregando, o campo desabilitado **não tem olho** (`29:20`) | O olho continua (`app-login-carregando.png`) | default |
| D-04 | Real | Diálogo e popup com 296 de largura (`33:62`; margem 32) | `dialogMaxWidth` 320 (`tokens.ts:142`; medi 320 no app) | default |
| F-01 | Real, **sem captura** | Anel de foco: petro a 4–6 pt do controle, halo branco a 1–3, raio externo 14 (`29:95`, `29:96`) | Petro a 2–4 pt, halo a 0–2, raio 12 (`tokens.ts:109-116`) | default; confirmar em aparelho |
| P-10 | Real (lacuna do Figma) | Nenhum frame mostra o Perfil **com** a tab bar | O app mostra o Perfil sobre a tab bar (F33) | **Decisão 11** |
| L-11 (resto) | A confirmar | Do fim da faixa ao topo do primeiro campo: 50 (120→170) | 45 (137→182); a faixa do app inclui a área da barra de status | ORLA mede sem a área de status |

Posições que **batem** (medidas): entre campo de e-mail e rótulo de senha (26 nos dois lados), campo de senha ao botão (24 nos dois lados), margens laterais de 16, cores de fundo da faixa, do botão e da borda do campo.

### 12.7 Contraste dos pares novos (cálculo: mesma fórmula da seção 5, sobre os hex lidos)

| Par | Razão | Mínimo | Resultado |
|---|---|---|---|
| slate-700 sobre branco (placeholder do Figma, valor do Figma, traço do X) | 10,35:1 | 4,5 / 3 | passa |
| slate-500 sobre branco (placeholder do código) | 4,76:1 | 4,5 | passa, folga pequena |
| petro sobre branco (valor no código) | 12,12:1 | 4,5 | passa |
| iniciais brancas sobre avatar petro | 12,12:1 | 4,5 | passa |
| `#000000` sobre branco (divisor do Figma) | 21:1 | 3 (não exigido, é decorativo) | passa |

Não recalculei por script nesta rodada: reaproveitei a razão da seção 5 para os pares de mesmas cores. Nenhum par novo ficou abaixo de AA.

### 12.8 Decisões que dependem da pessoa (somam-se às 1 a 7 da seção 7)

| # | Pergunta | Minha recomendação |
|---|---|---|
| 8 | Placeholder: seguir o Figma (slate-700, igual ao valor) ou manter o código (slate-500)? | Manter o código e atualizar o Figma com a variável `color/text/placeholder`. Placeholder idêntico ao valor digitado confunde quem tem baixa visão ou dificuldade de leitura. |
| 9 | Divisor do Perfil: ligar o Figma a uma variável (`color/border/divider` = petro) ou trocar o código para preto? | Ligar o Figma à variável petro. Preto puro está fora da paleta. |
| 10 | Botões do diálogo e do popup com 44 de altura (Figma) ficam abaixo do `minTouchTarget` de 48 do projeto. Seguir o Figma? | Seguir o Figma: 44 passa o WCAG 2.2 AA (2.5.8, mínimo 24) e o mínimo do iOS (44). Só o Android recomenda 48. Registrar a exceção em `tokens.ts`. |
| 11 | Criar no Figma um frame "Perfil com tab bar" (composição de `33:33` e `39:3`)? | Sim: adiciona frame, não altera os aprovados. |
| 12 | `29:20` com 14 px de salto: corrigir o Figma para o mesmo layout de `29:79`? | Sim. |
| 13 | Rótulo "Perfil" da tab bar: ajustar o Figma para o rótulo não mudar de altura entre selecionado e padrão (como no código)? | Sim. |

### 12.9 O que esta rodada não fez

- **Capturas do app no aparelho físico, protocolo de aparelho, tarefas 3 e 5**: continuam bloqueados pela dúvida 2 (da pessoa). Não toquei no simulador.
- **Capturas do app de Perfil carregando, Perfil erro, foco e estado "Padrão"**: não existem no código ou não são forçáveis. Ver 12.3.
- **Divergências do lado código (L-13, L-14, B-01 página, L-15, D-04, F-01)**: são do ORLA, não alterei código.
- **Variáveis `color/text/placeholder` e `color/border/divider` e frame de composição do Perfil**: aguardam as decisões 8, 9 e 11.
- **Instrução `get_figma_skill` não lida**: a ferramenta não está disponível nesta sessão (não consta na minha lista), então **não li as skills `figma-use` e `figma-design-to-code` exigidas antes de `use_figma` e `get_design_context`**. Para limitar o risco, fiz uma leitura somente antes de escrever e uma única escrita pequena, conferida por captura.
- **US-PAR-08 não fecha**: há divergência real em aberto (esta seção e as seções 4 e 11.5).

### 12.10 README

README sem mudança: só documentação, capturas e edição de dois frames do Figma.

## 13. Rodada do ORLA (2026-11-13, 2ª): correções da tabela do ESQUADRO e recaptura do app

Autor: ORLA. Ramo: **`feat/f41-paridade-correcoes`**, criado a partir de `88c586c`. As rodadas anteriores (seções 11 e 12) ficaram no ramo `feat/f40-componentizacao-mobile`; este ramo só tem os commits abaixo. Estado: **correções do código feitas e capturadas; feature NÃO fechada** (decisões 1 a 13 da pessoa, estados sem captura e lado Figma dos tokens).

### 13.1 Figma nesta sessão (US-PAR-11)

`mcp__figma-remote__create_session` (arquivo `DLqbSzzKRxiN2eyvXG73Lr`) voltou: `Claude requested permissions to use mcp__figma-remote__create_session, but you haven't granted it yet.` Não repeti a chamada. Pedi ao ESQUADRO medidas do olho e do campo; ele respondeu que **não tem nenhuma ferramenta `mcp__figma-remote__*` nesta sessão** e não mediu nada. **Nenhum nó nem variável do Figma foi lido ou alterado nesta rodada.** O lado Figma aqui são as 12 capturas versionadas, medidas em pixel por mim (leitor de PNG fora do repositório, margem ±1 pt) e a tabela da seção 12.

### 13.2 Protocolo de captura realmente usado (desvio da premissa 9, igual à seção 11.2)

| Item | Valor |
|---|---|
| Aparelho | **Simulador** iPhone 17, iOS 27.0, 1206×2622 (3x, 402×874 pt). **Não** é o aparelho físico da premissa 9 (dúvida 2 sem resposta) |
| Modo | Expo Go 54, Metro em modo dev na 8082 (`CI=1`, sem recarga: reiniciado a cada mudança de código), `EXPO_PUBLIC_API_BASE_URL=http://localhost:8080` |
| Tema / fonte / orientação | Claro / padrão / retrato |
| Barra de status | `simctl status_bar override` 9:41, bateria cheia, sinal cheio; limpa ao fim |
| Dados | `ana.souza@exemplo-ficticio.com.br` e senha fictícia mascarada (`secureTextEntry`); nenhuma API, nenhum token, nenhum dado real |
| Arquivos | reduzidos a 402 px com `sips`; 16 a 59 KB cada |

**O que prova:** só `app-login-vazio.png` é a rota real `/login`. As demais vêm de uma rota temporária (`app/capture.tsx`, **apagada, nunca commitada**) que compõe os componentes reais com props fixas, aberta por deep link. Provam **aparência**, não o fluxo contra a API. Nada foi tocado nem digitado no simulador; o foco do campo (`app-login-foco-campo.png`) vem de `TextInput.focus()` por ref, que dispara o `onFocus` real. Não há diff automático nem montagem lado a lado.

**Lição repetida:** a 1ª leva desta rodada tinha 3 fotos do Expo Go carregando ("Opening project…", splash, "Downloading 100%") e um diálogo no meio do fade. Todas distintas por md5. Refeitas com 30 s de espera e abertas uma a uma.

### 13.3 md5 de cada foto (captura original 1206×2622 / arquivo versionado 402 px)

| Arquivo | md5 original | md5 versionado | Bytes |
|---|---|---|---|
| `app-login-vazio.png` (rota real) | `cdfbeff8c7ca25b2ea08a410973f609b` | `dd0c4a0eea675d208860a560019febbd` | 34831 |
| `app-login-carregando.png` | `dac525753189526d37b2a76097b1063f` | `526d8c7b86e5ace7a07991c8fb946d8e` | 42021 |
| `app-login-erro-validacao.png` | `3466c6c7ab2e0ae61976fcc2ca4b35a5` | `942eeb8a31c56dca5ed3ada2ef7efd2e` | 44820 |
| `app-login-erro-rede.png` | `1f0dbf3f4df9c927af16f20e25f8dda8` | `03a3e28598be158c4f8ec08293ed4f2f` | 52593 |
| `app-login-preenchido.png` | `26904229e2a14c03fd9768d86a4e2eab` | `d9da64298685e055404d28987bc2eb9d` | 38651 |
| `app-login-foco-campo.png` (novo; sem par no Figma) | `fd7d3aa00cf4514a703b8d791ce53d9f` | `05442122ae10e6ff5b3c19216fe70755` | 40033 |
| `app-perfil-preenchido.png` | `8650c275366be803e097971867d1789b` | `329fef9b3bc5d9d904c4a5830a9d729d` | 44945 |
| `app-perfil-confirmar-saida.png` | `3b44a23f4465e5b25310b25465020651` | `dfce4563ac6547a7f2dac5c935d35e63` | 58988 |

Os 8 originais têm hash distinto entre si e cada um foi aberto e visto. `erro-validacao` e `confirmar-saida` têm o mesmo md5 de uma captura anterior da mesma rodada, feita antes do ajuste de espaçamento que não os afeta: coerente, o render é determinístico.

### 13.4 Divergências da tabela do ESQUADRO: resultado

Commits: `e80ffce` (anel, largura do diálogo, botão de página), `f83c536` (teste do anel), `17f9cc7` (campo), `ccf17e6` (olho e Entrar/Sair 52), `a4bbbc9` (respiro do Login e rótulo). Medido no app (pt, margem ±1) contra o Figma (capturas `figma-*`).

| ID | Correção (commit) | Antes → depois, app | Figma | Teste |
|---|---|---|---|---|
| L-13 | Valor digitado em slate-700 (`17f9cc7`) | petro → `text.secondary` | slate-700 | `text-field.test.tsx` |
| L-14 | `minHeight` 48 passa para a linha do campo (o Yoga conta a borda); acessório com `marginVertical` -1,5 para o olho de 48 caber | 50,0 → **47,7** (e-mail e senha 48 medidos) | 48 | `text-field.test.tsx` |
| B-01 (página) | `Button size="page"` (52) em Entrar e Sair; padrão segue 48 | 48 → **52,0** | 52 | `button.test.tsx` |
| L-15 | Olho sai do campo em "Entrando..." (campos já ficavam travados) | olho presente → ausente | ausente | `login.test.tsx` |
| D-04 | `layout.dialogMaxWidth` 320 → 296 | 320 → **295** (diálogo e popup) | 296 | `confirm-dialog.test.tsx` |
| F-01 | Anel: respiro 2 → **4**, petro 2, raio externo 12 → **14** | petro a 2–4 → 4–6 do controle | petro 2 pt a 4 pt (confirmado em `29:79`: 310–312 petro, 312–316 branco, botão 316–368) | `use-focus-ring.test.ts` |
| L-11 (resto) | `ScreenContainer topSpacing`; Login usa 30 sem banner e 24 com banner | faixa→campo **43,7 → 49,6** | 50 (4 frames sem banner); com banner já batia (24) | `screen-container.test.tsx` |

Efeitos colaterais que eu achei e tratei: (1) o halo de 4 pt do anel cobria a base do rótulo "E-mail"; o rótulo ganhou `zIndex: 1` (visto em `app-login-foco-campo.png`, texto inteiro). (2) `IconButton` passou a usar o mesmo raio de anel dos demais. (3) o botão de ação do estado vazio (`StateView`, sem frame) herdou a largura 296 por usar `dialogMaxWidth`.

**F-01 só foi visto no campo de e-mail** (`TextInput.focus()`), onde o anel de 6 pt encosta no rótulo; no botão e no olho o anel não foi fotografado (o foco não pode ser forçado de fora) e continua conferido só por teste de componente. Em aparelho físico não foi visto.

### 13.5 Divergência nova achada nesta rodada (não corrigida: fora da tabela)

| ID | Figma | App | Evidência |
|---|---|---|---|
| **L-17** | Faixa de erro (`29:60`) com **44** de altura (144→188 em `29:56`) | **40** (162,7→203) | medida nas duas capturas; `inline-alert.tsx` tem `paddingVertical` 12 e sem altura mínima |

Corrigir é trivial (`minHeight` 44), mas a instrução desta rodada foi corrigir só a tabela do ESQUADRO. **Aguarda o comandante.** O ⚠ da faixa no Figma é triângulo cheio e no app é o glifo do sistema, vazado: classifico como só de plataforma (fonte), mas a decisão é do ESQUADRO.

### 13.6 O que continua em aberto

- **Decisões da pessoa 1 a 13** (seções 7 e 12.8): botão Fechar, rótulos do Perfil, Ionicons, estado "Padrão", Perfil carregando e erro, F39, aparelho físico, local das capturas, placeholder (L-12), divisor, botões de 44, frame "Perfil com tab bar", salto do frame `29:20`, rótulo da tab bar. Não toquei no código dessas.
- **Tokens no Figma (US-PAR-07):** o lado código ganhou `spacing.formTop` (30), `layout.pageButtonHeight` (52), `focusRingOffset` 4 (era 2) e `dialogMaxWidth` 296 (era 320). **Nenhum entrou no Figma** (MCP negado); o `figma.md` e a coleção `28:3` precisam de `space/formTop`, `size/button/page`, o respiro do anel e a largura do diálogo. Descumprido até o ESQUADRO criar.
- **Sem captura do app:** Perfil carregando e erro, foco no botão/olho/tab bar, tab bar "Padrão". US-MENU-06 (foco de teclado e leitor de tela em aparelho) segue onde estava.
- **US-PAR-08 não fecha.**

### 13.7 Verificação executada

`npm test` 166 passed / 29 suítes (eram 152); `npm run typecheck` e `npm run lint` sem saída de erro, com a rota temporária já apagada. API e backend não foram subidos nem alterados nesta rodada: comportamento e endpoints iguais (US-PAR-10 só por testes de componente e de tela, que seguem verdes).

### 13.8 README

README sem mudança: nenhuma instalação, comando, variável, porta ou funcionalidade mudou; só aparência de tela, testes e documentação.

## 14. Rodada do ORLA (2026-11-13, 3ª): R-02, R-03 e A-01 e recaptura

Ramo `feat/f41-paridade-correcoes`. Origem das correções: `docs/design/F41-planilha-divergencias.md` (ESQUADRO, `2e7be60`).

### 14.1 Correções

| ID | Commit | O que mudou | Teste |
|---|---|---|---|
| R-02 | `6b3c082` | Novo `AlertIcon` (Ionicons `warning`, triângulo cheio, decorativo) na faixa de erro e no popup de erro; `glyph.alert` removido | `alert-icon.test.tsx`, `inline-alert.test.tsx` |
| R-03 | `6b3c082` | `layout.inlineAlertMinHeight` 44 aplicado como `minHeight` da faixa | `inline-alert.test.tsx` |
| A-01 | `ad22425` | `ScreenHeader` monta `<StatusBar style="light" />` (texto da barra branco sobre o petro) | `screen-header.test.tsx` |

Figma: nenhuma escrita nesta rodada. O lado Figma da conferência segue sendo as 12 capturas versionadas (a planilha traz o motivo). O token novo `layout.inlineAlertMinHeight` está só no código: pendente no Figma (US-PAR-07).

### 14.2 Protocolo desta recaptura

Igual ao da seção 13.2 (simulador iPhone 17, iOS 27.0, Expo Go 54, claro, retrato, `status_bar override` 9:41, dados fictícios, senha mascarada, nenhum token). Metro na 8082 com `CI=1`, reiniciado antes de cada leva; rota temporária `app/capture.tsx` recriada e **apagada** antes do commit (nunca versionada). Só `app-login-vazio.png` é a rota real `/login`; as demais compõem os componentes reais com props fixas e provam **aparência**, não fluxo contra a API. Nada foi tocado nem digitado no simulador.

**Lição repetida:** na 1ª leva, `erro-rede` e `foco-campo` saíram com o mesmo md5 (`508f6158…`) e eram a splash do Expo Go. Foram refeitas com 45 s de espera e distintas entre si. Todas as 8 fotos foram abertas e vistas uma a uma.

### 14.3 md5 de cada foto (original 1206×2622 / versionado 402 px)

| Arquivo | md5 original | md5 versionado | Bytes |
|---|---|---|---|
| `app-login-vazio.png` | `b1e02b4ea7a09d89f881076d1379689e` | `2d9941f83bf73e3c3d675d0dfda536e2` | 36813 |
| `app-login-carregando.png` | `c1238de877d80dafede0606d1c39686b` | `68843303eb253d600a717bb223269720` | 42621 |
| `app-login-erro-validacao.png` | `43a216898eaa3833536f9491cadce847` | `adf1236cc861c03a56a7fc5d3d770e2e` | 46901 |
| `app-login-erro-rede.png` | `2d83d8b8bd05c77321346aad9c362e20` | `9933012733eaac0de75e74ccd46399a1` | 54749 |
| `app-login-preenchido.png` | `37dcb19447d95c175757fb23c821135a` | `cac5f5ae776ee4455ac7c65b49ef2902` | 40397 |
| `app-login-foco-campo.png` | `85cf959241125033dd3531c7e04b4944` | `c8d0a38c0057209b1e16fd0187396706` | 41797 |
| `app-perfil-preenchido.png` | `e9e2f3e4372ff413c0c3d0ec141d52f0` | `8ce7d22782fb1bc38476671cef4c86af` | 44250 |
| `app-perfil-confirmar-saida.png` | `97a6ec401d23246cf33e0a57a99e3af0` | `cd69d845abcc74ec79a6a63635313c0b` | 59537 |

### 14.4 O que as fotos mostram

Triângulo cheio na faixa e no popup; hora e ícones brancos sobre a faixa petro em todas as telas. A altura em pixel da faixa de erro não foi medida de novo. Nada mais mudou de lugar nas telas.

### 14.5 Verificação executada

Em `apps/mobile`, com a rota temporária já apagada: `./node_modules/.bin/tsc --noEmit` sem saída; `./node_modules/.bin/eslint src app` sem saída; `./node_modules/.bin/prettier --check src app` "All matched files use Prettier code style!"; `./node_modules/.bin/jest`: **30 suítes, 170 testes passaram** (eram 29 e 166). O jest mostra aviso de `act` do `Icon` do Ionicons nos testes que o renderizam de verdade (já existia em `tab-bar-item.test.tsx`). API e backend não foram subidos: comportamento e endpoints iguais (US-PAR-10 só por testes).

### 14.6 Continua em aberto

Decisões 1 a 13, dúvidas 2, 4 e 5, lado Figma dos tokens, capturas dos estados ausentes (Perfil carregando e erro, tab bar "Padrão", foco em botão, olho e tab bar) e US-MENU-06. **US-PAR-08 não fecha.**

### 14.7 README

README sem mudança: só aparência de tela, testes e documentação.

## 15. Rodada de 2026-11-14 — referência nova `FPdB8RymAnN81pbKfizdzE` (ESQUADRO)

### 15.1 Tentativa de acesso (US-PAR-11)

Pedido: rodar `whoami` pelo `figma-remote` e capturar os frames de Login, Perfil, diálogo de logout e tab bar no arquivo `FPdB8RymAnN81pbKfizdzE`.

Resultado real: **não rodei `whoami`.** O ambiente informou que o servidor `figma-remote` exige autenticação e que a sessão é não interativa (não dá para fazer o OAuth aqui). Nenhuma ferramenta `mcp__figma-remote__*` (`whoami`, `create_session`, `get_metadata`, `get_design_context`, `get_screenshot`) está disponível nesta sessão, então não há saída de `whoami` para registrar.

Ação necessária da pessoa: autenticar o servidor (`claude mcp login figma-remote`, ou `/mcp` em sessão interativa) e reabrir a etapa.

### 15.2 O que NÃO foi feito por causa do bloqueio

- Listar páginas do arquivo `FPdB8RymAnN81pbKfizdzE` e confirmar quais frames valem (tarefa 2 e dúvida 5).
- Exportar os frames de Login (5 estados), Perfil, diálogo e tab bar (tarefas 6, 8 e 10).
- Refazer a planilha de divergências do zero (tarefa 12), reconferir R-02, R-03 e A-01, e refazer o diff de tokens e o contraste com as cores do desenho novo, incluindo X e avatar (tarefas 12 e 17).
- Nenhum frame ou variável do Figma foi lido ou alterado.
- US-PAR-08 permanece **aberto**. Nenhum estado foi marcado como "não se aplica": isso depende de ver os frames novos, e declará-lo agora seria suposição.

### 15.3 Discrepância a resolver pela pessoa

O repositório trata `FPdB8RymAnN81pbKfizdzE` como **inspiração da F39, e não como referência de paridade** (`docs/product/F41-conferencia-paridade-referencias.md:37`, `docs/design/figma.md:439`). O briefing de hoje manda refazer a F41 contra ele. Pela regra do briefing, a F39 só edita o alta fidelidade dessas quatro telas depois que a F41 fechar. Confirmar:

1. Os frames válidos são `20:2131` (alta, v2 da F39) ou outro nó? Se for `20:2131`, a F41 passa a conferir um desenho que o app ainda não implementa, e a regra de "exceção temporária" (redesenho aguardando código) entra em conflito com o fechamento.
2. As capturas de `docs/design/f41-capturas` valem como "antes" da F39 e continuam sendo a linha de base da F40 (decisão registrada no briefing), ou a F41 é refeita inteira contra o novo?
3. Aparelho físico (premissa 9): sem modelo, sistema e resolução informados, só há simulador; a exceção precisa ser pedida e registrada (US-PAR-04).

### 15.4 Estado dos arquivos

`docs/design/figma.md:4` não foi alterado: a tarefa 1 manda atualizar depois de confirmar o acesso, e o acesso não foi confirmado.

## 16. Rodada de 2026-11-14 — etapa do código (ORLA)

### 16.1 Código

Nenhuma correção aplicada. A seção 15 não traz lista de divergências refeita, e a instrução é corrigir só o que o ESQUADRO listar. R-02, R-03 e A-01 ficam como estão (decididas contra o desenho antigo) até a reconferência.

### 16.2 Figma

Tentativa nesta etapa pelo conector `claude.ai Figma` (única família de ferramentas Figma exposta na sessão): `mcp__claude_ai_Figma__whoami` voltou `Claude requested permissions to use mcp__claude_ai_Figma__whoami, but you haven't granted it yet.` Não repeti a chamada nem tentei outra ferramenta do conector. O `figma-remote` segue sem autenticação (seção 15.1). Nenhum frame lido ou alterado.

### 16.3 Testes (critério 9, reexecução)

Comando: `npm --prefix apps/mobile test -- --silent`
Saída real: `Test Suites: 31 passed, 31 total` e `Tests: 176 passed, 176 total`, inclusive `screen-header.test.tsx`. Os testes de `alert-icon` e `inline-alert` não aparecem na lista exibida (só as últimas 25 linhas foram vistas); a suíte inteira passou. Isso só prova que os testes batem com o código atual, que segue o desenho antigo. Eles não foram revisados contra o frame novo, porque ele não foi lido.

### 16.4 Não feito

Fluxo real contra a API local (critério 10), capturas no aparelho (critérios 4, 12, 13) e capturas finais com md5. Sem frames novos e sem aparelho informado, qualquer captura seria da linha antiga e não serviria de linha de base da F40.

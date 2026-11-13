# F41 · Conferência de paridade Figma × código — Login, Perfil, diálogo de saída e tab bar

Autor: ESQUADRO · Data: 2026-11-13 · Branch: `feat/f40-componentizacao-mobile` · Estado: **etapa 1 de 3 concluída; conferência incompleta (lado app sem capturas)**

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

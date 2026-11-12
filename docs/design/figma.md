# Arquivo Figma da operação OP-002

- **Arquivo**: OP-002 app-mecanica-sao-jorge
- **Link**: https://www.figma.com/design/DLqbSzzKRxiN2eyvXG73Lr
- **file_key**: `DLqbSzzKRxiN2eyvXG73Lr`
- **Pasta**: `team::1274094162661077353` / projeto `681115069` (pasta da operação)
- **Criado por**: ESQUADRO, via `create_new_file` (Figma MCP oficial `figma-remote`, OAuth, sem `FIGMA_TOKEN`), em 2026-11-07
- **Acesso**: confirmado com `whoami` antes da criação — handle "Leticia Moraes", plano "Time Pessoal" (`team::1274094162661077353`), sem bloqueio

Um arquivo por operação. Toda nova entrega de design desta operação (F24, e as
próximas F25+) continua neste mesmo arquivo, em páginas novas, sem criar
arquivo adicional.

## Páginas

### `F24 · Wireframe baixa fidelidade`
Wireframe de baixa fidelidade das 24 telas da Feature F24, a partir da
especificação em `docs/design/F24-wireframe-baixa-fidelidade.md`. Conteúdo
fictício (seção 5 daquela spec), sem nenhum dado real da oficina.

**Organização**: cada tela ocupa uma linha (offset vertical de 1800 px por
tela, na ordem 01 a 24); cada estado aplicável ocupa uma coluna (offset
horizontal de 420 px: Vazio, Carregando, Erro de rede, Erro de validação,
Preenchido). Frame mobile fixo em 360 px de largura, altura dinâmica
conforme o conteúdo de cada tela (lista ou formulário mais longo = frame mais
alto, representando rolagem).

**Nomenclatura de frame**: `[nº da tela] Nome da tela / Estado` — ex.:
`03 Clientes · lista / Vazio`. A tela 24 (Financeiro · lançamentos), por
reunir lista e formulário de lançamento manual na mesma tela, tem os estados
"Preenchido" desdobrados em dois frames (`Preenchido (lista)` e
`Preenchido (formulário)`) e os estados de erro de rede/validação
identificados com o sufixo `(lista)`/`(formulário)`, mantendo cada frame
identificável pelo nome (US-DES-01).

**94 frames no total** (93 células da matriz de cobertura da seção 7 da spec
+ 1 frame extra para desdobrar "24 · Preenchido" em lista e formulário).
Nenhuma célula "—" da matriz (vazio ou erro de validação não aplicável a uma
tela) virou frame — confirmado contra a matriz antes de fechar a entrega.

**Padrões de acessibilidade aplicados em todos os frames** (US-DES-03):
- Todo campo tem rótulo de texto visível acima da caixa (nunca só
  placeholder).
- Campo somente leitura é sinalizado no próprio rótulo ("(somente leitura)")
  e com fundo diferenciado.
- Todo erro de campo é texto ("! mensagem") abaixo do campo, nunca só borda
  vermelha — a borda vermelha acompanha o texto, não substitui.
- Estado "Estoque baixo" (tela 13) e badges de status (perfil, parcela) usam
  ícone/símbolo + texto, nunca só cor.
- Segmented control (Catálogo e Financeiro, seção 4.6 da spec) marca a aba
  ativa com negrito + sublinhado, as duas opções sempre com rótulo visível.
- Toda tela carrega uma legenda final (itálico, cinza) com a ordem de foco
  e/ou o texto que o leitor de tela deve anunciar ao entrar no estado
  (loading e erro de rede), e a nota "N/A" quando um estado da matriz não se
  aplica àquela tela.
- Estado de erro de rede segue padrão único nas 24 telas: ícone de alerta +
  "Não foi possível carregar" + "Verifique sua conexão e tente novamente" +
  botão "Tentar novamente".

## Pendência conhecida (registrar para CRIVO)
Não revisei célula por célula com zoom todas as 94 telas após a montagem —
validei visualmente por amostragem (8 telas de tipos diferentes: formulário
simples, formulário longo multi-seção, lista com ação secundária, lista com
segmented control, detalhe com histórico, e os três estados de erro) mais a
conferência estrutural via `get_metadata` (nomes das 94 frames contra a
matriz da spec). Não é uma verificação exaustiva de todas as 94 telas
individualmente — registrado como o que foi checado de fato, não suposto.

## Fechamento de resíduos (2026-11-07, ESQUADRO)

A pedido do REGENTE, reli o arquivo real (não só esta spec) com `get_metadata`
sobre a página inteira (118 frames: 94 de tela/estado + 24 popups novos) e
achei três resíduos reais, confirmados por XML antes de qualquer correção —
não presumidos:

1. **US-DES-13 violado em 24 telas**: o estado "Erro de rede" tinha sido
   construído como **tela cheia substituindo o conteúdo** (só ícone + título +
   texto + botão sobre fundo branco), e não como popup sobre a tela, como a
   Premissa 5 e o US-DES-13 exigem. Corrigido nas 24 telas: cada frame "Erro
   de rede" agora traz o conteúdo de fundo da própria tela (clonado do estado
   "Carregando" correspondente, mesma estrutura/skeleton), uma sobreposição
   escurecida (preto a 50% de opacidade) e um cartão modal centralizado
   (branco, cantos arredondados, sombra) com o ícone, "Não foi possível
   carregar", "Verifique sua conexão e tente novamente." e o botão "Tentar
   novamente" — mantendo o conteúdo de fundo visível, porém inativo. A legenda
   de leitor de tela foi reescrita por tela ("Erro ao carregar [nome da
   tela]"), com um fundo sutil atrás dela para manter contraste de leitura
   sobre o conteúdo esmaecido (necessário sobretudo na tela 18, formulário
   mais alto que as demais, 826 px).
2. **US-DES-12 violado em 47 textos**: mensagens de erro (banners de erro de
   rede dentro de formulários e mensagens de erro de validação por campo)
   começavam com `"! "`, contra a regra explícita de não iniciar com `"!"`.
   Removido o prefixo nos 47 nós de texto, mantendo o conteúdo da mensagem.
3. **US-DES-11 violado em 17 textos**: placeholder de busca usava o emoji
   `🔍` ("🔍 Buscar cliente" etc., 9 ocorrências em Clientes/Serviços/Peças) e
   a alternância "Ativo" usava o emoji `🟢` ("🟢 Ativo", 8 ocorrências em
   Serviços e Peças editar). Removidos os dois emojis, mantendo só o texto
   (o rótulo "Busca" acima do campo e o texto "Ativo" já cumpriam a função,
   sem depender do emoji).

**Como foi verificado**: script Python sobre o XML de `get_metadata` (salvo
localmente) para localizar e contar cada ocorrência antes de corrigir;
correção aplicada via `use_figma` (API de plugin) node a node, usando os ids
reais; nova varredura completa do XML após a correção confirmando 0
ocorrências residuais de `"! "` no início de texto e 0 ocorrências de emoji
colorido (faixa Unicode de pictogramas), com os 94 frames de tela/estado
preservados (nenhum apagado) e 24 popups novos (118 frames no total). Validado
visualmente com `get_screenshot` em 5 telas (Login erro de rede, Clientes
lista erro de rede, Peças lista erro de rede, OS criar erro de rede — a mais
alta/complexa — e Login erro de validação, para confirmar que a correção do
"!" não quebrou a leitura da mensagem).

**O símbolo `⚠`** (ícone de alerta, presente em todos os estados de erro)
foi mantido: é um glifo de aviso (dingbat), não um emoji colorido, e já era a
decisão de design registrada para representar "ícone de alerta" nesta etapa
de baixa fidelidade, sem ícone vetorial.

**Pendência que segue de pé, não coberta por este fechamento**: a tela 18
(OS · criar, erro de rede) ainda tem um leve bleed visual de 1-2 px de
conteúdo esmaecido nas bordas do fundo de contraste da legenda, por ser a
única tela mais alta que o padrão (826 px vs. 800 px) com seções muito
compactas; não afeta a leitura da legenda nem é uma violação de critério de
aceitação, registrado aqui como polimento visual menor para quando a F24
virar protótipo de alta fidelidade.

### `F25 · Protótipo alta fidelidade` (2026-11-07, ESQUADRO)

Protótipo navegável de alta fidelidade das telas **01 Login** e **02 Perfil**,
a partir de `docs/product/F25-prototipo-login-perfil.md` (critérios
US-PROTO-LGN-01 a 10, texto e dado fictício fixados na seção 8 daquele PRD) e
reaproveitando a estrutura/coordenadas do wireframe F24 (frames `3:3`, `3:15`,
`3:29`, `3:45`, `3:58`, `3:66`, `3:79` da página anterior), com os tokens
petro/primary aplicados por cima.

**Página**: `28:2`. **9 frames**, grade 360×800, offset horizontal 420 px por
estado (linha Login em y=0, linha Perfil em y=1800, mesma convenção da F24):

| Frame | id | Observação |
|---|---|---|
| 01 Login / Vazio (pós-logout) | `29:2` | Campos vazios; novo em relação à F24 (necessário como destino do logout, US-PROTO-LGN-10) |
| 01 Login / Carregando | `29:20` | Campos desabilitados (fundo skeleton), spinner no botão |
| 01 Login / Erro de rede | `29:35` | Popup sobre o conteúdo esmaecido (mesmo padrão corrigido na F24) |
| 01 Login / Erro de validação | `29:56` | Banner de credencial + erro por campo |
| 01 Login / Preenchido | `29:79` | Com anel de foco ilustrado no botão "Entrar" |
| 02 Perfil / Carregando | `33:2` | Skeleton nos dados; "Sair" visível com opacidade reduzida |
| 02 Perfil / Erro de rede | `33:14` | Popup; "Sair" fora da área esmaecida, sempre acessível |
| 02 Perfil / Preenchido | `33:33` | Com anel de foco ilustrado no botão "Sair" |
| 02 Perfil / Confirmar saída | `33:49` | Novo nesta feature (US-PROTO-LGN-10): tela cheia com fundo de Perfil esmaecido + diálogo central "Deseja realmente sair?" |

Não há frame "02 Perfil / Erro de validação" nem "Vazio" (Perfil sempre tem
usuário logado, sem formulário) — ausência já prevista e aceita pelo
US-PROTO-LGN-02.

**Tokens (Figma Variables, coleção `OP-002 Tokens de cor`, id
`VariableCollectionId:28:3`)**: implementados em dois níveis — primitivo e
semântico (o nível "componente" da convenção da casa foi absorvido no
semântico por limite de tempo desta entrega; registrado como simplificação,
não omissão silenciosa).

Primitivos: `primitive/color/petro-900` (`#1E3A3F`), `primary-600`
(`#B5453D`), `white` (`#FFFFFF`) — os três do briefing/PRD — mais quatro
introduzidos por mim para cobrir texto secundário, bordas e fundo de
skeleton/overlay (Dúvida 2 do PRD F25, seção 5.2): `slate-700` (`#334155`),
`slate-500` (`#64748B`), `slate-200` (`#E2E8F0`), `slate-100` (`#F1F5F9`),
`overlay-scrim` (`#000000` a 50%).

Semânticos (alias para os primitivos): `color/surface/default`,
`/skeleton`, `/brand`, `/overlay`; `color/text/primary`, `/onBrand`,
`/secondary`, `/onPrimaryAction`, `/error` (reaproveita `primary-600` — não
criei uma cor de erro nova, decisão deliberada para não introduzir um tom sem
contraste calculado); `color/border/default`, `/skeleton`;
`color/action/primary/background`; `color/focus/ring` (petro),
`/ring-offset` (branco).

**Contraste verificado por mim** (fórmula de luminância relativa WCAG, mesmo
método da Premissa 5 do PRD), para os quatro tokens novos usados em texto ou
borda:

| Combinação | Razão | Uso | Resultado |
|---|---|---|---|
| `slate-700` sobre branco | 10,35:1 | texto secundário (rótulo, e-mail, legenda) | passa AA (texto normal) |
| `slate-500` sobre branco | 4,76:1 | borda de campo (não-texto, mínimo 3:1) | passa |
| `petro-900` sobre `primary-600` | 2,24:1 | — descartado como anel de foco direto sobre botão | não usado isoladamente por isso |
| branco sobre `primary-600` | 5,41:1 (igual à Premissa 5) | halo do anel de foco sobre o botão | passa |

**Anel de foco**: por `petro` sozinho não ter contraste suficiente sobre o
botão `primary` (2,24:1, tabela acima), usei um anel duplo — 2 px `petro`
(anel externo) + 2 px branco (halo entre o anel e o elemento) — padrão comum
de indicador de foco acessível que garante ≥3:1 tanto sobre fundo branco
(petro a 12,1:1) quanto sobre o botão primary (branco a 5,4:1). Ilustrado
nos frames "01 Login / Preenchido" (botão Entrar) e "02 Perfil / Preenchido"
(botão Sair); a legenda de cada frame descreve a ordem de foco completa.

**Navegação (modo Prototype)**: 10 reações `ON_CLICK` → `NAVIGATE` com
transição Smart Animate, configuradas via `setReactionsAsync` e **relidas por
mim depois de gravadas** (não presumi que a gravação funcionou):

| Origem | Ação | Destino |
|---|---|---|
| Login Vazio (`29:16`) | Entrar | Login Carregando (`29:20`) |
| Login Erro de validação (`29:75`) | Entrar | Login Carregando (`29:20`) |
| Login Erro de rede, popup (`29:52`) | Tentar novamente | Login Carregando (`29:20`) |
| **Login Preenchido (`29:93`)** | **Entrar** | **Perfil Preenchido (`33:33`)** |
| Perfil Erro de rede, popup (`33:27`) | Tentar novamente | Perfil Carregando (`33:2`) |
| Perfil Erro de rede (`33:29`) | Sair | Confirmar saída (`33:49`) |
| Perfil Carregando (`33:10`) | Sair | Confirmar saída (`33:49`) |
| **Perfil Preenchido (`33:43`)** | **Sair** | **Confirmar saída (`33:49`)** |
| **Confirmar saída (`33:65`)** | **Cancelar** | **Perfil Preenchido (`33:33`)**, sem encerrar sessão |
| **Confirmar saída (`33:67`)** | **Sair (confirmar)** | **Login Vazio (`29:2`)** |

As cinco linhas em negrito são os caminhos exigidos literalmente pelo PRD
(US-PROTO-LGN-03 e US-PROTO-LGN-10); as demais (retry de carregamento) são
reforço de fidelidade ao wireframe, não exigência explícita do Gherkin.
Nenhuma tela fica órfã: Perfil só é alcançável a partir de Login Preenchido,
e isso está cumprido. Ponto de partida do fluxo (`flowStartingPoints`)
marcado em "01 Login / Vazio".

**Decisão de escopo não coberta pelo Gherkin, registrada para CRIVO avaliar**:
o botão "mostrar/ocultar senha" (ícone de olho, alvo de toque 44×44) não tem
reação de navegação — é uma interação local (alternar máscara do campo), não
uma navegação entre telas. Interpretei "ação clicável" do US-PROTO-LGN-03
como as ações que mudam de tela (Entrar, Sair, Tentar novamente, Cancelar,
Confirmar), não todo elemento tocável do formulário. Se CRIVO ou BUSSOLA
discordarem dessa leitura, é ajuste pequeno (criar um frame alternativo de
"senha visível" e uma reação local), não revisão estrutural.

**Decisões de copy (Dúvida 3 do PRD F25)**: mantive "Sair" como rótulo do
botão de confirmação dentro do diálogo (em vez de "Confirmar saída"), igual
ao botão que abre o diálogo — distinguidos por posição (sempre a segunda
ação, com `primary`, contra "Cancelar" em `secondary`/outline à esquerda/
acima) e pelo contexto do diálogo, não por texto diferente. Acho que isso é
suficientemente claro, mas é decisão minha, não imposição do PRD; BUSSOLA
pode pedir "Confirmar saída" na revisão sem implicar retrabalho estrutural.

**O que eu verifiquei de fato, e o que não pude verificar**:
- Chamei `get_metadata` depois de cada etapa de construção e confirmei a
  árvore de nós esperada (nenhum frame perdido, nenhum node duplicado) antes
  de seguir para a etapa seguinte.
- Tirei `get_screenshot` das 9 telas (não só amostragem) e look visual
  bate com o esperado: tokens aplicados, popups sobre conteúdo esmaecido
  (não tela cheia), "Sair" visível fora da área do popup em Perfil/Erro de
  rede, anel de foco duplo visível nos dois botões primários ilustrados.
- Configurei as 10 reações via `setReactionsAsync` e **reli cada uma com
  `node.reactions`** depois de gravar, confirmando `destinationId`,
  `navigation: "NAVIGATE"` e o trigger `ON_CLICK` exatamente como pretendido
  — não presumi que a chamada tinha funcionado só porque não lançou erro.
- **Não verifiquei** o clique real em modo Present/Play (não tenho navegador
  interativo nesta sessão): a confirmação de que a transição "funciona" ao
  vivo, com a animação e o teclado/leitor de tela reais, depende de alguém
  abrir o link do Figma em modo de apresentação. O que relato é: os dados de
  reação estão gravados e corretos na árvore do documento, lidos de volta por
  mim.
- Calculei o contraste dos quatro tokens novos (tabela acima) pela mesma
  fórmula da Premissa 5 do PRD — não usei uma ferramenta externa de
  contraste como segunda fonte; se BUSSOLA/CRIVO quiserem conferir com outra
  ferramenta, é bem-vindo.
- Não testei leitor de tela real (VoiceOver/TalkBack) sobre o protótipo — as
  legendas de cada frame descrevem o que o leitor de tela *deveria* anunciar
  (mesma convenção da F24), não uma gravação de um teste real, porque o
  protótipo Figma não tem semântica de acessibilidade executável (isso só
  existe depois da F30, no app real).

**Próximo passo**: handoff para CRIVO conferir US-PROTO-LGN-01 a 04 e 08 a
10 contra este arquivo; BUSSOLA decide a aprovação/reprovação formal na
tabela de registro de execução do PRD F25 (US-PROTO-LGN-05/06), incluindo
decidir as duas divergências de escopo/copy registradas acima.

#### Correção F38 — X de fechar e ícone de olho (2026-11-12, ESQUADRO)

A pedido direto do comandante, reaplicados no protótipo F25 os dois padrões
novos de UI da F38 (botão X em popup, ícone de olho em campo de senha),
restritos ao recorte que a instrução pediu: popup de erro de login e
confirmação de logout. `whoami` confirmado sem bloqueio antes de qualquer
leitura ou edição (handle "Leticia Moraes", plano `team::1274094162661077353`).

**US-POP-06 — Popup de erro de login (`29:35` → `29:48`)**: adicionado
`Alvo de toque · Fechar (44×44)` (`79:2`, retângulo invisível, mesmo padrão
do alvo de toque do olho) com um ícone X de dois traços (`79:3`/`79:4`,
`color/text/secondary`, 1,5 px, mesmo estilo do contorno do olho) no canto
superior direito. Para abrir espaço sem sobrepor o ícone de alerta, todo o
conteúdo do popup (`29:49` a `29:53`) foi deslocado 44 px para baixo e a
altura do popup cresceu de 206 para 250 px; o frame do popup subiu 44 px
(`y` 297→253) para manter a borda inferior exatamente onde estava (503 px),
sem mexer na legenda de leitor de tela abaixo. Nenhum texto, botão ou cor
existente foi alterado — só reposicionado. Legenda (`29:55`) reescrita para
descrever o novo controle e a ordem de foco (Fechar → Tentar novamente).

**US-POP-07 — Confirmação de logout (`33:49` → `33:62`)**: mesmo padrão,
ids `79:5`/`79:6`/`79:7`. Conteúdo do diálogo (`33:63` a `33:68`) deslocado
44 px para baixo, altura 192→236 px, frame subiu 44 px (`y` 304→260,
borda inferior mantida em 496 px). Cancelar (`33:65`/`33:66`) e Sair/confirmar
(`33:67`/`33:68`) preservados sem nenhuma alteração de posição relativa,
texto ou cor — o X é ação adicional, não substitui nenhum botão. Legenda
(`33:70`) reescrita: ordem de foco passa a ser Fechar (X) → título →
mensagem → Cancelar → Sair, com o X documentado como equivalente a
"Cancelar" (fecha sem encerrar sessão).

**US-PWD-06 — Ícone de olho**: reli a página inteira (`28:2`) antes de
mexer e confirmei que o ícone de olho **já existia** nos três frames de
Login com campo de senha (`29:2`, `29:56`, `29:79` — "Olho · contorno" +
"Olho · pupila" + "Olho · barra (ocultar)", construídos desde a criação
original da F25 em 2026-11-07, antes mesmo da F38 existir). Ou seja, o
código mobile usava texto "mostrar senha" até a F38 corrigir, mas o Figma
já estava correto nesse ponto — não precisei adicionar o ícone fechado,
só o estado aberto que faltava.

Criei o frame `80:2` ("Anotação · olho aberto (variante US-PWD-06)"),
360×256, posicionado em `x=1680, y=900` (coluna de Login, na faixa vazia
entre a linha de Login e a linha de Perfil, sem sobrepor nenhum frame
existente). Contém o ícone de olho aberto (sem a barra — `olhoContorno`/
`olhoPupila` sem o traço "ocultar"), o alvo de toque 44×44 e o texto do
nome acessível no estado ativo ("Ocultar senha").

**Conflito que encontrei e não resolvi sozinho**: o PRD do F25
(`docs/product/F25-prototipo-login-perfil.md`, §8) já fixa, como decisão
aprovada, que a senha "nunca" aparece como string literal visível no frame,
"mesmo no estado Preenchido" — só mascarada/pontos. A US-PWD-06 da F38 pede
literalmente uma variante "mostrando o olho aberto **com a senha em texto
claro**". As duas instruções se contradizem. Não escolhi uma por conta
própria: implementei a troca de ícone e de nome acessível (que não conflita
com nada) e documentei o impasse na própria nota do frame `80:2`, pedindo
que BUSSOLA decida qual decisão prevalece antes de eu desenhar a senha em
texto legível de fato.

**O que verifiquei**: `get_metadata` antes e depois de cada edição (nenhum
nó existente apagado, ids antigos preservados); `get_screenshot` dos três
frames (`29:35`, `33:49`, `80:2`) depois de cada etapa, conferindo que não
há sobreposição de texto, que os botões Cancelar/Sair/Tentar novamente
continuam legíveis e sem alteração visual além da nova posição, e que o
X não é cortado pelo canto arredondado do popup. Cores do X e do olho
aberto lidas com `boundVariables` antes de criar (herdadas de
`color/text/secondary`, `VariableID:28:18`), não digitadas de cabeça —
mesmo token já usado no ícone de olho fechado.

**Fora desta rodada** (fora do escopo que o comandante pediu para mim
agora, registrado para quando alguém retomar o Bloco D completo): o X não
foi retroagido aos 24 frames de "Erro de rede" do F24, nem o olho foi
retroagido ao frame de Login do F24 — a instrução recebida foi
especificamente sobre o F25.

**Próximo passo**: BUSSOLA decide o conflito do §8 do PRD F25 registrado
acima (olho aberto com senha em texto claro vs. senha sempre mascarada).
Depois disso, CRIVO revalida US-POP-06/07 e US-PWD-06 contra este arquivo
(frames `29:35`, `33:49`, `80:2`, página `28:2`).

### `F34 · Tab bar alta fidelidade` (2026-11-07, ESQUADRO)

Protótipo de alta fidelidade do Menu principal (tab bar inferior), a partir
dos critérios US-PROTO-MENU-01 a 05 fixados diretamente no briefing da
operação (sem PRD próprio de BUSSOLA — rota desta feature é ESQUADRO → CRIVO).
Reaproveita integralmente os tokens e a coleção de variáveis já criados na
F25 (`VariableCollectionId:28:3`) — nenhum token novo foi criado; onde faltava
um papel semântico (anel de foco sobre fundo escuro), reaproveitei
`color/focus/ring-offset` (branco), que já existia com o valor certo para
esse uso, em vez de criar uma variável nova.

**Página**: `39:2`. **3 frames**, 360×84 cada (grade mobile), offset
horizontal 420 px (mesma convenção F24/F25), com uma legenda de texto
(itálico, `color/text/secondary`) abaixo de cada um:

| Frame | id | O que documenta |
|---|---|---|
| Menu principal / Selecionado (Perfil) · estado real Sprint 01 | `39:3` | Como a tab bar aparece de fato hoje: Perfil é o único item habilitado e já chega selecionado (é a aba de pouso do app) |
| Menu principal / Padrão (Perfil não selecionado) | `39:31` | Variante exigida pelo critério de 3 estados (US-PROTO-MENU-01); documentada por completude de especificação, já que na Sprint 01 Perfil praticamente sempre está selecionado |
| Menu principal / Foco de teclado (Perfil) | `39:58` | Selecionado + anel de foco branco sobreposto (os dois estados coexistem na prática) |

**Ordem fixa dos 5 itens, esquerda → direita, igual nas 3 frames**: Perfil
(habilitado) → Clientes e Veículos → Catálogo → Ordens de Serviço →
Financeiro (os 4 últimos desabilitados, com ícone e rótulo de referência,
sem navegação real — conforme o fora de escopo da feature).

**Layout de cada item**: célula de 72×64 pt/dp (360 ÷ 5), mais 20 pt/dp de
faixa de área segura (home indicator) abaixo, mesma cor do fundo — barra
total 360×84. A célula inteira (72×64) é a área de toque de cada item,
folgada acima do mínimo de 44×44pt (iOS) / 48×48dp (Android) exigido pelo
critério US-PROTO-MENU-03.

**Ícones**: desenhados com formas geométricas simples (retângulo/elipse com
cantos arredondados), no mesmo espírito de referência visual do wireframe
F24 — não são um ícone de produção/SVG importado, são um placeholder
reconhecível (pessoa, carro, caixa, prancheta, gráfico de barras) suficiente
para "ícone de referência" (fora de escopo: ícone final). Ícone preenchido
(fill sólido) nos itens habilitados; ícone em traço (stroke, sem
preenchimento) nos desabilitados — a diferença de estilo do ícone, não só a
cor, é um dos dois sinais exigidos por US-PROTO-MENU-02.

**Estado selecionado (Perfil)**: fundo petro da barra inteira
(`color/surface/brand`) + um "pill" de 56×32 em `color/action/primary/background`
atrás do ícone + ícone e rótulo em `color/text/onPrimaryAction` (branco) +
peso de fonte Semi Bold no rótulo. **Não** usei a cor primary diretamente como
cor de texto/ícone sobre o fundo petro: calculei o contraste de primary
(`#B5453D`) sobre petro (`#1E3A3F`) pela mesma fórmula de luminância relativa
da F25 e deu **≈2,24:1** — não passa AA nem para elemento de UI (mínimo 3:1).
Por isso a cor primary aparece como fundo do pill (com branco em cima, razão
≈5,41:1, já validada na F25), não como cor de texto/ícone isolada — é assim
que o token "primary no ativo" do briefing fica com contraste correto
(US-PROTO-MENU-05).

**Estado padrão/habilitado sem seleção (Perfil)**: ícone preenchido e rótulo
em `color/text/onBrand` (branco) direto sobre petro, sem pill, peso regular —
razão ≈12,1:1 (mesma da F25), passa AA com folga.

**Estado desabilitado (4 itens futuros)**: ícone em traço + rótulo em
`color/text/onBrand`, com opacidade do nó em 60%. Calculei antes de montar
(fórmula de luminância relativa, branco a 60% de opacidade composto sobre o
petro de fundo): resultado **≈5,46:1**, passa AA (mínimo 4,5:1 para texto
normal) com margem — não usei um valor arredondado "de olho"; testei 50%
primeiro (≈4,30:1, não passa) antes de fechar em 60%. Isso cumpre
US-PROTO-MENU-05 também para os itens desabilitados, que o critério exige
explicitamente (diferente do padrão comum de não cobrar contraste de
controle desabilitado).

**Anel de foco**: branco (`color/focus/ring-offset`), 2 px, 2 px de margem
interna da célula — contraste ≈12,1:1 sobre o fundo petro, visível em
qualquer item ao navegar por Tab. Ilustrado no item Perfil no frame "Foco de
teclado"; a legenda do frame descreve que o mesmo anel se aplica a qualquer
item que receba foco.

**Ordem de foco (teclado e leitor de tela)**, anotada na legenda do frame 1,
igual à ordem visual: Perfil → Clientes e Veículos → Catálogo → Ordens de
Serviço → Financeiro (US-PROTO-MENU-04).

**Rótulo acessível (accessibilityLabel/aria-label) e estado anunciado, por
item** (anotado na legenda do frame 1, US-PROTO-MENU-03):
- Perfil — "Perfil, aba selecionada" · role tab, `selected=true`,
  `disabled=false`.
- Clientes e Veículos — "Clientes e Veículos, indisponível nesta versão" ·
  role tab, `disabled=true`, `selected=false`.
- Catálogo — "Catálogo, indisponível nesta versão" · role tab,
  `disabled=true`.
- Ordens de Serviço — "Ordens de Serviço, indisponível nesta versão" · role
  tab, `disabled=true`.
- Financeiro — "Financeiro, indisponível nesta versão" · role tab,
  `disabled=true`.

**Decisão registrada para CRIVO/BUSSOLA confirmarem**: os itens desabilitados
ficam alcançáveis por foco de teclado/leitor de tela (anunciando
"indisponível nesta versão"), em vez de ficarem fora da ordem de tabulação
como é mais comum para controle desabilitado. Optei por isso porque o
próprio critério US-PROTO-MENU-04 pede "ordem de foco" cobrindo os 5 itens
"com indicador de foco visível em cada item", o que só faz sentido se os
desabilitados também puderem receber foco. Não é uma violação de WCAG (um
controle desabilitado-mas-focável que anuncia seu estado é um padrão aceito
para pré-visualizar funcionalidade futura), mas diverge do padrão mais comum
de excluir `disabled` da ordem de tabulação — se CRIVO ou BUSSOLA preferirem
excluir os 4 itens futuros da ordem de foco (deixando só Perfil navegável),
é ajuste pequeno de anotação, não de estrutura visual.

**O que eu verifiquei de fato**:
- Chamei `get_variable_defs` nos frames `39:3` e `39:58` depois de montar e
  confirmei que as cores vieram de variável vinculada (não hex solto): fundo
  petro, pill primary, texto/ícone onBrand e onPrimaryAction, e o anel de
  foco em `color/focus/ring-offset` — os 5 tokens certos, reaproveitados da
  F25.
- Chamei `get_screenshot` dos 3 frames individualmente e do canvas inteiro
  (os 3 lado a lado) em resolução alta; conferi visualmente que os 5 itens
  aparecem na ordem certa nas 3 variantes, que os 4 desabilitados têm o
  mesmo tratamento (traço + opacidade) nas 3, que o pill e o anel de foco
  aparecem só onde esperado, e que não há sobreposição/vazamento de conteúdo
  entre os frames (o `get_metadata` reportou coordenadas relativas estranhas
  para os grupos de ícone — valores negativos grandes — mas conferi por
  captura visual real que a renderização está correta nos 3 frames; registro
  essa discrepância aqui como uma particularidade da ferramenta de leitura de
  metadados com nós agrupados via `figma.group`, não como defeito no arquivo,
  já que o screenshot é a fonte de verdade sobre o que está desenhado).
- Calculei as duas razões de contraste novas desta feature (primary sobre
  petro ≈2,24:1 — descartado; branco a 60% de opacidade sobre petro
  ≈5,46:1 — usado no desabilitado) pela mesma fórmula de luminância relativa
  do WCAG já usada na F25, testando 50% antes de fechar em 60%.

**O que não verifiquei**: não há interação real por teclado/leitor de tela
testada (VoiceOver/TalkBack) — esta é uma especificação visual em Figma, sem
semântica executável; os rótulos acessíveis acima são a anotação de como o
item deve se comportar quando a F33 implementar a tab bar real, não uma
gravação de teste real. Também não configurei reações de navegação
(`ON_CLICK`) neste protótipo — está fora de escopo (critério explícito:
"conteúdo real ou navegação funcional dos itens de módulos futuros" e
"lógica de habilitação dinâmica" ficam para F33); os 3 frames são estados
estáticos lado a lado, não uma sequência clicável.

**Próximo passo**: handoff para CRIVO conferir US-PROTO-MENU-01 a 05 contra
este arquivo (frames `39:3`, `39:31`, `39:58`, página `39:2`).

### F33 · Menu principal de navegação (2026-11-07, ESQUADRO)

Reli a página `39:2` nesta sessão (`get_metadata` + `get_screenshot`) para
confirmar que os 3 frames ainda batem com a descrição acima antes de
especificar a implementação — bateram, sem divergência.

**Nenhuma página/frame novo foi criado nesta feature.** A F33 reaproveita
integralmente os frames `39:3`/`39:31`/`39:58` já aprovados (CRIVO, F34); o
trabalho desta etapa foi de especificação de comportamento (navegação, guard
de sessão, i18n, adaptação responsiva), não de artefato visual novo —
detalhado em `docs/design/F33-especificacao-menu-tabbar.md`.

Decisão registrada: a dúvida §10 do PRD de BUSSOLA (`docs/product/F33-menu-principal-navegacao.md`)
— se falta um frame para o "instante de redirect" de US-MENU-08 — foi
respondida como **não falta**: esse instante é o guard de sessão que já
existe em código (`apps/mobile/app/index.tsx`, implementado na F30), que
nunca chega a montar a tab bar enquanto decide o destino; não é um estado
visual da tab bar em si. Ver seção 2 do documento de especificação para o
raciocínio completo.

**Confirmação pós-implementação (2026-11-09, ESQUADRO)**: reli a página
`39:2` de novo nesta sessão (`whoami` sem bloqueio, `get_metadata`) — os 3
frames (`39:3`, `39:31`, `39:58`) continuam idênticos ao que está descrito
acima, nenhuma mudança desde a F34. Confrontei a spec
(`docs/design/F33-especificacao-menu-tabbar.md`) contra o código real já
implementado por ORLA (`menu-tab-bar.tsx`, `(menu)/_layout.tsx`): bate ponto
a ponto. Detalhe completo, incluindo o gap de verificação de foco em item
desabilitado que fica para CRIVO, na seção 13 do documento de especificação.

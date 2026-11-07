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

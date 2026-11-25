# F41 — Rodada contra o Figma novo (FPdB8RymAnN81pbKfizdzE)

Data: 2026-11-14. Autor: ESQUADRO. Estado: **provisório, aguardando decisão da pessoa**.
Este documento substitui, para a conferência, a planilha R-01..R-15 e as tabelas de
`F41-planilha-divergencias.md` e `F41-conferencia-paridade.md`, todas feitas contra o
arquivo antigo (`DLqbSzzKRxiN2eyvXG73Lr`). Aquelas não valem para o design novo.

`docs/design/figma.md` **não foi alterado**: o link da linha 4 só muda depois que a pessoa
confirmar quais frames valem (seção 6).

## 1. Acesso ao Figma (US-PAR-11)

Saída real de `mcp__figma-remote__whoami`, 2026-11-14:

```
{"whoami":{"user_id":"1126488233271433922","handle":"Leticia Moraes",
 "plans":[{"name":"Time Pessoal","seat":"Full","tier":"student",
 "key":"team::1274094162661077353","role":"admin"}]}}
```

Sem bloqueio. `create_session` (fileKey `FPdB8RymAnN81pbKfizdzE`) devolveu o sessionId e
`get_metadata`, `get_screenshot` e `get_variable_defs` responderam. Nenhum nó foi editado.
`get_design_context` **não foi chamado** (exige a instrução `figma-design-to-code`, que não
consegui carregar nesta sessão): por isso fills e bordas por nó não foram inspecionados
(ver seção 5).

## 2. O que o arquivo tem

Páginas (de `get_metadata` sem nodeId):

| id | Nome |
|---|---|
| `20:2131` | 01 — Wireframes |
| `20:2132` | 02 — Alta fidelidade |
| `1:66` | Componentes |

Na página `20:2132`: seção `10:3936` "49 telas de alta fidelidade" (frame `20:1065`, grupos por
módulo) e seção `62:1529` "Complementos de fluxo" (C01..C09, sem relação com esta feature).

**Os ids do briefing não batem com o arquivo.** O briefing cita `20:968` (baixa) e `20:2131`
(alta). No arquivo, `20:2131` é a **página "01 — Wireframes"**, não um frame de alta
fidelidade, e `20:968` é um **rótulo de texto** ("Navegação inferior / OS · Clientes ·
Catálogo · Financeiro / 3"), não um frame. Registro como dúvida, sem escolher por conta própria.

Frames das telas desta feature (todos lidos, 362 x 772, frame de tela 360 x 740):

| Tela | Frame | Id |
|---|---|---|
| Login, estado inicial | 1a — Login | `10:895` |
| Login, credencial inválida | 1b — Login — erro de credencial | `10:936` |
| "Sem conexão (padrão global)" | 1c, tela **Ordens de Serviço** | `10:981` |
| Perfil | 1av — Perfil | `10:3842` |
| Diálogo de logout | 1aw — Sair — confirmação | `10:3886` |
| Tab bar, Ordens ativa | símbolo | `20:1102` |
| Tab bar, Clientes ativa | símbolo | `20:1340` |

Capturas baixadas (só rascunho, não versionadas): scratchpad `figma-novo/` (login-1a, 1b, 1c,
perfil-1av, 1aw, tab-20-1102, tab-20-1340).

## 3. Estados: o que o Figma novo prevê

| Tela | Estados com frame | Estados que o código tem e o frame não |
|---|---|---|
| Login | 1a vazio (campo Usuário com borda de destaque), 1b erro de credencial (campos preenchidos, senha mascarada) | carregando ("Entrando..."), preenchido sem erro, erro de rede do login, sessão expirada |
| Perfil | 1av preenchido | carregando, erro (a sessão tem textos `sessao.*`) |
| Diálogo de logout | 1aw | — |
| Tab bar | selecionado (Ordens ou Clientes) e inativo | **foco** e **desabilitado**: não existem no frame |
| Sem conexão | 1c existe, mas como padrão global na tela Ordens de Serviço | não é frame do Login nem do Perfil |

Regra aplicada (premissa 5): estado que o frame prevê e o código não tem = divergência real.
Estado que só o código tem **não é divergência do frame**; vira pergunta (seção 6, item 6), não
invento frame. "Sem conexão" não se aplica ao Login nem ao Perfil enquanto o frame for da tela
Ordens de Serviço.

## 4. Divergências provisórias (por leitura, sem captura do app)

Base: frame do Figma novo (metadata, screenshot, variáveis) contra `strings.ts` e `tokens.ts` na
linha `refactor/f40-estrutura-ui-sobre-f41` (0c82d49). **Não houve captura do app nesta rodada**:
é tarefa do CRIVO no aparelho do protocolo. Por isso nenhuma linha abaixo é "só de plataforma"
confirmada; todas são candidatas a **real** e dependem de decisão (US-PAR-05/06). Ids `N-` para
não se confundir com R-01..R-15 do desenho antigo.

### Login

| Id | Frame | Código hoje | Observação |
|---|---|---|---|
| N-01 | Rótulo "Usuário", placeholder "Seu usuário" | "E-mail", "seu@email.com" | Texto. **Conflito de comportamento**: a API autentica por e-mail. Trocar o rótulo sem trocar o campo engana quem digita. Decisão da pessoa. |
| N-02 | Emblema escudo 84x96 + "MECÂNICA SÃO JORGE" (Barlow Condensed Bold 30, espaçamento 0,6) + "Gestão da oficina", sobre fundo Pampas `#F7F5F2` | Faixa petro com "Entre com sua conta" | Estrutura e texto (`login.subtitulo`). Falta o ativo do emblema no app. |
| N-03 | Erro: caixa com ícone de alerta e "Usuário ou senha incorretos. Confira os dados e tente novamente."; as duas bordas de campo em Crail | "E-mail ou senha incorretos." (`login.erroCredencial.mensagem`) | Texto e estrutura. |
| N-04 | Campo 304 x 46, rótulo 16 de altura, 6 entre rótulo e campo, 16 entre campos; botão Entrar 304 x 50 | campo 48 (`minTouchTarget`), botão 52 (`pageButtonHeight`) | Medida. Conflita com alvo de toque 48 (WCAG 2.2 AA 24, mas o token da casa é 48): decidir antes de mexer. |
| N-05 | Sem botão de mostrar senha | Tem ("Mostrar senha"/"Ocultar senha") | Controle que o código tem e o frame não. Recomendo manter e atualizar o Figma (acessibilidade), mas é decisão da pessoa. |
| N-06 | Títulos em Barlow Condensed, texto em Inter | `typography` sem `fontFamily` | Token novo (seção 5). |

### Perfil e diálogo

| Id | Frame | Código hoje | Observação |
|---|---|---|---|
| N-07 | Cabeçalho "Perfil" com botão voltar (seta) em petro; **sem tab bar** | Perfil é uma aba da tab bar, sem seta voltar | Estrutura e navegação. Ver N-12. |
| N-08 | Avatar 84, iniciais "JS" Barlow 32 sobre Spectra `#33575D` | `avatarSize: 64`, iniciais 20 | Medida e token. |
| N-09 | Nome "João da Silva" (Barlow, 24/600), selo "ADMIN" pílula petro, texto 12 | `heading` 17/600, selo 11 | Tipografia. |
| N-10 | Cartão: "Usuário joao.silva", "Perfil de acesso Administrador", "Versão do app 1.0.0" | "Nome", "E-mail", "Perfil de acesso" | Texto e conteúdo. "Versão do app" não existe no código nem na API: de onde vem o valor? Não invento. |
| N-11 | Botão "Sair da conta" (contorno, texto Crail) fixo no rodapé da tela | "Sair" (`perfil.botaoSair.rotulo`) | Texto e posição. |
| N-11b | Diálogo: "Sair da conta?", "Você vai precisar do usuário e senha para entrar de novo.", Cancelar (contorno petro) e Sair (Crail), fundo petro a 55% | "Deseja realmente sair?", "...e-mail e senha.", scrim preto 50% | Texto, token (`overlayScrim`). Depende de N-01. |

### Tab bar

| Id | Frame | Código hoje | Observação |
|---|---|---|---|
| N-12 | **4 itens: Ordens, Clientes, Catálogo, Financeiro. Perfil não está na barra**; o acesso ao Perfil é um botão de usuário 36 x 36 no canto direito do cabeçalho (visto no 1c) | 5 itens: Perfil habilitado + Clientes e Veículos, Catálogo, Ordens de Serviço, Financeiro desabilitados | **Divergência estrutural e de navegação.** Muda o fluxo da F33 e o PRD (US-MENU-02). Fora do alcance de "só aparência" da F41 (premissa 7). Decisão da pessoa. |
| N-13 | Rótulos "Ordens" e "Clientes" | "Ordens de Serviço" e "Clientes e Veículos" | Texto, na chave de i18n. |
| N-14 | Selecionado = ícone e rótulo em vermelho, sem pílula; barra 360 x 62; ícone 22; rótulo 10,5 | Pílula 56 x 32; altura 64; rótulo 10 | Estrutura e medida. |
| N-15 | Sem estado desabilitado nem foco desenhados | Quatro desabilitados e anel de foco | Estados do código sem frame. Pergunta (seção 6, item 6). |

Itens do código sem equivalente no frame (botão de usuário no cabeçalho) entram na decisão N-12.

## 5. Contraste AA com as cores do Figma novo (US-PAR-15)

Cálculo WCAG 2.x rodado em `scratchpad/contrast.py`. Cores vêm de `get_variable_defs` dos frames
`10:895` e `10:3886`: Te Papa/petro `#1E3A3F`, Crail `#B5453D`, Pampas `#F7F5F2`, Flint `#6E6A66`,
Dawn `#A8A39D`, Westar `#E2DEDA`, Spectra `#33575D`, branco. **Qual cor cada nó usa foi lida na
captura, não no nó** (sem `get_design_context`), então as linhas marcadas (?) precisam de
confirmação por nó antes de virar divergência fechada.

| Uso | Par | Razão | Meta | Resultado |
|---|---|---|---|---|
| Título e valores | petro sobre Pampas / branco | 11,14 / 12,12 | 4,5 | OK |
| Rótulos e subtítulo | Flint sobre Pampas / branco | 4,93 / 5,36 | 4,5 | OK |
| Entrar, Sair do diálogo | branco sobre Crail | 5,41 | 4,5 | OK |
| "Sair da conta" | Crail sobre Pampas | 4,97 | 4,5 | OK |
| Selo ADMIN, título do cabeçalho, seta e ícone de usuário | branco sobre petro | 12,12 | 4,5 / 3 | OK |
| Iniciais do avatar | branco sobre Spectra | 7,89 | 3 (texto grande) | OK |
| Tab inativa (?) | Dawn sobre petro | 4,84 | 4,5 texto, 3 ícone | OK |
| **Placeholder (?)** | Dawn sobre branco | **2,50** | 4,5 | **ABAIXO** |
| **Tab selecionada** | Crail sobre petro | **2,24** | 4,5 texto, 3 ícone | **ABAIXO** |
| **Borda de campo em repouso (?)** | Westar sobre branco | **1,34** | 3 | **ABAIXO** se Westar for a borda |
| **Texto na caixa de erro (?)** | Crail sobre tom de erro estimado `#EFE0DC` | **4,21** | 4,5 | **ABAIXO**; fundo estimado (Crail 12% sobre Pampas), não lido do nó |
| Borda de campo com erro/foco | Crail sobre Pampas | 4,97 | 3 | OK |
| Botão de contorno (Cancelar) | petro sobre Pampas | 11,14 | 3 | OK |

Pares abaixo de AA viram divergência real tratada pela US-PAR-07: **D-AA-1** placeholder,
**D-AA-2** tab selecionada (mesmo 2,24:1 já conhecido no ADR-014), **D-AA-3** borda de campo,
**D-AA-4** texto de erro. D-AA-3 e D-AA-4 aguardam a leitura por nó. O X do alerta e o avatar
foram calculados (avatar OK). O "X" do botão fechar não aparece em nenhum dos frames lidos:
**não se aplica**.

Não consegui ler: fill exato do fundo da caixa de erro, cor da borda do campo, cor do rótulo
da tab inativa e do ícone de alerta (só pela captura).

## 6. Diff de tokens: `tokens.ts` x variáveis do Figma novo (US-PAR-07)

O arquivo novo **não tem tokens semânticos nomeados** (`color/surface/...`): as variáveis lidas
são primitivos importados (`color/grey/42`, `Flint`, etc.). Diff contra `tokens.ts`:

| Papel | `tokens.ts` | Figma novo | Situação |
|---|---|---|---|
| petro | `#1E3A3F` | `#1E3A3F` | igual |
| primary | `#B5453D` | `#B5453D` (Crail) | igual |
| fundo da tela | branco (`surface.default`) | Pampas `#F7F5F2` | muda |
| texto secundário | slate-700 `#334155` | Flint `#6E6A66` | muda |
| placeholder | slate-500 `#64748B` | Dawn `#A8A39D` | muda e **falha AA** |
| borda / skeleton | slate-500, slate-200 | Westar `#E2DEDA` | muda |
| avatar | — | Spectra `#33575D` | novo |
| scrim | `rgba(0,0,0,.5)` | petro a 55% (`#1E3A3F8C`) | muda |
| fonte | sem `fontFamily` | Barlow Condensed (títulos), Inter | novo |
| `inlineAlertMinHeight` | 44 | caixa de erro do 1b com ~66 de altura (duas linhas), sem mínimo declarado | rever |
| `tabItemHeight` / pílula | 64 / 56x32 | 62 / sem pílula | muda |
| `pageButtonHeight` / campo | 52 / 48 | 50 / 46 | muda |

Nada foi alterado em `tokens.ts` nem em variável do Figma. Quando a pessoa decidir, o token entra
nos dois lados juntos.

## 7. Conflitos com regras e documentos já escritos

1. `F41-conferencia-paridade-referencias.md` (linha 37, ramo `refactor/f40-estrutura-ui-sobre-f41`)
   diz que `FPdB8RymAnN81pbKfizdzE` "não é referência de paridade". A observação da pessoa em
   14/11 diz o contrário. Prevalece a decisão mais nova da pessoa, mas o texto precisa ser
   corrigido na mesma entrega.
2. Briefing, exceção temporária: o alta de Login, Perfil, logout e tab bar só é redesenhado depois
   que a F41 fecha, e o frame novo fica "redesenho aguardando código", fora da paridade. O arquivo
   novo já tem esses frames. Se valerem como referência da F41, a exceção e a ordem F41 -> F39 ->
   código precisam ser reescritas pela pessoa.
3. Os frames novos incluem mudanças de navegação (N-12) e de campo de login (N-01), que a F41
   proíbe (premissa 7: sem mudança de comportamento ou endpoint).

## 8. Perguntas para a pessoa (nenhuma foi respondida)

1. Quais frames valem: `10:895`, `10:936`, `10:3842`, `10:3886` e os símbolos `20:1102`/`20:1340`?
   E os ids `20:968`/`20:2131` do briefing: o que eram de fato (hoje são texto e página)?
2. Esse arquivo é a v2 da F39? Se sim, a exceção temporária do briefing e a linha 37 do
   documento de referências mudam.
3. Login pede "Usuário" ou "E-mail"? (N-01; a API é por e-mail.)
4. A tab bar passa a ter 4 itens sem Perfil, com Perfil no cabeçalho? Isso é feature de
   navegação própria ou entra na F41? (N-12)
5. Perfil mostra "Versão do app"? Qual a fonte do valor? (N-10)
6. Estados que só o código tem (carregando, preenchido, rede, sessão expirada, foco, desabilitado,
   mostrar senha): o Figma ganha frame ou o código remove? Sugestão: o Figma ganha frame.
7. Dúvidas 2 e 4 da F41 seguem abertas: aparelho do protocolo e local das capturas.

## 9. O que NÃO foi feito nesta rodada

- Nenhuma captura do app, de nenhum estado (tarefas 7, 9, 11 são do CRIVO no aparelho).
- Nenhum nó do Figma editado; `figma.md` e `tokens.ts` intactos.
- Nenhuma correção de código, nenhum teste rodado nesta rodada. Os testes de `alert-icon`,
  `inline-alert` e `screen-header` seguem o desenho antigo e ficam para o ORLA depois da lista
  decidida.
- Fluxo real contra a API não repetido.

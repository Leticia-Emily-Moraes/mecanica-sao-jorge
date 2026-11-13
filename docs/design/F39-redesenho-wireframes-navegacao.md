# F39 — Redesenho de wireframes com inspiração de navegação (Figma)

- Autor: ESQUADRO (etapa 3 de 4: BUSSOLA → CARTOGRAFO → ESQUADRO → CRIVO)
- Data: 2026-11-13
- PRD: `docs/product/F39-redesenho-wireframes-navegacao-figma.md` (ainda na v1; ver seção 9)
- ADR: `docs/architecture/adr/ADR-014-adotar-referencia-figma-como-nova-identidade-visual.md` (não rastreado no git)
- Referência: `https://www.figma.com/design/FPdB8RymAnN81pbKfizdzE/Untitled` (file_key `FPdB8RymAnN81pbKfizdzE`, node `1:66`)
- Arquivo do wireframe: `DLqbSzzKRxiN2eyvXG73Lr` (página `3:2` "F24 · Wireframe baixa fidelidade")

## Status: leitura e análise concluídas; edição dos 96 frames NÃO iniciada (US-WFR-15b)

| Parte | Situação |
|---|---|
| Acesso ao Figma | OK nesta sessão (`whoami`, `get_metadata`, `get_design_context`, `get_screenshot`, `get_variable_defs`) |
| Versão nomeada da F24 aprovada (pré-requisito de qualquer edição) | **BLOQUEADA**. Nenhum nó do arquivo foi alterado |
| Redesenho dos 96 frames | **Não feito**, consequência do item acima |
| Quadro comparativo de tokens | Feito (seção 4) |
| Contraste da paleta da referência | Feito (seção 5) |
| Agrupamento, hierarquia e node-ids da referência | Feito (seção 6) |
| Componentes de navegação com motivo | Proposto, não aplicado (seção 7) |
| Grafo de navegação | Gaps cruzados com a referência; mapa **não** reescrito (seção 8) |
| Débito com o F33 | Registrado para a REGENTE (seção 10) |
| Lista de impacto | Feita (seção 11) |

## 1. Bloqueio: versão nomeada (US-WFR-15b)

A premissa 11 do briefing (D4) manda sobrescrever as páginas da F24 e proteger a F24 aprovada com uma versão nomeada criada antes da primeira edição. Tentei criá-la pelo `use_figma`:

```js
await figma.saveVersionHistoryAsync('F24 aprovada (pré-F39)', '…');
```

Saída real:

```
{"pages":[{"id":"3:2","name":"F24 · Wireframe baixa fidelidade","n":94},{"id":"28:2",…},{"id":"39:2",…}],
 "typeofFn":"function",
 "error":"in saveVersionHistoryAsync: \"saveVersionHistoryAsync\" is not a supported API"}
```

Consequência, conforme US-WFR-15b: nenhuma página da F24 foi editada. A chamada não alterou nenhum nó (a página tinha 94 filhos antes e a chamada só leu). Também não criei cópia da página nem arquivo novo: a D4 escolheu explicitamente sobrescrever em vez de duplicar, e trocar isso por conta própria seria decisão que não é minha.

**O que destrava (qualquer uma, decisão da pessoa):**
1. A pessoa abre o arquivo `DLqbSzzKRxiN2eyvXG73Lr` no Figma e salva a versão pelo menu (nome sugerido: `F24 aprovada (pré-F39)`), e informa o nome e o id (o id aparece na URL ao abrir a versão no histórico, parâmetro `version-id`). Eu não consigo ler o histórico por esta ferramenta, então vou conferir só pelo que a pessoa informar, e isso fica escrito como "informado, não verificado".
2. A pessoa autoriza trocar a D4 por "duplicar a página F24 como `F24 · aprovada (arquivo morto)` dentro do mesmo arquivo". É um desvio da D4, por isso só com autorização escrita.

## 2. Acesso e leitura da referência

- `whoami`: handle "Leticia Moraes", plano `team::1274094162661077353`, sem erro de permissão.
- Páginas da referência: `20:2131` "01 — Wireframes" (40 telas), `20:2132` "02 — Alta fidelidade" (49 telas, título da seção) e `1:66` "Componentes" (175 símbolos de ícone `variant=1..175`).
- O `node-id=1-66` do link aponta para a página "Componentes", que é só uma pilha de ícones. A estrutura de menu e de agrupamento está nas páginas `20:2131` e `20:2132`; os node-ids da seção 6 vêm delas.
- Não li cada tela em detalhe: li a estrutura completa por `get_metadata`, o frame "Autenticação" (`20:1066`) por `get_design_context`, o conjunto de variáveis por `get_variable_defs` do frame `20:1065` e a captura geral. Os textos pequenos dos botões nas telas de módulo foram conferidos só visualmente, na captura reduzida.

## 3. Direito de uso da referência (D2, US-WFR-12): continua em aberto

Evidências lidas no arquivo (fatos, não conclusão):
- O nome da seção de componentes é `Telas Alta Fidelidade Mecânica São Jorge (offline).html.html by html.to.design ❤️ FREE version - 11/11/2026, 19:11:55 GMT-3`: o arquivo foi gerado por importação de um HTML local, em 11/11/2026.
- Os chips de identificação das telas têm link para `http://127.0.0.1:50072/__h2d_index.html#…`, isto é, servidor local.
- O conteúdo é o do próprio produto ("MECÂNICA SÃO JORGE", "Gestão da oficina", as mesmas telas do UX-UI-MAPEAMENTO), e a paleta coincide com o `identidade-visual.md` do repositório em todos os 14 hexadecimais distintos de cor que o `identidade-visual.md` define (marca, neutros, status e aba inativa; seção 4).
- Não há campo de titularidade que eu possa ler: o acesso da conta autenticada ao arquivo não prova autoria.

Isso indica que a referência é derivada do próprio projeto, mas **eu não consigo provar titularidade**. A D2 só se fecha com a resposta da pessoa ("o arquivo é meu / foi gerado por mim a partir do HTML do projeto"). Enquanto isso, BUSSOLA não deve aprovar como base de identidade.

Fontes:

| Família | Licença | Disponibilidade no Expo |
|---|---|---|
| Barlow Condensed (títulos) | OFL-1.1 | Pacote `@expo-google-fonts/barlow-condensed` 0.4.1, licença `MIT AND OFL-1.1` (verificado com `npm view`) |
| Inter (corpo) | OFL-1.1 | `@expo-google-fonts/inter` 0.4.2, `MIT AND OFL-1.1` (verificado com `npm view`) |
| JetBrains Mono | OFL-1.1 | Só aparece nos chips de anotação "1a, 1b…" da referência, não é fonte de produto; não adotar |

`expo-font ~14.0.12` já está no `apps/mobile/package.json`; o pacote `@expo-google-fonts/*` ainda não está. Nenhuma instalação foi feita (fora do escopo da F39).

Nenhum ícone, imagem ou fonte foi copiado para o arquivo do wireframe. Os 175 ícones da referência não foram baixados.

## 4. Quadro comparativo de tokens (US-WFR-09 e US-WFR-11)

Fonte da referência: `get_variable_defs` do frame `20:1065` e `get_design_context` do frame `20:1066`. Fonte vigente: `apps/mobile/src/theme/tokens.ts`, coleção Figma `OP-002 Tokens de cor` (`VariableCollectionId:28:3`, lida por `use_figma` somente leitura) e `docs/design/identidade-visual.md`.

### 4.1 Cor

| Papel | Vigente (`tokens.ts` / coleção F25) | Referência | `identidade-visual.md` | Mudança |
|---|---|---|---|---|
| Marca escura (header, tab bar, texto principal) | petro900 `#1E3A3F` | Te Papa Green `#1E3A3F` | `#1E3A3F` | **igual** |
| Marca / ação primária | primary600 `#B5453D` | Crail `#B5453D` | `#B5453D` | **igual** |
| Primária pressed | não existe | El Salva `#923631` | `#923631` | novo |
| Petro claro | não existe | Spectra `#33575D`; petro intermediário `#2C5258` | `#33575D` / `#2C5258` | novo |
| Fundo de tela | white `#FFFFFF` (surface/default) | Pampas `#F7F5F2` | `#F7F5F2` | muda |
| Superfície (card, input) | white `#FFFFFF` | white `#FFFFFF` | `#FFFFFF` | igual |
| Texto secundário | slate700 `#334155` | Flint `#6E6A66` | `#6E6A66` | muda |
| Texto desabilitado / placeholder | não existe | Dawn `#A8A39D` | `#A8A39D` | novo (falha AA, seção 5) |
| Borda | slate500 `#64748B` | Westar `#E2DEDA` | `#E2DEDA` | muda (falha 3:1, seção 5) |
| Skeleton (fundo) | slate100 `#F1F5F9` | `#EDE9E4` (color/grey/91) | não define | muda |
| Skeleton (borda) | slate200 `#E2E8F0` | sem equivalente lido | não define | sem referência |
| Scrim do modal | `rgba(0,0,0,.5)` | petro a 55% `#1E3A3F8C` | não define | muda |
| Erro (texto) | primary600 (mesma cor da marca) | El Salva `#923631` sobre Pot Pourri `#F6E7E5`, borda Rose Fog `#E2B5B0` | `#B5453D` | muda; ver ADR-014 achado 1 |
| Erro (borda do campo) | primary600 | Crail `#B5453D`, 2 px | `#B5453D` | igual |
| Aviso (banner) | não existe | Kumera `#7A5620` sobre Albescent `#F7EEDD`, borda Zombie `#E3CB9E` | não define | novo |
| Sucesso (toast, badge) | não existe | Killarney `#3E6E4A`; Gin `#E4EEE6` | `#3E6E4A` | novo |
| Badge ABERTA / PENDENTE | não existe | Natural Gray `#8C8780` | `#8C8780` | novo (falha AA, seção 5) |
| Badge AGUARDANDO_PECA / PARCIAL | não existe | Tussock `#BF8B3D` | `#BF8B3D` | novo (falha AA) |
| Badge FINALIZADA / PAGO | não existe | Spring Leaves `#5C8C68` | `#5C8C68` | novo (falha AA) |
| Tab bar: item inativo | white (`onBrand`) | Tide `#B7B2AC` | `#B7B2AC` | muda |
| Tab bar: item ativo | pill primary com texto branco (F34) | texto e ícone Crail direto sobre petro | `primary` sobre petro | **diverge do F34**; 2,24:1 falha (seção 5) |
| Anel de foco | petro + halo branco | não definido na referência | não define | manter o do app |

Resultado: marca escura e primária são **idênticas**. A referência não "substitui petro e primary": a mudança real está nos neutros, nos tons de status e de erro, na tipografia e na forma (4.2 e 4.3).

### 4.2 Tipografia

| Papel | Vigente | Referência |
|---|---|---|
| Família | Nenhuma definida em `tokens.ts` (fonte do sistema); wireframe F24 em Inter | Títulos: Barlow Condensed (Bold/SemiBold). Corpo: Inter (Regular/Medium/SemiBold) |
| Título de tela (header) | `title` 24/700 | Barlow Condensed SemiBold 21, `letter-spacing` 0,21 |
| Marca no login | — | Barlow Condensed Bold 30, `letter-spacing` 0,6 |
| Título de módulo (anotação) | — | Barlow Condensed Bold 26 |
| Título de estado vazio/erro | — | Barlow Condensed SemiBold 20 |
| Corpo | `body` 16/400 | Inter Regular 14, entrelinha 21 |
| Texto de campo | `body` 16 | Inter Regular 15 |
| Rótulo de campo | `label` 14/600 | Inter Medium 13 |
| Botão | `button` 16/600 | Inter SemiBold 15 |
| Legenda / aba | `caption` 12/400 | Inter Medium/SemiBold 11 |
| Mensagem de erro | `caption` 12 | Inter Regular 14 (entrelinha 19,6) |

Tamanhos usados na referência (lidos nas variáveis): 10, 10,5, 11, 12, 13, 14, 15, 17, 18, 20, 22, 24, 26, 30, 32, 44. A referência tem 17 tamanhos; para virar escala, a feature de migração precisa reduzir para um conjunto fechado (proposta da seção 11, não decidida aqui).

### 4.3 Espaçamento, raio, borda, sombra e medidas

| Token | Vigente | Referência |
|---|---|---|
| Espaçamento | 4 / 8 / 16 / 24 / 32 | 3, 4, 6, 8, 9, 12, 14, 16 (padding de tela 16; vão entre campos 16; entre rótulo e campo 6) |
| Raio de botão e campo | `sm` 8 | 8 (igual) |
| Raio de card e de tela | `md` 12 | 10 |
| Raio de chip de anotação | — | 5 |
| Raio de badge | `pill` 999 | 999 (igual) |
| Borda | 1 px; anel 2 px | 1 px; erro e foco de campo 2 px |
| Sombra do card | não definida | `0 1 3 rgba(30,58,63,.12)` e `0 8 24 rgba(30,58,63,.08)` |
| Altura do botão | mínimo 48 | 50 |
| Altura do campo | — | 46 |
| Altura do header | — | 56 |
| Altura da tab bar | 64 + 20 de área segura (F34) | 62 |
| Botão de ícone do header | — | 36×36 (**abaixo do mínimo de 44 pt / 48 dp**; ver seção 5) |
| Frame de tela | 360 de largura | 362 (+ borda 1 px; Login 418 largura no wireframe) |

### 4.4 Estilos Figma no arquivo do wireframe

O arquivo `DLqbSzzKRxiN2eyvXG73Lr` tem 0 estilos de cor, 0 de texto e 0 de efeito (lido por `use_figma`) e uma única coleção de variáveis (`OP-002 Tokens de cor`, 22 variáveis). Amostra da página F24: 1.061 textos; fills `#1C1C1C` (538), `#737373` (414), `#FFFFFF` (280), `#D9D9D9` (275), `#F9F9FA` (198); fonte só Inter (4 pesos); raios 6 (392), 4 (124), 12 (24), 32 (9). Ou seja, a F24 usa **valores soltos**, não variáveis; US-WFR-09 exige o contrário e vai exigir criar uma coleção v2 (primitivos → semânticos → componente) antes de pintar os frames. A coleção F25 (`28:3`) não deve ser editada.

## 5. Contraste WCAG 2.2 AA da paleta da referência (US-WFR-10)

Calculado por script (fórmula de luminância relativa do WCAG 2.2), sem ferramenta externa de segunda fonte. Texto normal ≥ 4,5:1; texto grande, componente de interface e anel de foco ≥ 3:1.

| Par (texto ou elemento / fundo) | Razão | Mínimo | Resultado |
|---|---|---|---|
| Petro `#1E3A3F` / Pampas `#F7F5F2` | 11,14:1 | 4,5 | passa |
| Petro / branco | 12,12:1 | 4,5 | passa |
| Flint `#6E6A66` / Pampas | 4,93:1 | 4,5 | passa |
| Flint / branco | 5,36:1 | 4,5 | passa |
| Branco / Crail `#B5453D` (botão) | 5,41:1 | 4,5 | passa |
| Crail / branco (mensagem de erro) | 5,41:1 | 4,5 | passa |
| Crail / Pampas | 4,97:1 | 4,5 | passa |
| El Salva `#923631` / Pot Pourri `#F6E7E5` (banner) | 6,26:1 | 4,5 | passa |
| Crail / Pot Pourri | 4,50:1 | 4,5 | passa sem folga |
| Branco / petro (header) | 12,12:1 | 4,5 | passa |
| Tide `#B7B2AC` / petro (aba inativa) | 5,76:1 | 4,5 | passa |
| Branco / Spectra `#33575D` (EM_ANALISE) | 7,89:1 | 4,5 | passa |
| Branco / `#2C5258` (EM_ANDAMENTO) | 8,55:1 | 4,5 | passa |
| Branco / Killarney `#3E6E4A` (ENTREGUE) | 5,94:1 | 4,5 | passa |
| Kumera `#7A5620` / Albescent `#F7EEDD` (aviso) | 5,73:1 | 4,5 | passa |
| Anel de foco petro / branco | 12,12:1 | 3 | passa |
| Anel de foco branco / petro | 12,12:1 | 3 | passa |
| **Dawn `#A8A39D` / branco (placeholder, desabilitado)** | **2,50:1** | 4,5 | **falha** |
| **Dawn / Pampas** | **2,30:1** | 4,5 | **falha** |
| **Branco / Natural Gray `#8C8780` (ABERTA, PENDENTE)** | **3,56:1** | 4,5 | **falha** |
| **Branco / Tussock `#BF8B3D` (AGUARDANDO_PECA, PARCIAL)** | **3,01:1** | 4,5 | **falha** |
| **Branco / Spring Leaves `#5C8C68` (FINALIZADA, PAGO)** | **3,88:1** | 4,5 | **falha** |
| **Borda Westar `#E2DEDA` / branco (campo)** | **1,34:1** | 3 | **falha** |
| **Borda Westar / Pampas** | **1,23:1** | 3 | **falha** |
| **Crail / petro (item ativo da tab bar)** | **2,24:1** | 3 | **falha** (já tratado no F34 com pill) |
| **Anel de foco petro / Crail (sobre o botão)** | **2,24:1** | 3 | **falha** (já tratado com halo branco) |

### Ajustes propostos (valor antes → depois)

Não aplicados, porque nenhum frame pôde ser editado. São a proposta que entra na coleção v2.

| Uso | Antes | Depois | Razão depois |
|---|---|---|---|
| Placeholder e texto desabilitado | Dawn `#A8A39D` | Flint `#6E6A66` (sem criar cor nova); desabilitado se distingue por ícone, rótulo e opacidade do controle, como no F34 | 5,36:1 sobre branco |
| Borda de campo e de card que delimita controle | Westar `#E2DEDA` | Natural Gray `#8C8780` | 3,56:1 sobre branco |
| Borda decorativa de card (não é controle) | Westar | Westar (mantém; separador decorativo não exige 3:1) | — |
| Badge ABERTA / PENDENTE | `#8C8780` + branco | `#6E6A66` + branco (ou `#7A7670`, 4,51:1) | 5,36:1 |
| Badge AGUARDANDO_PECA / PARCIAL | `#BF8B3D` + branco | `#7A5620` + branco | 6,60:1 |
| Badge FINALIZADA / PAGO | `#5C8C68` + branco | `#477654` + branco | 5,27:1 |
| Item ativo da tab bar | Crail sobre petro | Manter o pill do F34 | 5,41:1 (branco sobre Crail) |

Pontos que o contraste não cobre e que a referência tem:
- **Alvo de toque**: o botão de ícone do header mede 36×36 (`10:992`). O mínimo adotado no projeto é 48 dp (`minTouchTarget`). No wireframe revisado a área de toque tem que ser 48×48, mesmo com ícone de 18.
- **Informação só por cor**: os badges têm texto, então não dependem só de cor. Na referência o erro de campo tem borda vermelha **e** texto com ícone; manter os dois.
- Os quatro estados de foco, erro e vazio não foram medidos um a um porque os frames novos não existem.

## 6. Agrupamento e hierarquia da referência, com node-ids (US-WFR-02)

### 6.1 Hierarquia lida

```
Página 20:2132 "02 — Alta fidelidade"
└─ 10:3936  Seção "Mecânica São Jorge — 49 telas de alta fidelidade"
   └─ 20:1065  "Alta fidelidade — telas organizadas por módulo"
      ├─ 20:1066  Autenticação
      ├─ 20:1067  Clientes e Veículos
      ├─ 20:1068  Catálogo
      ├─ 20:1069  Ordens de Serviço
      ├─ 20:1070  Financeiro
      ├─ 20:1071  Perfil
      └─ 20:1072  Componentes reutilizáveis — alta fidelidade

Página 20:2131 "01 — Wireframes" (baixa fidelidade, tons de cinza)
└─ 1:1811  Seção "Mecânica São Jorge — 40 telas organizadas"
   └─ 20:1051  "Telas e componentes — organização por módulos"
      ├─ Telas principais (1a–1v):   20:1052 Autenticação · 20:1053 Clientes · 20:1054 Catálogo ·
      │                              20:1055 Ordens de Serviço · 20:1056 Financeiro · 20:1057 Perfil
      ├─ Estados e validações (2a–2r): 20:1058 Padrões globais de erro e feedback ·
      │                              20:1059 Clientes/Veículos · 20:1060 Catálogo ·
      │                              20:1061 OS · 20:1062 Financeiro
      └─ 20:1064  Componentes reutilizáveis — wireframes
```

Dois eixos de organização que o wireframe atual (F24) não tem:
1. **Por módulo, em blocos com cabeçalho**: cada módulo é um bloco de 1880 px de largura com título, em vez de uma fila única de 24 linhas × 5 colunas.
2. **Telas principais separadas de "Estados e validações"**: o estado preenchido fica no bloco do módulo; erro, vazio e validação ficam em um segundo grupo (20:1058 a 20:1062), com os padrões globais (erro de credencial, falha de rede, toast de sucesso, toast de erro, modal de exclusão, vazios) juntos em um bloco só.

### 6.2 Correspondência com as 24 telas (inventário fechado)

| Grupo de telas (F39) | Telas | Frames de referência (hi-fi `20:106x`; wireframe `20:105x`) | Agrupamento e hierarquia adotados |
|---|---|---|---|
| Autenticação | 01 Login | `1a` Login (`1:885`); `2a` erro de credencial (`1:106`); `2b` falha de rede (`1:168`) | Login isolado, sem tab bar; erro de rede com o padrão global |
| Clientes e Veículos | 03 a 09 | `1b` lista (`1:912`), `1c` detalhe (`1:970`), `1d` criar/editar (`1:1020`), `1e` detalhe do veículo (`1:1053`), `1f` criar/editar veículo (`1:1096`); `2i` e `2j` validação (`1:452`, `1:491`); `2e` modal de exclusão (`1:283`); `2f` vazio (`1:329`) | Veículo agrupado sob o cliente: o detalhe do cliente lista os veículos e leva ao detalhe do veículo, em vez de ser módulo separado |
| Catálogo | 10 a 16 | `1g` lista de serviços (`1:1137`), `1h` criar/editar (`1:1184`), `1i` lista de peças (`1:1213`), `1j` detalhe da peça (`1:1265`), `1k` criar/editar (`1:1301`), `1l` movimentação (`1:1330`); `2k`, `2l`, `2m` (`1:546` região) | Serviços e Peças na mesma aba, alternados por controle segmentado; movimentação de estoque nasce do detalhe da peça |
| Ordens de Serviço | 17 a 21 | `1m` lista (`1:1368`), `1n` criar (`1:1428`), `1o` detalhe (`1:1463`), `1p` selecionar serviços/peças (`1:1524`), `1q` alterar status (`1:1568`); `2n`, `2o`, `2p` (`1:653`, `1:689`, `1:725`); `2g` vazio (`1:365`) | Detalhe da OS concentra serviços, peças e parcelas; ações (alterar status, adicionar item) saem dele |
| Financeiro | 22 a 24 | `1r` parcelas em aberto (`1:1605`), `1s` detalhe e pagamento (`1:1660`), `1t` lançamentos (`1:1715`), `1u` novo lançamento (`1:1751`); `2q`, `2r` (`1:771`, `1:825`); `2h` vazio (`1:408`) | Parcelas e Lançamentos alternados por controle segmentado; pagamento abre a partir da parcela |
| Perfil | 02 Perfil | `1v` (`1:1791`) | Tela única com "Sair da conta" e confirmação em modal |

Mapeamento tela do inventário → tela da referência: 01→1a; 02→1v; 03→1b; 04→1c; 05 e 06→1d (a referência junta criar e editar em um frame "Criar/Editar"); 07 e 08→1f; 09→1e; 10→1g; 11 e 12→1h; 13→1i; 14 e 15→1k; 16→1l; 17→1m; 18→1n; 19→1o; 20→1q; 21→1o (parcelas dentro do detalhe da OS na referência); 22→1r; 23→1s; 24→1t e 1u.

**Telas da referência fora do inventário de 24** (não somadas, conforme premissa 2): `1j` Detalhe da Peça, `1p` Selecionar Serviços/Peças e, na alta fidelidade, `1ag` Adicionar Peça na OS (id `10:2899`, lido na seleção). Entram como pergunta para BUSSOLA (seção 9, item 4), porque sem elas dois gaps do mapa seguem abertos.

## 7. Componentes de navegação e motivo estrutural (US-WFR-08)

Proposta com base no que a referência já faz. Nada disso foi aplicado nos frames.

| Tela | Componente | Motivo estrutural |
|---|---|---|
| 02 Perfil, 04/09 exclusão, 20 cancelar OS | Modal central de confirmação (referência: `2e`, `2o`, confirmação de saída em `1v`) | Ação destrutiva ou irreversível exige decisão explícita, e o modal mantém a tela de origem visível por trás. Sem ele, o toque acidental em "Sair" ou "Excluir" age direto |
| 20 Transição de status | Bottom sheet (referência: `1q` e `2p`) | Escolha rápida entre poucas opções (os próximos status válidos) sem perder o contexto da OS. Tela cheia perderia o resumo da OS que explica a escolha |
| 18 Criar OS (adicionar serviço ou peça) | Bottom sheet ou tela de seleção (referência: `1p`, `1ag`) | Escolher item de lista longa com busca, preservando o formulário da OS. Fica como pergunta, pois `1p` está fora do inventário |
| 03, 10, 13, 17, 22 | Estado de erro de rede como modal sobre o conteúdo (padrão já adotado na F24, referência `2b`) | Mantém o que já foi carregado visível e oferece "Tentar novamente" |
| Drawer e menu flutuante | **Não proposto** | Com 5 posições de tab bar (F33) e módulos de uma lista cada, nenhum dos dois resolve problema estrutural. Não adicionar só porque a regra permite |

## 8. Grafo de navegação (US-WFR-03)

O mapa `docs/architecture/diagrams/navegacao-wireframe-f24.md` **não foi reescrito**: ele descreve frames que ainda não foram redesenhados, e reescrevê-lo antes dos frames criaria um documento que o Figma não confirma. O cruzamento dos seis gaps com a referência, para a edição futura:

| Gap do mapa original | O que a referência mostra | Fecha dentro das 24 telas? |
|---|---|---|
| 1 e órfã 07 (Veículos · criar sem entrada) | `1c` Detalhe do Cliente tem botões "+ Veículo" e "+ Nova OS" (visto na captura, texto pequeno) | Sim: botão em 04 leva a 07 |
| 2 (lista de Catálogo sem entrada declarada) | Aba Catálogo com controle segmentado Serviços/Peças | Sim |
| 3 (item da lista → editar implícito) | Item de lista com seta; ação de editar no header do detalhe (`1j`) | Parcial: referência usa tela de detalhe que o inventário não tem para Serviço e Peça |
| 4 (item do histórico → OS) | `1e` Detalhe do Veículo lista OS anteriores como itens | Sim |
| 5 e órfã 16 (Movimentação sem entrada) | `1j` Detalhe da Peça tem botão "Registrar movimentação" (visto na captura) | **Não** sem a tela `1j` ou sem decidir que o botão vive na lista 13 |
| 6 (22 → 23 implícito) | `1r` lista de parcelas leva a `1s` | Sim |

Estados carregando e erro com saída: na referência, `2b` oferece "Tentar novamente". Pendente aplicar nos frames.

## 9. Pendências para BUSSOLA e decisões que não são minhas

1. **PRD ainda na v1** (`docs/product/F39-…md`, de 2026-11-11): continua dizendo "visual excluído", "página nova" e "link não recebido". As decisões D1 e D4 e o link já existem. BUSSOLA precisa gravar a v2 e registrar nela o bloqueio da seção 1.
2. **A premissa de "troca de identidade" precisa ser reescrita** (ADR-014 e PRD v2): petro e primary **não mudam** (seção 4.1). O que muda é neutros, estados, tipografia e forma. Isso afeta a leitura da D1 e o tamanho da lista de impacto. Registrado aqui; a decisão de manter, reduzir ou refazer a D1 é da pessoa, com a REGENTE.
3. **D2** segue em aberto (seção 3).
4. **96 frames contra 93 células** (D7 de BUSSOLA): o inventário aplicável da F24 tem 93 células e a página tem 94 frames de tela. US-WFR-01 pede 96 (24 × 4). A conta fecha em 96 só se cada tela tiver exatamente os quatro estados, e hoje 16 telas não têm "Vazio" aplicável (formulários e detalhes). Preciso de decisão: (a) criar o "Vazio" dessas telas como formulário em branco ou detalhe sem dados, ou (b) corrigir o critério para a matriz de aplicabilidade. Fica registrado aqui porque a decisão de BUSSOLA muda o número de frames a editar.
5. Telas `1j`, `1p`, `1ag` da referência fora do inventário (seção 6.2).

## 10. Débito endereçado à REGENTE (US-WFR-05)

Divergência encontrada entre a navegação da referência e a decisão travada do F33:

| # | Divergência | Referência | F33 / F34 | Pergunta para a REGENTE |
|---|---|---|---|---|
| 1 | Número e conteúdo das abas | 4 abas: Ordens, Clientes, Catálogo, Financeiro (`20:1102`, frame de navegação inferior). Perfil não está na barra | 5 posições: Perfil habilitado + 4 desabilitadas | Perfil fica como aba (F33) ou passa a ser acesso pelo header (referência)? |
| 2 | Ordem | Ordens primeiro | Perfil primeiro; Ordens em quarto | Qual a aba de pouso do app quando as demais forem habilitadas? |
| 3 | Aba ativa | Texto e ícone Crail sobre petro (2,24:1, falha 3:1) | Pill Crail com texto branco (5,41:1) | Manter o pill do F34 (recomendação de acessibilidade) |
| 4 | Alvo de toque do botão do header | 36×36 | mínimo 48 | Manter 48 |

Divergência aberta nos pontos 1 e 2. **Não implementei nada** e o F33 e a tab bar não foram tocados. A decisão de abrir feature de revisão do menu é da REGENTE. Esta tabela precisa ser copiada para a seção 10 do PRD por BUSSOLA.

## 11. Lista de impacto da adoção da referência (US-WFR-11)

Sem alterar protótipo nem token nesta feature. Ajustada pelo achado de que petro e primary não mudam.

| Item | O que revisar | Tamanho |
|---|---|---|
| F25 (Login/Perfil) | Neutros (slate → quentes), erro (El Salva no banner), fundo Pampas, tipografia Barlow/Inter, raio 10, sombra do card. Marca não muda | médio |
| F26 a F29 (ainda não iniciadas) | Não começar em alta fidelidade sobre os neutros slate; usar a coleção v2 | evitável |
| F33/F34 | Decisão da REGENTE (seção 10); rever só cor de inativo (Tide) e fonte do rótulo | pequeno |
| `apps/mobile/src/theme/tokens.ts` | Trocar valores de neutros, adicionar status, erro, aviso, sucesso e `fontFamily`; **não renomear chaves** (ADR-014 regra 8). Dar valor próprio à cor de erro antes de mexer na marca (ADR-014 achado 1) | médio |
| `docs/design/identidade-visual.md` | Já descreve a referência (os 14 hexadecimais de cor que ele define aparecem na referência). Falta corrigir: seção 2.5 afirma AA em todos os pares e 7 pares falham (seção 5); nota de versão aponta divergência que passa a ser eliminada | pequeno |
| F40 e F41 | Base de comparação muda com os neutros; refazer a linha de base depois da migração | médio |
| Dependência | `@expo-google-fonts/barlow-condensed` e `@expo-google-fonts/inter` (OFL) | pequeno |

D3 (ordem e fatiamento) continua com quem prioriza o backlog e a REGENTE.

## 12. O que foi e o que não foi verificado

Verificado nesta sessão (saída real): `whoami`; leitura das três páginas da referência; `get_variable_defs`; `get_design_context` do frame `20:1066`; coleção de variáveis e amostra de fills, fontes e raios do arquivo da F24 por `use_figma` somente leitura; contraste por script; versões dos pacotes Expo de fonte por `npm view`; `git status` (ADR-014 não rastreado, nenhum arquivo de código tocado).

Não verificado ou não feito:
- Versão nomeada: bloqueada (seção 1). Nenhuma edição no Figma.
- Os 96 frames, estilos/variáveis v2, anotações de acessibilidade por estado (US-WFR-06) e grafo reescrito (US-WFR-03): não feitos.
- Texto pequeno de botões nas telas de módulo da referência: só visual.
- Titularidade da referência: não provada.
- Nenhum teste de código foi escrito ou executado: a entrega é documentação e leitura de Figma.

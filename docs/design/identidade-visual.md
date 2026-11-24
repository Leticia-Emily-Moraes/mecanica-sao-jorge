# Identidade Visual — App Mecânica São Jorge (React Native)

Baseado no `docs/product/ux-ui-mapeamento.md` e no `CLAUDE.md`. Define paleta de cores, tipografia, diretrizes de componentes e direção de logo/ícone para o app. Estilo escolhido: **industrial/robusto** — transmite força mecânica, oficina e confiança, evitando visual "fofo" ou genérico de app consumer.

> Nota de versão: documento de direção visual anterior aos protótipos F25/F34 no Figma. Os valores efetivamente implementados vivem em `apps/mobile/src/theme/tokens.ts` (única fonte de cor do app). As cores de marca (`#B5453D`, `#1E3A3F`) coincidem; neutros e escala tipográfica do app seguiram outra linha (neutros slate, escala 24/16/14/12) — em divergência, valem os tokens e o Figma.

---

## 1. Conceito

Linguagem visual de oficina ancorada nas cores do próprio nome — São Jorge (branco e vermelho, do escudo/cruz) — combinadas com azul petróleo como base escura, no lugar de grafite/preto puro. Tons dessaturados e mais escuros do que o vermelho/azul "de bandeira" para manter o resultado sóbrio e não agressivo. Tipografia condensada e firme nos títulos. Prioridade é legibilidade rápida em tela de trabalho (mecânico/atendente olhando o app no meio do serviço), não um visual decorativo.

---

## 2. Paleta de cores

### 2.1 Cores de marca

| Token | Hex | Uso |
|---|---|---|
| `primary` (Vermelho São Jorge) | `#B5453D` | Ações primárias: botões principais, ícone ativo da tab bar, links de destaque — vermelho terroso/dessaturado, não vermelho-sinal puro |
| `primary-dark` | `#923631` | Estado pressed/hover do primary |
| `petro` (Azul Petróleo) | `#1E3A3F` | Header, tab bar, textos de maior ênfase, fundo de telas escuras — substitui o grafite como base escura, mantendo a referência a óleo/oficina junto com a identidade São Jorge |
| `petro-light` | `#33575D` | Variante de superfície escura (cards sobre fundo petro, divisores em modo escuro) |

### 2.2 Neutros

| Token | Hex | Uso |
|---|---|---|
| `background` | `#F7F5F2` | Fundo padrão das telas — branco levemente quebrado, não branco puro |
| `surface` | `#FFFFFF` | Cards, inputs, modais |
| `border` | `#E2DEDA` | Bordas de cards/inputs |
| `text-primary` | `#1E3A3F` | Texto principal — usa o petro em vez de preto puro, mais suave |
| `text-secondary` | `#6E6A66` | Texto auxiliar, labels, metadados |
| `text-disabled` | `#A8A39D` | Campos/ações desabilitadas |

### 2.3 Cores de status — Ordem de Serviço

Badge colorido por status (ver `docs/product/ux-ui-mapeamento.md`, seção 5). Progressão pensada como "temperatura": cinza (não iniciado) → azul/âmbar (em curso) → laranja (execução ativa) → verde (concluído) → vermelho (cancelado), para o usuário reconhecer o estágio de longe, sem ler o texto.

| Status | Hex | Texto |
|---|---|---|
| `ABERTA` | `#8C8780` (cinza) | branco |
| `EM_ANALISE` | `#33575D` (petro claro) | branco |
| `AGUARDANDO_PECA` | `#BF8B3D` (âmbar dessaturado) | branco |
| `EM_ANDAMENTO` | `#2C5258` (petro intermediário — distinto do petro do header, indica "em curso") | branco |
| `FINALIZADA` | `#5C8C68` (verde dessaturado) | branco |
| `ENTREGUE` | `#3E6E4A` (verde escuro) | branco |
| `CANCELADA` | `#B5453D` (vermelho — cor de marca, reaproveitada para sinalizar encerramento) | branco |

### 2.4 Cores de status — Parcela/Pagamento

| Status | Hex | Texto |
|---|---|---|
| `PENDENTE` | `#8C8780` (cinza) | branco |
| `PARCIAL` | `#BF8B3D` (âmbar dessaturado) | branco |
| `PAGO` | `#5C8C68` (verde dessaturado) | branco |
| `ATRASADO` | `#B5453D` (vermelho — cor de marca) | branco |

Reaproveitar os mesmos tons de âmbar/verde/vermelho/cinza dos status de OS — mantém o vocabulário de cor consistente no app inteiro em vez de criar uma segunda escala.

### 2.5 Acessibilidade

Todos os pares texto/fundo acima têm contraste mínimo AA (4.5:1) para texto normal. O vermelho de marca (`#B5453D`) foi escolhido propositalmente mais escuro/terroso do que um vermelho-sinal puro (ex.: `#E53935`) para não soar "alerta" o tempo todo, já que ele aparece tanto em ações neutras (botão primário) quanto em status de atenção (`CANCELADA`, `ATRASADO`).

---

## 3. Tipografia

| Papel | Fonte | Peso/uso |
|---|---|---|
| Títulos/headers (telas, nomes de seção) | **Barlow Condensed** | SemiBold/Bold — condensada reforça o caráter "industrial", economiza espaço em telas de mobile com listas densas (lista de OS, lista de peças) |
| Corpo de texto, labels, inputs | **Inter** | Regular/Medium — alta legibilidade em tamanhos pequenos, padrão confiável para dados tabulares (valores, datas, status) |
| Números de destaque (valores monetários, totais) | **Inter** | SemiBold/Bold, tabular figures (`font-variant-numeric: tabular-nums`) — alinha dígitos em listas de valores |

Ambas disponíveis via Google Fonts, compatíveis com `expo-font` / `@expo-google-fonts` no React Native.

### Escala de tamanho sugerida

| Nível | Tamanho | Uso |
|---|---|---|
| `display` | 28px | Título de tela (ex.: "Ordens de Serviço") |
| `heading` | 20px | Título de seção/card (ex.: nome do cliente no detalhe) |
| `body` | 15px | Texto padrão |
| `caption` | 13px | Labels, metadados, timestamps |
| `badge` | 12px | Texto dentro de badges de status |

---

## 4. Diretrizes de componentes

- **Botão primário**: fundo `primary` (#B5453D), texto branco, cantos arredondados (8px), peso de fonte SemiBold. Reservado para a ação principal da tela (ex.: "Nova OS", "Registrar pagamento"). Por ser também a cor de `CANCELADA`/`ATRASADO`, usar sempre com texto/ícone claro e contexto óbvio (rótulo do botão), evitando ambiguidade.
- **Botão secundário**: fundo transparente, borda `petro`, texto `petro`. Para ações secundárias (ex.: "Cancelar", "Editar").
- **Botão destrutivo**: mesma cor do primário (`#B5453D`) já cobre exclusão/cancelamento — não criar um vermelho ainda mais forte só para isso, manter a paleta enxuta.
- **Cards**: fundo `surface` (branco), borda `border` 1px, cantos 8px, leve sombra (elevação 1). Card de OS na lista mostra badge de status no canto, alinhado à direita do título.
- **Badges de status**: pill (raio total), padding horizontal 10px/vertical 4px, cor conforme tabelas da seção 2.3/2.4, texto em `badge` (12px, SemiBold).
- **Inputs**: fundo `surface`, borda `border`, borda `primary` 2px quando focado. Mensagem de erro abaixo do campo em vermelho (#B5453D), tamanho `caption`.
- **Tab bar**: fundo `petro`, ícone/label ativo em `primary` (vermelho sobre petro tem bom contraste e remete à bandeira/escudo), inativo em cinza claro (#B7B2AC).
- **Header de tela**: fundo `petro`, texto branco, título em `heading`/Barlow Condensed.

---

## 5. Logo / ícone do app

Direção (conceito, não arte final): **escudo branco com uma listra/cruz vermelha** (referência direta e agora explícita ao símbolo de São Jorge), contorno em azul petróleo, com um elemento mecânico simples sobreposto — engrenagem ou chave inglesa estilizada em petro ou vermelho. O escudo reforça a dupla leitura "proteção/garantia do serviço" + identidade do nome da oficina. Manter o vermelho como listra/detalhe, não como preenchimento total do escudo, para o resultado ficar sóbrio e não parecer brasão religioso.

Para o ícone do app (launcher icon, formato quadrado/circular conforme plataforma), simplificar para só a engrenagem/chave em branco sobre fundo petro sólido — o escudo completo (branco + vermelho) funciona melhor em telas de login/splash, onde há mais espaço para a composi
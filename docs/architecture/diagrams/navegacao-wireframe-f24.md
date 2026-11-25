# Mapa de navegação entre telas — Wireframe F24 (24 telas)

- Autor: CARTOGRAFO (Arquiteto)
- Data: 2026-11-07 (F24). Revisão F39 em 2026-11-13: grafo alvo na seção 8.
- Fonte de verdade das telas: `docs/product/F24-wireframe-baixa-fidelidade.md`
  (seção 4) e `docs/design/F24-wireframe-baixa-fidelidade.md` (seção 6).
- Instrução que originou este artefato: comandante — "confirmar o mapa de
  navegação entre telas para o wireframe não criar fluxo órfão".

## 1. Para que serve

A matriz de cobertura de estado (PRD seção 5.4) verifica **estado por tela**
(vazio, carregando, erro de rede, erro de validação, preenchido). Ela **não**
verifica se cada tela é alcançável e se cada ação leva a algum lugar. Este mapa
é a outra metade do critério técnico: fecha o grafo de navegação das 24 telas e
lista, tela a tela, de onde se entra e para onde se sai, para que o CRIVO
consiga reprovar um fluxo órfão com a mesma objetividade com que reprova um
estado faltante.

**Definição de órfão aqui**: tela sem nenhuma aresta de entrada a partir da raiz
(inalcançável) ou ação de tela sem destino declarado (botão que não leva a lugar
nenhum).

## 2. Raiz e casa pós-login

- **Raiz**: `01 Login`. Única tela sem navegação de entrada (ponto de partida).
- **Casa pós-login**: `02 Perfil`, conforme F30 (tela de pouso da Sprint 01) e
  F33 (tab bar inferior como casa). Na Sprint 01 a tab bar tem só a aba Perfil;
  as demais abas entram sprint a sprint (F33). Para o wireframe das 24 telas,
  trate a tab bar como o **roteador de nível 0** que expõe o topo de cada módulo:

| Aba (tab bar, estado-alvo) | Tela-topo do módulo |
|---|---|
| Perfil | `02 Perfil` |
| Clientes | `03 Clientes · lista` |
| Catálogo | `10 Serviços · lista` + `13 Peças · lista` (ver nota A) |
| Ordens de Serviço | `17 Ordens de Serviço · lista` |
| Financeiro | `22 Financeiro · parcelas` + `24 Financeiro · lançamentos` (ver nota A) |

> **Nota A**: Catálogo reúne duas listas (Serviços e Peças) e Financeiro reúne
> duas telas-topo (Parcelas e Lançamentos). Como ESQUADRO expõe as duas dentro
> de uma aba (sub-aba, segmented control ou cabeçalho) é decisão de design, mas
> **ambas precisam ter entrada visível a partir da raiz** — senão `13 Peças ·
> lista` e `24 Financeiro · lançamentos` ficam órfãs em relação à tab bar.

## 3. Grafo de navegação

```mermaid
flowchart TD
    L[01 Login] -->|sucesso| P[02 Perfil]
    P -->|logout| L

    subgraph TAB[Tab bar pos-login - roteador nivel 0]
        P
        CL[03 Clientes lista]
        SL[10 Servicos lista]
        PL[13 Pecas lista]
        OL[17 OS lista]
        FP[22 Financeiro parcelas]
        FL[24 Financeiro lancamentos]
    end

    %% Clientes
    CL -->|Novo cliente| CC[05 Clientes criar]
    CL -->|toca item| CD[04 Clientes detalhe]
    CC -->|salva/cancela| CL
    CD -->|Editar cliente| CE[06 Clientes editar]
    CE -->|salva/cancela| CD

    %% Veiculos no fluxo do cliente
    CD -->|toca veiculo| VD[09 Veiculos detalhe + historico OS]
    CD -.->|GAP: Adicionar veiculo| VC[07 Veiculos criar]
    VC -->|salva/cancela| CD
    VD -->|Editar veiculo| VE[08 Veiculos editar]
    VE -->|salva/cancela| VD
    VD -->|toca item do historico| OD[19 OS detalhe]

    %% Servicos
    SL -->|Novo servico| SC[11 Servicos criar]
    SL -.->|implicito: toca item| SE[12 Servicos editar]
    SC -->|salva/cancela| SL
    SE -->|salva/cancela| SL

    %% Pecas
    PL -->|Nova peca| PC[14 Pecas criar]
    PL -.->|implicito: toca item| PE[15 Pecas editar]
    PL -.->|GAP: Movimentar estoque| ME[16 Movimentacao de estoque]
    PC -->|salva/cancela| PL
    PE -->|salva/cancela| PL
    ME -->|confirma/cancela| PL

    %% Ordens de Servico
    OL -->|Nova OS| OC[18 OS criar]
    OL -->|toca item| OD
    OC -->|cria/cancela| OD
    OD -->|Alterar status| OT[20 OS transicao]
    OD -->|link parcelas| OP[21 OS parcelas]
    OT -->|confirma/cancela| OD
    OP -->|Registrar pagamento| PG[23 Financeiro pagamento]

    %% Financeiro
    FP -.->|implicito: Registrar pagamento| PG
    PG -->|confirma/cancela| OP
    FL -->|Novo lancamento + salva| FL
```

Legenda: linha cheia = aresta declarada na spec de ESQUADRO; linha tracejada =
aresta **não declarada** (órfão ou implícita) que precisa ser fechada antes de
o wireframe ser aprovado.

## 4. Entrada e saída por tela (as 24)

| # | Tela | Entra a partir de | Sai para | Situação |
|---|---|---|---|---|
| 01 | Login | — (raiz) | 02 (sucesso) | OK |
| 02 | Perfil | tab bar; 01 (sucesso) | 01 (logout) | OK |
| 03 | Clientes · lista | tab bar | 04, 05 | OK |
| 04 | Clientes · detalhe | 03 (item) | 06, 09, **07** | **Gap 1** |
| 05 | Clientes · criar | 03 | 03/04 | OK |
| 06 | Clientes · editar | 04 | 04 | OK |
| 07 | Veículos · criar | **04 (sem botão hoje)** | 04/09 | **Gap 1 (órfão)** |
| 08 | Veículos · editar | 09 | 09 | OK |
| 09 | Veículos · detalhe + histórico | 04 (item veículo) | 08, 19 | **Gap 4** (item→19) |
| 10 | Serviços · lista | tab bar (Catálogo) | 11, 12 | **Gap 2** (nota A) |
| 11 | Serviços · criar | 10 | 10 | OK |
| 12 | Serviços · editar | **10 (item, implícito)** | 10 | **Gap 3** |
| 13 | Peças · lista | tab bar (Catálogo) | 14, 15, 16 | **Gap 2** (nota A) |
| 14 | Peças · criar | 13 | 13 | OK |
| 15 | Peças · editar | **13 (item, implícito)** | 13 | **Gap 3** |
| 16 | Movimentação de estoque | **sem entrada declarada** | 13 | **Gap 5 (órfão)** |
| 17 | Ordens de Serviço · lista | tab bar | 18, 19 | OK |
| 18 | Ordens de Serviço · criar | 17 | 19 | OK (consome 03/04/10/13 como seletor) |
| 19 | Ordens de Serviço · detalhe | 17 (item); 09 (histórico) | 20, 21 | OK |
| 20 | Ordens de Serviço · transição | 19 | 19 | OK |
| 21 | Ordens de Serviço · parcelas | 19 | 23 | OK |
| 22 | Financeiro · parcelas | tab bar | **23 (implícito)** | **Gap 6** |
| 23 | Financeiro · pagamento | 21; **22** | 21/22 | **Gap 6** |
| 24 | Financeiro · lançamentos | tab bar | 24 (form na mesma tela) | OK (nota A) |

## 5. Órfãos e lacunas de fluxo (decisão de design, não de schema)

Seis pontos a fechar antes da aprovação. Nenhum é decisão de arquitetura de
backend — são arestas de navegação que a spec de ESQUADRO precisa declarar
explicitamente. Dono da correção: **ESQUADRO** (spec) → **ORLA/F35/F36** (front).

1. **`07 Veículos · criar` é órfã.** A spec de `04 Clientes · detalhe` lista
   "Editar cliente" e a lista de veículos, mas **não** tem ação de adicionar
   veículo. Como "Veículos no fluxo do cliente" (Sprint 02), a única entrada
   coerente é um botão **"Adicionar veículo"** em `04`. Sem isso, não há como
   chegar à tela 07. → Adicionar a aresta `04 → 07`.
2. **Entrada das duas listas de Catálogo e das duas de Financeiro a partir da
   raiz** (nota A). Confirmar que `13 Peças · lista` e `24 Financeiro ·
   lançamentos` têm entrada visível na tab bar (sub-aba/segmented), senão ficam
   inalcançáveis a partir da casa pós-login.
3. **`12 Serviços · editar` e `15 Peças · editar` dependem de "tocar item".**
   Serviços e Peças **não têm tela de detalhe** — a edição é o destino do toque
   no item da lista. A spec de `10` e `13` descreve o item, mas não declara que
   ele navega para a edição. → Declarar explicitamente `10 → 12` e `13 → 15`.
4. **`09 → 19` (item do histórico de OS).** `09` lista o histórico de OS do
   veículo ("OS-0001 — …"), mas não diz se o item é tocável. → Confirmar se o
   item do histórico navega para `19 OS · detalhe` (recomendado) ou é só leitura.
5. **`16 Movimentação de estoque` é órfã.** A tela assume uma peça de contexto
   ("Peça: Filtro de óleo — FO-1023"), mas nenhuma tela declara como chegar
   nela. Como não há tela de detalhe de peça, a entrada natural é uma ação
   **"Movimentar estoque"** no item de `13 Peças · lista` (ou num detalhe de
   peça, se ESQUADRO decidir criar um). → Fechar a aresta de entrada de `16`.
6. **`22 Financeiro · parcelas → 23 Financeiro · pagamento`.** O pagamento só
   está cabeado a partir de `21 OS · parcelas`. Se `22` lista parcelas de todas
   as OS mas não permite pagar, há duas telas de parcela com affordance
   diferente. → Confirmar se `22` também leva a `23` (recomendado, consistência)
   ou se o pagamento é exclusivo do fluxo da OS.

Órfãos reais (telas inalcançáveis): **07 e 16**. Os demais são arestas
implícitas a tornar explícitas. Nenhuma tela fica sem caminho de volta — a
convenção 4.4 de ESQUADRO já prevê "cancelar"/voltar em todo formulário e
detalhe.

## 6. Revisão dos dois pontos do handoff da BUSSOLA

### 6.1 A matriz da seção 5.4 é suficiente como critério técnico?
**Suficiente para cobertura de estado, não para cobertura de fluxo.** A matriz
é objetiva e contável (93 frames) e serve ao CRIVO sem interpretação. Mas,
sozinha, deixaria passar um wireframe com as 24 telas e os 93 frames **e ainda
assim** com as telas 07 e 16 inalcançáveis. Recomendo que o critério de
aceitação do CRIVO passe a ser **matriz 5.4 (estado) + seção 4 deste mapa
(fluxo)**: toda tela marcada na seção 4 como "OK" tem entrada e saída; os seis
gaps fechados é pré-condição de US-DES-07 (aprovação).

### 6.2 As dúvidas de schema (dúvida 2 do PRD) têm impacto de arquitetura?
**Não para o wireframe; sim como pendência de migration já mapeada — com uma
lacuna nova.** O wireframe pode usar placeholder estrutural para campo sem
coluna (foi o que ESQUADRO fez, seção 3 da spec). A estratégia de migration
aditiva por feature já está registrada em `overview.md` ("Schema V2
incremental"), cobrindo `servicos.nome`, `pecas.nome`,
`movimentacoes_estoque.quantidade` etc. — **nada disso bloqueia a F24**.

Porém, revisando o mapa incremental de `overview.md`, **`clientes.cpf` e
`clientes.endereco` (pedidos por US-DES-04) não têm feature dona registrada** —
a tabela incremental não lista `clientes`. Corrigi isso em `overview.md` nesta
entrega, atribuindo a coluna à feature que primeiro grava o cliente (F09
Clientes criar / F03 módulo), por migration aditiva, conforme ADR-003. Não abre
ADR novo: é aplicação direta da decisão de schema aditivo já aceita.

## 7. Quando atualizar este mapa

- Se o comandante/BUSSOLA separar `24 Financeiro · lançamentos` em duas telas
  (dúvida 3 do PRD), a contagem vira 25 e as arestas de `24` mudam — republicar.
- Se ESQUADRO criar uma tela de **detalhe de peça** ou **detalhe de serviço**,
  as arestas dos gaps 3 e 5 mudam de destino.
- Toda nova tela de módulo (sprints seguintes) entra aqui com entrada e saída
  antes de o front da feature começar.
- Quando o ESQUADRO concluir a edição da F39 e o CRIVO conferir, a seção 8 deixa
  de ser alvo e passa a descrever o Figma. Quando a REGENTE decidir os débitos 1
  e 2 da F39, as arestas tracejadas de 8.2 são fixadas.

## 8. Revisão F39: grafo alvo (2026-11-13)

- Autor: CARTOGRAFO (etapa 2 da rota da F39).
- Status: **alvo proposto**. É o contrato de navegação que o ESQUADRO desenha nos
  frames da F39. Só passa a descrever o Figma depois da edição (gate G1 do PRD) e
  da conferência do CRIVO (US-WFR-03). As seções 2 a 5 ficam como registro da F24
  aprovada e não são editadas.
- Fontes: PRD F39 v2 (D6, US-WFR-03, US-WFR-16, US-WFR-17, débitos 1 e 2 da seção
  11), spec `docs/design/F39-redesenho-wireframes-navegacao.md` §6.2, §6.4, §7 e §8
  (node-ids da referência `FPdB8RymAnN81pbKfizdzE`, lidos pelo ESQUADRO; CARTOGRAFO
  não reabriu o Figma, acesso negado nesta sessão).
- Decisões de contrato visual (cabeçalho, navegação inferior, tokens): ADR-014,
  seção "Coleção v2 e componentes estruturais no Figma".

### 8.1 O que muda em relação à F24

| # | Mudança | Origem | Fecha |
|---|---|---|---|
| 1 | Navegação inferior com 4 abas, na ordem Ordens, Clientes, Catálogo, Financeiro | `20:1103` | Nota A |
| 2 | Perfil sai da barra e entra pelo ícone de pessoa do cabeçalho das 6 telas raiz | `20:1174`, `20:1080` | Aresta nova; depende do débito 1 |
| 3 | Catálogo: 10 e 13 alternados por controle segmentado na mesma aba | spec §6.2 | Gap 2 |
| 4 | Financeiro: 22 e 24 alternados por controle segmentado | spec §6.2 | Gap 2 |
| 5 | 04 → 07 pelo botão "+ Veículo" do detalhe do cliente | `1:970` (1c) | Gap 1 (órfã 07) |
| 6 | 10 → 12 e 13 → 15 pelo toque no item da lista | spec §8 | Gap 3 |
| 7 | 09 → 19 pelo item do histórico de OS | `1:1053` (1e) | Gap 4 |
| 8 | 13 → 16 pela ação "Registrar movimentação" no item da lista ou em bottom sheet | D6 do PRD | Gap 5 (órfã 16) |
| 9 | 22 → 23 pelo toque na parcela | `1:1605` → `1:1660` (1r → 1s) | Gap 6 |
| 10 | 18 "Cancelar" → 17. Na F24, cancelar levava a 19, o detalhe de uma OS que não chegou a existir | Correção deste mapa | Aresta inválida da F24 |
| 11 | 20 vira bottom sheet sobre 19. Não muda aresta: continua 19 → 20 → 19 | `1:1568` (1q), spec §7 | — |

### 8.2 Grafo

```mermaid
flowchart TD
    L[01 Login] -->|sucesso| POUSO[Aba de pouso - debito 2]
    POUSO -.->|referencia| OL
    POUSO -.->|F33| P

    subgraph NAV[Navegacao inferior - 4 abas, so nas telas raiz]
        OL[17 OS lista]
        CL[03 Clientes lista]
        SL[10 Servicos lista]
        PL[13 Pecas lista]
        FP[22 Financeiro parcelas]
        FL[24 Financeiro lancamentos]
    end
    SL <-->|segmentado Catalogo| PL
    FP <-->|segmentado Financeiro| FL

    NAV -->|icone Perfil no cabecalho| P[02 Perfil]
    P -->|voltar| NAV
    P -->|Sair e confirmar no modal| L

    CL -->|Novo cliente| CC[05 Clientes criar]
    CC -->|salva ou cancela| CL
    CL -->|toca item| CD[04 Clientes detalhe]
    CD -->|voltar| CL
    CD -->|editar no cabecalho| CE[06 Clientes editar]
    CE -->|salva ou cancela| CD
    CD -->|+ Veiculo| VC[07 Veiculos criar]
    VC -->|salva ou cancela| CD
    CD -->|toca veiculo| VD[09 Veiculos detalhe e historico]
    VD -->|voltar| CD
    VD -->|editar no cabecalho| VE[08 Veiculos editar]
    VE -->|salva ou cancela| VD
    VD -->|toca item do historico| OD

    SL -->|Novo servico| SC[11 Servicos criar]
    SL -->|toca item| SE[12 Servicos editar]
    SC -->|salva ou cancela| SL
    SE -->|salva ou cancela| SL

    PL -->|Nova peca| PC[14 Pecas criar]
    PL -->|toca item| PE[15 Pecas editar]
    PL -->|Registrar movimentacao| ME[16 Movimentacao de estoque]
    PC -->|salva ou cancela| PL
    PE -->|salva ou cancela| PL
    ME -->|confirma ou cancela| PL

    OL -->|Nova OS| OC[18 OS criar]
    OC -->|cria| OD[19 OS detalhe]
    OC -->|cancela| OL
    OL -->|toca item| OD
    OD -->|voltar para a origem| OL
    OD -->|Alterar status - bottom sheet| OT[20 OS transicao de status]
    OT -->|confirma ou cancela| OD
    OD -->|Parcelas| OP[21 OS parcelas]
    OP -->|voltar| OD
    OP -->|Registrar pagamento| PG[23 Financeiro pagamento]

    FP -->|toca parcela| PG
    PG -->|confirma ou cancela, volta a origem| OP
    PG -->|confirma ou cancela, volta a origem| FP
    FL -->|Novo lancamento - variante formulario| FL
```

Legenda: linha cheia é aresta obrigatória do wireframe revisado. Linha tracejada
depende de decisão da REGENTE (débito 2), e só uma das duas fica. Sobreposições
(modal, bottom sheet) não são nós: fecham para a tela de baixo ou seguem a aresta
da ação.

### 8.3 Entrada, saída, cabeçalho e navegação inferior por tela

O cabeçalho é descrito pelas propriedades do componente único do ADR-014
(`voltar`, `acao`). "Voltar" leva à tela de origem na pilha, e não a um destino
fixo. Formulário de criação concluído sai da pilha: depois de 18 → 19, voltar
em 19 leva a 17.

| # | Tela | Entra a partir de | Sai para | Cabeçalho (`voltar`, `acao`) | Navegação inferior |
|---|---|---|---|---|---|
| 01 | Login | raiz | aba de pouso (débito 2) | não, nenhuma (D8) | oculta |
| 02 | Perfil | ícone do cabeçalho das 6 raiz; pouso, se o débito 2 ficar com o F33 | raiz de origem (voltar); 01 (sair, com modal) | sim, nenhuma (`20:2084`) | oculta |
| 03 | Clientes · lista | aba Clientes | 04, 05, 02 | não, perfil (`20:1174`) | visível, Clientes ativo |
| 04 | Clientes · detalhe | 03 | 06, 07, 09, 03 | sim, editar (`20:1435`) | oculta |
| 05 | Clientes · criar | 03 | 03 | sim, nenhuma (`20:1455`) | oculta |
| 06 | Clientes · editar | 04 | 04 | sim, nenhuma | oculta |
| 07 | Veículos · criar | 04 | 04 | sim, nenhuma | oculta |
| 08 | Veículos · editar | 09 | 09 | sim, nenhuma | oculta |
| 09 | Veículos · detalhe com histórico de OS | 04 | 08, 19, 04 | sim, editar | oculta |
| 10 | Serviços · lista | aba Catálogo; 13 (segmentado) | 11, 12, 13, 02 | não, perfil | visível, Catálogo ativo |
| 11 | Serviços · criar | 10 | 10 | sim, nenhuma | oculta |
| 12 | Serviços · editar | 10 (item) | 10 | sim, nenhuma | oculta |
| 13 | Peças · lista | aba Catálogo; 10 (segmentado) | 14, 15, 16, 10, 02 | não, perfil | visível, Catálogo ativo |
| 14 | Peças · criar | 13 | 13 | sim, nenhuma | oculta |
| 15 | Peças · editar | 13 (item) | 13 | sim, nenhuma | oculta |
| 16 | Movimentação de estoque | 13 (ação do item ou bottom sheet, D6) | 13 | sim, nenhuma | oculta |
| 17 | Ordens de Serviço · lista | aba Ordens; pouso, se o débito 2 ficar com a referência | 18, 19, 02 | não, perfil (`20:1080`) | visível, Ordens ativo |
| 18 | Ordens de Serviço · criar | 17 | 19 (cria), 17 (cancela) | sim, nenhuma | oculta |
| 19 | Ordens de Serviço · detalhe | 17, 09, 18 | 20, 21, origem | sim, badge (`20:1726`) | oculta |
| 20 | Ordens de Serviço · transição de status | 19 (bottom sheet) | 19 | o de 19, por baixo da sobreposição | oculta |
| 21 | Ordens de Serviço · parcelas | 19 | 23, 19 | sim, nenhuma | oculta |
| 22 | Financeiro · parcelas | aba Financeiro; 24 (segmentado) | 23, 24, 02 | não, perfil | visível, Financeiro ativo |
| 23 | Financeiro · pagamento | 21, 22 | origem (21 ou 22) | sim, badge (`20:1922`) | oculta |
| 24 | Financeiro · lançamentos | aba Financeiro; 22 (segmentado) | 22, 02 e a variante `Preenchido · formulário` (volta a 24) | não, perfil; na variante formulário, sim, nenhuma | visível, Financeiro ativo; oculta na variante formulário (ESQUADRO confirma em `1:1751`) |

Conferência: 24 linhas, todas com entrada e saída. Visível em 6 telas (03, 10,
13, 17, 22, 24) e oculta em 18, a mesma regra da US-WFR-17.

### 8.4 Invariantes que o CRIVO confere

1. Toda tela da tabela 8.3 tem ao menos uma entrada e uma saída (24 de 24).
2. Toda tela com navegação inferior oculta tem `voltar` no cabeçalho, salvo 01
   (raiz) e 20 (sobreposição que fecha para 19). Assim nenhuma tela é beco sem saída.
3. Estado Erro: "Tentar novamente" mais a saída de nível da tela (voltar ou aba).
   Estado Carregando: voltar nas telas que o têm; aba e ícone de Perfil nas raiz.
4. **Lacuna aberta: 01 Login no estado Carregando** não tem voltar nem aba, e a
   US-WFR-03 pede saída em Carregando. Ou o frame ganha "Cancelar", ou a anotação
   declara o tempo limite que leva ao estado Erro (que tem "Tentar novamente").
   A escolha é do ESQUADRO e fica registrada na anotação do frame; sem ela, a
   tela 01 reprova na US-WFR-03.
5. Toda aresta da tabela 8.3 tem desenhado no frame o controle que a dispara
   (botão, item tocável, ícone do cabeçalho, aba ou segmentado). Aresta sem
   controle conta como lacuna "sem saída".

### 8.5 Débitos 1 e 2 decididos juntos

Os dois débitos do PRD (Perfil como aba ou no cabeçalho; aba de pouso) não são
independentes. Cruzando as quatro combinações com o invariante 2:

| Perfil | Pouso pós-login | Grafo válido? | Motivo |
|---|---|---|---|
| Aba (F33) | Perfil (F33) | sim | Perfil tem navegação inferior visível |
| Aba (F33) | Ordens (referência) | sim | Idem |
| Cabeçalho (referência) | Ordens (referência) | sim | Perfil abre de uma raiz e volta para ela |
| Cabeçalho (referência) | Perfil (F33) | **não** | Perfil sem navegação inferior e sem origem na pilha: a única saída é "Sair", então vira beco sem saída |

Recomendação não vinculante para a REGENTE: decidir os débitos 1 e 2 juntos. O
wireframe usa a terceira linha (referência nos dois), e as arestas tracejadas de
8.2 marcam o que muda se a decisão for outra. Como cabeçalho e navegação inferior
são aplicados por instância (ADR-014), mudar a decisão custa a edição de dois
componentes e destas duas arestas, e não dos 110 frames.

### 8.6 Segurança e dados pessoais

- O grafo não carrega dado pessoal. Os textos de exemplo dos frames seguem
  fictícios (PRD F39, seção 8).
- Nada muda no app nesta feature. Quando uma feature futura levar o Perfil para o
  cabeçalho, a rota do Perfil continua atrás do guard de sessão do grupo
  autenticado (F33), e o logout continua com confirmação em modal. Quem
  implementar confere isso no teste de navegação, porque mudar o caminho de
  entrada não pode abrir rota autenticada sem token.

# PRD — F39: Redesenho de wireframes com inspiração de navegação (Figma)

- Versão: **v3** (2026-11-13, após a revisão humana das 19:52). Substitui a v2 do mesmo dia e a v1 de 2026-11-11.
- Prioridade: P1
- Área: Frontend (artefato de design; implementação de app fora de escopo)
- Sprint: Sprint 01: Fundação e Login (trilha paralela de design)
- Autor: BUSSOLA (Product Owner)
- Etapa da rota: **BUSSOLA (1/4)** → ESQUADRO → CARTOGRAFO → CRIVO
- Depende de: [[F24]] (wireframe de baixa fidelidade, aprovado em 2026-11-07; esta feature **sobrescreve** as páginas dele, ver D4). O campo de dependências **não muda**: a espera pela F41 é premissa (20), não dependência.
- Não reabre: [[F33]] (PRD do menu, travado por REGENTE em 2026-11-09) nem o código da tab bar.
- Companheiro de design (ESQUADRO): `docs/design/F39-redesenho-wireframes-navegacao.md`.
- Insumo executável da contagem de frames de baixa fidelidade: `docs/design/f39-frames/` (seção 5.6).

> **Instrução do comandante para esta etapa**: fechar no PRD a contagem de 96 frames contra 93, o inventário das 24 telas e o link e os node-ids da referência que a pessoa fornecer, **sem iniciar a distribuição** enquanto faltarem o link e a versão nomeada da F24. Situação: a contagem está fechada (seção 5, D7); o inventário está na seção 4; o link está na premissa 1; os node-ids da referência que a pessoa citou (`20:968` e `20:2131`) estão na premissa 19, com o papel de cada um em aberto (D9); a **versão nomeada não existe**, então a distribuição para o ESQUADRO editar o Figma **não está liberada** (seção 13, G1).

## 0. O que mudou

### 0.1 Da v2 para a v3 (revisão humana de 2026-11-13, 19:52)

| # | Pedido da pessoa | Como foi resolvido | Onde |
|---|---|---|---|
| R1 | Critério 1 (US-WFR-01): qualificar a contagem como baixa fidelidade; o alta das quatro telas ganha contagem própria, em critério novo | US-WFR-01, seção 5 e premissas 2 e 14 passam a dizer "baixa fidelidade". Critério novo US-WFR-20 para o alta | Seções 5, 6, 10 |
| R2 | Critério 16 (US-WFR-15): trocar "os 96 frames editados" por "os 96 frames de baixa fidelidade editados"; a captura do antes continua pré-requisito da primeira edição | Texto trocado em US-WFR-15, com a distinção entre os 80 canônicos editados no lugar e os 16 criados. A captura do antes virou a US-WFR-21 e está citada na US-WFR-15 como pré-requisito | Seção 10 |
| R3 | Critério 21 (US-WFR-18): a captura do antes cobre também F25 e F34, além da F24, antes de qualquer edição, com os node-ids listados no PRD | US-WFR-18 e US-WFR-21 reescritas; tabela de node-ids capturados na seção 13 (vazia: nada foi capturado) | Seções 10, 13 |
| R4 | Tarefas 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15 e 20 ainda não feitas | Seguem abertas. São do ESQUADRO (execução no Figma) e minha (20, aprovação). Nenhuma foi marcada como feita | Seção 15 |
| R5 | Premissas: incluir `20:968` e `20:2131` e **aguardar** a pessoa dizer o que cada um é; qualificar a premissa 2 como baixa fidelidade; registrar como **premissa, e não dependência**, que o baixa anda antes da F41 e o alta das quatro telas só depois; o campo de dependências não muda | Premissas 2, 14 e 19 a 24; papel dos frames na D9, **não preenchido** | Seções 6, 7 |
| R6 | Trocar a frase sobre F25 a F29 (aguardar o texto da pessoa) e incluir a marcação "redesenho aguardando código" (aguardar a pessoa dizer se vai nos frames, no PRD ou nos dois) | Frase **mantida como estava e marcada "aguarda texto da pessoa"** (D10). Marcação descrita na premissa 22 e na US-WFR-22 **sem local definido** (D11) | Seções 2, 6, 7, 10 |
| R7 | Quatro critérios novos a partir de US-WFR-19, em Gherkin | US-WFR-19 (baixa antes da F41), 20 (contagem própria do alta), 21 (captura do antes de F24, F25 e F34) e 22 (marcação "aguardando código") | Seção 10 |
| R8 | Reescrever o "Estado atual" só com o que a pessoa confirmar como editado e quando; não preencher node-ids, telas do alta nem a frase de F25 a F29 por inferência | Seção 1.1: **nenhum frame consta como editado**, porque a pessoa ainda não confirmou (D14). Nenhum node-id de edição preenchido. Quantos frames de alta existem: D13, sem número | Seções 1.1, 7 |

### 0.2 Da v1 para a v2 (mantido para rastreio)

| Ponto | v1 (2026-11-11) | v2 (2026-11-13) | Origem |
|---|---|---|---|
| Visual da referência | Excluído (só estrutura de menu) | Incluído: layout, espaçamento, paleta e tipografia (premissa 1) | Decisão da pessoa, 2026-11-12 (D1) |
| Onde editar | Página nova | Sobrescrever as páginas da F24, com versão nomeada antes (premissa 11) | D4, 2026-11-12 |
| Link da referência | Não recebido | Registrado na premissa 1 | Briefing |
| Contagem de frames | 24 telas × estados "aplicáveis" (93) | **96 canônicos** (24 × 4) mais 14 variantes, 110 no total (seção 5) | D7 |
| Critérios | US-WFR-01 a 08 | US-WFR-01 a 18 (inclui 05b, 15b, 17b) | Briefing |
| Cabeçalho e navegação inferior | Não previstos | Prioridade máxima de semelhança com a referência (US-WFR-16, 17) | Pedido da pessoa, 2026-11-13 |
| Aprovação | Pendente | **Continua pendente**; bloqueios na seção 13 | — |

### 0.3 Conflitos entre fontes que esta versão **não** resolve (viram dúvida, seção 7)

1. **Papel dos frames `20:968` e `20:2131`.** A regra "Inspiração visual" do briefing diz baixa = `20:968` e alta = `20:2131`. O pedido da revisão e a premissa 13 do briefing mandam aguardar a pessoa. O relato do ESQUADRO (`docs/design/F39-redesenho-wireframes-navegacao.md`, seção 2) trata `20:2131` como a **página** "01 — Wireframes" (baixa fidelidade) da referência, e a página de alta como `20:2132`. Eu não abri o Figma, então não sei qual leitura vale. Fica na D9 e nenhum papel é atribuído aqui.
2. **Versão nomeada da F24.** A premissa 11 e a US-WFR-15 exigem versão nomeada antes da primeira edição. A regra "Edição sobre a F24" do briefing diz que a pessoa decidiu em 2026-11-13 editar direto, **sem versão salva**, assumindo o risco de perder a linha de base, com captura do antes como evidência. Os dois textos não cabem juntos, e a instrução do comandante manda esperar a versão. Enquanto a pessoa não disser qual vale, **vale o mais restritivo**: G1 continua fechado. Fica na D12. A captura do antes (US-WFR-21) é exigida nos dois casos.
3. **"Só wireframe" contra alta das quatro telas.** O briefing põe o alta de Login, Perfil, diálogo de logout e tab bar no alcance da F39, e a visão e o "Fora do escopo" desta feature ainda dizem "artefato de wireframe". A reconciliação é da pessoa (D10).
4. **Numeração.** As premissas 13 a 16 do briefing e as dúvidas D5 a D8 dele colidem com números já em uso na v2 e citados no documento do ESQUADRO e no ADR-014. Mantive a numeração da v2 e **acrescentei** as novas. Mapa de premissas: 13 do briefing = 19; 14 = 20; 15 = 21; 16 = 22; o alcance e a exceção temporária da regra "Inspiração visual" = 23 e 24. Mapa de dúvidas: D5 do briefing (papel dos frames) = D9; D6 (local da marcação) = D11; D7 (reconciliação com o alta) = D10; D8 (o que foi editado) = D14. A D5 e a D8 da v2 (estilo da referência; cabeçalho do Login) seguem com o número que tinham.

## 1. Visão

O wireframe da F24 resolveu cobertura de estado e fechou o grafo de navegação, mas a pessoa considera que um Figma de referência organiza as telas de forma mais harmônica e com resultado visual mais agradável. Esta feature revisa as 24 telas com a estrutura e o visual dessa referência, dando destaque ao **cabeçalho** (indica onde a pessoa está) e à **navegação inferior**. A paleta e a tipografia da referência passam a ser a identidade do produto (D1); o que isso significa para o app (F25 a F29, tokens, `identidade-visual.md`) fica mapeado aqui e executado em feature futura.

Valor para quem usa: o funcionário da oficina enxerga em qualquer tela onde está e como voltar, e a base do protótipo de alta fidelidade deixa de ser refeita a cada módulo.

### 1.1 Estado atual (reescrito na v3)

- **Nenhum frame do Figma consta como editado neste PRD.** A regra do pedido de revisão é registrar só o que a pessoa confirmar, e a pessoa ainda não confirmou o que foi editado, em quais frames e quando (D14).
- A pessoa citou os frames `20:968` e `20:2131` do Figma de referência (premissa 19). Citar um frame **não** é edição, e o papel de cada um segue em aberto (D9).
- O que o repositório diz, que li e não conferi no Figma: `docs/design/figma.md` (seção "F39") afirma que nenhum nó foi alterado e que a página `3:2` segue com 94 filhos (relato do ESQUADRO, 2026-11-13). O G1 (versão nomeada) está fechado (seção 13).
- A prova de edição é a US-WFR-18. Sem node-ids, capturas de antes e depois e a saída do `check-frames.sh` contra o Figma real, a feature não é dada como entregue.
- A F41, da qual o alta das quatro telas depende como premissa (20), consta no painel do projeto como **Pronta**, não como concluída. Não conferi o fechamento dela.

## 2. Escopo

### Dentro do escopo
- Revisão das 24 telas em **baixa fidelidade**, com **96 frames canônicos** (24 telas × 4 estados) mais **14 variantes** nomeadas (seção 5), sobrescrevendo as páginas da F24.
- **Captura do antes** dos frames da F24, da F25 e da F34 que serão tocados, feita **antes da primeira edição**, com os node-ids capturados listados na seção 13 (US-WFR-21).
- Versão nomeada da F24 aprovada no histórico do Figma, criada **antes** da primeira edição (premissa 11; sobre a dispensa de 2026-11-13, ver D12).
- Cabeçalho e navegação inferior como componentes únicos do Figma, aplicados por instância nas 24 telas.
- Visual da referência aplicado por estilos e variáveis do Figma, sem valor solto.
- Quadro comparativo de tokens, conferência de contraste WCAG 2.2 AA (valor antes e depois), lista de impacto da troca de identidade.
- Anotações de acessibilidade por estado, mapa de navegação sem tela órfã, motivo estrutural de cada bottom sheet, modal, drawer ou menu flutuante.
- Atualização de `docs/design/figma.md` e `docs/design/F24-wireframe-baixa-fidelidade.md` quando os node-ids mudarem.
- **Alta fidelidade de Login, Perfil, diálogo de confirmação de logout e tab bar**, seguindo a inspiração, **só depois da F41 fechar** (premissas 20, 23 e 24), com contagem própria (US-WFR-20) e marcação "redesenho aguardando código" (US-WFR-22). Quais frames e quantos: D13.
- Débito com o F33 registrado para a REGENTE; D2 (direito de uso) respondida antes da aprovação.
- Evidência de que o Figma foi de fato editado (capturas antes e depois, node-ids).

### Fora do escopo
- Alteração em `apps/mobile`, `apps/api`, `docs/design/identidade-visual.md` ou no PRD do F33.
- **AGUARDA TEXTO DA PESSOA (D10):** revisão dos protótipos F25 a F29 e dos tokens do app: decidida, executada em feature futura. (Frase da v2, mantida sem alteração: a pessoa vai fornecer o texto novo e eu não o escrevi por inferência.)
- Alta fidelidade das demais telas: fica com F26 (Clientes e Veículos), F27 (Catálogo e Estoque), F28 (Ordens de Serviço) e F29 (Financeiro), que partem do baixa aprovado. A F39 não absorve o escopo delas.
- O código do app acompanhando o alta novo: feature própria, posterior à F41.
- Ícones finais, imagens reais e microinterações. Protótipo navegável de alta fidelidade, **exceto** o alta das quatro telas do escopo acima (reconciliação do limite "só wireframe": D10).
- Telas novas fora das 24 (premissa 2).
- Reordenar ou repriorizar o backlog (D3 é de quem prioriza, com a REGENTE).

## 3. Glossário

| Termo | Significado neste PRD |
|---|---|
| Tela | Uma das 24 do inventário (seção 4). |
| Estado canônico | Um dos quatro: `Vazio`, `Carregando`, `Erro`, `Preenchido`. Toda tela tem exatamente um frame por estado canônico. |
| Frame canônico | O frame que representa (tela, estado canônico). São 96. |
| Variante | Frame extra que detalha um estado canônico sem substituí-lo: `Erro · validação` (13 telas com formulário) e `Preenchido · formulário` (tela 24). São 14. |
| Sobreposição | Modal, bottom sheet ou popup desenhado **dentro** de um frame. Não conta como frame. |
| Frame de topo | Filho direto da página `3:2` "F24 · Wireframe baixa fidelidade". A contagem de baixa fidelidade é feita só neles. |
| Baixa fidelidade | Wireframe da página `3:2`. Os 96 canônicos e as 14 variantes valem **só para ele**. |
| Alta das quatro telas | Frames de alta fidelidade de Login, Perfil, diálogo de confirmação de logout e tab bar. Têm contagem própria (US-WFR-20) e **não** entram na conta da baixa. |
| Linha de base da F41 | Frames da F25 e da F34 capturados como estavam e as capturas finais do app da F41. Referência do código vigente enquanto o alta novo aguarda código. |
| Redesenho aguardando código | Marcação do frame de alta redesenhado pela F39 cujo código ainda não o acompanha. O frame marcado não conta como aprovado para a paridade. Local da marcação: D11. |
| Débito endereçado à REGENTE | Divergência com decisão travada (F33), registrada e entregue à REGENTE sem implementação. |
| Tela órfã / sem saída | Sem aresta de entrada a partir da raiz / ação sem destino declarado. |

## 4. As 24 telas (inventário fechado)

Mesma lista e numeração da seção 4 de `docs/product/F24-wireframe-baixa-fidelidade.md`. Os nomes abaixo são os usados nos frames (a parte entre parênteses da tela 24 sai do nome do frame).

| # | Tela | Módulo | Formulário? |
|---|---|---|---|
| 01 | Login | Autenticação | sim |
| 02 | Perfil | Autenticação | não |
| 03 | Clientes · lista | Clientes | não |
| 04 | Clientes · detalhe | Clientes | não |
| 05 | Clientes · criar | Clientes | sim |
| 06 | Clientes · editar | Clientes | sim |
| 07 | Veículos · criar | Veículos | sim |
| 08 | Veículos · editar | Veículos | sim |
| 09 | Veículos · detalhe com histórico de OS | Veículos | não |
| 10 | Serviços · lista | Catálogo | não |
| 11 | Serviços · criar | Catálogo | sim |
| 12 | Serviços · editar | Catálogo | sim |
| 13 | Peças · lista | Catálogo | não |
| 14 | Peças · criar | Catálogo | sim |
| 15 | Peças · editar | Catálogo | sim |
| 16 | Movimentação de estoque | Catálogo | sim |
| 17 | Ordens de Serviço · lista | OS | não |
| 18 | Ordens de Serviço · criar | OS | sim |
| 19 | Ordens de Serviço · detalhe | OS | não |
| 20 | Ordens de Serviço · transição de status | OS | não |
| 21 | Ordens de Serviço · parcelas | OS | não |
| 22 | Financeiro · parcelas | Financeiro | não |
| 23 | Financeiro · pagamento | Financeiro | sim |
| 24 | Financeiro · lançamentos | Financeiro | sim |

Total: 24. As 13 telas com formulário são as da seção 5.2 do PRD da F24.


## 5. Contagem de frames de baixa fidelidade: 93, 94 e 96 reconciliados

> **Qualificação (revisão de 2026-11-13).** Todos os números desta seção são de **baixa fidelidade**: os 96 frames (24 telas × 4 estados) e as 14 variantes valem só para a página `3:2`. O alta das quatro telas (Login, Perfil, diálogo de logout e tab bar) tem contagem própria na US-WFR-20 e não soma nem altera nenhum número daqui. O número esperado de frames de alta **não está fixado** (D13).

### 5.1 De onde vêm os números

| Número | Origem | Composição |
|---|---|---|
| 93 | Matriz da seção 5.4 de `docs/product/F24-wireframe-baixa-fidelidade.md` | 24 Carregando + 24 Erro de rede + 24 Preenchido + 8 Vazio + 13 Erro de validação |
| 94 | Página `3:2` do Figma hoje (`docs/design/figma.md`; contagem de filhos pelo ESQUADRO em 2026-11-13) | 93 + 1: a tela 24 desdobra "Preenchido" em lista e formulário |
| 96 | US-WFR-01 (briefing) | 24 telas × 4 estados canônicos, **só baixa fidelidade** |
| 110 | v2 e v3 | 96 canônicos + 14 variantes, **só baixa fidelidade** |

O `figma.md` também cita 118 frames "na página inteira (94 de tela/estado + 24 popups)". Leio isso como 24 sobreposições aninhadas dentro de frames de tela, e é por isso que a contagem vale só para os filhos diretos da página (glossário, "Frame de topo"). Não conferi no Figma: o acesso me foi negado nesta sessão (seção 13, G2).

A F24 aprovada tratou "Vazio" como inaplicável a 16 telas (seção 5.3 daquele PRD), e isso explica 93 em vez de 96. Não há erro de contagem em nenhum dos lados: são dois critérios diferentes.

### 5.2 Decisão D7 (BUSSOLA, 2026-11-13): vale o 96

Escolhida a opção (a) levantada pelo ESQUADRO: toda tela ganha os quatro estados canônicos, e o critério de 96 do briefing fica como está. Motivos:

1. O briefing e a US-WFR-06 pedem anotação de acessibilidade "nos quatro estados de qualquer das 24 telas". Com "—" em 16 telas, essa regra teria 16 exceções, e o CRIVO conferiria contra uma matriz em vez de contra uma contagem.
2. A matriz de 93 sai do critério de aceite desta feature. A F24 aprovada continua intacta na versão nomeada (G1) e não é reaberta.
3. O custo é conhecido e limitado: **16 frames novos** (seção 5.4). Os outros 94 já existem e são editados no lugar.

A alternativa (b), corrigir o critério para 93, foi descartada porque contradiz o briefing e deixaria "Vazio" indefinido para quem ler o wireframe como base de protótipo.

### 5.3 A conta

| Grupo | Qtd | Situação no Figma hoje |
|---|---|---|
| Carregando | 24 | existem; mantêm nome e node-id |
| Erro (rede ou carregamento) | 24 | existem como "Erro de rede"; renomear para "Erro" |
| Preenchido | 24 | existem; na tela 24, "Preenchido (lista)" vira "Preenchido" |
| Vazio já aplicável na F24 | 8 | existem (telas 03, 09, 10, 13, 17, 21, 22, 24) |
| **Vazio novo** | **16** | **não existem: frames novos** (seção 5.4) |
| **Canônicos** | **96** | 80 existentes + 16 novos |
| Variante `Erro · validação` | 13 | existem (13 telas com formulário) |
| Variante `Preenchido · formulário` | 1 | existe (tela 24; hoje "Preenchido (formulário)") |
| **Variantes** | **14** | todas existentes |
| **Total de frames de topo** | **110** | 94 existentes + 16 novos |

### 5.4 O que o frame "Vazio" mostra nas 16 telas novas

Regra geral: **Vazio é a tela sem o conteúdo principal que ela normalmente mostra, sem erro e sem carregamento.** Sempre traz o texto que explica o que falta e a ação de saída ou de criação. Os textos são placeholders (i18n na seção 9). Esta definição é decisão de produto minha. Se o ESQUADRO demonstrar que algum desses frames fica indistinguível de Carregando, Erro ou Preenchido, a tela volta para mim antes de seguir.

| Tela | O que o frame Vazio mostra |
|---|---|
| 01 Login | Formulário sem valor em e-mail e senha, nenhuma mensagem de erro |
| 02 Perfil | Campos de dados sem valor, exibidos como "Não informado"; "Sair da conta" continua visível |
| 04 Clientes · detalhe | Cliente sem veículos: seção Veículos com mensagem e ação "Adicionar veículo" (leva à tela 07) |
| 05, 07, 11, 14, 16, 18, 23 (criar, movimentação, pagamento) | Formulário sem nenhum valor digitado, nenhuma mensagem de erro |
| 06, 08, 12, 15 (editar) | Campos editáveis esvaziados; campos somente leitura mantêm o valor; sem erro (o erro só aparece depois do envio e é a variante `Erro · validação`) |
| 19 OS · detalhe | OS sem itens: seções de serviços e de peças com "nenhum item" e a ação de adicionar item |
| 20 OS · transição de status | OS sem transição disponível (estado terminal: ENTREGUE ou CANCELADA): mensagem "nenhuma mudança de status disponível" e saída para voltar |

Conferência: 01, 02, 04, 05, 06, 07, 08, 11, 12, 14, 15, 16, 18, 19, 20 e 23 somam 16 telas.

### 5.5 Nomes

Padrão `NN Tela / Estado` (ex.: `03 Clientes · lista / Vazio`). Variantes: `NN Tela / Erro · validação` e `24 Financeiro · lançamentos / Preenchido · formulário`. Os 94 frames existentes são **renomeados no lugar**, sem apagar e recriar, para manter os node-ids (premissa 11). A lista oficial é `docs/design/f39-frames/frames-esperados.csv` (110 linhas, delimitador `;`).

### 5.6 Verificação executável

O critério de contagem não depende de leitura humana. Depois de cada lote de edição, o ESQUADRO exporta os nomes dos filhos diretos da página `3:2` (um por linha) e roda:

```
docs/design/f39-frames/check-frames.sh <lista-real.txt>
```

Saída esperada na entrega: `canonicos presentes: 96 de 96`, `variantes presentes: 14 de 14`, `faltando: 0`, `extra: 0`, `duplicado: 0`, `RESULTADO: confere` e código de saída 0. Divergência sai com código 1 e lista o que falta, o que sobra e o que está duplicado.

O verificador tem teste próprio, montado a partir da lista esperada, sem depender do Figma:

```
bash docs/design/f39-frames/test-check-frames.sh
```

Saída real em 2026-11-13: 9 casos `ok` (lista completa confere; matriz antiga com só 8 Vazio reprova com `faltando: 16`; um canônico faltando reprova; variantes faltando reprova; duplicado reprova; tela fora do inventário reprova; nome antigo "Erro de rede" reprova; lista vazia reprova com `faltando: 110`; sem argumento devolve 2) e `falhas: 0`.

O que isto **não** cobre: o script confere nomes, não o conteúdo do frame. Que o Vazio de cada tela mostre o descrito na seção 5.4 é conferência visual do CRIVO. E a execução contra o Figma real ainda não aconteceu, porque nada foi editado (seção 13).

## 6. Premissas

1. O Figma de referência (https://www.figma.com/design/FPdB8RymAnN81pbKfizdzE/Untitled?node-id=1-66&p=f&t=ey2miBd7TT4dAX63-0) vale como referência de estrutura e de visual: menu, agrupamento, hierarquia, layout, espaçamento, paleta e tipografia (decisão da pessoa, 2026-11-12, que substitui a versão anterior, em que o visual era excluído).
2. As 24 telas de `UX-UI-MAPEAMENTO.md` são o inventário fechado: não se somam nem se removem telas. Com 4 estados por tela, o wireframe revisado de **baixa fidelidade** tem 96 frames canônicos (mais 14 variantes, seção 5). Essa conta vale **só para a baixa fidelidade**: o alta das quatro telas tem contagem própria (US-WFR-20).
3. Se a navegação proposta divergir do F33 (1 aba habilitada + 4 desabilitadas), a divergência vira débito neste PRD (seção 11). Abrir ou não uma feature de revisão do menu é decisão da REGENTE, que travou o F33 em 2026-11-09. BUSSOLA não decide isso e o F33 não é reaberto.
4. Wireframe não carrega dado pessoal real. Finalidade: ilustrar fluxo. Base legal: não aplicável. Retenção: enquanto o produto estiver em desenvolvimento (seção 8).
5. Bottom sheet, modal, drawer e menu flutuante podem ser usados quando ajudarem a estrutura, cada um com motivo estrutural registrado. "Fica mais bonito" não é motivo.
6. A paleta e a tipografia da referência passam a ser a identidade do produto (2026-11-12). A execução (revisão de F25 a F29, tokens, `identidade-visual.md`) fica para feature futura. A formulação "no lugar de petro e primary" do briefing é corrigida pela premissa 13.
7. O código do app (telas, tab bar, tokens) permanece como está.
8. A aprovação explícita do wireframe revisado é registrada por BUSSOLA no PRD (seção 12), no padrão da aprovação da F24. Sem ela, nenhum protótipo novo começa.
9. Risco registrado: F26 a F29 não devem começar alta fidelidade sobre a identidade antiga, e F40 e F41 ficam com base desatualizada enquanto F25 e F34 não forem revisados. A ordem é de quem prioriza o backlog com a REGENTE (D3) e não é tomada aqui.
10. Tokens só são extraídos do que o ESQUADRO conseguir abrir de fato no Figma. Se o acesso falhar, o bloqueio é registrado com a saída real e nenhum valor é inferido.
11. Decisão de 2026-11-12 (D4): o redesenho sobrescreve as páginas da F24, com versão nomeada da F24 aprovada criada **antes de qualquer edição**, com nome e id no PRD. A edição é nos frames existentes (sem apagar e recriar) para manter os node-ids citados em `docs/design/figma.md` e `docs/design/F24-wireframe-baixa-fidelidade.md`. Os 16 Vazio novos não têm node-id anterior: entram com o id novo registrado (US-WFR-15). **Em conflito com a regra de 2026-11-13 que dispensa a versão salva (0.3, item 2 e D12).**
12. Pedido de 2026-11-13: cabeçalho e navegação inferior seguem a referência de perto. É desenho de wireframe; a tab bar do app (F33/F34) não muda aqui.
13. **Fato verificado (cor de marca).** Petro `#1E3A3F` e primary `#B5453D` **são iguais** na referência. O ESQUADRO leu os dois no Figma (relato dele, `docs/design/F39-redesenho-wireframes-navegacao.md` seção 4.1). Eu confirmei por conta própria que `apps/mobile/src/theme/tokens.ts` tem `petro900: '#1E3A3F'` e `primary600: '#B5453D'` (linhas 10 e 11) e que o ADR-014 já registra "a cor de marca não muda". A troca de identidade está em neutros, estados (erro, aviso, sucesso, status), tipografia e forma. A D1 continua de pé; muda o tamanho da lista de impacto (US-WFR-11), que é menor do que "trocar petro e primary" sugere.
14. **Contagem de baixa fidelidade:** vale a D7 (seção 5). O alta das quatro telas não entra nela (US-WFR-20).
15. **Gate G1:** nenhuma edição no Figma antes de a versão nomeada constar na seção 13. A API `saveVersionHistoryAsync` não é suportada pelo MCP (duas tentativas do ESQUADRO em 2026-11-13, mesma saída). O ESQUADRO **não é liberado** até a pessoa informar nome e id, ou responder a D12.
16. **O que li e o que não li.** O MCP do Figma me foi negado nesta sessão (seção 13, G2). Tudo o que este PRD diz sobre o conteúdo do Figma vem do documento do ESQUADRO e está marcado como relato dele. O que conferi no repositório está dito como tal.
17. **Estilo da referência (default adotado).** A referência tem dois estilos: a página `20:2131` (baixa fidelidade em estilo rascunho) e a `20:2132` (alta fidelidade, Barlow Condensed e Inter, paleta quente). Como a D1 fala em paleta e tipografia do produto, o ESQUADRO extraiu os tokens da alta fidelidade. Sigo esse default e peço confirmação (D5). Se a pessoa quiser o estilo rascunho, o quadro de tokens muda, mas como a pintura é por variável do Figma o retrabalho fica nos valores, não nos frames.
18. Os 16 frames de Vazio novos e a regra da seção 5.4 são decisão de produto desta versão (D7).
19. **Frames da referência citados pela pessoa.** A pessoa indicou os frames `20:968` e `20:2131` do Figma principal de referência (`FPdB8RymAnN81pbKfizdzE`) como insumo desta feature, em 2026-11-13. O papel de cada um está **pendente** (D9). Nenhum valor, token ou estrutura é inferido a partir deles até a resposta. O briefing do projeto, na regra "Inspiração visual", atribui `20:968` ao baixa e `20:2131` ao alta; o relato do ESQUADRO trata `20:2131` como página de baixa. Como as leituras divergem, este PRD não atribui papel (0.3, item 1).
20. **Sequência (premissa, não dependência).** O redesenho de baixa fidelidade **não depende** da F41 e segue antes dela. O alta fidelidade das quatro telas **só começa depois da F41 fechar**, para que as capturas finais da F41 sejam conferidas contra os frames da F25 e da F34 como estavam. O campo de dependências da F39 não muda. Enquanto a F41 não fecha, a F39 avança no baixa de todas as telas; só o alta dessas quatro espera. A F41 fecha com o escopo atual e as capturas finais dela são a linha de base do "antes".
21. **Captura do antes.** Antes de qualquer edição, cada frame da F24, da F25 e da F34 que o redesenho vai tocar é capturado como está, e os node-ids capturados constam na seção 13 (US-WFR-21). A pessoa decidiu em 2026-11-13 editar direto sobre os frames aprovados da F24 e assumiu o risco de perder a linha de base; a captura é a evidência do "antes" nesse caso. A relação com a versão nomeada está em D12.
22. **Marcação "redesenho aguardando código".** Quando o alta das quatro telas é redesenhado e o código ainda não o acompanha, o frame novo recebe a marcação "redesenho aguardando código" e não conta como frame aprovado para a paridade. Onde a marcação vai (nos frames, no PRD ou nos dois) é decisão da pessoa e está **pendente** (D11); nenhuma das opções foi escolhida aqui.
23. **Alcance decidido pela pessoa em 2026-11-13.** O baixa fidelidade é redesenhado para todas as telas. O alta redesenhado na F39 cobre só Login, Perfil, diálogo de confirmação de logout e tab bar. O alta das demais telas fica com F26, F27, F28 e F29, que partem do baixa redesenhado e aprovado na F39 e já nascem seguindo a inspiração.
24. **Exceção temporária à paridade.** Do momento em que a F39 edita o alta dessas quatro telas até o fechamento da feature de código posterior à F41, o frame novo fica marcado (premissa 22) e a referência do código vigente é a linha de base da F41, inclusive na revisão de paridade de fim de sprint. A exceção vale só para essas quatro telas e termina quando a feature posterior à F41 fecha; nenhuma outra tela usa esse caminho.

## 7. Decisões e dúvidas

### Decididas

| # | Decisão | Data | Quem |
|---|---|---|---|
| D1 | Paleta e tipografia da referência são a identidade do produto; revisão de F25 a F29 e dos tokens em feature futura | 2026-11-12 | Pessoa |
| D4 | Redesenho sobrescreve as páginas da F24, com versão nomeada antes | 2026-11-12 | Pessoa |
| D6 | O inventário continua em 24 telas. As telas da referência fora dele (`1j` Detalhe da Peça, `1p` Selecionar Serviços/Peças, `1ag` Adicionar Peça na OS) **não** entram. O gap 5 (tela 16 sem entrada) fecha com a ação "Registrar movimentação" a partir da lista 13 (item da lista ou bottom sheet). Se o ESQUADRO concluir que isso é impossível sem tela nova, volta para mim e para a pessoa; ele não soma tela sozinho | 2026-11-13 | BUSSOLA, dentro da premissa 2 |
| D7 | 96 canônicos + 14 variantes; 16 Vazio novos (seção 5) | 2026-11-13 | BUSSOLA |

### Em aberto

| # | Pergunta | Quem responde | Bloqueia |
|---|---|---|---|
| D2 | O arquivo de referência (`FPdB8RymAnN81pbKfizdzE`) é seu, gerado a partir do HTML do projeto? O ESQUADRO achou indícios (nome da seção "…html.to.design… 11/11/2026", links para `127.0.0.1`, conteúdo e 14 cores iguais ao `identidade-visual.md`), mas não consegue provar titularidade. Fontes: Barlow Condensed e Inter, OFL-1.1, pacotes `@expo-google-fonts/*` com licença `MIT AND OFL-1.1` (relato do ESQUADRO via `npm view`; não conferi) | Pessoa | A **aprovação** (US-WFR-07, US-WFR-12). Não bloqueia a edição, desde que nenhum ícone, imagem ou fonte seja copiado |
| D3 | Ordem e fatiamento da revisão de identidade (F25 a F29, tokens, `identidade-visual.md`, F40, F41). Recomendação não vinculante: nenhuma alta fidelidade nova (F26 a F29) antes de uma feature só de tokens e fontes v2; depois revisão de F25 e F34; depois refazer a base de F40 e F41 | Quem prioriza o backlog, com a REGENTE | Nenhuma tarefa desta feature (não reordeno nada aqui) |
| D5 | O wireframe revisado usa os tokens da alta fidelidade da referência (default, premissa 17) ou o estilo rascunho da página `20:2131`? | Pessoa | Pintura dos frames; sem resposta vale o default |
| D8 | O Login tem cabeçalho na referência? O ESQUADRO não leu isso, e a US-WFR-16 exige cabeçalho nas 24 telas | ESQUADRO, ao editar | US-WFR-16 no Login (resolver com a variante sem "voltar" do mesmo componente e registrar) |
| D9 | O que é cada um dos frames `20:968` e `20:2131` do Figma de referência? (Uma fonte diz baixa e alta, outra diz que `20:2131` é a página de baixa; ver 0.3, item 1.) | Pessoa | Qualquer uso desses frames como referência de estrutura ou de visual; a D5 depende desta |
| D10 | Qual é o texto novo da frase sobre F25 a F29 e do limite "só wireframe", agora que o alta das quatro telas entra na F39? | Pessoa | A reescrita da seção 2 (a frase da v2 segue marcada) |
| D11 | A marcação "redesenho aguardando código" vai nos frames do Figma, no PRD ou nos dois? | Pessoa | US-WFR-22 (cenário de marcação); só vale depois da F41 |
| D12 | A versão nomeada da F24 (premissa 11, US-WFR-15) continua exigida, ou a decisão de 2026-11-13 de editar sem versão salva a substitui? | Pessoa | **A liberação do ESQUADRO** (G1). Sem resposta, vale a versão nomeada |
| D13 | Quantos frames de alta fidelidade as quatro telas têm e em quais estados? (O diálogo de logout e a tab bar não têm naturalmente os quatro estados de uma tela de dados.) | Pessoa, com o ESQUADRO | US-WFR-20 (a contagem esperada de alta fica sem número até a resposta) |
| D14 | O que foi editado no Figma, em quais frames e quando? | Pessoa | A seção 1.1 e a US-WFR-18; sem resposta, nenhum frame consta como editado |

## 8. Dados pessoais no conteúdo de exemplo (LGPD)

Nenhum dado real de cliente, veículo ou financeiro da oficina pode aparecer no wireframe nem no arquivo de design compartilhado. Nomes que vierem da referência (ex.: "Roberto Alves" aparece no cabeçalho de detalhe lido pelo ESQUADRO) só entram se forem fictícios; na dúvida, troca por placeholder.

| Dado fictício | Finalidade | Base legal | Retenção |
|---|---|---|---|
| Nome, telefone, e-mail de cliente (telas de Clientes) | Ilustrar hierarquia de informação | Não aplicável: dado fictício, não é dado pessoal de titular real | Enquanto o arquivo de wireframe existir; não migra para produção |
| Placa, marca, modelo de veículo (telas de Veículos) | Idem | Não aplicável: fictício | Idem |
| Valor de parcela, pagamento, lançamento (Financeiro) | Idem | Não aplicável: fictício | Idem |

Os 16 frames novos seguem a mesma regra. O arquivo da referência tem links para `127.0.0.1` nos chips de anotação; nenhum link, URL local ou id de servidor interno é copiado para o wireframe nem para este repositório.

## 9. Acessibilidade e i18n

- Acessibilidade é critério de aceitação nos quatro estados de cada tela (US-WFR-06), não fase futura: ordem de leitura numerada, foco inicial, texto alternativo de ícone e imagem informativos, aria-live em Carregando e Erro.
- Alvo de toque: a referência tem botão de ícone de 36×36 no cabeçalho, abaixo do mínimo de 48 do projeto. O wireframe usa área de toque de 48×48 (o preenchimento visível pode ser menor).
- Informação nunca só por cor: erro de campo com borda **e** texto; item ativo da navegação inferior com cor, peso e indicador de forma.
- i18n: texto de interface do app não é fixado aqui. Quando uma feature de front implementar, usa chave `area.componente.texto`. Os textos dos frames são placeholders em PT-BR. Datas, valores e números de exemplo seguem a localidade `pt-BR` (ex.: `R$ 1.250,00`, `13/11/2026`).

## 10. Histórias de usuário e critérios de aceitação

IDs `US-WFR-NN`, área `WFR`, feature F39. Cada cenário é um comportamento e foi escrito para o CRIVO executar sem interpretar. Onde há comando, a saída esperada está no texto.

### US-WFR-01 — Cobertura completa de telas (baixa fidelidade)

**Como** pessoa dona do produto, **quero** as 24 telas do inventário nos quatro estados em baixa fidelidade, **para** não perder tela nem estado na revisão. A contagem abaixo vale **só para a baixa fidelidade**; o alta das quatro telas tem contagem própria (US-WFR-20).

```gherkin
Cenário: 96 frames canônicos e 14 variantes de baixa fidelidade, exatamente
  Dado a lista docs/design/f39-frames/frames-esperados.csv (110 nomes)
  E os nomes dos filhos diretos da página 3:2, um por linha, em lista-real.txt
  Quando executo docs/design/f39-frames/check-frames.sh lista-real.txt
  Então a saída contém "canonicos presentes: 96 de 96" e "variantes presentes: 14 de 14"
  E contém "faltando: 0", "extra: 0" e "duplicado: 0"
  E o código de saída é 0
  E nenhuma tela de número 25 ou superior existe
  E nenhum frame de alta fidelidade está entre os filhos diretos da página 3:2 (a contagem do alta está na US-WFR-20)

Cenário de erro: matriz antiga de 93
  Dado uma página com só 8 frames Vazio (matriz da F24)
  Quando executo o verificador
  Então a saída contém "faltando: 16", "RESULTADO: diverge" e o código de saída é 1
  E a entrega não é aprovada
```

### US-WFR-02 — Navegação inspirada na referência

**Como** pessoa dona do produto, **quero** ver de onde veio cada escolha de agrupamento, **para** conferir a inspiração contra a referência.

```gherkin
Cenário: agrupamento e hierarquia com node-id
  Dado os seis grupos da referência: Autenticação, Clientes e Veículos, Catálogo, Ordens de Serviço, Financeiro e Perfil
  Quando abro docs/design/F39-redesenho-wireframes-navegacao.md
  Então cada grupo descreve o agrupamento e a hierarquia adotados
  E cada grupo cita ao menos um node-id da referência que o inspirou

Cenário de erro: grupo sem origem
  Dado um grupo descrito sem node-id da referência
  Quando o CRIVO confere o documento
  Então a US-WFR-02 reprova e o grupo é listado pelo nome
```

### US-WFR-03 — Grafo sem telas órfãs

**Como** pessoa usuária, **quero** que toda tela tenha entrada e saída, **para** nunca ficar presa.

```gherkin
Cenário: entrada e saída em todas as telas
  Dado o mapa docs/architecture/diagrams/navegacao-wireframe-f24.md atualizado
  Quando percorro as 24 telas a partir do Login
  Então cada tela tem ao menos uma aresta de entrada e uma de saída documentadas
  E as telas 07 (Veículos · criar) e 16 (Movimentação de estoque), órfãs na F24, têm entrada (04 → 07; 13 → 16, decisão D6)
  E existe a aresta "lista raiz → Perfil" pelo ícone do cabeçalho, que a F24 não tinha

Cenário: Carregando e Erro com saída
  Dado qualquer tela nos estados Carregando e Erro
  Quando verifico as ações do frame
  Então Erro tem "Tentar novamente" e Carregando tem saída por voltar ou cancelar
  E nenhum frame é beco sem saída

Cenário de erro: tela órfã ou sem saída
  Dado uma tela sem aresta de entrada ou uma ação sem destino
  Quando o mapa é revisado
  Então a entrega não é aprovada e o tipo de lacuna (sem entrada, sem saída) é registrado
```

### US-WFR-04 — Não reabertura do código

**Como** pessoa dona do produto, **quero** garantir que o trabalho aceito de F33/F34 e o app ficam intactos, **para** proteger o escopo.

```gherkin
Cenário: nenhum arquivo protegido no diff
  Dado a branch da F39
  Quando executo git diff --name-only main -- apps docs/design/identidade-visual.md docs/product/F33-menu-principal-navegacao.md
  Então a saída é vazia

Cenário de erro: arquivo protegido alterado
  Dado qualquer arquivo de apps/mobile, apps/api ou identidade-visual.md, ou o PRD do F33, no diff
  Quando executo o mesmo comando
  Então a saída lista o arquivo, a entrega não é aprovada e a alteração é revertida
```

Verificado em 2026-11-13 na branch `docs/f39-wireframe-redesenho`: o comando acima devolveu 0 linhas. O diff da branch inteira contra a `main` tem 4 arquivos, todos de documentação (ADR-014, `docs/architecture/overview.md`, `docs/design/F39-redesenho-wireframes-navegacao.md`, `docs/design/figma.md`). Repetir no fechamento, já com os arquivos desta etapa.

### US-WFR-05 — Divergência com o F33 registrada como débito

**Como** pessoa dona do produto, **quero** que divergência com o F33 vá para a REGENTE, **para** não reinterpretá-lo sozinha.

```gherkin
Cenário: divergência registrada
  Dado a navegação inferior da referência (4 itens) e a decisão travada do F33 (1 habilitada + 4 desabilitadas, 5 posições)
  Quando a navegação revisada exigir outra arquitetura de menu
  Então a seção 11 registra o débito com a tela afetada, o ponto de divergência e a pergunta endereçada à REGENTE
  E nenhuma linha de código ou do PRD do F33 é alterada

Cenário de erro: débito sem pergunta
  Dado um débito na seção 11 sem tela afetada ou sem pergunta à REGENTE
  Quando o CRIVO confere a seção
  Então a US-WFR-05 reprova
```

Estado atual: **o cenário acima se aplica**, a divergência existe (seção 11).

### US-WFR-05b — Sem divergência

```gherkin
Cenário: navegação compatível com o F33
  Dado a navegação revisada compatível com o F33
  Quando o PRD é fechado
  Então a seção 11 traz a frase "sem divergência com o F33"
```

Estado atual: **não se aplica**, porque há divergência (US-WFR-05).

### US-WFR-06 — Acessibilidade nos quatro estados

**Como** pessoa com leitor de tela, baixa visão ou teclado, **quero** que cada estado traga a anotação de acesso, **para** a base do protótipo já nascer acessível.

```gherkin
Cenário: anotação completa por estado
  Dado qualquer das 24 telas, em cada um dos 4 estados canônicos
  Quando abro a anotação do frame
  Então ela traz a ordem de leitura numerada
  E indica o elemento que recebe o foco inicial
  E traz o texto alternativo de cada imagem ou ícone informativo
  E nenhuma informação depende só de cor

Cenário: anúncio dinâmico
  Dado uma tela no estado Carregando
  Então a anotação indica aria-live "polite" com a mensagem de carregamento
  Dado uma tela no estado Erro
  Então a anotação indica aria-live "assertive", a mensagem de erro e a ação de recuperação ("Tentar novamente" ou voltar)

Cenário de erro: anotação faltando
  Dado um frame sem ordem de leitura, foco inicial ou aria-live exigido
  Quando o CRIVO confere a tela
  Então a tela reprova pelo número, nome e estado do frame
```

### US-WFR-07 — Aprovação antes de seguir

**Como** pessoa dona do produto, **quero** aprovar o wireframe por escrito, **para** que nenhum protótipo avance sobre hierarquia não validada.

```gherkin
Cenário: aprovação registrada
  Dado a D2 respondida, a versão nomeada da F24 registrada (G1) e as US-WFR-01 a 06, 08 a 18 e 21 sem pendência para a baixa fidelidade (as US-WFR-19, 20 e 22 tratam do alta das quatro telas, que só começa depois da F41)
  Quando BUSSOLA valida o wireframe
  Então a seção 12 ganha uma linha "Aprovado" com data e identificação (nome e id) da versão do Figma
  E só a partir dessa linha F26 a F29 e qualquer protótipo novo podem avançar

Cenário de erro: aprovação alegada sem registro
  Dado uma alegação em chat de que o wireframe foi aprovado
  Quando não há linha "Aprovado" com data e id na seção 12
  Então a aprovação não conta
```

Estado atual: **não há linha "Aprovado"** (seção 12).

### US-WFR-08 — Componente de navegação com motivo

**Como** pessoa dona do produto, **quero** o motivo de cada bottom sheet, modal, drawer ou menu flutuante, **para** que a liberdade não vire enfeite.

```gherkin
Cenário: motivo estrutural
  Dado uma tela que usa bottom sheet, modal, drawer ou menu flutuante
  Quando consulto a tabela do documento de design
  Então há uma linha com tela, componente e motivo estrutural (preservar contexto, confirmar ação destrutiva, escolha rápida entre poucas opções)

Cenário de erro: motivo estético
  Dado um motivo do tipo "ficou mais bonito"
  Quando a revisão acontece
  Então o uso é recusado para aquela tela
```

### US-WFR-09 — Visual da referência por estilos, sem valor solto

**Como** pessoa dona do produto, **quero** o visual da referência aplicado por variáveis e estilos, **para** a troca de valor futura ser feita num lugar só.

```gherkin
Cenário: nenhum valor solto
  Dado a coleção de variáveis v2 criada no arquivo DLqbSzzKRxiN2eyvXG73Lr (a coleção da F25, 28:3, não é editada)
  Quando o ESQUADRO lista, por use_figma somente leitura, fills, textos e raios dos 110 frames
  Então 0 valores de cor, tipografia, espaçamento ou raio estão fora de variável ou estilo
  E o quadro comparativo token a token com petro e primary está anexado (documento de design, seção 4)

Cenário de erro: valor solto
  Dado um fill ou texto fora de variável e estilo
  Quando a listagem é feita
  Então o frame é citado pelo node-id e a US-WFR-09 reprova
```

### US-WFR-10 — Contraste WCAG 2.2 AA

**Como** pessoa com baixa visão, **quero** pares de cor que passam em AA, **para** ler a tela.

```gherkin
Cenário: pares medidos
  Dado a paleta aplicada e os estados erro, vazio e foco
  Quando cada par de texto e fundo é medido por método reprodutível (script ou fórmula versionada no repositório)
  Então texto normal tem razão mínima de 4,5:1
  E texto grande, componente de interface e anel de foco têm 3:1
  E a tabela mostra par, razão medida e resultado
  E todo ajuste registra valor antes e depois

Cenário: pares conhecidos que falham
  Dado os pares que o ESQUADRO mediu abaixo do mínimo (placeholder Dawn 2,50:1; badges #8C8780 3,56:1, #BF8B3D 3,01:1, #5C8C68 3,88:1; borda Westar 1,34:1)
  Quando o wireframe é entregue
  Então nenhum desses pares aparece em frame sem o ajuste proposto (valores depois no documento de design, seção 5)

Cenário de erro: método não reprodutível
  Dado uma razão sem script ou fórmula no repositório
  Quando o CRIVO tenta repetir a medição
  Então a US-WFR-10 reprova até o método ser versionado
```

O método está versionado em `docs/design/f39-frames/contraste.mjs`, com os pares em `pares-contraste.csv` e o teste em `contraste.test.mjs` (commit f53c063). Conferi que os arquivos existem; a execução está na seção 15.

### US-WFR-11 — Identidade da referência registrada, com lista de impacto

**Como** pessoa dona do produto, **quero** saber o que a nova identidade obriga a revisar, **para** priorizar sem surpresa.

```gherkin
Cenário: quadro e impacto
  Dado a paleta e a tipografia da referência adotadas (D1)
  Quando o quadro comparativo é concluído
  Então cada token traz valor vigente e valor da referência
  E registra que petro e primary não mudam (premissa 13)
  E a seção 10.1 lista, para F25 a F29, F33/F34, tokens do app, identidade-visual.md, F40 e F41, o que revisar
  E nenhum protótipo, token ou identidade-visual.md é alterado nesta feature (US-WFR-04)
```

#### 10.1 Lista de impacto (resumo; detalhe no documento de design, seção 11)

| Item | O que revisar | Tamanho (relato do ESQUADRO) |
|---|---|---|
| F25 | Neutros (slate → quentes), erro, fundo Pampas, tipografia, raio, sombra. Marca não muda | médio |
| F26 a F29 | Não iniciadas: não começar sobre os neutros antigos; usar a coleção v2 | evitável |
| F33/F34 | Decisão da REGENTE (seção 11); rever só cor de inativo e fonte do rótulo | pequeno |
| `apps/mobile/src/theme/tokens.ts` | Valores de neutros; adicionar status, erro, aviso, sucesso e `fontFamily`; não renomear chaves (ADR-014). Erro com primitivo próprio | médio |
| `docs/design/identidade-visual.md` | A seção 2.5 afirma AA em todos os pares e 7 falham | pequeno |
| F40 e F41 | Refazer a base de comparação depois da migração | médio |
| Dependência | `@expo-google-fonts/barlow-condensed` e `@expo-google-fonts/inter` | pequeno |

### US-WFR-12 — Direito de uso da referência

**Como** pessoa dona do produto, **quero** a titularidade e a licença registradas, **para** não basear a identidade em material sem direito de uso.

```gherkin
Cenário: titularidade e fonte registradas
  Dado a D2 respondida pela pessoa
  Quando o visual é aplicado
  Então a seção 7 registra a titularidade ou licença do arquivo
  E registra, para a fonte, família, licença e disponibilidade no Expo

Cenário: arquivo de terceiros sem licença confirmada
  Dado a resposta da D2 de que o arquivo é de terceiros e a licença não foi confirmada
  Quando o wireframe é entregue
  Então nenhum ícone, imagem ou fonte foi copiado, só o estilo reproduzido
  E o PRD marca o wireframe como "não aprovado para base de identidade"
```

Estado atual: D2 em aberto. Não aprovado para base de identidade até a resposta.

### US-WFR-13 — Risco de sequência registrado

```gherkin
Cenário: risco e D3 endereçados
  Dado que a troca de identidade desatualiza a base de F26 a F29, F40 e F41
  Quando o PRD é fechado
  Então a premissa 9 registra o risco
  E a D3 está endereçada a quem prioriza o backlog com a REGENTE
  E nenhuma feature foi reordenada dentro da F39
```

### US-WFR-14 — Referência inacessível

```gherkin
Cenário: bloqueio de acesso
  Dado que o Figma de referência não abre ou não expõe os frames para o ESQUADRO
  Quando a extração de tokens é tentada
  Então o PRD registra o bloqueio com a saída real do acesso
  E nenhum token é inferido ou inventado
  E o wireframe não avança para o redesenho
```

Estado atual: o ESQUADRO acessou a referência (`whoami`, `get_metadata`, `get_design_context`, `get_variable_defs`, `get_screenshot`), então o cenário não foi disparado. O acesso **meu** foi negado (seção 13, G2) e não é o que a história cobre.

### US-WFR-15 — F24 preservada antes da sobrescrita

**Como** pessoa dona do produto, **quero** ponto de retorno da F24 aprovada, **para** poder comparar e desfazer.

```gherkin
Cenário: versão nomeada antes da primeira edição
  Dado a versão nomeada da F24 aprovada criada no histórico do Figma
  Quando a primeira edição é feita
  Então a seção 13 registra nome e id da versão, quem informou e quando
  E a captura do antes (US-WFR-21) existe para cada frame que será editado, feita antes da primeira edição
  E os 96 frames canônicos de baixa fidelidade (80 editados no lugar e 16 criados) e as 14 variantes (editadas no lugar) estão no Figma
  E os frames de baixa fidelidade editados mantêm os node-ids citados em docs/design/figma.md e docs/design/F24-wireframe-baixa-fidelidade.md, ou esses documentos foram atualizados
  E os 16 frames de Vazio novos têm o node-id registrado no documento de design
```

### US-WFR-15b — Versão não criada

```gherkin
Cenário: bloqueio da versão
  Dado que a versão nomeada da F24 não pôde ser criada ou confirmada
  Quando o ESQUADRO tenta iniciar o redesenho
  Então nenhuma página da F24 é editada, nem variável, estilo ou coleção criada
  E o PRD registra o bloqueio com a saída real
```

Estado atual: **este cenário está em vigor** (seção 13, G1). A dispensa da versão nomeada decidida em 2026-11-13 conflita com este critério (0.3, item 2, D12); enquanto a pessoa não responder, vale o critério como está escrito.

### US-WFR-16 — Cabeçalho indica onde a pessoa está

```gherkin
Cenário: um componente, 110 instâncias
  Dado o componente de cabeçalho do Figma, com propriedade de título, indicador de voltar e espaço para ação ou badge
  Quando abro qualquer das 24 telas em qualquer dos 4 estados
  Então o cabeçalho é uma instância desse componente (nenhuma cópia solta ou desanexada)
  E mostra o título da tela
  E mostra a ação de voltar quando a tela é aberta a partir de outra
  E o botão de ação tem área de toque de 48×48
  E o documento cita o node-id da referência (variantes `20:1174` lista, `20:1435` detalhe, `20:1455` formulário, `20:1726` detalhe de OS)

Cenário de erro: cabeçalho copiado
  Dado um frame cujo cabeçalho é cópia desanexada
  Quando o CRIVO conta as instâncias
  Então a US-WFR-16 reprova e o node-id do frame é citado
```

### US-WFR-17 — Navegação inferior semelhante à referência

```gherkin
Cenário: itens, ordem e estado ativo
  Dado a navegação inferior da referência (node-id 20:1103)
  Quando o wireframe revisado é entregue
  Então o documento descreve 4 itens na ordem Ordens, Clientes, Catálogo, Financeiro, com ícone acima do rótulo
  E o item ativo se distingue por cor, peso do rótulo e um indicador de forma (não só cor)
  E cada item tem nome acessível no formato "Ordens, aba 1 de 4, selecionada"
  E cada item tem alvo de toque de no mínimo 24×24 px (WCAG 2.5.8), no wireframe 90×62

Cenário: onde aparece
  Dado as 24 telas e seus estados
  Então a navegação inferior aparece nas telas raiz (03 Clientes · lista, 10 Serviços · lista, 13 Peças · lista, 17 OS · lista, 22 Financeiro · parcelas, 24 Financeiro · lançamentos), em todos os estados delas
  E fica oculta nas demais 18 (Login, Perfil, detalhes, formulários, transição, parcelas da OS, pagamento)
```

A regra de exibição vem da leitura do ESQUADRO (documento de design, seção 6.4) e ele a confirma nos frames.

### US-WFR-17b — Navegação inferior diverge do F33

```gherkin
Cenário: divergência registrada
  Dado que a referência tem 4 abas (Perfil fora da barra, Ordens primeiro) e o F33 tem 5 posições (Perfil primeiro, habilitado)
  Quando o PRD é fechado
  Então a seção 11 registra o débito com a tela afetada (Perfil, 02) e a pergunta à REGENTE
  E a tab bar do app permanece inalterada
```

Estado atual: **em vigor** (seção 11, débitos 1 e 2).

### US-WFR-18 — Evidência de que o Figma foi editado

```gherkin
Cenário: evidência de depois, com a captura do antes ligada
  Dado o redesenho concluído
  Quando o PRD é fechado
  Então a seção 13 lista os node-ids dos frames editados e dos 16 criados
  E traz a captura de antes registrada na US-WFR-21 (frames da F24, da F25 e da F34 que foram tocados) e, quando existir, a versão nomeada da F24
  E traz a captura de depois do cabeçalho, da navegação inferior e de uma tela de cada um dos 6 grupos da referência
  E as capturas estão em docs/design/f39-frames/evidencias/, PNG de até 500 KB cada
  E a saída do check-frames.sh contra o Figma real consta como "RESULTADO: confere"

Cenário: antes ausente
  Dado um frame da F24, da F25 ou da F34 editado sem a captura do antes da US-WFR-21
  Quando o CRIVO confere a seção 13
  Então a US-WFR-18 reprova e o node-id do frame sem captura é citado

Cenário de erro: sem evidência
  Dado um PRD fechado sem node-ids, capturas de antes e depois ou saída do verificador
  Quando o CRIVO confere
  Então a feature não é dada como entregue
```

Estado atual: nada foi confirmado como editado (D14), sem evidência possível.

### US-WFR-19 — Baixa fidelidade antes da F41

**Como** pessoa dona do produto, **quero** que o baixa fidelidade avance sem esperar a F41 e que o alta das quatro telas só comece depois dela, **para** que as capturas finais da F41 sirvam de linha de base do "antes".

```gherkin
Cenário: baixa fidelidade avança sem esperar a F41
  Dado a F41 ainda não concluída
  E o ESQUADRO liberado pela lista da seção 13 (G1 e demais itens)
  Quando o redesenho de baixa fidelidade é planejado
  Então os frames da página 3:2 podem ser editados sem esperar a F41
  E a F41 não consta no campo de dependências da F39 (só a F24)
  E a ordem consta como premissa 20, não como dependência

Cenário: alta das quatro telas espera a F41
  Dado a F41 sem status concluída
  Quando alguém tenta editar o frame de alta de Login, Perfil, diálogo de confirmação de logout ou tab bar
  Então nenhum desses frames é editado
  E o bloqueio é registrado com o motivo "aguardando o fechamento da F41"

Cenário: alta liberada depois da F41
  Dado a F41 concluída e a captura do antes dos frames de alta feita (US-WFR-21)
  Quando o ESQUADRO edita o alta das quatro telas
  Então a edição respeita a contagem própria (US-WFR-20) e a marcação (US-WFR-22)
```

Estado atual: a F41 consta como **Pronta** no painel do projeto, não como concluída (não conferi o fechamento dela). Nenhum frame de alta foi editado, e o baixa também não, porque o G1 está fechado.

### US-WFR-20 — Contagem própria do alta fidelidade das quatro telas

**Como** pessoa dona do produto, **quero** a contagem do alta das quatro telas separada da contagem da baixa, **para** que o critério de 96 frames da US-WFR-01 continue verificável.

```gherkin
Cenário: contagem à parte
  Dado os frames de alta fidelidade de Login, Perfil, diálogo de confirmação de logout e tab bar entregues
  Quando conto os frames de alta
  Então cada frame de alta é nomeado com tela e estado
  E a contagem esperada de alta consta na seção 5, definida na resposta da D13
  E a soma não altera a contagem da US-WFR-01: o check-frames.sh sobre a página 3:2 continua devolvendo "canonicos presentes: 96 de 96" e "variantes presentes: 14 de 14"
  E nenhum frame de alta está entre os filhos diretos da página 3:2

Cenário de erro: alta somado à baixa
  Dado um frame de alta contado dentro dos 96 canônicos ou das 14 variantes
  Quando o CRIVO confere as duas contagens
  Então a US-WFR-20 reprova e o frame é citado pelo nome
```

Estado atual: o número de frames de alta **não está fixado** (D13) e não o inferi. Nenhum frame de alta foi entregue.

### US-WFR-21 — Captura do antes de F24, F25 e F34

**Como** pessoa dona do produto, **quero** a captura de cada frame antes de ele ser editado, **para** ter a evidência do "antes" mesmo sem versão salva no histórico do Figma.

```gherkin
Cenário: captura antes da primeira edição
  Dado os frames da F24 (página 3:2), da F25 (Login e Perfil em alta) e da F34 (tab bar em alta) que o redesenho vai tocar
  Quando o ESQUADRO vai fazer a primeira edição em qualquer um deles
  Então cada frame que será tocado já foi capturado como está, em PNG de até 500 KB, em docs/design/f39-frames/evidencias/antes/
  E a seção 13 lista o node-id de cada frame capturado, com data e hora da captura
  E a data e hora da captura é anterior à da primeira edição registrada daquele frame

Cenário de erro: edição sem captura
  Dado um frame tocado sem captura do antes ou sem node-id listado na seção 13
  Quando o CRIVO confere
  Então a US-WFR-21 reprova, o node-id do frame é citado e o frame é tratado como linha de base perdida
```

Estado atual: **nada foi capturado**. A tabela da seção 13 está vazia, e o ESQUADRO não é liberado antes de ela ser preenchida.

### US-WFR-22 — Marcação "redesenho aguardando código"

**Como** pessoa dona do produto, **quero** que o alta redesenhado e ainda sem código esteja marcado, **para** que a revisão de paridade não o confunda com o frame aprovado.

```gherkin
Cenário: frame novo marcado
  Dado um frame de alta de Login, Perfil, diálogo de confirmação de logout ou tab bar editado pela F39
  Quando o código do app ainda não o acompanha
  Então o frame está marcado "redesenho aguardando código", no local definido na D11
  E o frame não conta como frame aprovado para efeito de paridade
  E na revisão de paridade de fim de sprint a referência do código vigente é a linha de base da F41 (frames da F25 e da F34 capturados como estavam e capturas finais do app)

Cenário: fim da exceção
  Dado a feature de código posterior à F41 fechada, com as telas no frame novo e o teste de componente ajustado
  Quando ela fecha
  Então a marcação sai e o frame volta a contar como aprovado para a paridade

Cenário de erro: marcação fora do alcance
  Dado uma tela de alta que não é uma das quatro
  Quando alguém a marca "redesenho aguardando código"
  Então a marcação é recusada, porque a exceção vale só para as quatro telas
```

Estado atual: o local da marcação **não foi definido** (D11). Nenhum frame foi editado, então nenhum está marcado.

## 11. Registro de débitos à REGENTE (US-WFR-05 e 17b)

Origem: documento do ESQUADRO, seção 10, com a referência lida por ele (`20:1102`/`20:1103`). Não implementei nada. O F33 e a tab bar não foram tocados.

| # | Data | Divergência | Referência | F33 / F34 | Tela afetada | Pergunta à REGENTE | Status |
|---|---|---|---|---|---|---|---|
| 1 | 2026-11-13 | Número e conteúdo das abas | 4 abas: Ordens, Clientes, Catálogo, Financeiro. Perfil fora da barra, aberto pelo ícone de pessoa no cabeçalho das telas raiz | 5 posições: Perfil habilitado + 4 desabilitadas | 02 Perfil e as 6 telas raiz | O Perfil fica como aba (F33) ou passa a ser acesso pelo cabeçalho (referência)? | **Aberto, aguarda REGENTE** |
| 2 | 2026-11-13 | Ordem das abas | Ordens primeiro | Perfil primeiro; Ordens em quarto | 17 OS · lista (e demais raiz) | Qual é a aba de pouso quando as demais forem habilitadas? | **Aberto, aguarda REGENTE** |

Pontos que o ESQUADRO listou como divergência e que **não** são débito, porque se resolvem no wireframe sem tocar o F33:
- Aba ativa: a referência usa texto e ícone Crail sobre petro (2,24:1, falha 3:1). O wireframe mantém o indicador de forma do F34 (texto branco sobre pill Crail, 5,41:1).
- Alvo de toque do botão do cabeçalho: 36×36 na referência, 48×48 no wireframe (mínimo do projeto).

O alta da tab bar (US-WFR-20) herda os débitos 1 e 2: um frame de alta com 4 abas só pode virar código depois da decisão da REGENTE. Isso decorre do texto dos débitos; não é decisão nova.

Decisão de abrir ou não uma feature de revisão do menu: **da REGENTE**. Sem implementação nesta feature.

## 12. Registro de execução — US-WFR-07

| # | Data | Tipo | Descrição | Status |
|---|---|---|---|---|
| 1 | 2026-11-13 | Pendência | G1: versão nomeada da F24 não criada nem informada (seção 13). A D12 pergunta se a dispensa de 2026-11-13 a substitui | Aberta |
| 2 | 2026-11-13 | Pendência | D2: titularidade da referência não respondida | Aberta |
| 3 | 2026-11-13 | Pendência | D5: estilo da referência (default em uso) aguarda confirmação; depende da D9 | Aberta |
| 4 | 2026-11-13 | Pendência | Débitos 1 e 2 da seção 11 aguardam a REGENTE | Aberta |
| 5 | 2026-11-13 | Resolvida | Contagem 93 contra 96: D7, 96 canônicos + 14 variantes, **só baixa fidelidade**, verificador executável (seção 5) | Resolvida no PRD; a conferência contra o Figma real depende da edição |
| 6 | 2026-11-13 | Resolvida | US-WFR-10: script de contraste versionado em `docs/design/f39-frames/` (commit f53c063); testes rodados na seção 15 | Resolvida |
| 7 | 2026-11-13 | Pendência | D9: papel dos frames `20:968` e `20:2131` | Aberta |
| 8 | 2026-11-13 | Pendência | D10: texto novo da frase sobre F25 a F29 e do limite "só wireframe" | Aberta |
| 9 | 2026-11-13 | Pendência | D11: local da marcação "redesenho aguardando código" | Aberta |
| 10 | 2026-11-13 | Pendência | D13: número e estados dos frames de alta das quatro telas | Aberta |
| 11 | 2026-11-13 | Pendência | D14: o que foi editado no Figma, em quais frames e quando | Aberta |
| 12 | 2026-11-13 | Pendência | US-WFR-21: captura do antes de F24, F25 e F34 não feita | Aberta |

**Aprovação: não registrada.** Nenhum frame consta como editado (1.1), então não há o que aprovar. F26 a F29 e qualquer protótipo novo continuam sem liberação.

## 13. Bloqueios e gates

### G1 — Versão nomeada da F24 (bloqueia toda edição)

Saída real do ESQUADRO, duas tentativas em 2026-11-13 (documento de design, seções 1 e 1.1):

```
await figma.saveVersionHistoryAsync('F24 aprovada (pré-F39)', '…');
→ "error":"in saveVersionHistoryAsync: \"saveVersionHistoryAsync\" is not a supported API"
```

A página `3:2` seguiu com 94 filhos; `28:2` com 10 e `39:2` com 6. Nenhum nó, variável, estilo ou coleção foi criado ou alterado.

**O que libera o ESQUADRO** (uma das três, decisão da pessoa):
1. Abrir `DLqbSzzKRxiN2eyvXG73Lr` no Figma, salvar a versão pelo menu do histórico com o nome `F24 aprovada (pré-F39)` e informar o **nome** e o **id** (parâmetro `version-id` da URL ao abrir a versão), com uma captura da lista do histórico mostrando a versão.
2. Autorizar por escrito, em desvio da D4, duplicar a página como `F24 · aprovada (arquivo morto)` no mesmo arquivo.
3. Responder a D12 por escrito, confirmando que a decisão de 2026-11-13 (editar direto sobre os frames da F24, sem versão salva, assumindo o risco de perder a linha de base) substitui a premissa 11. Nesse caso a captura do antes (US-WFR-21) é o único ponto de retorno, e eu reescrevo a US-WFR-15 e a US-WFR-15b antes de qualquer edição.

Nenhuma ferramenta que eu ou o ESQUADRO temos lê o histórico de versões. Por isso o registro abaixo vale como "informado pela pessoa, conferido contra a captura", não como verificado por API.

| Nome da versão | Id (`version-id`) | Informado por | Data e hora | Captura do histórico | Status |
|---|---|---|---|---|---|
| — | — | — | — | — | **Pendente: ESQUADRO não liberado** |

### G2 — Acesso de BUSSOLA ao Figma nesta sessão

Chamada `mcp__figma-remote__create_session` (arquivo `DLqbSzzKRxiN2eyvXG73Lr`, somente leitura), 2026-11-13. Saída real:

```
Claude requested permissions to use mcp__figma-remote__create_session, but you haven't granted it yet.
```

Não repeti a chamada nem tentei outra ferramenta do Figma. Consequência: não conferi nenhum nome de frame no arquivo real. A contagem da seção 5 foi reconciliada por documentos do repositório e pelo verificador, não por leitura do Figma.

### Captura do antes (US-WFR-21): node-ids capturados

Preencher **antes** da primeira edição. Nenhum node-id foi preenchido por mim: os frames da F24 e as telas de alta da F25 e da F34 são identificados pelo ESQUADRO ao capturar, a partir de `docs/design/figma.md`.

| Origem | Node-id capturado | Arquivo da captura (em `docs/design/f39-frames/evidencias/antes/`) | Data e hora | Quem |
|---|---|---|---|---|
| F24 (página `3:2`, 94 frames existentes) | — | — | — | — |
| F25 (Login e Perfil em alta) | — | — | — | — |
| F34 (tab bar em alta) | — | — | — | — |

**Pendente: nada capturado. ESQUADRO não liberado.**

### Lista de liberação do ESQUADRO

O ESQUADRO só começa a editar quando **todos** os itens abaixo valem:

1. A linha da versão nomeada acima está preenchida (G1), ou a pessoa respondeu a D12 por escrito.
2. A captura do antes (US-WFR-21) existe e a tabela acima está preenchida.
3. Este PRD v3 está commitado.
4. A coleção de variáveis v2 é criada **antes** de qualquer pintura; a coleção da F25 (`28:3`) não é editada.
5. Os 94 frames existentes são editados e renomeados no lugar; os 16 Vazio novos são criados e seus node-ids anotados.
6. Depois de cada lote, `check-frames.sh` roda sobre os nomes reais dos filhos diretos da página `3:2` e a saída é colada na evidência.
7. Nenhum arquivo de `apps/`, `identidade-visual.md` ou do PRD do F33 é tocado (US-WFR-04).
8. Para o **alta** das quatro telas, além dos itens acima: a F41 está concluída (premissa 20) e as D9, D11 e D13 foram respondidas.

### Evidência do Figma editado (US-WFR-18)

| Item | Valor |
|---|---|
| Node-ids dos frames editados | — (nada confirmado como editado, D14) |
| Node-ids dos 16 frames criados | — |
| Captura antes (US-WFR-21; versão nomeada, se existir) | — |
| Captura depois: cabeçalho, navegação inferior, 1 tela por grupo | — |
| Frames de alta das quatro telas (contagem própria, US-WFR-20) | — (D13) |
| Saída de `check-frames.sh` contra o Figma real | — |

## 14. Priorização e o que fica para depois

As histórias são P1 e nenhuma é opcional para fechar a feature. Ordem dentro da feature, por dependência: G1 (e D12) → captura do antes (US-WFR-21) → coleção v2 → componentes de cabeçalho e navegação inferior (US-WFR-16 e 17) → 94 frames editados + 16 novos, em baixa fidelidade (US-WFR-01, 09) → anotações (US-WFR-06) → grafo (US-WFR-03) → contraste (US-WFR-10) → evidência (US-WFR-18) → aprovação do baixa (US-WFR-07). O alta das quatro telas (US-WFR-19, 20, 22) vem **depois da F41** e não bloqueia o baixa.

Fica para depois, sem decisão nova:
- Revisão de F25 a F29, tokens do app e `identidade-visual.md` (D3; texto novo na D10).
- Alta das demais telas: F26 a F29.
- Código que acompanha o alta novo: feature própria, posterior à F41.
- Qualquer mudança de código ou de decisão do menu (F33), condicionada à REGENTE.
- Ícones finais, imagens reais, microinterações.
- Itens de backlog (dashboard, fotos, PDF, WhatsApp).

## 15. Handoff para ESQUADRO

**O que esta etapa fez (v3)**
- Aplicou os ajustes da revisão humana de 2026-11-13, 19:52 (oito itens, seção 0.1): contagem qualificada como baixa fidelidade (US-WFR-01), "96 frames de baixa fidelidade" na US-WFR-15, captura do antes ampliada para F25 e F34 (US-WFR-18 e 21), premissas 19 a 24, quatro critérios novos (US-WFR-19 a 22) e Estado atual reescrito (1.1).
- Manteve fechada a contagem 96 contra 93 (seção 5, D7: 96 canônicos + 14 variantes, só baixa fidelidade).
- **Não liberou o ESQUADRO para editar o Figma.** O link da referência está registrado (premissa 1) e os node-ids que a pessoa citou também (premissa 19), mas a **versão nomeada da F24 não existe** (G1) e a D12 está aberta.

**O que o ESQUADRO pode fazer agora, sem editar nada no Figma** (somente leitura)
1. Capturar o antes (US-WFR-21) dos frames da F24, da F25 e da F34 que serão tocados e preencher a tabela da seção 13. É pré-requisito, e capturar não altera nó.
2. Ler `20:968` e `20:2131` na referência e relatar o que são, como **fato lido**, para a pessoa responder a D9. Não atribuir papel nem extrair token a partir deles antes da resposta.
3. Manter o documento de design (`docs/design/F39-redesenho-wireframes-navegacao.md`) alinhado a esta versão; ele ainda cita o PRD como v1 em alguns pontos.

**O que o ESQUADRO não faz até a liberação**: editar, renomear ou criar frame, variável, estilo ou coleção; tocar o alta das quatro telas (depende da F41 e das D9, D11 e D13).

**Pendências, com dono**
- Pessoa: G1 e D12 (versão nomeada ou dispensa por escrito), D2, D5, D9, D10, D11, D13, D14.
- REGENTE: débitos 1 e 2 (seção 11). Quem prioriza o backlog, com a REGENTE: D3.
- ESQUADRO: D8 (cabeçalho do Login); capturas do antes; 16 frames novos e edição só depois da liberação.
- BUSSOLA: aprovar ou reprovar (seção 12) quando houver frames editados; escrever o texto da D10 quando a pessoa fornecer.

**Verificado por mim, em 2026-11-13, com saída real**
- `node --test docs/design/f39-frames/contraste.test.mjs`: 7 testes, 7 passam, 0 falham.
- `bash docs/design/f39-frames/test-check-frames.sh`: 9 casos `ok`, `falhas: 0`.
- `git diff --name-only main -- apps docs/design/identidade-visual.md docs/product/F33-menu-principal-navegacao.md`: 0 linhas (US-WFR-04).
- Estrutura deste PRD (seções, numeração de premissas 1 a 24 e de dúvidas D1 a D14).

**Não verificado por mim**: qualquer conteúdo do Figma (não abri o arquivo nesta etapa), o papel de `20:968` e `20:2131`, se a F41 fechou, a titularidade da referência, o histórico de versões do Figma. O que o documento diz sobre o Figma vem do relato do ESQUADRO e está marcado assim.

**README**: sem mudança, porque esta entrega só altera documento de produto e não muda como instalar, rodar, testar ou configurar o projeto.


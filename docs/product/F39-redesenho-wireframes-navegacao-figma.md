# PRD — F39: Redesenho de wireframes com inspiração de navegação (Figma)

- Versão: **v2** (2026-11-13). Substitui a v1 de 2026-11-11.
- Prioridade: P1
- Área: Frontend (artefato de design; implementação de app fora de escopo)
- Sprint: Sprint 01: Fundação e Login (trilha paralela de design)
- Autor: BUSSOLA (Product Owner)
- Etapa da rota: **BUSSOLA (1/4)** → CARTOGRAFO → ESQUADRO → CRIVO
- Depende de: [[F24]] (wireframe de baixa fidelidade, aprovado em 2026-11-07; esta feature **sobrescreve** as páginas dele, ver D4).
- Não reabre: [[F33]] (PRD do menu, travado por REGENTE em 2026-11-09) nem o código da tab bar.
- Companheiro de design (ESQUADRO): `docs/design/F39-redesenho-wireframes-navegacao.md`.
- Insumo executável da contagem de frames: `docs/design/f39-frames/` (seção 5.6).

> **Instrução do comandante para esta etapa**: fixar 96 frames (24 telas × 4 estados) como meta, resolver a divergência com a contagem de 93 e escrever o critério de forma que o CRIVO consiga executar. A seção 5 e a US-WFR-01 fazem exatamente isso.

## 0. O que mudou da v1 para a v2

| Ponto | v1 (2026-11-11) | v2 (2026-11-13) | Origem |
|---|---|---|---|
| Visual da referência | Excluído (só estrutura de menu) | Incluído: layout, espaçamento, paleta e tipografia (premissa 1) | Decisão da pessoa, 2026-11-12 (D1) |
| Onde editar | Página nova | Sobrescrever as páginas da F24, com versão nomeada antes (premissa 11) | D4, 2026-11-12 |
| Link da referência | Não recebido | Registrado na premissa 1 | Briefing |
| Contagem de frames | 24 telas × estados "aplicáveis" (93) | **96 canônicos** (24 × 4) mais 14 variantes, 110 no total (seção 5) | D7, esta versão |
| Critérios | US-WFR-01 a 08 | US-WFR-01 a 18 (inclui 05b, 15b, 17b) | Briefing |
| Cabeçalho e navegação inferior | Não previstos | Prioridade máxima de semelhança com a referência (US-WFR-16, 17) | Pedido da pessoa, 2026-11-13 |
| Aprovação | Pendente | **Continua pendente**; bloqueios na seção 13 | — |

## 1. Visão

O wireframe da F24 resolveu cobertura de estado e fechou o grafo de navegação, mas a pessoa considera que um Figma de referência organiza as telas de forma mais harmônica e com resultado visual mais agradável. Esta feature revisa as 24 telas com a estrutura e o visual dessa referência, dando destaque ao **cabeçalho** (indica onde a pessoa está) e à **navegação inferior**. A paleta e a tipografia da referência passam a ser a identidade do produto (D1); o que isso significa para o app (F25 a F29, tokens, `identidade-visual.md`) fica mapeado aqui e executado em feature futura.

Valor para quem usa: o funcionário da oficina enxerga em qualquer tela onde está e como voltar, e a base do protótipo de alta fidelidade deixa de ser refeita a cada módulo.

## 2. Escopo

### Dentro do escopo
- Revisão das 24 telas com **96 frames canônicos** (24 telas × 4 estados) mais **14 variantes** nomeadas (seção 5), sobrescrevendo as páginas da F24.
- Versão nomeada da F24 aprovada no histórico do Figma, criada **antes** da primeira edição.
- Cabeçalho e navegação inferior como componentes únicos do Figma, aplicados por instância nas 24 telas.
- Visual da referência aplicado por estilos e variáveis do Figma, sem valor solto.
- Quadro comparativo de tokens, conferência de contraste WCAG 2.2 AA (valor antes e depois), lista de impacto da troca de identidade.
- Anotações de acessibilidade por estado, mapa de navegação sem tela órfã, motivo estrutural de cada bottom sheet, modal, drawer ou menu flutuante.
- Atualização de `docs/design/figma.md` e `docs/design/F24-wireframe-baixa-fidelidade.md` quando os node-ids mudarem.
- Débito com o F33 registrado para a REGENTE; D2 (direito de uso) respondida antes da aprovação.
- Evidência de que o Figma foi de fato editado (capturas antes e depois, node-ids).

### Fora do escopo
- Alteração em `apps/mobile`, `apps/api`, `docs/design/identidade-visual.md` ou no PRD do F33.
- Revisão dos protótipos F25 a F29 e dos tokens do app: decidida, executada em feature futura.
- Ícones finais, imagens reais e microinterações; protótipo navegável de alta fidelidade.
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
| Frame de topo | Filho direto da página `3:2` "F24 · Wireframe baixa fidelidade". A contagem é feita só neles. |
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


## 5. Contagem de frames: 93, 94 e 96 reconciliados

### 5.1 De onde vêm os números

| Número | Origem | Composição |
|---|---|---|
| 93 | Matriz da seção 5.4 de `docs/product/F24-wireframe-baixa-fidelidade.md` | 24 Carregando + 24 Erro de rede + 24 Preenchido + 8 Vazio + 13 Erro de validação |
| 94 | Página `3:2` do Figma hoje (`docs/design/figma.md`; contagem de filhos pelo ESQUADRO em 2026-11-13) | 93 + 1: a tela 24 desdobra "Preenchido" em lista e formulário |
| 96 | US-WFR-01 (briefing) | 24 telas × 4 estados canônicos |
| 110 | Esta versão | 96 canônicos + 14 variantes |

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
2. As 24 telas de `UX-UI-MAPEAMENTO.md` são o inventário fechado: não se somam nem se removem telas.
3. Se a navegação proposta divergir do F33 (1 aba habilitada + 4 desabilitadas), a divergência vira débito neste PRD (seção 11). Abrir ou não uma feature de revisão do menu é decisão da REGENTE, que travou o F33 em 2026-11-09. BUSSOLA não decide isso e o F33 não é reaberto.
4. Wireframe não carrega dado pessoal real. Finalidade: ilustrar fluxo. Base legal: não aplicável. Retenção: enquanto o produto estiver em desenvolvimento (seção 8).
5. Bottom sheet, modal, drawer e menu flutuante podem ser usados quando ajudarem a estrutura, cada um com motivo estrutural registrado. "Fica mais bonito" não é motivo.
6. A paleta e a tipografia da referência passam a ser a identidade do produto (2026-11-12). A execução (revisão de F25 a F29, tokens, `identidade-visual.md`) fica para feature futura. A formulação "no lugar de petro e primary" do briefing é corrigida pela premissa 13.
7. O código do app (telas, tab bar, tokens) permanece como está.
8. A aprovação explícita do wireframe revisado é registrada por BUSSOLA no PRD (seção 12), no padrão da aprovação da F24. Sem ela, nenhum protótipo novo começa.
9. Risco registrado: F26 a F29 não devem começar alta fidelidade sobre a identidade antiga, e F40 e F41 ficam com base desatualizada enquanto F25 e F34 não forem revisados. A ordem é de quem prioriza o backlog com a REGENTE (D3) e não é tomada aqui.
10. Tokens só são extraídos do que o ESQUADRO conseguir abrir de fato no Figma. Se o acesso falhar, o bloqueio é registrado com a saída real e nenhum valor é inferido.
11. Decisão de 2026-11-12 (D4): o redesenho sobrescreve as páginas da F24, com versão nomeada da F24 aprovada criada **antes de qualquer edição**, com nome e id no PRD. A edição é nos frames existentes (sem apagar e recriar) para manter os node-ids citados em `docs/design/figma.md` e `docs/design/F24-wireframe-baixa-fidelidade.md`. Os 16 Vazio novos não têm node-id anterior: entram com o id novo registrado (US-WFR-15).
12. Pedido de 2026-11-13: cabeçalho e navegação inferior seguem a referência de perto. É desenho de wireframe; a tab bar do app (F33/F34) não muda aqui.
13. **Fato verificado (cor de marca).** Petro `#1E3A3F` e primary `#B5453D` **são iguais** na referência. O ESQUADRO leu os dois no Figma (relato dele, `docs/design/F39-redesenho-wireframes-navegacao.md` seção 4.1). Eu confirmei por conta própria que `apps/mobile/src/theme/tokens.ts` tem `petro900: '#1E3A3F'` e `primary600: '#B5453D'` (linhas 10 e 11) e que o ADR-014 já registra "a cor de marca não muda". A troca de identidade está em neutros, estados (erro, aviso, sucesso, status), tipografia e forma. A D1 continua de pé; muda o tamanho da lista de impacto (US-WFR-11), que é menor do que "trocar petro e primary" sugere.
14. **Contagem:** vale a D7 (seção 5).
15. **Gate G1:** nenhuma edição no Figma antes de a versão nomeada constar na seção 13. A API `saveVersionHistoryAsync` não é suportada pelo MCP (duas tentativas do ESQUADRO em 2026-11-13, mesma saída). O ESQUADRO **não é liberado** até a pessoa informar nome e id.
16. **O que li e o que não li.** O MCP do Figma me foi negado nesta sessão (seção 13, G2). Tudo o que este PRD diz sobre o conteúdo do Figma vem do documento do ESQUADRO e está marcado como relato dele. O que conferi no repositório está dito como tal.
17. **Estilo da referência (default adotado).** A referência tem dois estilos: a página `20:2131` (baixa fidelidade em estilo rascunho) e a `20:2132` (alta fidelidade, Barlow Condensed e Inter, paleta quente). Como a D1 fala em paleta e tipografia do produto, o ESQUADRO extraiu os tokens da alta fidelidade. Sigo esse default e peço confirmação (D5). Se a pessoa quiser o estilo rascunho, o quadro de tokens muda, mas como a pintura é por variável do Figma o retrabalho fica nos valores, não nos frames.
18. Os 16 frames de Vazio novos e a regra da seção 5.4 são decisão de produto desta versão (D7).

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

### US-WFR-01 — Cobertura completa de telas

**Como** pessoa dona do produto, **quero** as 24 telas do inventário nos quatro estados, **para** não perder tela nem estado na revisão.

```gherkin
Cenário: 96 frames canônicos e 14 variantes, exatamente
  Dado a lista docs/design/f39-frames/frames-esperados.csv (110 nomes)
  E os nomes dos filhos diretos da página 3:2, um por linha, em lista-real.txt
  Quando executo docs/design/f39-frames/check-frames.sh lista-real.txt
  Então a saída contém "canonicos presentes: 96 de 96" e "variantes presentes: 14 de 14"
  E contém "faltando: 0", "extra: 0" e "duplicado: 0"
  E o código de saída é 0
  E nenhuma tela de número 25 ou superior existe

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
  Dado a D2 respondida, a versão nomeada da F24 registrada (G1) e as US-WFR-01 a 06 e 08 a 18 sem pendência
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

O ESQUADRO calculou por script que não está no repositório (documento de design, seção 5). Entra como pendência dele.

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
  E os 94 frames existentes mantêm os node-ids citados em docs/design/figma.md e docs/design/F24-wireframe-baixa-fidelidade.md, ou esses documentos foram atualizados
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

Estado atual: **este cenário está em vigor** (seção 13, G1).

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
Cenário: evidência
  Dado o redesenho concluído
  Quando o PRD é fechado
  Então a seção 13 lista os node-ids dos frames editados e dos 16 criados
  E traz captura de antes (versão nomeada da F24) e de depois do cabeçalho, da navegação inferior e de uma tela de cada um dos 6 grupos da referência
  E as capturas estão em docs/design/f39-frames/evidencias/, PNG de até 500 KB cada
  E a saída do check-frames.sh contra o Figma real consta como "RESULTADO: confere"

Cenário de erro: sem evidência
  Dado um PRD fechado sem node-ids, capturas de antes e depois ou saída do verificador
  Quando o CRIVO confere
  Então a feature não é dada como entregue
```

Estado atual: nada foi editado, sem evidência possível.

## 11. Registro de débitos à REGENTE (US-WFR-05 e 17b)

Origem: documento do ESQUADRO, seção 10, com a referência lida por ele (`20:1102`/`20:1103`). Não implementei nada. O F33 e a tab bar não foram tocados.

| # | Data | Divergência | Referência | F33 / F34 | Tela afetada | Pergunta à REGENTE | Status |
|---|---|---|---|---|---|---|---|
| 1 | 2026-11-13 | Número e conteúdo das abas | 4 abas: Ordens, Clientes, Catálogo, Financeiro. Perfil fora da barra, aberto pelo ícone de pessoa no cabeçalho das telas raiz | 5 posições: Perfil habilitado + 4 desabilitadas | 02 Perfil e as 6 telas raiz | O Perfil fica como aba (F33) ou passa a ser acesso pelo cabeçalho (referência)? | **Aberto, aguarda REGENTE** |
| 2 | 2026-11-13 | Ordem das abas | Ordens primeiro | Perfil primeiro; Ordens em quarto | 17 OS · lista (e demais raiz) | Qual é a aba de pouso quando as demais forem habilitadas? | **Aberto, aguarda REGENTE** |

Pontos que o ESQUADRO listou como divergência e que **não** são débito, porque se resolvem no wireframe sem tocar o F33:
- Aba ativa: a referência usa texto e ícone Crail sobre petro (2,24:1, falha 3:1). O wireframe mantém o indicador de forma do F34 (texto branco sobre pill Crail, 5,41:1).
- Alvo de toque do botão do cabeçalho: 36×36 na referência, 48×48 no wireframe (mínimo do projeto).

Decisão de abrir ou não uma feature de revisão do menu: **da REGENTE**. Sem implementação nesta feature.

## 12. Registro de execução — US-WFR-07

| # | Data | Tipo | Descrição | Status |
|---|---|---|---|---|
| 1 | 2026-11-13 | Pendência | G1: versão nomeada da F24 não criada nem informada (seção 13) | Aberta |
| 2 | 2026-11-13 | Pendência | D2: titularidade da referência não respondida | Aberta |
| 3 | 2026-11-13 | Pendência | D5: estilo da referência (default em uso) aguarda confirmação | Aberta |
| 4 | 2026-11-13 | Pendência | Débitos 1 e 2 da seção 11 aguardam a REGENTE | Aberta |
| 5 | 2026-11-13 | Resolvida | Contagem 93 contra 96: D7, 96 canônicos + 14 variantes, verificador executável (seção 5) | Resolvida no PRD; a conferência contra o Figma real depende da edição |
| 6 | 2026-11-13 | Pendência | US-WFR-10: o script de contraste do ESQUADRO não está no repositório | Aberta |

**Aprovação: não registrada.** Nenhum frame foi editado, então não há o que aprovar. F26 a F29 e qualquer protótipo novo continuam sem liberação.

## 13. Bloqueios e gates

### G1 — Versão nomeada da F24 (bloqueia toda edição)

Saída real do ESQUADRO, duas tentativas em 2026-11-13 (documento de design, seções 1 e 1.1):

```
await figma.saveVersionHistoryAsync('F24 aprovada (pré-F39)', '…');
→ "error":"in saveVersionHistoryAsync: \"saveVersionHistoryAsync\" is not a supported API"
```

A página `3:2` seguiu com 94 filhos; `28:2` com 10 e `39:2` com 6. Nenhum nó, variável, estilo ou coleção foi criado ou alterado.

**O que libera o ESQUADRO** (uma das duas, decisão da pessoa):
1. Abrir `DLqbSzzKRxiN2eyvXG73Lr` no Figma, salvar a versão pelo menu do histórico com o nome `F24 aprovada (pré-F39)` e informar o **nome** e o **id** (parâmetro `version-id` da URL ao abrir a versão), com uma captura da lista do histórico mostrando a versão.
2. Autorizar por escrito, em desvio da D4, duplicar a página como `F24 · aprovada (arquivo morto)` no mesmo arquivo.

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

### Lista de liberação do ESQUADRO

O ESQUADRO só começa a editar quando **todos** os itens abaixo valem:

1. A linha da versão nomeada acima está preenchida (G1).
2. Este PRD v2 está commitado.
3. A coleção de variáveis v2 é criada **antes** de qualquer pintura; a coleção da F25 (`28:3`) não é editada.
4. Os 94 frames existentes são editados e renomeados no lugar; os 16 Vazio novos são criados e seus node-ids anotados.
5. Depois de cada lote, `check-frames.sh` roda sobre os nomes reais dos filhos diretos da página `3:2` e a saída é colada na evidência.
6. Nenhum arquivo de `apps/`, `identidade-visual.md` ou do PRD do F33 é tocado (US-WFR-04).

### Evidência do Figma editado (US-WFR-18)

| Item | Valor |
|---|---|
| Node-ids dos 94 frames editados | — (nada editado) |
| Node-ids dos 16 frames criados | — |
| Captura antes (versão nomeada) | — |
| Captura depois: cabeçalho, navegação inferior, 1 tela por grupo | — |
| Saída de `check-frames.sh` contra o Figma real | — |

## 14. Priorização e o que fica para depois

As histórias são P1 e nenhuma é opcional para fechar a feature. Ordem dentro da feature, por dependência: G1 → coleção v2 → componentes de cabeçalho e navegação inferior (US-WFR-16 e 17) → 94 frames editados + 16 novos (US-WFR-01, 09) → anotações (US-WFR-06) → grafo (US-WFR-03) → contraste (US-WFR-10) → evidência (US-WFR-18) → aprovação (US-WFR-07).

Fica para depois, sem decisão nova:
- Revisão de F25 a F29, tokens do app e `identidade-visual.md` (D3).
- Qualquer mudança de código ou de decisão do menu (F33), condicionada à REGENTE.
- Ícones finais, imagens reais, microinterações e protótipo navegável.
- Itens de backlog (dashboard, fotos, PDF, WhatsApp).

## 15. Handoff para CARTOGRAFO

**O que esta etapa fez**: fechou a divergência de contagem (seção 5, D7: 96 canônicos + 14 variantes, 16 Vazio novos, verificador executável com teste), reescreveu o PRD na v2 com os 21 critérios do briefing em Gherkin, trouxe o débito do F33 para a seção 11, registrou o gate da versão nomeada (G1) e **não liberou o ESQUADRO**.

**O que o CARTOGRAFO precisa olhar**:
1. **ADR-014, linha 125.** O ADR propõe El Salva `#923631` para `color.text.error`. O ESQUADRO leu a mensagem sob o campo na referência e a cor é Crail `#B5453D` (Inter 13); El Salva só aparece no banner (documento de design, seção 4.2.1). O ADR está "Proposto" e a própria linha diz "confirmada na migração". Sugiro dois papéis (`text.error` e `text.errorOnBanner`). Decisão de arquitetura de tokens: é sua.
2. **Coleção de variáveis v2.** O arquivo do wireframe usa valores soltos e 0 estilos. A estrutura (primitivos → semânticos → componente) e a regra de não editar a coleção da F25 (`28:3`) precisam de um desenho antes de o ESQUADRO pintar.
3. **Grafo de navegação** (`docs/architecture/diagrams/navegacao-wireframe-f24.md`): ainda é o da F24. A aresta "lista raiz → Perfil" e as entradas de 07 e 16 (D6) são mudanças de arquitetura de informação que você deve revisar.
4. **Escopo do ADR.** Nada em `apps/` muda nesta feature. A migração de tokens e fontes é feature futura (D3).

**Pendências, com dono**:
- Pessoa: G1 (salvar a versão nomeada e informar nome, id e captura), D2, D5.
- REGENTE: débitos 1 e 2 (seção 11). Quem prioriza o backlog, com a REGENTE: D3.
- ESQUADRO: só depois de G1; D8; script de contraste versionado; 16 frames novos.
- BUSSOLA: aprovar ou reprovar (seção 12) quando houver frames editados.

**Verificado por mim**: `test-check-frames.sh` (9 casos, falhas: 0); hexadecimais de petro e primary em `tokens.ts` (linhas 10 e 11); contagem de ocorrências no `identidade-visual.md`; diff protegido vazio; linha 125 do ADR-014; o que a F24 diz (93, matriz) e o que o `figma.md` diz (94). **Não verificado por mim**: qualquer conteúdo do Figma (acesso negado), a titularidade da referência, o histórico de versões.

# PRD — F24: Wireframe de baixa fidelidade de todas as telas

- Prioridade: P1
- Área: Frontend
- Sprint: Sprint 01: Fundação e Login (trilha paralela de design)
- Autor: BUSSOLA (Product Owner)
- Data: 2026-11-07
- Revisão 2026-11-07 (mesmo dia): US-DES-07 e US-DES-08 tornados executáveis —
  decisão formal sobre o artefato de aprovação (seção 8, dúvida 1, agora
  resolvida) e execução real desta rodada (fim da seção 7), com confirmação
  cruzada das 24 telas e dos dois tipos de erro contra
  `docs/design/F24-wireframe-baixa-fidelidade.md`.
- Etapa da rota: **BUSSOLA (1/4)** → CARTOGRAFO → ESQUADRO → CRIVO

> **Recorte desta entrega**: instrução direta do comandante — fixar a lista das
> 24 telas e os critérios de cobertura (quatro estados por tela, dois tipos de
> erro) que o CRIVO vai conferir. Este documento é a fonte de verdade de
> produto para essa cobertura; não substitui a especificação de hierarquia,
> rótulo e ordem de foco por tela, que é entrega de ESQUADRO em
> `docs/design/F24-wireframe-baixa-fidelidade.md`.
>
> **Recorte desta revisão** (segunda instrução do comandante): deixar
> US-DES-07 e US-DES-08 executáveis de fato, sem depender de uma decisão
> futura ainda não tomada, e confirmar que a lista de 24 telas e os dois tipos
> de erro deste PRD são exatamente os mesmos da especificação de ESQUADRO.
> Fora de escopo: criar tela nova ou mexer em protótipo de alta fidelidade
> (F25 a F29).

## 1. Visão

O wireframe de baixa fidelidade das 24 telas do app valida o fluxo de
navegação e a cobertura de estado (vazio, carregando, erro, preenchido) antes
de qualquer investimento em identidade visual ou protótipo navegável. Sem essa
etapa, o time de frontend (F25 a F29) implementaria tela de alta fidelidade
sobre um fluxo não validado, e o time mobile (F30 em diante) herdaria estado
de erro inconsistente entre telas.

**Nota de verificação importante**: não existe `UX-UI-MAPEAMENTO.md` neste
repositório. Confirmei por busca (`grep -ril "UX-UI-MAPEAMENTO"` e
`grep -ril "figma"` em todo `.md` da operação) — nenhuma ocorrência fora da
própria especificação da F24. A lista de 24 telas da seção 4 deste documento
**é** a fonte de verdade que substitui o `UX-UI-MAPEAMENTO.md` referenciado no
briefing, até que esse arquivo apareça no repositório ou seja formalmente
descartado.

**Confirmação desta revisão (24 telas e os dois tipos de erro)**: reli
`docs/design/F24-wireframe-baixa-fidelidade.md` por completo e comparei, linha
a linha, a tabela da seção 4 deste PRD com a seção 6 (uma subseção por tela) e
a matriz da seção 7 daquele documento. As 24 telas batem em número e nome
exatos nos dois lados, sem divergência. Os dois tipos de erro também batem:
"erro de rede ou carregamento" (24 telas, sem exceção) e "erro de validação de
formulário" (as mesmas 13 telas com formulário nos dois documentos, listadas
na seção 5.2 abaixo). Não encontrei nenhuma tela, nome ou tipo de erro
divergente entre os dois documentos.

## 2. Escopo

### Dentro do escopo desta entrega (produto)
- Lista fechada e numerada das 24 telas (seção 4), com o nome que deve
  identificar cada frame no Figma.
- Matriz de cobertura de estado por tela (seção 5): quais das 24 telas têm
  `vazio` aplicável, e quais das 13 telas com formulário têm `erro de
  validação` aplicável — critério objetivo que o CRIVO confere linha a linha.
- Os dois tipos de erro tratados como categorias distintas, não um estado
  genérico (seção 5.1).
- Critérios de aceitação US-DES-01 a US-DES-08, já definidos no escopo da
  feature, mantidos aqui como a versão formal e rastreável.
- Dado pessoal fictício: finalidade e tratamento LGPD do conteúdo de exemplo
  (seção 6).

### Fora do escopo desta entrega (registrado, não decidido como "não vai fazer")
- Identidade visual, cor e tipografia final — fica para F25, F26, F27, F28,
  F29 (protótipos de alta fidelidade).
- Protótipo navegável.
- Hierarquia visual detalhada, rótulo exato de cada controle e ordem de foco
  por tela — é entrega de ESQUADRO, não deste PRD.
- Qualquer item do backlog (dashboard, fotos, PDF, WhatsApp) sem decisão nova.

## 3. Glossário

- **Tela**: uma unidade de navegação do app (ex.: "Clientes · lista"), distinta
  de um estado dessa tela.
- **Estado**: uma variação de conteúdo da mesma tela em um momento diferente
  do ciclo de carregamento de dado — `vazio`, `carregando`, `erro` (com dois
  subtipos, seção 5.1) e `preenchido`.
- **Erro de rede ou carregamento**: estado aplicável a qualquer uma das 24
  telas, disparado quando a chamada à API falha ou não responde.
- **Erro de validação de formulário**: estado aplicável só às telas com
  campo de entrada, disparado quando o usuário tenta enviar dado inválido,
  com mensagem por campo.
- **Tela com formulário**: tela que tem ao menos um campo de entrada de dado
  enviado para a API (lista fechada na seção 5.2, 13 telas).

## 4. As 24 telas (lista fechada)

Numeração e nome de referência — todo frame no Figma e toda evidência do
CRIVO usam exatamente este número e este nome.

| # | Tela | Módulo |
|---|---|---|
| 01 | Login | Autenticação |
| 02 | Perfil | Autenticação |
| 03 | Clientes · lista | Clientes |
| 04 | Clientes · detalhe | Clientes |
| 05 | Clientes · criar | Clientes |
| 06 | Clientes · editar | Clientes |
| 07 | Veículos · criar | Veículos |
| 08 | Veículos · editar | Veículos |
| 09 | Veículos · detalhe com histórico de OS | Veículos |
| 10 | Serviços · lista | Catálogo |
| 11 | Serviços · criar | Catálogo |
| 12 | Serviços · editar | Catálogo |
| 13 | Peças · lista | Catálogo |
| 14 | Peças · criar | Catálogo |
| 15 | Peças · editar | Catálogo |
| 16 | Movimentação de estoque | Catálogo |
| 17 | Ordens de Serviço · lista | OS |
| 18 | Ordens de Serviço · criar | OS |
| 19 | Ordens de Serviço · detalhe | OS |
| 20 | Ordens de Serviço · transição de status | OS |
| 21 | Ordens de Serviço · parcelas | OS |
| 22 | Financeiro · parcelas | Financeiro |
| 23 | Financeiro · pagamento | Financeiro |
| 24 | Financeiro · lançamentos (lista + lançamento manual) | Financeiro |

Total: **24**, igual à contagem do briefing da feature. Nenhuma tela pode ser
dividida ou fundida sem atualizar este PRD primeiro (ver dúvida 3, seção 8).

## 5. Matriz de cobertura de estado (critério que o CRIVO confere)

### 5.1 Os dois tipos de erro

O estado `erro` não é um único visual genérico — são dois critérios
independentes:

1. **Erro de rede ou carregamento**: aplicável às **24 telas**, sem exceção.
   Critério de aceitação: mensagem textual explicando a falha de conexão ou
   carregamento + ação visível de nova tentativa (US-DES-05).
2. **Erro de validação de formulário**: aplicável só às **13 telas com
   formulário** (seção 5.2). Critério de aceitação: mensagem de erro própria
   ao lado de cada campo inválido + foco indicado no primeiro campo inválido
   (US-DES-06).

### 5.2 Telas com formulário (13) — onde erro de validação é obrigatório

Login · Clientes criar · Clientes editar · Veículos criar · Veículos editar ·
Serviços criar · Serviços editar · Peças criar · Peças editar · Movimentação
de estoque · Ordens de Serviço criar · Financeiro pagamento · Financeiro
lançamento manual.

As **11 telas restantes** (Perfil, Clientes lista, Clientes detalhe, Veículos
detalhe, Serviços lista, Peças lista, OS lista, OS detalhe, OS transição, OS
parcelas, Financeiro parcelas) não têm formulário e por isso **não** precisam
de estado de erro de validação — essa ausência é esperada, não uma lacuna.

### 5.3 Telas onde "vazio" é aplicável (8)

`Vazio` só se aplica a tela cujo conteúdo principal é uma lista ou coleção que
pode legitimamente não ter nenhum item ainda: Clientes · lista, Veículos ·
detalhe com histórico (o vazio é do histórico, não do veículo), Serviços ·
lista, Peças · lista, Ordens de Serviço · lista, Ordens de Serviço · parcelas,
Financeiro · parcelas, Financeiro · lançamentos.

As **16 telas restantes** não têm `vazio` como estado válido, por serem tela
de ação (Login, formulários de criar/editar), tela de entidade única já
existente (Perfil, Clientes detalhe, OS detalhe, OS transição) ou dependerem
de um registro que precisa já existir para a tela abrir.

### 5.4 Matriz completa (fixada)

| # | Tela | Vazio | Carregando | Erro de rede | Erro de validação | Preenchido |
|---|---|:---:|:---:|:---:|:---:|:---:|
| 01 | Login | — | ✅ | ✅ | ✅ | ✅ |
| 02 | Perfil | — | ✅ | ✅ | — | ✅ |
| 03 | Clientes · lista | ✅ | ✅ | ✅ | — | ✅ |
| 04 | Clientes · detalhe | — | ✅ | ✅ | — | ✅ |
| 05 | Clientes · criar | — | ✅ | ✅ | ✅ | ✅ |
| 06 | Clientes · editar | — | ✅ | ✅ | ✅ | ✅ |
| 07 | Veículos · criar | — | ✅ | ✅ | ✅ | ✅ |
| 08 | Veículos · editar | — | ✅ | ✅ | ✅ | ✅ |
| 09 | Veículos · detalhe com histórico | ✅ | ✅ | ✅ | — | ✅ |
| 10 | Serviços · lista | ✅ | ✅ | ✅ | — | ✅ |
| 11 | Serviços · criar | — | ✅ | ✅ | ✅ | ✅ |
| 12 | Serviços · editar | — | ✅ | ✅ | ✅ | ✅ |
| 13 | Peças · lista | ✅ | ✅ | ✅ | — | ✅ |
| 14 | Peças · criar | — | ✅ | ✅ | ✅ | ✅ |
| 15 | Peças · editar | — | ✅ | ✅ | ✅ | ✅ |
| 16 | Movimentação de estoque | — | ✅ | ✅ | ✅ | ✅ |
| 17 | Ordens de Serviço · lista | ✅ | ✅ | ✅ | — | ✅ |
| 18 | Ordens de Serviço · criar | — | ✅ | ✅ | ✅ | ✅ |
| 19 | Ordens de Serviço · detalhe | — | ✅ | ✅ | — | ✅ |
| 20 | Ordens de Serviço · transição | — | ✅ | ✅ | — | ✅ |
| 21 | Ordens de Serviço · parcelas | ✅ | ✅ | ✅ | — | ✅ |
| 22 | Financeiro · parcelas | ✅ | ✅ | ✅ | — | ✅ |
| 23 | Financeiro · pagamento | — | ✅ | ✅ | ✅ | ✅ |
| 24 | Financeiro · lançamentos | ✅ | ✅ | ✅ | ✅ | ✅ |

Leitura para o CRIVO: "✅" é obrigatório — a ausência de um frame marcado
"✅" nessa linha é reprovação (US-DES-08). "—" é esperado — exigir um frame
onde a matriz marca "—" é sobre-especificação, não lacuna. Total de frames
esperados: 24 (carregando) + 24 (erro de rede) + 24 (preenchido) + 8 (vazio) +
13 (erro de validação) = **93 frames** no arquivo Figma (ou 93 blocos
identificáveis, caso a entrega fique em Markdown por bloqueio de ferramenta —
ver seção 8, dúvida 1).

## 6. Dados pessoais no conteúdo de exemplo (LGPD)

| Dado fictício | Finalidade | Base legal | Retenção |
|---|---|---|---|
| Nome, telefone, e-mail de cliente fictício (telas de Clientes) | Demonstrar hierarquia de informação no wireframe, sem usar dado real da oficina | Não aplicável — dado fictício, não é dado pessoal de titular real (LGPD não incide) | Enquanto o arquivo de wireframe existir; não migra para produção |
| Placa, marca, modelo de veículo fictício (telas de Veículos) | Idem | Não aplicável — dado fictício | Idem |
| Valor de parcela/pagamento/lançamento fictício (telas Financeiro) | Idem | Não aplicável — dado fictício | Idem |

Mesmo sendo dado fictício, a US-DES-04 exige que nenhum dado real de cliente,
veículo ou financeiro da oficina apareça no wireframe nem na ferramenta de
design compartilhada — tratado como requisito de aceitação, não como boa
prática opcional.

## 7. Histórias de usuário e critérios de aceitação

IDs: `US-DES-01` a `US-DES-08`, área `DES`, feature `F24`. Mantidos conforme o
escopo já fixado da feature; registrados aqui como a versão formal que o CRIVO
rastreia.

---

### US-DES-01 — Cobertura completa de telas

**Como** pessoa dona do produto,
**quero** ver as 24 telas da seção 4 representadas no wireframe,
**para** confirmar que nenhuma tela do app ficou de fora da validação de
fluxo antes da alta fidelidade.

```gherkin
Cenário: Todas as 24 telas presentes e identificáveis
  Dado a lista fechada de 24 telas da seção 4 deste PRD
  Quando o wireframe é entregue
  Então cada uma das 24 telas tem uma versão em baixa fidelidade
  E cada versão é identificável pelo número e nome exatos da tabela da seção 4
  E todas estão dentro de um único arquivo Figma (ou do artefato substituto formalmente aceito, ver seção 8 dúvida 1)

Cenário de erro: tela faltando
  Dado o wireframe entregue com menos de 24 telas
  Quando reviso contra a lista da seção 4
  Então a entrega não é aprovada (US-DES-08)
  E a tela faltante é registrada pelo número e nome exatos da tabela
```

---

### US-DES-02 — Cobertura dos quatro estados

**Como** pessoa dona do produto,
**quero** ver cada tela nos estados aplicáveis da matriz da seção 5.4,
**para** garantir que a implementação de alta fidelidade não vai improvisar
um estado que não foi pensado antes.

```gherkin
Cenário: Estados aplicáveis presentes
  Dado uma tela e sua linha na matriz da seção 5.4
  Quando reviso os estados entregues para essa tela
  Então todo estado marcado "✅" na linha da tela existe como versão separada e rotulada

Cenário: Estado não aplicável corretamente ausente
  Dado uma tela cuja linha na matriz marca "—" para "vazio" ou "erro de validação"
  Quando reviso os estados entregues para essa tela
  Então a ausência desse estado não é motivo de reprovação

Cenário de erro: estado obrigatório faltando
  Dado uma tela cuja linha na matriz marca "✅" para um estado
  Quando esse estado não existe como versão separada no wireframe
  Então a entrega não é aprovada (US-DES-08)
  E a pendência registra a tela e o estado faltante
```

---

### US-DES-03 — Acessibilidade estrutural

**Como** pessoa usuária com leitor de tela ou baixa visão,
**quero** que o wireframe já preveja rótulo, ordem de foco e independência de
cor,
**para** que a alta fidelidade não precise redesenhar a estrutura por um
problema de acessibilidade descoberto tarde.

```gherkin
Cenário: Estrutura acessível prevista
  Dado o wireframe de uma tela com formulário ou lista
  Quando reviso a estrutura
  Então cada controle (campo, botão, item de lista) tem um rótulo visível previsto
  E a ordem de leitura e foco está indicada
  E nenhuma informação de estado (erro, sucesso, ativo/inativo) depende só de cor

Cenário de erro: informação só por cor
  Dado um estado de badge ou indicador visual na tela
  Quando o único jeito de diferenciar os valores é a cor
  Então a entrega não é aprovada para aquela tela (US-DES-08)
```

---

### US-DES-04 — Dado pessoal fictício

**Como** encarregado de dados da oficina,
**quero** que todo conteúdo de exemplo nas telas de Clientes, Veículos e
Financeiro seja fictício,
**para** que nenhum dado real de cliente circule em uma ferramenta de design
compartilhada.

```gherkin
Cenário: Conteúdo de exemplo fictício
  Dado o conteúdo de exemplo nas telas de Clientes, Veículos e Financeiro
  Quando reviso o wireframe
  Então nome, telefone, e-mail, placa e valores exibidos não correspondem a nenhum cliente, veículo ou lançamento real da oficina

Cenário de erro: dado real identificado
  Dado qualquer nome, telefone, e-mail, placa ou valor que corresponda a um registro real da oficina
  Quando esse dado aparece em qualquer tela ou na ferramenta de design compartilhada
  Então a entrega não é aprovada (US-DES-08)
  E o dado real é removido antes de qualquer nova revisão
```

---

### US-DES-05 — Estado de erro de rede

**Como** pessoa usuária do app,
**quero** entender quando uma tela falhou ao carregar por problema de rede e
poder tentar de novo,
**para** não ficar presa numa tela em branco sem saber o que fazer.

```gherkin
Cenário: Erro de rede com mensagem e ação de nova tentativa
  Dado o estado de erro de rede ou carregamento de qualquer uma das 24 telas
  Quando reviso seu conteúdo
  Então há uma mensagem textual explicando a falha de conexão ou carregamento
  E há uma ação visível de nova tentativa

Cenário de erro: erro de rede sem ação de retry
  Dado o estado de erro de rede de uma tela
  Quando não existe ação visível de nova tentativa
  Então a entrega não é aprovada para aquela tela (US-DES-08)
```

---

### US-DES-06 — Estado de erro de validação de formulário

**Como** pessoa usuária preenchendo um formulário,
**quero** saber exatamente qual campo está errado e ter o foco levado até
ele,
**para** corrigir o problema sem precisar adivinhar qual campo falhou.

```gherkin
Cenário: Erro de validação por campo
  Dado o estado de erro de validação de uma das 13 telas com formulário (seção 5.2)
  Quando reviso seu conteúdo
  Então cada campo inválido tem mensagem de erro própria ao lado do campo
  E o foco é indicado no primeiro campo inválido

Cenário de erro: mensagem genérica sem apontar o campo
  Dado o estado de erro de validação de uma tela com formulário
  Quando a mensagem de erro não está associada a um campo específico (exceto erro de regra de negócio sem campo correspondente, ex.: credencial de login inválida)
  Então a entrega não é aprovada para aquela tela (US-DES-08)
```

---

### US-DES-07 — Aprovação

**Como** pessoa dona do produto,
**quero** aprovar explicitamente o wireframe completo antes de qualquer
protótipo de alta fidelidade iniciar,
**para** impedir que o time avance para identidade visual sobre um fluxo
ainda não validado.

```gherkin
Cenário: Aprovação explícita
  Dado o artefato de aprovação desta fase — o par docs/product/F24-wireframe-baixa-fidelidade.md (este PRD) + docs/design/F24-wireframe-baixa-fidelidade.md (especificação de ESQUADRO), aceito formalmente no lugar do arquivo Figma enquanto o acesso ao Figma estiver bloqueado (decisão registrada na seção 8, dúvida 1)
  E a matriz de cobertura da seção 5.4 sem nenhuma célula "✅" faltando nesse artefato
  Quando a pessoa dona do produto revisa o artefato e registra a decisão na tabela "Registro de execução" (fim desta seção)
  Então a linha registrada marca "Aprovado", com data e identificação de quem aprovou
  E nenhuma feature de protótipo de alta fidelidade (F25 a F29) inicia implementação antes de existir essa linha "Aprovado" na tabela

Cenário de erro: aprovação alegada sem registro
  Dado qualquer alegação verbal ou em chat de que "o wireframe foi aprovado"
  Quando não existe uma linha correspondente na tabela "Registro de execução" deste PRD, com data e identificação de quem aprovou
  Então a aprovação não conta como cumprida para efeito de liberar F25 a F29
```

---

### US-DES-08 — Reprovação com pendência

**Como** pessoa dona do produto,
**quero** registrar toda pendência de tela ou estado faltante ou incorreto de
forma rastreável,
**para** que o ajuste seja objetivo e a reapresentação não repita a mesma
lacuna.

```gherkin
Cenário: Reprovação registrada por pendência
  Dado o artefato de aprovação desta fase (ver US-DES-07) com tela ou estado faltando ou incorreto em relação à matriz da seção 5.4
  Quando a pessoa dona do produto revisa o artefato
  Então a entrega não é aprovada
  E cada pendência vira uma linha na tabela "Registro de execução" (fim desta seção), com o número e nome exatos da tela (seção 4) e o tipo de estado faltante ou incorreto (vazio, carregando, erro de rede, erro de validação ou preenchido)
  E a linha "Aprovado" (US-DES-07) só é registrada depois que todas as pendências abertas forem fechadas, numa nova rodada de revisão

Cenário: Reapresentação depois do ajuste
  Dado uma pendência registrada na tabela "Registro de execução"
  Quando a pessoa responsável corrige o item apontado e a pessoa dona do produto revisa de novo só esse ponto
  Então a pendência é marcada como resolvida na mesma linha, com a data da correção
  E, se não houver outra pendência aberta, uma nova linha "Aprovado" é registrada (US-DES-07)
```

---

### Registro de execução — US-DES-07 e US-DES-08 (rodada 2026-11-07)

Para estes dois critérios deixarem de ser teóricos, esta revisão os executa de
fato sobre o artefato disponível hoje (decisão da dúvida 1, seção 8, agora
resolvida).

**Artefato revisado**: `docs/product/F24-wireframe-baixa-fidelidade.md` (este
PRD) + `docs/design/F24-wireframe-baixa-fidelidade.md` (especificação de
ESQUADRO, commit `6eb31c9`), aceito como artefato de aprovação desta fase na
ausência de arquivo Figma.

| # | Data | Tela | Tipo de pendência | Descrição | Status |
|---|---|---|---|---|---|
| 1 | 2026-11-07 | 15 — Peças · editar | Erro de validação | O texto da tela 15 herda por tabela as mensagens "Informe o código" / "Código já cadastrado" da tela 14, mas o campo "Código" é somente leitura na edição — essas mensagens não podem existir num campo não editável (achado originalmente do CRIVO). ESQUADRO ajusta a seção 6, tela 15, de `docs/design/F24-wireframe-baixa-fidelidade.md` antes da reapresentação. | **Resolvida em 2026-11-07** |
| 2 | 2026-11-07 | — | Aprovação | Reconferência de BUSSOLA sobre a pendência 1: a seção 6, tela 15, de `docs/design/F24-wireframe-baixa-fidelidade.md` já traz a mensagem corrigida (sem "Informe o código"/"Código já cadastrado" no estado de erro de validação), e o mesmo documento (seção "Atualização 2026-11-07 — Arquivo Figma criado") e `docs/design/figma.md` registram que essa correção foi transcrita para o frame real do Figma antes da entrega. Nenhuma outra pendência aberta contra a matriz da seção 5.4. | **Aprovado** |

**Decisão desta rodada (BUSSOLA, Product Owner, 2026-11-07): Reprovado, com a
pendência acima, e reaberto na mesma data depois da correção.** Nenhuma outra
tela ou estado da matriz da seção 5.4 está faltando — reconferido nesta
revisão linha a linha contra a seção 6 e a matriz da seção 7 de
`docs/design/F24-wireframe-baixa-fidelidade.md`.

**Reconferência e aprovação (BUSSOLA, Product Owner, 2026-11-07)**: a pendência
1 foi corrigida por ESQUADRO (texto da tela 15 ajustado na especificação, com
registro de que o frame do Figma recebeu a mesma correção). **O que verifiquei
de fato**: reli a seção 6 (tela 15) de
`docs/design/F24-wireframe-baixa-fidelidade.md` e confirmei que as mensagens
"Informe o código"/"Código já cadastrado" não aparecem mais no estado de erro
de validação daquela tela; reli `docs/design/figma.md` e a seção "Atualização
2026-11-07" da especificação de ESQUADRO, que relatam a transcrição dessa
correção para o frame real do Figma (commits `2108fdc` e `ae16a98`). **O que
não verifiquei nesta sessão**: não abri o arquivo Figma pixel a pixel — a
chamada à ferramenta MCP do Figma (`whoami`) não foi autorizada nesta sessão,
então esta aprovação se apoia na evidência documental registrada por ESQUADRO,
não em inspeção visual direta minha do frame. Registrado aqui para CRIVO
conferir com acesso ao Figma, se quiser uma segunda verificação direta.

Com a linha "Aprovado" acima registrada, **F25 a F29 estão destravadas para
iniciar implementação**, conforme US-DES-07. Nenhuma feature de alta
fidelidade iniciava antes dessa linha existir — a partir de agora, existe.

## 8. Dúvidas em aberto

1. **RESOLVIDA nesta revisão (2026-11-07, decisão de BUSSOLA)** — Ferramenta
   Figma indisponível nesta operação: `FIGMA_TOKEN` ausente na ponte e nenhum
   arquivo Figma referenciado no repositório (confirmado por ESQUADRO em
   `docs/design/F24-wireframe-baixa-fidelidade.md`, seção 1, e reconfirmado
   pelo CRIVO em 2026-11-07 — memória de projeto
   `reference_figma_acesso_bloqueado`). Em vez de manter US-DES-07/08
   bloqueadas à espera indefinida de um token, decido como Product Owner
   aceitar formalmente a opção (b) do leque original: o par de documentos
   Markdown (este PRD + `docs/design/F24-wireframe-baixa-fidelidade.md`) é o
   artefato de aprovação desta fase, no lugar do arquivo Figma. **Divergência
   registrada**: a Premissa 3 da feature fixa Figma como ferramenta; esta
   aprovação específica do wireframe é cumprida sobre Markdown, não sobre um
   arquivo Figma. Isso não dispensa a transcrição para Figma antes do
   protótipo de alta fidelidade (F25 em diante, que tem premissa própria de
   Figma) nem resolve o acesso para essas features futuras — só desbloqueia a
   aprovação do conteúdo do wireframe em si. Execução real desta decisão: ver
   a tabela "Registro de execução" ao fim da seção 7.
2. **Campos sem coluna no schema atual** (CPF e endereço em Clientes; nome em
   Serviços e Peças; quantidade em Movimentação de estoque) — US-DES-04 pede
   esses campos como conteúdo de exemplo, mas `V2__criar_schema_oficina.sql`
   não tem essas colunas hoje. Mantive os campos na matriz e nas telas por
   serem critério de aceitação já aprovado da feature; a decisão de adicionar
   essas colunas via migration aditiva é de CARTOGRAFO/ESPRESSO, não deste
   PRD.
3. **"Financeiro · lançamentos" como tela única ou duas telas**: tratei como
   uma tela (lista + formulário de lançamento manual na mesma tela, via ação
   "Novo lançamento") para fechar a contagem em 24, conforme o briefing da
   feature. Se o comandante quiser separar lista e formulário em duas telas,
   a contagem total muda para 25 e esta seção 4 precisa ser republicada antes
   do CRIVO conferir.

## 9. Acessibilidade e i18n

Cobertos como critério de aceitação (US-DES-03), não como fase futura:
nenhuma informação de estado depende só de cor, todo controle tem rótulo
previsto e a ordem de foco é indicada. Texto de interface não é fixado neste
PRD (é decisão de implementação da F30 em diante, com chave
`area.componente.texto`); aqui só o conteúdo de exemplo e a estrutura de
estado são fixados.

## 10. Priorização e o que fica para depois

A matriz da seção 5.4 é o critério mínimo de aceitação — nenhuma tela ou
estado marcado "✅" pode ser cortado para entregar mais rápido. Fica para
depois, sem decisão nova: identidade visual e protótipo navegável (F25 a
F29), qualquer refinamento de copy de produção, e qualquer tela ou fluxo fora
da lista fechada da seção 4.

## 11. Handoff para CARTOGRAFO

**O que foi feito**: fixação formal, em `docs/product/`, da lista das 24
telas (seção 4) e da matriz de cobertura de estado por tela — quais das 24
telas exigem `vazio`, quais das 13 telas com formulário exigem `erro de
validação`, e que `carregando`, `erro de rede` e `preenchido` são obrigatórios
nas 24 sem exceção (seção 5). Os critérios US-DES-01 a US-DES-08 foram
formalizados em Gherkin com cenário de erro/reprovação explícito para cada
um, para que o CRIVO confira sem precisar interpretar texto livre.

**Arquivos**:
- Criado: `docs/product/F24-wireframe-baixa-fidelidade.md` (este arquivo).
- Nenhum outro arquivo alterado.

**O que verifiquei de verdade** (vs. o que supus):
- Verifiquei por busca (`grep -ril`) que não existe `UX-UI-MAPEAMENTO.md` nem
  referência a `figma.com` em nenhum `.md` do repositório, além da já
  conhecida pela especificação da F24.
- Verifiquei a especificação de ESQUADRO em `docs/design/F24-wireframe-baixa-fidelidade.md`
  e mantive a mesma numeração, os mesmos 24 nomes de tela e a mesma matriz de
  cobertura (seção 7 daquele documento) para não criar uma segunda fonte de
  verdade divergente — este PRD e aquela especificação descrevem a mesma
  lista com o mesmo resultado.
- Não verifiquei (não é possível nesta sessão) se o arquivo Figma existe de
  fato — dependo da dúvida 1 (seção 8) para isso.

**Decisões**: tratei "Financeiro · lançamentos" como uma tela única (lista +
formulário) para fechar a contagem em 24, replicando a mesma interpretação já
usada por ESQUADRO; registrado como dúvida 3 caso o comandante prefira
separar.

**Pendências**: as três da seção 8, com destaque para a primeira (acesso ao
Figma) — sem resolvê-la, US-DES-07/08 não têm artefato formal para aprovar ou
reprovar.

**Próximo passo**: CARTOGRAFO revisa se a matriz da seção 5.4 é suficiente
como critério técnico de verificação (por exemplo, para orientar como o CRIVO
vai contar os 93 frames esperados) e se há algum impacto de arquitetura nas
dúvidas 2 (colunas ausentes no schema) antes de passar a ESQUADRO para
transcrição/ajuste da especificação já existente.

## 12. Handoff desta revisão (2026-11-07) — para ESQUADRO

**O que foi feito**: segunda rodada, por instrução direta do comandante —
tornei US-DES-07 e US-DES-08 executáveis de fato (antes dependiam de uma
decisão futura não tomada) e confirmei a lista das 24 telas e os dois tipos de
estado de erro contra a especificação de ESQUADRO.

1. Resolvi a dúvida 1 (seção 8): como Product Owner, aceitei formalmente o par
   de Markdown (este PRD + a especificação de ESQUADRO) como o artefato de
   aprovação do wireframe nesta fase, no lugar do arquivo Figma — com a
   divergência da Premissa 3 (ferramenta Figma) registrada, não escondida.
   Isso não resolve o acesso ao Figma para F25 em diante, só desbloqueia a
   aprovação deste wireframe.
2. Reescrevi US-DES-07 e US-DES-08 em Gherkin apontando para uma tabela
   concreta ("Registro de execução", fim da seção 7) em vez de uma aprovação
   abstrata — agora dá para checar objetivamente se existe uma linha
   "Aprovado" com data e identificação, ou uma pendência registrada.
3. **Executei o critério de verdade nesta rodada**, não só o deixei pronto
   para execução futura: revisei o par de documentos linha a linha contra a
   matriz da seção 5.4 e **reprovei** com 1 pendência (tela 15 — Peças ·
   editar, erro de validação herdando mensagem de um campo somente leitura —
   achado que já constava da memória de QA do CRIVO). Registrado na tabela da
   seção 7.
4. Confirmei (seção 1) que as 24 telas e os dois tipos de erro deste PRD são
   idênticos, nome a nome, aos da especificação de ESQUADRO — nenhuma
   divergência encontrada.

**Arquivos**:
- Alterado: `docs/product/F24-wireframe-baixa-fidelidade.md` (este arquivo) —
  cabeçalho, nota de confirmação (seção 1), Gherkin de US-DES-07/US-DES-08,
  tabela "Registro de execução" (fim da seção 7), dúvida 1 resolvida (seção 8)
  e esta seção de handoff.
- Nenhum outro arquivo alterado. Não criei tela nova nem mexi em
  `docs/design/F24-wireframe-baixa-fidelidade.md` (fora de escopo desta
  instrução) nem em qualquer artefato de protótipo de alta fidelidade.

**O que verifiquei de verdade** (vs. o que supus):
- Reli `docs/design/F24-wireframe-baixa-fidelidade.md` por completo nesta
  sessão (seções 1 a 10) e comparei a lista de 24 telas e a matriz de estado
  linha a linha com a seção 4 e a seção 5 deste PRD — batem exatamente.
- Reli as memórias de projeto `project_f24_wireframe_bloqueado` (inclui o
  status de QA do CRIVO de 2026-11-07, com o achado da tela 15) e
  `reference_figma_acesso_bloqueado` antes de decidir a dúvida 1 — não inventei
  o estado do bloqueio do Figma nem o achado da tela 15, ambos já estavam
  registrados por CRIVO.
- Não tenho acesso ao Figma nesta sessão (ferramenta MCP do Figma não
  disponível para mim nesta etapa) — não tentei nem afirmei ter verificado a
  existência de um arquivo Figma além do que já está registrado na memória.

**Decisões**: aceitar o Markdown como artefato de aprovação (dúvida 1) e
reprovar esta rodada com 1 pendência, em vez de aprovar condicionalmente ou
deixar a decisão em aberto — a pendência da tela 15 é concreta e documentada,
então a aprovação explícita (US-DES-07) ficaria falsa se eu a registrasse
agora.

**Pendências**:
1. **Para ESQUADRO** (próximo passo, item 5 abaixo): corrigir a tela 15 —
   remover ou adaptar as mensagens de erro de validação herdadas da tela 14
   para o campo "Código", que é somente leitura na edição.
2. Dúvidas 2 (colunas ausentes no schema) e 3 (Financeiro · lançamentos como
   uma tela ou duas) da seção 8 seguem como estavam, sem decisão nova nesta
   rodada — fora do escopo desta instrução.
3. O acesso ao Figma em si (token/arquivo) segue sem solução — é pendência de
   REGENTE, não minha nem de ESQUADRO, e só afeta a transcrição futura para
   Figma e as features de alta fidelidade (F25 a F29), não a aprovação deste
   wireframe.

**Próximo passo**: ESQUADRO corrige a tela 15 em
`docs/design/F24-wireframe-baixa-fidelidade.md` (seção 6). Depois disso, eu
(BUSSOLA) reconfiro só esse ponto e registro a linha "Aprovado" na tabela da
seção 7, liberando F25 a F29 para iniciar. Até lá, nenhuma feature de
protótipo de alta fidelidade pode começar implementação.

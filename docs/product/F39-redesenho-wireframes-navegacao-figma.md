# PRD — F39: Redesenho de wireframes com inspiração de navegação (Figma)

- Prioridade: P1
- Área: Full-stack (dono do artefato: design/produto; implementação de app fora de escopo)
- Sprint: Sprint 01: Fundação e Login (trilha paralela de design)
- Autor: BUSSOLA (Product Owner)
- Data: 2026-11-11
- Etapa da rota: **BUSSOLA (1/3)** → ESQUADRO → CRIVO
- Depende de: [[F24]] (wireframe de baixa fidelidade original, aprovado
  2026-11-07 — este PRD reabre esse artefato, não cria um novo do zero).
- Não reabre: [[F33]] (PRD do menu principal, travado por REGENTE em
  2026-11-09) nem o código da tab bar já implementada
  (`apps/mobile/src/components/menu-tab-bar.tsx` e correlatos).

> **Instrução do comandante para esta etapa**: confirmar o escopo (24 telas, 4
> estados cada), que esta feature reabre só o wireframe F24 e não toca o PRD
> do menu F33 nem a tab bar implementada, e travar os critérios US-WFR. Este
> documento executa exatamente essa instrução.

## 1. Visão

O wireframe de baixa fidelidade das 24 telas, entregue pela F24 e aprovado em
2026-11-07, resolveu a cobertura de estado e fechou o grafo de navegação (ver
`docs/architecture/diagrams/navegacao-wireframe-f24.md`). Esta feature não
substitui essa entrega — ela a **revisa**, usando como forte inspiração
estrutural um arquivo Figma indicado pela pessoa, porque esse arquivo
organiza e hierarquiza telas de forma mais harmônica do que a entrega atual
do F24 nesse aspecto específico (agrupamento de menu e navegação).

Valor para quem usa: o funcionário da oficina vai operar uma estrutura de
navegação mais clara desde a base do wireframe, antes de qualquer
investimento em identidade visual (F25 a F29) — evitando que a Sprint 02 em
diante herde uma hierarquia de menu que já se sabe menos organizada que uma
referência disponível.

**O que esta revisão não é**: não é uma reabertura da decisão de produto do
menu principal (uma aba habilitada + quatro reservadas, travada por REGENTE
em 2026-11-09 — [[F33]]), nem uma mudança de código. É uma correção
estrutural do artefato de wireframe, no mesmo nível de baixa fidelidade do
F24 original.

## 2. Escopo

### Dentro do escopo
- Revisão das **24 telas** do inventário fechado de UX-UI-MAPEAMENTO.md (a
  mesma lista da seção 4 de `docs/product/F24-wireframe-baixa-fidelidade.md`
  — ver seção 4 abaixo, reproduzida sem alteração de número ou nome).
- Cobertura dos **quatro estados** por tela (vazio, carregando, erro,
  preenchido), na mesma matriz de aplicabilidade já travada pela F24 (seção
  5.4 daquele PRD) — esta feature não adiciona nem remove tela nem estado
  aplicável, só revisa a organização visual e de navegação dentro do que já
  está fixado.
- Menu e navegação redesenhados com forte inspiração estrutural no Figma de
  referência (agrupamento, hierarquia), sem copiar paleta, tipografia ou
  componente visual daquele arquivo.
- Uso livre de componentes de navegação usuais de UI/UX (bottom sheet, modal,
  drawer, menu flutuante) quando servirem à hierarquia proposta, em baixa
  fidelidade, com o motivo estrutural de cada uso registrado junto à tela.
- Atualização do mapa de navegação (grafo) de
  `docs/architecture/diagrams/navegacao-wireframe-f24.md`, fechando toda tela
  órfã ou sem saída — incluindo os seis gaps já identificados por CARTOGRAFO
  na revisão original (seção 5 daquele mapa), que continuam válidos até
  prova em contrário.
- Registro de toda divergência entre a navegação proposta aqui e a decisão
  travada do F33 (1 aba habilitada + 4 desabilitadas) como débito endereçado
  ao REGENTE, sem implementação nesta feature.
- Acessibilidade estrutural (rótulo, ordem de leitura, foco) nos quatro
  estados de cada tela, como critério de aceitação, não como fase futura.

### Fora do escopo
- Alteração em código do app ([[F33]]/F34) ou no PRD travado do menu
  principal — `docs/product/F33-menu-principal-navegacao.md` permanece como
  está; nenhuma linha deste documento o reabre.
- Protótipo de alta fidelidade (permanece com F25 a F29, já concluídas para
  Login/Perfil e Menu, pendentes para os módulos seguintes).
- Identidade visual final de produção — o wireframe revisado continua em
  baixa fidelidade, igual ao F24 original.
- Telas novas fora do inventário fechado de UX-UI-MAPEAMENTO.md (as mesmas 24
  — nenhuma tela nova, nenhuma tela removida).
- Decisão sobre abrir ou não uma nova feature de revisão do menu principal,
  caso a navegação revisada sugira arquitetura diferente da travada no F33 —
  essa decisão é do REGENTE (premissa 6), não desta feature.

## 3. Glossário

| Termo | Significado neste PRD |
|---|---|
| Wireframe revisado | A nova versão de baixa fidelidade das 24 telas, produzida nesta feature sobre a base do F24, com navegação redesenhada. |
| Figma de referência | Arquivo Figma indicado pela pessoa, usado só como inspiração estrutural de menu/navegação (agrupamento, hierarquia) — nunca como fonte de verdade visual. |
| Inspiração estrutural | Reaproveitar a forma como o Figma de referência organiza e agrupa telas/seções, sem copiar cor, tipografia ou componente visual daquele arquivo. |
| Componente de navegação usual | Padrão comum de UI/UX para organizar hierarquia (bottom sheet, modal, drawer, menu flutuante), usado aqui por motivo estrutural, não estético. |
| Débito endereçado ao REGENTE | Registro formal, nesta PRD, de uma divergência entre a navegação revisada e uma decisão de produto já travada (F33), sem decidir por conta própria se ela se reabre. |
| Tela órfã | Tela sem nenhuma aresta de entrada a partir da raiz do grafo de navegação (inalcançável) — mesma definição do mapa de CARTOGRAFO. |
| Tela sem saída | Tela cuja(s) ação(ões) não têm destino declarado (botão que não leva a lugar nenhum). |

## 4. As 24 telas (inventário fechado, reproduzido sem alteração)

Mesma lista e numeração da seção 4 de
`docs/product/F24-wireframe-baixa-fidelidade.md`. Esta feature **não** soma
nem remove tela — US-WFR-01 confere exatamente esta lista.

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

Total: **24**, idêntico ao F24. Os quatro estados aplicáveis a cada tela
(vazio, carregando, erro, preenchido) seguem a mesma matriz de aplicabilidade
já travada na seção 5.4 do PRD da F24 — esta feature revisa a organização
visual e de navegação, não redecide quais estados cada tela tem.

## 5. Premissas

1. O Figma de referência é usado como forte inspiração estrutural de
   menu/navegação, por ser mais organizado e harmônico que o wireframe atual
   nesse aspecto, mas nunca como fonte de verdade visual (cor, tipografia,
   componentes).
2. As 24 telas de UX-UI-MAPEAMENTO.md continuam sendo o inventário fechado:
   não se somam nem se removem telas nesta feature.
3. Qualquer divergência entre a navegação proposta aqui e a decisão travada
   do F33 (1 aba habilitada + 4 desabilitadas reservadas) fica registrada
   como débito, sem reabrir F33 nesta feature.
4. Wireframe não carrega dado pessoal real: todo texto de exemplo é
   placeholder/fictício. Finalidade: ilustrar fluxo de telas. Base legal: não
   aplicável (não é dado pessoal de titular real). Retenção: arquivo de
   design mantido enquanto o produto estiver em desenvolvimento (ver tabela
   completa na seção 7).
5. Componentes de navegação como bottom sheet, modal e drawer podem ser
   incorporados livremente quando ajudarem a estrutura e hierarquia, mesmo
   sem equivalente literal no Figma de referência; cada uso deve ter o motivo
   estrutural registrado, não é escolha estética.
6. Se a navegação revisada sugerir arquitetura diferente da travada no F33,
   a divergência é registrada no PRD e a decisão de abrir ou não uma nova
   feature de revisão do menu é do REGENTE, mesma autoridade que travou o PRD
   do F33 em 2026-11-09. BUSSOLA não decide isso sozinho.
7. A aprovação explícita do wireframe revisado, antes de liberar para
   qualquer novo protótipo, é registrada por BUSSOLA no PRD, no mesmo padrão
   usado na aprovação da F24 original (aprovação de BUSSOLA destravou
   F25-F29 — seção 7 daquele PRD).

## 6. Dúvidas em aberto

Nenhuma dúvida estratégica em aberto nesta etapa: as duas levantadas durante
a co-escrita da feature foram resolvidas e registradas nas premissas 6 e 7
acima.

**Pendência operacional, não dúvida de produto**: o link ou identificação
exata do arquivo Figma de referência não está registrado neste PRD porque
não foi compartilhado nesta sessão com BUSSOLA — é informação que ESQUADRO
precisa ter em mãos para executar US-WFR-02. Isso não bloqueia o travamento
do escopo e dos critérios aqui (não depende do conteúdo do Figma de
referência), mas bloqueia a execução de ESQUADRO até o link ser passado por
quem o indicou. Registrado para rastreio, não como dúvida de decisão de
produto.

## 7. Dados pessoais no conteúdo de exemplo (LGPD)

Mesmo tratamento já aplicado na F24 original, reconfirmado para a revisão —
nenhum dado real de cliente, veículo ou financeiro da oficina pode aparecer
no wireframe revisado nem na ferramenta de design compartilhada (critério de
aceitação, não boa prática opcional — ver US-WFR-01 a 03, que herdam a
mesma exigência da F24 por não reabrirem decisão nova sobre isso).

| Dado fictício | Finalidade | Base legal | Retenção |
|---|---|---|---|
| Nome, telefone, e-mail de cliente fictício (telas de Clientes) | Demonstrar hierarquia de informação no wireframe revisado, sem usar dado real da oficina | Não aplicável — dado fictício, não é dado pessoal de titular real (LGPD não incide) | Enquanto o arquivo de wireframe existir; não migra para produção |
| Placa, marca, modelo de veículo fictício (telas de Veículos) | Idem | Não aplicável — dado fictício | Idem |
| Valor de parcela/pagamento/lançamento fictício (telas Financeiro) | Idem | Não aplicável — dado fictício | Idem |

## 8. Acessibilidade e i18n

Cobertos como critério de aceitação (US-WFR-06), não como fase futura: texto
alternativo, ordem de leitura e foco coerentes com navegação por teclado e
leitor de tela, nos estados de erro e vazio de cada uma das 24 telas, mesmo
em baixa fidelidade. Texto de interface de produção não é fixado neste PRD
(decisão de implementação de cada feature de front, com chave
`area.componente.texto`); aqui só a estrutura de navegação e os estados são
fixados.

## 9. Histórias de usuário e critérios de aceitação

IDs: `US-WFR-01` a `US-WFR-08`, área `WFR`, feature `F39`. Critérios travados
nesta etapa — CRIVO confere sem precisar interpretar texto livre.

---

### US-WFR-01 — Cobertura completa de telas

**Como** pessoa dona do produto,
**quero** ver as 24 telas do inventário fechado representadas no wireframe
revisado,
**para** confirmar que a revisão de navegação não deixou nenhuma tela de
fora nem mudou a contagem fechada pela F24.

```gherkin
Cenário: Todas as 24 telas presentes nos quatro estados
  Dado a lista fechada de 24 telas da seção 4 deste PRD
  Quando o wireframe revisado é entregue
  Então cada uma das 24 telas tem uma versão atualizada
  E cada versão cobre os estados aplicáveis a ela conforme a matriz da
    seção 5.4 de docs/product/F24-wireframe-baixa-fidelidade.md (vazio,
    carregando, erro, preenchido — sem redecidir quais são aplicáveis)
  E cada versão é identificável pelo número e nome exatos da tabela da
    seção 4

Cenário de erro: tela ou estado obrigatório faltando na revisão
  Dado o wireframe revisado com menos de 24 telas, ou com uma tela sem um
    estado marcado como obrigatório na matriz herdada da F24
  Quando reviso contra a lista da seção 4 e a matriz herdada
  Então a entrega não é aprovada (US-WFR-07)
  E a tela ou o estado faltante é registrado pelo número e nome exatos
```

---

### US-WFR-02 — Navegação inspirada no Figma de referência

**Como** pessoa dona do produto,
**quero** que o menu e a navegação do wireframe revisado reflitam a
organização e hierarquia do Figma de referência,
**para** capturar o ganho estrutural que motivou esta revisão, sem herdar
nada da identidade visual daquele arquivo.

```gherkin
Cenário: Estrutura de agrupamento e hierarquia inspirada na referência
  Dado o Figma de referência indicado pela pessoa
  Quando o menu e a navegação do wireframe são redesenhados
  Então a estrutura de agrupamento e hierarquia das 24 telas reflete a
    inspiração do Figma de referência (ex.: como telas são agrupadas por
    módulo, como a navegação principal organiza o acesso a cada grupo)
  E o motivo de cada escolha de agrupamento é registrado junto ao wireframe
  E nenhuma cor, tipografia ou componente visual do Figma de referência é
    copiado — o wireframe revisado permanece em baixa fidelidade

Cenário: Uso livre de componente de navegação usual, mesmo sem equivalente literal na referência
  Dado um componente de navegação usual de UI/UX (bottom sheet, modal,
    drawer, menu flutuante) que serve à hierarquia proposta
  Quando esse componente não aparece literalmente no Figma de referência
  Então ele pode ser incorporado ao wireframe revisado mesmo assim
  E seu uso é registrado conforme US-WFR-08 (motivo estrutural, não estético)

Cenário de erro: cópia de elemento visual da referência
  Dado uma cor, tipografia ou componente visual do Figma de referência
  Quando esse elemento aparece no wireframe revisado como cópia, não como
    inspiração estrutural
  Então a entrega não é aprovada (US-WFR-07)
  E o elemento copiado é removido antes de nova revisão
```

---

### US-WFR-03 — Grafo de navegação sem telas órfãs

**Como** pessoa dona do produto,
**quero** que toda tela do wireframe revisado tenha entrada e saída
documentadas,
**para** que a navegação redesenhada não introduza (ou mantenha) um fluxo
quebrado.

```gherkin
Cenário: Toda tela alcançável e com saída declarada
  Dado o mapa de navegação atualizado do wireframe revisado (nova versão de
    docs/architecture/diagrams/navegacao-wireframe-f24.md)
  Quando cada uma das 24 telas é percorrida a partir da raiz (Login) ou da
    casa pós-login
  Então toda tela tem ao menos uma aresta de entrada documentada
    (alcançável) e ao menos uma aresta de saída documentada (toda ação leva
    a um destino declarado)
  E os seis gaps já identificados no mapa original de CARTOGRAFO (seção 5
    de docs/architecture/diagrams/navegacao-wireframe-f24.md) estão fechados
    ou substituídos por uma aresta equivalente na navegação redesenhada

Cenário de erro: tela órfã ou sem saída na revisão
  Dado uma tela sem nenhuma aresta de entrada a partir da raiz, ou uma ação
    sem destino declarado
  Quando o mapa de navegação atualizado é revisado
  Então a entrega não é aprovada (US-WFR-07)
  E a tela e o tipo de lacuna (sem entrada / sem saída) são registrados
```

---

### US-WFR-04 — Não reabertura do código implementado

**Como** pessoa dona do produto,
**quero** garantir que a revisão do wireframe não toca o que já foi
implementado e travado,
**para** proteger o trabalho já aceito de F33/F34 de uma mudança de escopo
não autorizada.

```gherkin
Cenário: Código e PRD do menu intocados
  Dado a tab bar do menu principal já implementada pelo F33
    (apps/mobile/src/components/menu-tab-bar.tsx e correlatos) e o PRD
    travado docs/product/F33-menu-principal-navegacao.md
  Quando o wireframe revisado é entregue
  Então nenhuma alteração é feita em nenhum arquivo de código do app
  E nenhuma alteração é feita em docs/product/F33-menu-principal-navegacao.md

Cenário de erro: alteração indevida detectada
  Dado o diff da entrega desta feature
  Quando esse diff inclui qualquer arquivo de código do app (apps/mobile/**)
    ou o PRD do F33
  Então a entrega não é aprovada (US-WFR-07)
  E a alteração indevida é revertida antes de nova revisão
```

---

### US-WFR-05 — Divergência registrada como débito

**Como** pessoa dona do produto,
**quero** registrar formalmente qualquer divergência entre a navegação
revisada e a decisão travada do F33,
**para** que a decisão de reabrir ou não o menu principal seja do REGENTE,
não uma reinterpretação silenciosa minha.

```gherkin
Cenário: Divergência estrutural identificada e registrada
  Dado uma divergência entre a navegação proposta no wireframe revisado e a
    decisão travada do F33 (1 aba habilitada + 4 desabilitadas reservadas)
  Quando essa divergência existir
  Então ela é registrada nesta PRD, na seção "Registro de débitos ao
    REGENTE" (seção 10), com a descrição exata da divergência
  E a decisão de abrir ou não uma nova feature de revisão do menu é
    explicitamente atribuída ao REGENTE, sem implementação nesta feature

Cenário: Nenhuma divergência encontrada
  Dado a navegação redesenhada compatível com 1 aba habilitada + 4
    desabilitadas (ex.: a inspiração do Figma de referência se aplica dentro
    de cada módulo, não na estrutura de abas em si)
  Quando a revisão é concluída
  Então a seção 10 registra explicitamente "nenhuma divergência encontrada",
    não fica omissa
```

---

### US-WFR-06 — Acessibilidade nos quatro estados

**Como** pessoa usuária com leitor de tela, baixa visão ou que navega por
teclado,
**quero** que o wireframe revisado já preveja texto alternativo, ordem de
leitura e foco em todo estado de erro ou vazio,
**para** que a navegação redesenhada não introduza uma barreira de acesso
que a F24 original já havia evitado.

```gherkin
Cenário: Estrutura acessível prevista no estado de erro ou vazio
  Dado qualquer uma das 24 telas do wireframe revisado
  Quando o estado de erro ou vazio dessa tela é exibido
  Então o wireframe indica texto alternativo para elementos não textuais
  E a ordem de leitura e foco está indicada, coerente com navegação por
    teclado e leitor de tela
  E nenhuma informação de estado depende só de cor

Cenário de erro: estado de erro ou vazio sem previsão de acessibilidade
  Dado o estado de erro ou vazio de uma tela do wireframe revisado
  Quando falta texto alternativo, ordem de leitura/foco ou a informação de
    estado depende só de cor
  Então a entrega não é aprovada para aquela tela (US-WFR-07)
```

---

### US-WFR-07 — Aprovação antes de seguir

**Como** pessoa dona do produto,
**quero** aprovar explicitamente o wireframe revisado antes de qualquer novo
protótipo de alta fidelidade avançar sobre a navegação redesenhada,
**para** impedir que o time avance sobre uma hierarquia ainda não validada.

```gherkin
Cenário: Aprovação explícita registrada
  Dado o wireframe revisado entregue, com a matriz de estado (US-WFR-01), a
    navegação inspirada (US-WFR-02), o grafo sem órfãs (US-WFR-03), a não
    reabertura de código (US-WFR-04), os débitos registrados (US-WFR-05), a
    acessibilidade (US-WFR-06) e o motivo de cada componente de navegação
    (US-WFR-08) todos sem pendência aberta
  Quando ele é apresentado para validação
  Então BUSSOLA registra "Aprovado" na tabela "Registro de execução" (seção
    11), com data e identificação, no mesmo padrão usado na aprovação da F24
    original (seção 7 de docs/product/F24-wireframe-baixa-fidelidade.md)
  E só a partir dessa linha qualquer novo protótipo de alta fidelidade pode
    avançar sobre a navegação redesenhada

Cenário de erro: aprovação alegada sem registro
  Dado qualquer alegação verbal ou em chat de que "o wireframe revisado foi
    aprovado"
  Quando não existe uma linha correspondente na tabela "Registro de
    execução" (seção 11), com data e identificação de quem aprovou
  Então a aprovação não conta como cumprida para efeito de liberar qualquer
    protótipo sobre a navegação redesenhada
```

---

### US-WFR-08 — Componente de navegação com motivo registrado

**Como** pessoa dona do produto,
**quero** que todo bottom sheet, modal ou drawer incorporado ao wireframe
revisado tenha o motivo estrutural documentado,
**para** impedir que a liberdade de usar esses componentes vire escolha
estética sem justificativa de hierarquia.

```gherkin
Cenário: Motivo estrutural documentado
  Dado uma tela que incorpora bottom sheet, modal ou drawer no wireframe
    revisado
  Quando esse componente é usado
  Então o motivo estrutural da escolha está documentado junto à tela (por
    que esse componente resolve melhor a hierarquia ou agrupamento do que a
    alternativa sem ele)
  E o motivo não é puramente estético (ex.: "porque ficou mais bonito" não
    é um motivo válido isoladamente)

Cenário de erro: componente sem motivo estrutural
  Dado um bottom sheet, modal ou drawer presente no wireframe revisado
  Quando não há motivo estrutural documentado para esse uso, ou o motivo
    registrado é só estético
  Então a entrega não é aprovada para aquela tela (US-WFR-07)
```

---

## 10. Registro de débitos ao REGENTE

Tabela a preencher por ESQUADRO/BUSSOLA durante a execução desta feature,
conforme US-WFR-05. Nenhuma linha ainda, porque a navegação ainda não foi
redesenhada nesta etapa (etapa de PO, antes da especificação de ESQUADRO).

| # | Data | Divergência identificada | Decisão do REGENTE | Status |
|---|---|---|---|---|
| — | — | Nenhum débito registrado ainda — preencher durante/depois da especificação de ESQUADRO, antes da aprovação (US-WFR-07) | — | Pendente |

## 11. Registro de execução — US-WFR-07

Tabela a preencher por BUSSOLA depois que ESQUADRO entregar a especificação
do wireframe revisado, no mesmo padrão usado na F24 (seção 7 daquele PRD).
Nenhuma linha ainda — esta etapa trava o escopo e os critérios, não executa
a aprovação.

| # | Data | Pendência ou aprovação | Descrição | Status |
|---|---|---|---|---|
| — | — | — | Aguardando entrega de ESQUADRO para primeira revisão | Pendente |

## 12. Priorização e o que fica para depois

As 8 histórias (US-WFR-01 a 08) são P1, todas necessárias para fechar esta
feature — nenhuma é opcional, porque cada uma cobre uma garantia distinta
(cobertura, inspiração sem cópia visual, grafo sem órfã, não regressão de
código, débito rastreável, acessibilidade, aprovação formal, motivo de
componente).

Fica para depois, sem decisão nova:
- Protótipo de alta fidelidade sobre a navegação redesenhada (F25 a F29 já
  concluídas para Login/Perfil/Menu, módulos seguintes aguardam a aprovação
  desta feature antes de herdar a navegação revisada).
- Qualquer mudança de código ou de decisão de produto do menu principal
  (F33) — fica condicionada à decisão do REGENTE sobre os débitos da seção
  10, se houver algum.
- Identidade visual final de produção.
- Qualquer item de backlog (dashboard, fotos, PDF, WhatsApp) sem decisão
  nova.

## 13. Handoff para ESQUADRO

**O que foi feito**: confirmação formal do escopo desta feature — reabre só
o artefato de wireframe da F24 (24 telas, quatro estados cada, mesma
matriz de aplicabilidade já travada), redesenha menu/navegação com
inspiração estrutural no Figma indicado pela pessoa, e não toca o PRD
travado do F33 nem o código da tab bar implementada. Os oito critérios de
aceitação (US-WFR-01 a 08) foram formalizados em Gherkin com cenário de erro
explícito para cada um, incluindo o mecanismo de registrar divergência com
F33 como débito ao REGENTE (US-WFR-05) em vez de decidir por conta própria.

**Arquivos**:
- Criado: `docs/product/F39-redesenho-wireframes-navegacao-figma.md` (este
  arquivo).
- Nenhum outro arquivo alterado — confirmado que não toquei
  `docs/product/F33-menu-principal-navegacao.md`, nenhum arquivo em
  `apps/mobile/**`, nem `docs/product/F24-wireframe-baixa-fidelidade.md`
  (esta feature cria sua própria PRD, não edita a da F24).

**O que verifiquei de fato** (vs. o que supus):
- Reli `docs/product/F24-wireframe-baixa-fidelidade.md` por completo e
  reproduzi a lista de 24 telas (seção 4) sem alteração de número ou nome.
- Reli `docs/product/F33-menu-principal-navegacao.md` por completo para
  confirmar o texto exato da decisão travada por REGENTE em 2026-11-09 ("1
  item habilitado + 4 desabilitados, 5 posições fixas") antes de escrever
  US-WFR-05 — não parafraseei de memória.
- Reli `docs/architecture/diagrams/navegacao-wireframe-f24.md` por completo:
  os seis gaps de fluxo (dois órfãos — telas 07 e 16) que CARTOGRAFO
  registrou na revisão original da F24 continuam a referência de "o que já
  se sabia estar quebrado" para US-WFR-03 nesta revisão.
- Verifiquei por `grep -ril "figma.com" docs/` que não existe no repositório
  nenhum link ou identificação do Figma de referência desta feature — por
  isso registrei isso como pendência operacional na seção 6, não como
  dúvida resolvida por invenção minha.
- Não abri nenhum arquivo Figma nesta sessão (não tentei chamar a
  ferramenta MCP do Figma, porque esta etapa de PO não depende do conteúdo
  visual do Figma de referência para travar escopo e critérios — isso é
  tarefa de ESQUADRO, próxima etapa da rota).

**Decisões**:
- Tratei a cobertura de estado (quatro estados por tela) como **herdada**
  da matriz já travada na F24 (seção 5.4 daquele PRD), não uma redecisão —
  esta feature revisa organização e navegação, não os estados aplicáveis a
  cada tela. Se ESQUADRO identificar necessidade de mudar a matriz de
  aplicabilidade durante a especificação, isso é uma mudança de escopo que
  precisa voltar a BUSSOLA antes de seguir.
- Criei a seção 10 (Registro de débitos ao REGENTE) e a seção 11 (Registro
  de execução) como tabelas vazias, a preencher por ESQUADRO/BUSSOLA durante
  e depois da especificação — não preenchi com débito ou aprovação
  fictícios, porque a navegação ainda não foi redesenhada nesta etapa.

**Pendências**:
1. **Operacional, para quem indicou o Figma de referência**: compartilhar o
   link/identificação exata do arquivo com ESQUADRO antes da execução de
   US-WFR-02 (seção 6). Sem isso, ESQUADRO não tem como aplicar a inspiração
   estrutural.
2. Os seis gaps de fluxo do mapa de navegação original (seção 5 de
   `docs/architecture/diagrams/navegacao-wireframe-f24.md`) precisam ser
   revisitados por ESQUADRO/CARTOGRAFO durante a atualização do mapa — a
   navegação redesenhada pode fechá-los de forma diferente da recomendação
   original, mas não pode deixá-los abertos (US-WFR-03).
3. Qualquer divergência com F33 encontrada durante a especificação entra na
   seção 10 deste PRD antes da aprovação (US-WFR-05) — é tarefa de
   ESQUADRO/BUSSOLA detectar e registrar, não decidir.

**Próximo passo**: ESQUADRO recebe o link do Figma de referência (pendência
1) e produz a especificação do wireframe revisado — organização de
menu/navegação inspirada na referência, grafo de navegação atualizado sem
órfãs, acessibilidade por tela e motivo estrutural de cada componente de
navegação usado (bottom sheet/modal/drawer) — registrando em um companheiro
de design (`docs/design/F39-...md`, seguindo o padrão já usado em
`docs/design/F24-wireframe-baixa-fidelidade.md`) toda divergência encontrada
com o F33 na seção 10 deste PRD. Depois disso, eu (BUSSOLA) reviso e
registro "Aprovado" ou as pendências na tabela da seção 11, liberando a
navegação redesenhada para qualquer protótipo futuro só depois dessa linha
existir.

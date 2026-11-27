# PRD — F28: Protótipo de alta fidelidade de Ordens de Serviço

- Prioridade: P1
- Área: Frontend
- Sprint: Sprint 04: Ordens de Serviço
- Dono da execução (Figma): ESQUADRO
- Autora: BUSSOLA (Product Owner)
- Data: 2026-11-24 (revisão 1)
- Etapa da rota: **BUSSOLA (1/3)** → ESQUADRO → CRIVO
- Depende de: F00, F24, F39 (premissa 7) e, **por esta revisão, da F29 só para o componente do formulário de pagamento** (seção 3).
- Estado: **PRD fechado para o ESQUADRO, com bloqueio.** A F39 não tem linha "Aprovado" (seção 9), então o desenho de alta fidelidade não começa. A decisão de dono do pagamento (seção 3) é **proposta minha, aguardando a pessoa.**

> **Como ler.** Separo o que li do que suponho. Esta etapa é só documento: **não rodei código nem teste de aplicação e não abri o Figma** (não havia ferramenta do Figma para mim). Li no repositório: `docs/product/ux-ui-mapeamento.md` (seções 5 e 7), `docs/design/F24-wireframe-baixa-fidelidade.md` (telas 19 a 23), `V2__criar_schema_oficina.sql`, `docs/architecture/overview.md`, o PRD da F39 (seção 11), `docs/design/figma.md` e o ADR-014. **Não existe no repositório** o card nem o PRD da F29, nem o card da F42; o que digo deles vem só do panorama do briefing.
>
> **Sobre "resolver com a pessoa".** Não tenho como conversar com a Letícia nesta sessão. Não registrei decisão em nome dela. A seção 3 traz a recomendação, o que muda se ela escolher o contrário, e a linha de confirmação **em branco** (seção 3.5).

## 1. Visão e histórias

A tela mais usada do app é o detalhe da OS. Antes de o Expo começar, a pessoa que aprova precisa percorrer o fluxo inteiro em alta fidelidade: achar a OS, abrir uma nova, ver itens e totais, mudar o status, ver as parcelas e registrar o recebimento.

- **H1.** Como **atendente da oficina**, quero percorrer em alta fidelidade o fluxo completo de Ordens de Serviço, para aprovar o desenho antes de o Expo começar (gate do ADR-007).
- **H2.** Como **atendente**, quero registrar o recebimento de uma parcela a partir do detalhe da OS e ver a parcela mudar de status ali mesmo, para não sair da OS que estou atendendo.
- **H3.** Como **pessoa que aprova o front**, quero que o formulário de pagamento exista **uma vez só** no Figma, com um dono, para que a OS e o Financeiro nunca mostrem campos ou mensagens diferentes.

## 2. Glossário

- **OS**: ordem de serviço. Status: ABERTA, EM_ANALISE, AGUARDANDO_PECA, EM_ANDAMENTO, FINALIZADA, ENTREGUE, CANCELADA.
- **Valor congelado**: preço do item gravado na venda; mudar o catálogo depois não altera a OS.
- **Parcela**: o que é devido (número/total, valor previsto, vencimento). Status calculado, nunca escolhido.
- **Pagamento**: recebimento real de uma parcela, com valor e forma.
- **Formulário de pagamento**: a tela e o componente "Financeiro · pagamento" (wireframe 23 da F24).
- **Componente mestre**: o componente original no Figma. **Instância**: uso dele numa tela, ligado ao mestre.
- **Ponto de entrada**: o botão e o contexto que abrem o formulário a partir de uma tela.

## 3. Decisão: quem é dono do registro de pagamento (D1)

### 3.1 O que já estava decidido

A pessoa decidiu (premissa 2) que o registro de pagamento aparece na F28 e na F29 e que o formulário é **o mesmo componente** nas duas. Isso **não** dizia qual feature desenha o mestre. É o que a D1 pergunta.

### 3.2 O que encontrei

1. O wireframe aprovado da F24 chama a tela de **"23 — Financeiro · pagamento"** e a liga a **duas** origens: a tela 21 (parcelas da OS) e a tela 22 (Financeiro · parcelas). O próprio texto diz que a segunda origem fecha o "Gap 6".
2. O `ux-ui-mapeamento.md`, seção 7, lista "Detalhe da Parcela / Registrar Pagamento" dentro de **Financeiro**, entrando "de Parcelas em Aberto, ou Detalhe da OS".
3. O contrato do pagamento é o da F22 (Financeiro), e cada pagamento gera um lançamento no Financeiro.
4. Na ordem do quadro, F29 está **Pronta** e F28 está **Bloqueada**; F29 depende de F00, F24 e F39, **sem** depender da F28. Então F29 pode ser desenhada antes.

### 3.3 Decisão proposta

| Item | Dono | Motivo |
|---|---|---|
| Frame e **componente mestre** do formulário de pagamento (campos, estados, mensagens de erro, regra de saldo) | **F29** | A tela é do domínio Financeiro nos dois documentos de origem; F22 e F43 são do mesmo domínio; um mestre só |
| **Ponto de entrada** na seção de parcelas do detalhe da OS: botão "Registrar pagamento" por parcela, quais parcelas mostram o botão, retorno ao detalhe, parcela com status novo | **F28** | A seção de parcelas é do detalhe da OS (premissa 1) |
| Uso do formulário dentro do fluxo da OS | **F28**, como **instância** do mestre da F29 | Premissa 2 |
| Cópia, "detach" ou variante própria do formulário na F28 | **Ninguém** | Quebra o critério US-PROTO-OS-16 |

Consequências para a F28:

1. A F28 **não desenha** os estados do formulário (vazio, preenchido, salvando, erro de campo, erro de envio). Eles vêm do mestre.
2. A F28 desenha: botão por parcela, a instância aberta a partir da parcela, o retorno ao detalhe e os estados da **seção** de parcelas depois do pagamento (PAGO e PARCIAL).
3. **Nova dependência:** F28 depende da F29, só do componente. Não há ciclo (F29 não depende da F28). Peço ao PRUMO que registre isso no quadro e olhe a ordem de sprint (F28 na Sprint 04, F29 na Sprint 05).
4. Os critérios 14, 15 e 16 mudam (seção 7) e entram dois novos (24 e 25).
5. A tarefa 9 muda (seção 8).

### 3.4 E se a pessoa escolher o contrário (F28 dona do mestre)

| O que muda | Efeito |
|---|---|
| Dono do mestre | F28 desenha tudo e a F29 vira consumidora; F29 passa a depender da F28 |
| Critérios | 14, 15 e 16 voltam a ser da F28 sem a ressalva; 24 e 25 caem |
| Ordem | F28 precisa sair antes da F29 e a F29 fica **Bloqueada** pela F28 (hoje está Pronta) |
| Risco | A tela de Financeiro dependeria de uma feature de outra sprint, e a F43 também (já depende da F42, que depende da F28) |

Recomendo **F29 dona** pelos quatro motivos de 3.2. Se a pessoa ficar com o contrário, o trabalho de reescrita é pequeno e está listado acima.

### 3.5 Confirmação da pessoa

| Data | Quem | Decisão | Registro |
|---|---|---|---|
| — | — | — | **Pendente. Nada foi confirmado.** |

Até a linha acima ser preenchida, vale a recomendação, e a F28 só avança nas partes que não dependem do formulário (lista, criar, detalhe, status, seção de parcelas).

## 4. Escopo

### Dentro

Protótipo navegável, só smartphone, com petro `#1E3A3F` e primary `#B5453D` e os quatro estados em cada tela (vazio, carregando, erro, preenchido):

- Lista de OS com filtro por status e busca por cliente ou veículo.
- Criar OS: cliente, veículo do cliente, descrição do problema e previsão de entrega.
- Detalhe da OS: itens de serviço e peça de valor congelado, desconto e totais recalculados.
- Transição de status só com as opções válidas, status terminal e confirmação de cancelamento.
- Seção de parcelas dentro do detalhe, com status calculado.
- **Ponto de entrada do pagamento** e retorno ao detalhe (seção 3.3). O formulário em si é instância da F29.

### Fora (fica para depois)

- Código (F42 e as features de front que vierem, ver D10).
- Frame e mestre do formulário de pagamento (F29). Telas de Financeiro fora do detalhe da OS (F29).
- Edição e estorno de pagamento.
- PDF, assinatura digital, WhatsApp.
- Gateway: o sistema registra o recebimento, não cobra.

## 5. Premissas (numeradas)

1. A seção de parcelas é parte do detalhe da OS. *(Observação: o wireframe da F24 tem a parcelas como tela própria, a 21. A premissa é decisão da pessoa e prevalece; a F39 pode ter mudado isso, e não pude verificar.)*
2. O registro de pagamento aparece na F28 e na F29, com o mesmo componente (decisão da pessoa). **O mestre é da F29 (seção 3), pendente de confirmação.**
3. Parcelas só existem para OS FINALIZADA ou ENTREGUE (F21).
4. Fluxo de status do `CLAUDE.md`. ENTREGUE e CANCELADA são terminais. **Conflito:** o texto original da premissa 4 dizia que ABERTA, EM_ANALISE, AGUARDANDO_PECA e EM_ANDAMENTO são "reversíveis entre si", e o `CLAUDE.md` só prevê reversão entre AGUARDANDO_PECA e EM_ANDAMENTO. **Adotei o `CLAUDE.md`** e registrei a dúvida na D2.
5. Status da parcela é calculado, nunca escolhido.
6. Só dado fictício.
7. O protótipo parte do wireframe da F39 e só inicia depois da aprovação dela.
8. **(nova)** O protótipo desta feature **não define** a regra de saldo nem a lista de formas de pagamento: isso é do formulário (F29). Registro o padrão na D5 e na D6.
9. **(nova)** As formas de pagamento do protótipo seguem a V2: DINHEIRO, PIX, CARTAO, BOLETO (rótulos "Dinheiro", "PIX", "Cartão", "Boleto", como no wireframe 23).

## 6. Dúvidas em aberto (numeradas) e padrão adotado

| # | Dúvida | Padrão adotado até a pessoa decidir | Dono da decisão | Estado |
|---|---|---|---|---|
| D1 | Quem é dono do registro de pagamento | **F29 é dona do mestre; F28 do ponto de entrada** (seção 3) | Letícia | **Proposta, não confirmada** |
| D2 | Transições a partir de EM_ANALISE e EM_ANDAMENTO; e a contradição da premissa 4 | Tabela abaixo, só para desenhar. A F20 está Bloqueada e fecha a regra; se divergir, só a tabela é redesenhada | F20 (ESPRESSO), Letícia | Aberta |
| D3 | Adicionar e remover item e editar desconto têm tela própria? | **Editar desconto: sim** (o critério 11 exige o campo). **Adicionar e remover item: recomendo incluir**, porque o `ux-ui-mapeamento.md` os lista no detalhe e sem eles a aprovação não cobre o que a F42 vai programar. Isso alarga a feature; se passar de 3 dias, dividir em F28a (lista, criar, detalhe, status) e F28b (itens, parcelas, entrada do pagamento) | Letícia, PRUMO | Aberta |
| D4 | Gerar parcelas (semanal ou mensal, F21) entra? | **Recomendo que entre**, com um frame de configuração (periodicidade e número). O wireframe 21 já tinha "Configurar parcelamento". Sem ele, a seção de parcelas de uma OS FINALIZADA sem parcelas fica sem saída | Letícia | Aberta |
| D5 | Pagamento maior que o saldo da parcela | **Bloqueia**, com mensagem em texto no campo valor. Motivo: aceitar geraria lançamento financeiro maior que o devido e não há regra de troco. Reversível. **A decisão e o texto são do formulário (F29)** | Letícia; F22 e F29 | Aberta |
| D6 | Valores do enum de forma de pagamento | **Respondida pelo código:** a V2 tem `CHECK` com DINHEIRO, PIX, CARTAO, BOLETO. Mudar a lista exige migration. "Cartão" não separa débito e crédito | Letícia confirma a lista | Fechada pelo código; lista a confirmar |
| D7 | Depender da F39 | Resolvida pelo briefing | — | Resolvida |
| D8 | Retenção dos dados de OS e cliente | Sem prazo inventado (seção 10) | Responsável pela oficina | Aberta |
| D9 | **(nova)** Data do pagamento. O `ux-ui-mapeamento.md` lista "data" no registro; a tabela `pagamentos` **não tem coluna de data** e o wireframe 23 não tem o campo | O protótipo **não mostra campo de data**. A data é o momento do registro. Quem decide é a F22 | F22 (ESPRESSO), F29 | Aberta |
| D10 | **(nova)** O título da F42 diz "lista e criação". Detalhe, status, itens, parcelas e pagamento da OS **não têm feature de front visível** no panorama (F19, F20 e F21 são Full-stack e F43 é Financeiro) | Só aponto. O gate do ADR-007 aprova o desenho, mas nenhuma feature o programa | REGENTE, PRUMO | Aberta |
| D11 | **(nova)** Estado da seção de parcelas para OS FINALIZADA **sem parcelas geradas**. A premissa 3 cobre os outros status e o critério 13 também | Estado vazio com a ação "Gerar parcelas" (depende da D4); sem a D4, vazio explicando que as parcelas ainda não foram geradas | Letícia | Aberta |

**Tabela de transições para desenhar (D2).** Padrão adotado a partir do `CLAUDE.md`:

| De | Opções oferecidas |
|---|---|
| ABERTA | EM_ANALISE, CANCELADA |
| EM_ANALISE | AGUARDANDO_PECA, EM_ANDAMENTO *(a confirmar na F20)*, CANCELADA |
| AGUARDANDO_PECA | EM_ANDAMENTO, CANCELADA |
| EM_ANDAMENTO | AGUARDANDO_PECA, FINALIZADA, CANCELADA |
| FINALIZADA | ENTREGUE, CANCELADA |
| ENTREGUE, CANCELADA | nenhuma (terminais) |

## 7. Histórias e critérios de aceitação (Gherkin)

IDs `US-PROTO-OS-NN` mantidos do briefing para rastrear. Mudanças desta revisão: **01, 14, 15 e 16 reescritos; 24 e 25 novos.** Os demais seguem o texto do briefing, escritos em Gherkin. Cada cenário vira teste sem tradução; a conferência é por captura do Figma ao lado da tela, como diz a regra de paridade do projeto.

```gherkin
# US-PROTO-OS-01 — cobertura de telas (reescrito)
Cenário: Todas as telas de OS têm versão navegável
  Dado as telas de OS do ux-ui-mapeamento.md
  Quando o protótipo é entregue
  Então lista, criar, detalhe com itens, transição de status e seção de parcelas têm versão navegável de alta fidelidade
  E o registro de pagamento aparece como instância do componente da F29 aberta a partir de uma parcela
  E os tokens petro e primary estão aplicados em todas as telas

# US-PROTO-OS-02 — quatro estados
Cenário: Cada tela mostra vazio, carregando, erro e preenchido
  Dado uma tela do protótipo
  Quando reviso seus estados
  Então ela mostra vazio, carregando, erro e preenchido com os tokens aplicados
  E o estado de erro traz mensagem em texto e a ação "Tentar novamente"

# US-PROTO-OS-03 — lista sem resultado do filtro
Cenário: Filtro ou busca sem resultado
  Dado a lista com um filtro de status ou busca que não encontra OS
  Quando vejo o estado vazio
  Então a mensagem diz que nenhuma OS corresponde ao filtro
  E há a ação "Limpar filtro"
  E esse estado é diferente do vazio de quando não existe nenhuma OS

# US-PROTO-OS-04 — transição válida
Cenário: OS ABERTA só oferece as transições válidas
  Dado uma OS em ABERTA no protótipo
  Quando abro a transição de status
  Então só aparecem EM_ANALISE e CANCELADA
  E CANCELADA usa o token primary acompanhado de rótulo em texto

# US-PROTO-OS-05 — status terminal
Cenário: OS ENTREGUE ou CANCELADA não oferece mudança
  Dado uma OS ENTREGUE ou CANCELADA
  Quando abro a transição de status
  Então nenhuma opção de mudança é oferecida
  E uma mensagem em texto explica que o status é final

# US-PROTO-OS-06 — confirmação de cancelamento
Cenário: Cancelar exige confirmação
  Dado uma OS em andamento
  Quando escolho CANCELADA
  Então aparece um diálogo de confirmação com as ações "Confirmar" e "Voltar"
  E nenhuma mudança de status é aplicada antes da confirmação

# US-PROTO-OS-07 — navegação
Cenário: Fluxo da lista ao detalhe e volta
  Dado o protótipo publicado
  Quando clico nas ações de cada tela
  Então a navegação segue o fluxo real da lista até o detalhe com itens de valor congelado e parcelas
  E o botão voltar retorna à tela anterior com o filtro preservado

# US-PROTO-OS-08 — criar OS
Cenário: Criar OS com sucesso
  Dado a tela de criar
  Quando escolho um cliente, um veículo desse cliente, preencho a descrição do problema e a previsão de entrega
  Então o protótipo confirma a criação
  E leva ao detalhe da nova OS com status ABERTA

# US-PROTO-OS-09 — criar OS, erro de validação
Cenário: Criar OS com campos inválidos
  Dado a tela de criar
  Quando confirmo sem veículo, com descrição vazia ou com previsão de entrega anterior a hoje
  Então cada campo inválido mostra mensagem em texto junto ao campo
  E o erro não depende só de cor
  E o foco vai para o primeiro campo inválido

# US-PROTO-OS-10 — itens congelados e totais
Cenário: Totais com valor congelado
  Dado uma OS com um serviço de R$ 120,00, uma peça de 2 unidades a R$ 45,00 e desconto de R$ 10,00
  Quando abro o detalhe
  Então vejo subtotal de serviços R$ 120,00, subtotal de peças R$ 90,00, desconto R$ 10,00 e total R$ 200,00
  E os itens indicam que o valor está congelado na venda

# US-PROTO-OS-11 — desconto inválido
Cenário: Desconto maior que a soma dos subtotais
  Dado o detalhe com desconto maior que a soma dos subtotais
  Quando o valor é informado
  Então o protótipo mostra erro em texto
  E o total nunca aparece negativo

# US-PROTO-OS-12 — parcelas com status calculado
Cenário: Seção de parcelas de OS FINALIZADA
  Dado uma OS FINALIZADA com 3 parcelas
  Quando abro a seção de parcelas
  Então cada parcela mostra número sobre total, vencimento, valor previsto e status em texto (PENDENTE, PARCIAL, PAGO ou ATRASADO)
  E o status não é escolhido manualmente

# US-PROTO-OS-13 — parcelas fora de FINALIZADA e ENTREGUE
Cenário: Seção de parcelas antes da finalização
  Dado uma OS que ainda não está FINALIZADA nem ENTREGUE
  Quando abro a seção de parcelas
  Então o estado vazio explica que as parcelas aparecem depois da finalização
```

```gherkin
# US-PROTO-OS-14a — pagamento total (reescrito)
Cenário: Registrar o pagamento total de uma parcela pelo detalhe da OS
  Dado uma OS FINALIZADA com uma parcela PENDENTE de R$ 100,00 na seção de parcelas
  Quando toco "Registrar pagamento" nessa parcela
  E o formulário (instância do componente da F29) abre com a parcela em somente leitura
  E informo R$ 100,00, escolho uma forma de pagamento e confirmo
  Então volto ao detalhe da mesma OS
  E a parcela aparece como PAGO
  E o resultado é anunciado a leitores de tela (aria-live)

# US-PROTO-OS-14b — pagamento parcial (reescrito)
Cenário: Registrar pagamento de valor menor que o previsto
  Dado uma parcela PENDENTE de R$ 100,00 no detalhe da OS
  Quando registro R$ 40,00 com uma forma de pagamento e confirmo
  Então volto ao detalhe da mesma OS
  E a parcela aparece como PARCIAL, com o saldo restante de R$ 60,00 em texto
  E a parcela continua oferecendo "Registrar pagamento"

# US-PROTO-OS-15 — pagamento com erro (reescrito)
Cenário: Erro no formulário aberto a partir da OS
  Dado o formulário de pagamento aberto a partir de uma parcela do detalhe da OS
  Quando confirmo com valor vazio ou zero, ou sem forma de pagamento
  Então a instância mostra as mensagens de erro do componente da F29, em texto, junto a cada campo inválido
  E o foco vai para o primeiro campo inválido
  E nenhum pagamento é registrado
  E, ao voltar ao detalhe, a parcela segue com o mesmo status e o mesmo saldo
  # Textos de referência, vindos do wireframe 23 da F24 e fixados pela F29:
  # "Informe um valor válido" e "Selecione a forma de pagamento".
  # Se a pessoa aceitar a D5, a F29 acrescenta a mensagem de valor acima do saldo.

# US-PROTO-OS-16 — mesmo componente da F29 (reescrito)
Cenário: O formulário da F28 é instância do mestre da F29
  Dado o formulário de pagamento da F28 e o da F29 no Figma
  Quando inspeciono a camada do formulário na F28
  Então ela é uma instância cujo componente mestre está na seção da F29
  E não há "detach", cópia nem variante criada na F28
  E campos, estados e mensagens são idênticos aos da F29
  E só os dados da parcela (número, valor previsto, vencimento) diferem

# US-PROTO-OS-17 — contraste e foco
Cenário: Contraste, foco e alvo de toque
  Dado uma tela do protótipo
  Quando verifico os elementos interativos
  Então o texto tem contraste mínimo de 4,5:1 e os componentes de interface de 3:1
  E o estado de foco é visível em cada controle navegável
  E cada alvo de toque tem pelo menos 24 por 24 px

# US-PROTO-OS-18 — anúncio de mudanças dinâmicas
Cenário: Carregando, erro e sucesso anunciados
  Dado os estados carregando, erro e sucesso do protótipo
  Quando reviso as anotações do frame
  Então cada um indica como será anunciado a leitores de tela (aria-live)

# US-PROTO-OS-19 — formatação e textos
Cenário: Moeda, data e chaves de i18n
  Dado valores e datas no protótipo
  Quando reviso as telas
  Então moeda aparece como R$ 1.234,56 e datas como dd/mm/aaaa
  E cada texto de interface tem anotada a chave de i18n no formato area.componente.texto

# US-PROTO-OS-20 — dados fictícios
Cenário: Nenhum dado real
  Dado qualquer tela do protótipo
  Quando reviso nomes, telefones e placas
  Então todos são fictícios
  E nenhum dado real da oficina ou de clientes aparece

# US-PROTO-OS-21 — aprovação
Cenário: Aprovação explícita
  Dado o protótipo completo de Ordens de Serviço
  Quando a pessoa revisa
  Então ela aprova explicitamente
  E o front do módulo pode começar (gate do ADR-007)

# US-PROTO-OS-22 — reprovação
Cenário: Pendência impede o início do front
  Dado o protótipo com tela, estado ou token pendente
  Quando a pessoa revisa
  Então a entrega não é aprovada
  E o front do módulo não inicia até a reapresentação ser aprovada

# US-PROTO-OS-23 — bloqueio sem wireframe aprovado
Cenário: F39 não aprovada
  Dado o wireframe redesenhado pela F39 sem linha "Aprovado" na seção 11 do PRD dela
  Quando o protótipo de alta fidelidade é iniciado
  Então a feature fica bloqueada até a aprovação da F39 existir

# US-PROTO-OS-24 — ponto de entrada do pagamento (novo)
Cenário: Só parcelas com saldo oferecem o registro
  Dado uma OS com parcelas PENDENTE, PARCIAL, ATRASADO e PAGO
  Quando abro a seção de parcelas
  Então as parcelas PENDENTE, PARCIAL e ATRASADO mostram "Registrar pagamento"
  E a parcela PAGO não mostra essa ação
  E o botão voltar do formulário e a ação "Cancelar" levam ao detalhe da mesma OS, no ponto da parcela, sem registrar nada

# US-PROTO-OS-25 — dependência da F29 (novo)
Cenário: Componente da F29 ainda não existe
  Dado o componente mestre do formulário de pagamento ainda não desenhado na F29
  Quando a F28 chega ao ponto de entrada do pagamento
  Então os critérios 14a, 14b, 15, 16 e 24 não contam como atendidos
  E a F28 não é apresentada para aprovação final
  E as demais telas podem seguir sem esperar
```

**Fora do Gherkin, mas exigido pelo critério 18:** o anúncio (aria-live) do sucesso do pagamento e da mudança de status da parcela é anotado **no frame da F28**, porque a mudança aparece na tela do detalhe.

**Condicionais à confirmação da D3 e D4 (não escrevo cenário antes da decisão):** adicionar serviço ou peça com preço editável e congelado, remover item com confirmação, e configurar a geração de parcelas. Se a pessoa disser sim, abro `US-PROTO-OS-26` em diante.

## 8. Tarefas ajustadas (proposta; o card original não está no repositório)

| # | Tarefa | Mudança |
|---|---|---|
| 1 | Confirmar a aprovação da F39 | **Não feita:** não há linha "Aprovado" (seção 9) |
| 2 | Resolver ou registrar D2, D3, D4, D5 | Registradas na seção 6 com padrão adotado; **sem decisão da pessoa** |
| 3 a 8 | Identidade visual, lista, criar, detalhe, status, seção de parcelas | Sem mudança |
| 9 | ~~Montar o formulário de pagamento como componente~~ | **Reformulada:** "Usar a instância do formulário da F29 e montar o ponto de entrada e o retorno (critérios 14a, 14b, 15, 16, 24)". O mestre é tarefa da F29 |
| 10 | Navegação | Inclui o caminho parcela → formulário → detalhe |
| 11 a 13 | Contraste, i18n e aria-live, aprovação | Sem mudança |
| 14 *(nova)* | Conferir que o mestre da F29 existe e que a F28 o usa sem "detach" | Critérios 16 e 25 |

## 9. Estado de bloqueio e verificação da premissa 7

Li a seção 11 do PRD da F39 (`docs/product/F39-redesenho-wireframes-navegacao-figma.md`): a tabela "Registro de execução" tem uma única linha, "Aguardando entrega de ESQUADRO… Pendente". **Não há linha "Aprovado".** O próprio PRD diz que aprovação verbal não conta. O `docs/design/figma.md` repete, para F26 e F27, "a F39 ainda não está aprovada". O quadro marca a F39 como "Concluída": isso **contradiz** o que está no repositório. Peço ao REGENTE que concilie. A tarefa 1 fica **aberta**.

## 10. Dados pessoais (LGPD)

O protótipo usa só nome, telefone e placa fictícios. Em produção, o fluxo toca:

| Dado | Tela | Finalidade | Base legal prevista | Retenção |
|---|---|---|---|---|
| Nome do cliente | Lista, criar, detalhe da OS | Identificar o dono da OS e executar o serviço | Execução de contrato (LGPD, art. 7º, V) | **D8, sem prazo** |
| Placa do veículo | Lista, criar, detalhe da OS | Identificar o veículo atendido | Execução de contrato (art. 7º, V) | **D8, sem prazo** |
| Descrição do problema | Criar, detalhe | Registrar o serviço contratado | Execução de contrato (art. 7º, V) | **D8, sem prazo** |
| Valor, forma e data do pagamento | Seção de parcelas, formulário | Cobrança e controle financeiro | Execução de contrato (art. 7º, V) | **D8, sem prazo** |

- **Mínimo:** o formulário de pagamento **não** coleta número de cartão, dados de PIX nem de boleto. CARTAO e BOLETO são só rótulos da forma usada; o sistema registra, não cobra. Se alguma versão pedir esses dados, volta ao VIGIA.
- **Validação pendente:** a base legal e o prazo precisam da validação da pessoa responsável pela oficina. Registros financeiros podem ter prazo mínimo de guarda por obrigação legal; **não verifiquei isso** e não pus número. VIGIA e a oficina confirmam.
- **Log e teste:** nome, placa e valores não vão a log nem a ambiente de teste com dado real (padrão da casa).

## 11. Priorização e o que fica para depois

1. **P1, primeiro:** lista, detalhe com itens e totais, status e seção de parcelas (valor diário da atendente).
2. **P1, em seguida:** criar OS e o ponto de entrada do pagamento.
3. **P1 condicional:** adicionar e remover item e geração de parcelas (D3 e D4).
4. **Depois:** edição e estorno de pagamento, PDF, assinatura, WhatsApp, campo de data do pagamento (D9).

Tamanho (INVEST): a feature já é grande (cerca de 8 grupos de telas × 4 estados). Se D3 e D4 entrarem, passa de 3 dias. Divisão sugerida na D3.

## 12. Pedidos aos colegas e ao quadro

| Para | Pedido |
|---|---|
| **REGENTE** | Declarar a dependência F28 → F29 (só o componente). Conciliar a F39 "Concluída" com a ausência da linha "Aprovado" (seção 9). Responder à D10 (quem programa detalhe, status, parcelas e pagamento da OS) |
| **PRUMO** | Checar ordem de sprint e ciclo com a nova dependência |
| **ESQUADRO** | Seguir a seção 3.3; só desenhar quando a F39 for aprovada; usar o `docs/product/F29-recebido-da-F28-registro-pagamento.md` como entrada da F29 |
| **ESPRESSO (F20, F22)** | Fechar D2, D5 e D9 do lado da API |
| **VIGIA** | Validar a seção 10 com a oficina |
| **CRIVO** | Para 14a, 14b, 15, 16 e 24, conferir a camada INSTÂNCIA no Figma; sem Figma, dizer "não verificado" |

## 13. Registro de execução (aprovação)

| Data | Quem | Resultado | Pendências |
|---|---|---|---|
| — | — | **Não aprovado. Nenhum frame foi desenhado nesta etapa.** | F39 sem aprovação; D1 a D6, D9 a D11 abertas |

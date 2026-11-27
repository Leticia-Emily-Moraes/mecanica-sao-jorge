# Registro — critérios da F05 redistribuídos (7 a 29)

- Autora: BUSSOLA (Product Owner)
- Data: 2026-11-25
- Origem: card F05 (29 critérios, 10 tarefas), cortado para `GET /api/v1/servicos` por instrução do comandante e pela revisão humana de 24/11, 23:13.
- PRD que ficou na F05a: `docs/product/F05a-servicos-listar.md` (critérios 1 a 6).
- Estado: **registro de produto, sem código nem teste nesta etapa.** Os destinos F11, F12, F14, F15, F16 e F17 estão `Bloqueada` ou `Pronta` no panorama; **nenhum deles tem PRD próprio no repositório** (`docs/product/` não tem arquivo dessas features). Este documento é o que impede os critérios de ficarem órfãos. Quando cada feature escrever o PRD, ela copia as linhas dela daqui, mantendo os IDs.

## 1. Regras de leitura

- O **ID** (`US-SRV-07` etc.) não muda. Quem herda o critério usa o mesmo ID, para o teste rastrear até aqui.
- A coluna "O destino deve provar" é o que a revisão humana pediu para cada critério, mais a borda que o texto original deixava solta. O texto Gherkin completo de cada critério é o do card original; aqui só o resumo e a exigência de prova.
- "Premissa" e "Dúvida" usam os números do card original (P1 a P9, D1 a D5). A seção 3 diz para onde cada uma foi.
- Todo destino que expõe endpoint repete o cenário de **401** (US-SRV-05 está aberto fora de `GET /servicos`) e usa erro no formato do handler global.

## 2. Critérios 7 a 29

### Serviços: escrita (F11 e F12)

| Crit. | ID | Resumo | Dono | O destino deve provar | Herda |
|---|---|---|---|---|---|
| 7 | US-SRV-07 | `POST /api/v1/servicos` com nome, valor padrão e tempo em horas decimais (ex.: 1.5) válidos responde 201 com o serviço ativo e o id. | **F11** | Hoje o POST responde 405; a F11 troca por 201. Corpo traz `ativo=true` e `id`. | D4 (nome único) |
| 8 | US-SRV-08 | `POST` com nome em branco, valor negativo ou tempo menor ou igual a zero responde 400. | **F11** | 400 com mensagem de validação **por campo, em português**, e nada gravado (contar linhas antes e depois). | D4 |
| 9 | US-SRV-09 | `PUT /api/v1/servicos/{id}` válido responde 200 com os dados atualizados. | **F12** | 200 com dados novos; **id inexistente responde 404**. | D4 |
| 10 | US-SRV-10 | `PUT` com `ativo=false` tira o serviço de `GET /servicos?ativo=true`. | **F12** | Serviço usado em OS some do filtro de ativos **e a OS antiga mantém o valor congelado** (ler o valor da junção antes e depois da inativação). Premissa 3. Depende de existir OS com serviço (Sprint 04): se a OS ainda não existir, a F12 prova com linha inserida na junção e diz isso. | P3 |

### Peças: lista, criação, edição (F17, F14 e F15)

| Crit. | ID | Resumo | Dono | O destino deve provar | Herda |
|---|---|---|---|---|---|
| 11 | US-PEC-01 | `GET /api/v1/pecas?q=` por trecho do nome ou do código, 200, ordenado por nome, paginado. | **F17** | Busca por nome **e** por código, sem diferenciar caixa; paginação com o contrato do ADR-032 e do ADR-040 (mesmos nomes `itens`, `pagina`, `tamanho`, `totalItens`, `totalPaginas`). | P1, P5 |
| 12 | US-PEC-02 | Termo sem correspondência responde 200 com lista vazia e total 0. | **F17** | Igual ao US-SRV-02, sobre peças. | P1 |
| 13 | US-PEC-03 | Com estoque mínimo 5, quantidade 6, 5 e 4 dão `estoqueBaixo` false, true e true; a resposta traz quantidade e estoque mínimo. | **F17** | **Os três pontos de borda** (6, 5, 4 com mínimo 5), um caso cada. A resposta traz `quantidade` e `estoqueMinimo` em número, para o front escrever o alerta em texto, sem depender de cor. | D2 |
| 14 | US-PEC-04 | `POST /api/v1/pecas` válido responde 201, quantidade inicial vira estoque atual, histórico mostra ENTRADA "Estoque inicial". | **F14** | 201 com a quantidade inicial como estoque; **a D3 precisa de resposta antes de implementar** (ver seção 3). Se a resposta for "sim", o histórico (F16) mostra a ENTRADA. | P7, D3 |
| 15 | US-PEC-05 | Código já cadastrado (ignorando caixa e espaços nas pontas) responde 409 identificando o campo código. | **F14** | 409 com o campo `codigo` no erro e nada gravado. **Atenção à colisão de acento em `uq_pecas_codigo`**: com a collation `utf8mb4_0900_ai_ci` (V10, ADR-036), `ç` e `c` passam a ser o mesmo código, e o `CONVERT` falha se já houver dois códigos assim. Apontado pelo CARTOGRAFO; a F14 decide e prova com um caso de código que só difere no acento. | P4 |
| 16 | US-PEC-06 | Custo, preço, quantidade inicial ou mínimo negativos, nome ou código em branco: 400. | **F14** | 400 com **mensagem de validação por campo, em português**; um caso por campo. | — |
| 17 | US-PEC-07 | `PUT /api/v1/pecas/{id}` válido atualiza nome, custo, preço e mínimo; a quantidade fica igual. | **F15** | O teste lê a quantidade antes e depois e **prova que não mudou**. | P2 |
| 18 | US-PEC-08 | `PUT` com quantidade ou código no corpo responde 400. | **F15** | **Dois testes**: um com `quantidade` no corpo, outro com `codigo`; ambos 400 e nada alterado (ler a peça depois). | P2, P4 |
| 19 | US-PEC-09 | Id inexistente responde 404 no `PUT` de peça e nos endpoints de movimentação. | **F15** (PUT) e **F16** (movimentação) | **Teste dividido**: o 404 do `PUT` na F15; o 404 de `POST` e `GET /api/v1/pecas/{id}/movimentacoes` na F16. | — |

### Movimentação de estoque (F16)

| Crit. | ID | Resumo | Dono | O destino deve provar | Herda |
|---|---|---|---|---|---|
| 20 | US-EST-01 | `POST /api/v1/pecas/{id}/movimentacoes` ENTRADA de 5 sobre 10 responde 201, saldo 15. | **F16** | Saldo final 15 **e** o histórico com usuário, data, tipo, quantidade e motivo. | P8 |
| 21 | US-EST-02 | SAIDA de 4 sobre 10 deixa 6; se ficar igual ou abaixo do mínimo, `estoqueBaixo=true` na lista. | **F16** | **Borda: quantidade final igual ao estoque mínimo deve virar `estoqueBaixo=true`** (consulta `GET /pecas` depois da saída). | D2 |
| 22 | US-EST-03 | SAIDA de 4 sobre 3 responde 400. | **F16** | **Nada é gravado**: quantidade continua 3 e o histórico não ganha linha. | — |
| 23 | US-EST-04 | AJUSTE com quantidade final 8 sobre 10: saldo 8, histórico guarda delta -2. | **F16** | **Delta negativo**: saldo 10, contagem 8, delta -2 no histórico. Cobrir também delta positivo e delta zero (decisão da F16, ver nota abaixo). | P6 |
| 24 | US-EST-05 | Motivo ausente, vazio ou só espaços responde 400. | **F16** | **Três casos separados**: ausente, vazio, só espaços. Nada gravado. | — |
| 25 | US-EST-06 | Quantidade zero ou negativa em ENTRADA ou SAIDA, ou tipo fora de ENTRADA, SAIDA e AJUSTE: 400. | **F16** | **Quantidade zero, negativa e tipo fora do enum**, mensagem por campo. Tipo inválido não pode virar 500. | — |
| 26 | US-EST-07 | Duas SAIDA de 3 simultâneas sobre 5: uma aceita, outra 400, saldo 2. | **F16** | **Teste de concorrência com Testcontainers** (MySQL real, duas requisições ao mesmo tempo); saldo final **2, nunca negativo**; rodar o bastante para não depender de sorte (a F10 usou 100 rodadas, ver `F10-evidencia-corrida-100-rodadas.md`). | — |
| 27 | US-EST-08 | Corpo com outro usuário: grava o do JWT. | **F16** | O teste **manda outro usuário no corpo** e prova que o gravado é o do token. | P8 |
| 28 | US-EST-09 | `GET /api/v1/pecas/{id}/movimentacoes`: paginado, da mais recente para a mais antiga. | **F16** | **Ordem do mais recente ao mais antigo** e paginação (página intermediária, última, além do fim), com o contrato do ADR-040. | P5 |
| 29 | US-EST-10 | Histórico vazio: 200 e lista vazia; e-mail mascarado em qualquer log. | **F16** | 200 vazio; e **prova da máscara do e-mail com log real capturado, não por inspeção do código**. Junto vão o registro LGPD e a retenção permanente (seção 3). | P9, D1, D5 |

Nota sobre US-EST-04: o card só descreve o delta -2. Delta positivo e zero são bordas óbvias do mesmo comportamento; peço à F16 que decida se `delta 0` é aceito ou 400 e escreva isso no PRD dela. Não decidi.

## 3. Premissas e dúvidas do card, com dono

| Item do card | Assunto | Dono agora | Estado |
|---|---|---|---|
| P1 | Campos de busca (nome do serviço; nome ou código da peça), por trecho, sem diferenciar caixa | F05a (serviço, ampliada para acento, ver PRD premissa 1) e F17 (peça) | Em uso |
| P2 | Quantidade em estoque só muda por movimentação; `PUT` de peça com quantidade responde 400 | F15 e F16 | A herdar |
| P3 | Inativar serviço não exclui; OS antigas mantêm o valor congelado | F12 | A herdar |
| P4 | Código da peça é definido na criação e não é editável | F14 e F15 | A herdar |
| P5 | Paginação: `size` 20, máximo 100, acima disso 400 | F05a e F17 (ADR-032, ADR-040); F16 no histórico | Em uso |
| P6 | AJUSTE informa a quantidade final; o histórico guarda o delta calculado no service | F16 | A herdar |
| P7 | Quantidade inicial gera ENTRADA "Estoque inicial" | F14 | **Depende da D3** |
| P8 | Usuário responsável vem do token JWT, nunca do corpo; acessibilidade da tela é da F36 | F16 e F36 | A herdar |
| P9 | Retenção permanente do usuário e do timestamp da movimentação | F16 | Decidida em 12/11/2026 (D1) |
| D1 | Retenção do histórico | F16 | **Resolvida** em 12/11/2026: permanente, sem expurgo |
| D2 | Alerta de estoque mínimo precisa de destaque além da lista (ordenação no topo, filtro "só estoque baixo")? | **F17** | Aberta. Padrão: só o campo `estoqueBaixo` na lista, sem filtro nem ordenação especial |
| D3 | A movimentação inicial automática está correta, ou a quantidade inicial entra sem histórico? | **F14** | **Aberta e bloqueia a F14**: precisa de resposta da pessoa antes da implementação. Padrão proposto: ENTRADA "Estoque inicial", para o histórico fechar com o saldo |
| D4 | O nome do serviço deve ser único? | **F11** (e F12 na edição) | Aberta. Padrão: nomes repetidos aceitos. Atenção: se a resposta for "único", a V9 não tem índice único e a F11 precisa de migration nova |
| D5 | Como a retenção permanente convive com a saída de um funcionário (manter nome e e-mail, ou manter só a referência e anonimizar)? LGPD art. 15, 16 e 18, VI | **F16** | **Aberta, precisa fechar antes do endpoint de histórico ir para produção.** Padrão adotado: guardar só a referência ao usuário (id) no histórico e anonimizar nome e e-mail no desligamento; é a opção que menos coleta, mas é decisão da pessoa com o VIGIA |

### Dados pessoais que seguem para a F16

- **Dado:** usuário responsável (nome e e-mail do funcionário) e o timestamp da movimentação.
- **Finalidade:** rastreabilidade de quem alterou o estoque.
- **Base legal:** legítimo interesse do controle interno da oficina (LGPD art. 7, IX), acesso restrito ao time interno.
- **Retenção:** sem prazo, histórico permanente (decisão de 12/11/2026). Ressalva: o tratamento do dado pessoal do funcionário depois do desligamento depende da D5.
- **Logs e ambientes de teste:** e-mail do usuário mascarado, provado com log real (critério 29).
- Esta etapa não grava nada disso: a F05a não tem movimentação.

## 4. Tarefas 1 a 10 do card, repartidas

| # | Tarefa | F05a | F11 | F12 | F14 | F15 | F16 | F17 |
|---|---|---|---|---|---|---|---|---|
| 1 | Migration e matriz | `servicos.nome` (V9) | — | — | — | — | `movimentacoes_estoque.quantidade` | `pecas.nome` (V10) |
| 2 | Entidades | `Servico` | — | — | `Peca` | `Peca` | `MovimentacaoEstoque`, enum STRING | `Peca` |
| 3 | Repositories | busca por nome | — | — | — | — | consulta do histórico | busca por nome ou código |
| 4 | DTOs e mappers | lista de serviço | request e response de criação | request de edição | request de criação | request de edição | request e response de movimentação | lista de peça |
| 5 | Service de serviços | `listar` | `criar` | `editar`, ativar e inativar | — | — | — | — |
| 6 | Service de peças | — | — | — | criar (409) | editar sem quantidade | — | listar com `estoqueBaixo` |
| 7 | Service de movimentação, atômico | — | — | — | — | — | **sim** | — |
| 8 | Controllers | `GET` | `POST` | `PUT` | `POST` | `PUT` | `POST` e `GET` | `GET` |
| 9 | Testes | US-SRV-01 a 06 | US-SRV-07, 08 | US-SRV-09, 10 | US-PEC-04 a 06 | US-PEC-07 a 09 | US-PEC-09, US-EST-01 a 10 | US-PEC-01 a 03 |
| 10 | Máscara do e-mail em log | — | — | — | — | — | **sim** | — |

## 5. Ordem e dependências que este registro cria

Ordem de entrega que sigo no panorama: **F05a → F11 → F12**, e **F17 → F14 → F15 e F16**; a F36 espera todas e o protótipo F27.

- **F17 depende também da F05a** (usa `Paginacao` e a V9). O card diz só F00 e F02. Recomendo ao PRUMO corrigir.
- **F16 depende da F14** (precisa de peça criada) e, para a prova do histórico com `estoqueBaixo`, da F17.
- **F12 tem uma dependência fraca da Sprint 04**: provar que a OS antiga mantém o valor congelado pede OS com serviço. Sem ela, a prova é por linha inserida na junção (ver critério 10).
- **Baixa automática de estoque ao usar peça na OS** continua fora e vai à Sprint 04, como no card.

## 6. O que continua fora de toda a Sprint 03

Relatório de margem (custo contra preço de venda), fornecedor ou compra automática, edição ou estorno de movimentação já registrada, busca por categoria, rotina de expurgo do histórico (a retenção é permanente), telas (F36, depois do protótipo F27).

---
status: proposto   # 2026-11-19 proposto (F04, CARTOGRAFO); aguarda aceite formal da pessoa dona do produto
date: 2026-11-19
decision-makers: [CARTOGRAFO (Arquiteto), pessoa dona do produto (aceite)]
consulted: [BUSSOLA (PRD F04 rev 2, ajuste N4), VIGIA (revisão 8 da política), dono da F35 (tradução no app)]
informed: [ESPRESSO, CRIVO, PERGAMINHO, ORLA]
---

# Reportar erro de campo como `{campo, chave}` e usar chave i18n só no 400 de validação e no 409 de placa do veículo

## Contexto e problema

A F35 (app) precisa traduzir os erros do formulário de veículo e pediu chaves estáveis em vez de texto (`docs/product/F35-recebido-da-F04-veiculos.md`). O formato de erro do ADR-011 tem `mensagem` em texto e `erros[]` sempre presente. O código do commit `4becbb2` já usa `ErroCampo{campo, chave}` e cita este ADR, mas o arquivo não existia. A revisão humana de 18/11 (critério 25) restringiu o escopo: chave só no 400 de validação de campo (`veiculo.form.*`); erros de rota continuam com texto fixo. Pergunta: qual o contrato de `erros[]` e onde a chave vale?

## Fatores de decisão

* F1. Não quebrar o contrato já entregue de login, cliente (F03a a F03d) e F30: mesmos campos, mesmos textos.
* F2. A F35 traduz sem interpretar texto: chave estável, documentada, da lista `VeiculoChaves.TODAS`.
* F3. Nada de entrada do usuário refletido na resposta (texto de exceção, valor rejeitado).
* F4. Uma regra que o CRIVO confere por teste de contrato, sem exceção escondida.

## Opções consideradas

* A. `erros[]` = lista de `{campo, chave}`; `chave` preenchida só quando a mensagem do Bean Validation tem formato de chave (`^[a-z]+(\.[a-zA-Z]+)+$`), o que hoje só acontece no veículo; 409 de placa com `erros[0]` próprio; erros de rota com texto fixo e `erros: []`.
* B. Migrar tudo para RFC 9457 (`ProblemDetail`) com `type` por erro.
* C. Traduzir no servidor com `MessageSource` e `Accept-Language`.
* D. Manter como está: só texto em `mensagem`, `erros[]` sem chave.

## Resultado da decisão

Opção escolhida: "A", porque atende F2 para a F04 sem tocar o contrato de cliente e login (F1): mensagem de cliente é texto e não casa com o formato de chave, então a `chave` sai `null` ali, como o ADR-026 já fixou.

### Especificação normativa

1. `ErroCampo` = `{campo: string, chave: string|null}`; `erros` é sempre array (nunca `null`), ordenado por `campo` e depois `chave`.
2. **400 de validação de campo do veículo** (`MethodArgumentNotValidException` com `VeiculoRequest`): cada violação vira `{campo, chave}` com chave de `VeiculoChaves`; `mensagem` = as mensagens unidas por `; `.
3. **400 de tipo do `ano`** (corpo legível mas `ano` não inteiro): `{campo: "ano", chave: "veiculo.form.ano.tipo"}`, regra no ADR-028.
4. **409 de placa** (ADR-022): `mensagem` = `veiculo.form.placa.duplicada`, `erros` = `[{campo: "placa", chave: "veiculo.form.placa.duplicada"}]`.
5. **Erros de rota** ficam com texto fixo e `erros: []`: 400 de parâmetro de caminho (`@Positive`), 400 de corpo ilegível, 404, 405 e 415. Se a F35 pedir, viram uma chave constante por tipo de erro (ex.: `veiculo.rota.nao.encontrado`) em ADR novo; nunca chave montada com valor de entrada.
6. Chave nova exige: constante em `VeiculoChaves`, entrada em `VeiculoChaves.TODAS`, publicação em `docs/api/veiculos.md` e aviso ao dono da F35.
7. Cliente, login e F30: sem mudança; `chave` sai `null`.

### Consequências

* Bom, porque a F35 traduz sem parsear texto e o contrato antigo continua byte a byte.
* Ruim, porque o formato fica heterogêneo: veículo com chave, cliente sem. Unificar exige ADR novo e combinação com a F35.
* Ruim, porque depende de uma convenção de formato (regex) para decidir se a mensagem é chave; mensagem de cliente que casar por acaso viraria chave. Mitigado por teste de contrato do cliente.

### Confirmação

* `VeiculoIT` C25 (400 de validação com chaves), C25a (409 com `veiculo.form.placa.duplicada`), C25b e C20a (400 de `@Positive`, 404, 405 e 415 com texto fixo e `erros: []`), C26 (um erro por campo).
* Testes de contrato de cliente e login inalterados e passando.
* Teste unitário que confere que toda mensagem de `VeiculoRequest` está em `VeiculoChaves.TODAS`.

## Prós e contras das opções

### A. `{campo, chave}` só no veículo

* Bom, porque atende F1, F2, F3 e F4 sem mudar contrato antigo.
* Neutro, porque a regra do formato de chave é implícita e precisa de teste.
* Ruim, porque o formato fica heterogêneo entre recursos.

### B. RFC 9457 `ProblemDetail`

* Bom, porque é padrão de mercado e o Spring 7 suporta nativamente.
* Ruim, porque troca o corpo de todos os erros e quebra login, cliente e F30 (falha F1); exige migrar o app de uma vez.

### C. `MessageSource` no servidor

* Bom, porque o app mostraria texto pronto.
* Ruim, porque o app perde o controle da tradução e o texto ainda não é estável para teste (falha F2); adiciona arquivos de mensagem e cabeçalho novo.

### D. Manter só texto

* Bom, porque custo zero.
* Ruim, porque a F35 teria de interpretar texto, que muda sem aviso (falha F2).

## Mais informações

* Complementa ADR-011 (formato do erro) e ADR-026 (chave `null` no cliente). Usado por ADR-022 e ADR-028.
* PRD `docs/product/F04-veiculos.md` (N4, C25 a C26); contrato publicado em `docs/api/veiculos.md`.
* Revisitar quando a F35 pedir chave para erro de rota ou quando cliente migrar para chaves.

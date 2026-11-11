---
status: aceito
date: 2026-11-07
decision-makers: [CARTOGRAFO (Arquiteto)]
consulted: [ESPRESSO (Dev Java), CORRENTE (BD)]
informed: [REGENTE, CRIVO]
---

# Persistir enum de domínio como STRING

## Contexto e problema

Vários campos do domínio são enums: `perfil` (Usuario: ADMIN/FUNCIONARIO),
`status` da OS (ABERTA, EM_ANALISE, ...), `forma_pagamento` (DINHEIRO, PIX,
CARTAO, BOLETO), `tipo` de movimentação de estoque (ENTRADA, SAIDA, AJUSTE) e
`tipo` de lançamento financeiro (ENTRADA, SAIDA). O briefing determina "enum
persistido como STRING". Como representar esses enums no banco e no mapeamento
JPA?

## Fatores de decisão

* Restrição do briefing (enum persistido como STRING).
* Legibilidade do dado direto no banco (relatório, suporte, auditoria).
* Estabilidade frente a reordenação/adição de valores do enum no código.
* Portabilidade (não depender de tipo `ENUM` nativo do MySQL).

## Opções consideradas

* **Opção A — Coluna `VARCHAR` + `@Enumerated(EnumType.STRING)` no Java.**
* **Opção B — `@Enumerated(EnumType.ORDINAL)` (inteiro posicional).**
* **Opção C — Tipo `ENUM` nativo do MySQL.**

## Resultado da decisão

Opção escolhida: **"Opção A — VARCHAR + EnumType.STRING"**, porque cumpre o
briefing e é a única que combina legibilidade, estabilidade e portabilidade. No
banco, cada coluna de enum é `VARCHAR` (com `CHECK` onde já havia, como em
`usuarios.perfil`); no Java, o atributo usa `@Enumerated(EnumType.STRING)`,
nunca `ORDINAL`.

### Consequências

* Bom, porque o valor é legível no banco (`'ABERTA'`, não `2`).
* Bom, porque adicionar um valor novo ao enum não exige migration de dados, e reordenar os valores do enum Java não corrompe dados existentes.
* Neutro, porque ocupa mais bytes que um inteiro — irrelevante na escala de uma oficina pequena.
* Ruim, porque um valor inválido só é barrado por `CHECK`/validação de aplicação, não pelo tipo da coluna (aceitável; a app controla a escrita).

### Confirmação

* Migration (Testcontainers, ADR-010): colunas de enum são `VARCHAR`; nenhuma usa `ENUM` nativo.
* Revisão/teste: todo atributo de enum nas entidades tem `@Enumerated(EnumType.STRING)`; nenhum `ORDINAL` (busca no código).
* Critério US-FUND-02 e US-FUND-03 (cenários de enum como STRING).

## Prós e contras das opções

### Opção A — VARCHAR + STRING
* Bom, porque é legível, estável e portável.
* Bom, porque cumpre o briefing.
* Ruim, porque não impede valor inválido só pelo tipo (mitigado por CHECK/app).

### Opção B — ORDINAL
* Bom, porque ocupa menos espaço.
* Ruim, porque **viola o briefing**; reordenar o enum Java corrompe silenciosamente os dados; valor ilegível no banco.

### Opção C — ENUM nativo do MySQL
* Bom, porque valida o valor no banco.
* Ruim, porque adicionar valor exige `ALTER TABLE`; menos portável; mapeamento JPA desconfortável.

## Mais informações

Aplicada nas migrations de [[ADR-003-versionar-schema-com-flyway-migrations-aditivas]]
(já presente em `V1__criar_tabela_usuarios.sql`, `ck_usuarios_perfil`) e nas
entidades de [[ADR-007-nao-expor-entidade-na-api-dto-e-convencao-de-nomes]].

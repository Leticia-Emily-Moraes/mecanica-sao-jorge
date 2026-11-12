---
status: aceito
date: 2026-11-07
decision-makers: [CARTOGRAFO (Arquiteto)]
consulted: [CRIVO (QA), ANCORA (CI/CD), ESPRESSO (Dev Java)]
informed: [REGENTE]
---

# Testes de integração com Testcontainers rodando as migrations do zero

> Backfill: decisão da F00 já materializada (`FlywayMigrationIT`, Testcontainers
> no pom, failsafe em `verify`). Gravada agora para fechar o débito de ADR e
> resolver a referência "ADR-010" existente no `pom.xml`.

## Contexto e problema

A definição de pronto da operação exige "teste de integração usando
Testcontainers rodando todas as migrations do zero contra MySQL real no CI".
Como garantir que o schema migrado e o mapeamento JPA funcionam contra o banco
real, e não só contra um H2 em memória?

## Fatores de decisão

* Fidelidade: MySQL real valida tipos, colunas geradas (ADR-005) e enums VARCHAR (ADR-006) que o H2 não reproduz.
* Reprodutibilidade em local e CI sem banco compartilhado.
* Separação entre teste unitário rápido (`mvn test`) e integração (`mvn verify`).

## Opções consideradas

* **Opção A — Testcontainers com MySQL real, teste `*IT.java` na fase `verify` (failsafe).**
* **Opção B — Banco em memória H2 no modo compatível com MySQL.**
* **Opção C — MySQL compartilhado provisionado no CI.**

## Resultado da decisão

Opção escolhida: **"Opção A — Testcontainers + MySQL real"** (já aplicada pela
F00), porque é a única que valida com fidelidade o que o schema usa (coluna
gerada `STORED`, `VARCHAR` de enum, `GENERATED ALWAYS AS`), roda igual em local e
CI, e não depende de banco externo. Testes de integração são `*IT.java`, rodam
no `maven-failsafe-plugin` (fase `verify`), separados dos unitários do surefire
(`mvn test`). O `FlywayMigrationIT` sobe um container MySQL, aplica **todas** as
migrations do zero e valida o resultado.

### Consequências

* Bom, porque pega divergências de schema/migration que o H2 mascara.
* Bom, porque o CI reproduz exatamente o banco de produção-alvo (MySQL).
* Neutro, porque exige Docker disponível no runner (ANCORA garante no CI).
* Ruim, porque testes de integração são mais lentos que unitários; mitigado pela separação surefire/failsafe.

### Confirmação

* `mvn verify` sobe o container, aplica as migrations e o `FlywayMigrationIT` fica verde (US-FUND-02-02).
* Na F02, o IT passa a validar as 12 tabelas e as colunas geradas/enum.
* ANCORA garante Docker no CI.

## Prós e contras das opções

### Opção A — Testcontainers
* Bom, porque alta fidelidade e reprodutível.
* Neutro, porque exige Docker.
* Ruim, porque mais lento (aceitável em `verify`).

### Opção B — H2
* Bom, porque é rápido e sem Docker.
* Ruim, porque não reproduz coluna gerada, enum VARCHAR com CHECK, nem dialetos — daria falso verde.

### Opção C — MySQL compartilhado no CI
* Bom, porque é MySQL real.
* Ruim, porque estado compartilhado gera flakiness e acoplamento entre execuções.

## Mais informações

Verifica [[ADR-003-versionar-schema-com-flyway-migrations-aditivas]],
[[ADR-005-subtotais-da-os-como-coluna-gerada-no-banco]] e
[[ADR-006-persistir-enum-de-dominio-como-string]]. Config de CI é de ANCORA.
Arquivo: `apps/api/src/test/java/.../integration/FlywayMigrationIT.java`.

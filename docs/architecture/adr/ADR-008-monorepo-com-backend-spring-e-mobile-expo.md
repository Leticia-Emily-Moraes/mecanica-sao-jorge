---
status: aceito
date: 2026-11-07
decision-makers: [CARTOGRAFO (Arquiteto)]
consulted: [ESPRESSO (Dev Java), ORLA (Expo), ANCORA (CI/CD)]
informed: [REGENTE, CRIVO]
---

# Monorepo com backend Spring (apps/api) e mobile Expo (apps/mobile)

> Backfill: decisão da F00 já materializada no repositório (ver `README.md`,
> "docs/architecture ... pendente de commit"). Gravada agora pelo dono dos ADRs
> para fechar o débito de documentação e deixar a numeração íntegra.

## Contexto e problema

A operação entrega uma API REST (Java/Spring) e um app mobile (React
Native/Expo) que a consome. Como organizar os dois no versionamento: um
repositório por aplicação ou um monorepo?

## Fatores de decisão

* Equipe pequena, entrega coordenada backend+mobile por sprint.
* Facilidade de referência cruzada (contrato, `.env.example`, docs).
* Simplicidade de CI para dois runtimes distintos (Maven e Node/Expo).

## Opções consideradas

* **Opção A — Monorepo**: `apps/api` + `apps/mobile` + `docs/` na mesma raiz.
* **Opção B — Dois repositórios separados.**

## Resultado da decisão

Opção escolhida: **"Opção A — monorepo"** (já aplicada pela F00), porque mantém
backend, mobile e documentação de arquitetura/produto versionados juntos, com
uma única história de PRs por sprint, adequado a uma equipe pequena. Estrutura:
`apps/api` (Spring Boot 4.1, Java 21), `apps/mobile` (Expo), `docs/` (product,
architecture).

### Consequências

* Bom, porque um PR por feature full-stack cobre API e app juntos; docs ao lado do código.
* Bom, porque `.env.example` e contrato de API ficam visíveis aos dois lados.
* Neutro, porque o CI precisa de jobs separados por runtime (Maven vs. Node) — tratado por ANCORA.
* Ruim, porque versiona os dois ciclos juntos mesmo quando só um muda; aceitável nesta escala.

### Confirmação

Estrutura verificável na raiz (`apps/api`, `apps/mobile`, `docs/`); CI
(ANCORA) define jobs por diretório. README documenta o passo a passo de cada app.

## Prós e contras das opções

### Opção A — Monorepo
* Bom, porque centraliza código e docs; entrega coordenada.
* Neutro, porque exige CI por subdiretório.

### Opção B — Repositórios separados
* Bom, porque isola ciclos de release.
* Ruim, porque fragmenta contrato/docs e dobra a sobrecarga de coordenação numa equipe pequena.

## Mais informações

Base para [[ADR-001-organizar-pacotes-por-camada]] (estrutura interna de
`apps/api`). CI é responsabilidade de ANCORA.

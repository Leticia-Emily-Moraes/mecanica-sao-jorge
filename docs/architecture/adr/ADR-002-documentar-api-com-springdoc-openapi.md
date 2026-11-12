---
status: aceito
date: 2026-11-07
decision-makers: [CARTOGRAFO (Arquiteto)]
consulted: [ESPRESSO (Dev Java), PERGAMINHO (Docs/API)]
informed: [REGENTE, CRIVO, ANCORA]
---

# Documentar a API com springdoc-openapi, não com Springfox

## Contexto e problema

A API precisa publicar sua documentação OpenAPI/Swagger. O repositório de
referência externo (`mecanica-sao-jorge/backend`) usa **Springfox 2.9.2**,
projeto abandonado e incompatível com o namespace `jakarta.*` do Spring Boot
3+/4.x. O briefing determina a troca por springdoc-openapi. Qual biblioteca de
documentação adotar nesta fundação?

## Fatores de decisão

* Compatibilidade com Spring Boot 4.1.x e Jakarta EE (`jakarta.*`).
* Projeto mantido, com releases ativas.
* Geração automática a partir de controllers e DTOs, com UI navegável.
* Restrição do briefing (Springfox 2.9.2 sai do pom).

## Opções consideradas

* **Opção A — springdoc-openapi** (`springdoc-openapi-starter-webmvc-ui`).
* **Opção B — Springfox 2.9.2** (manter o do repositório de referência).
* **Opção C — Sem documentação automática** (escrever OpenAPI à mão).

## Resultado da decisão

Opção escolhida: **"Opção A — springdoc-openapi"**, porque é a única compatível
com Jakarta/Spring Boot 4.1, é mantida e cumpre o briefing. Em `op-002/apps/api`
**não há Springfox para remover** — o `pom.xml` já traz
`springdoc-openapi-starter-webmvc-ui` desde a F00; este ADR formaliza a decisão
e registra por que o Springfox foi rejeitado na origem.

### Consequências

* Bom, porque a documentação sobe junto da aplicação em `/swagger-ui.html` e o contrato em `/v3/api-docs`, sem manutenção manual.
* Bom, porque evita dívida de dependência abandonada e incompatível.
* Neutro, porque a UI exige declarar o esquema de segurança `bearer-jwt` (ADR-004) no `OpenApiConfig` para o botão "Authorize" funcionar.
* Ruim, porque adiciona dependência de runtime (UI) ao artefato; aceitável para uso interno.

### Confirmação

Subir a aplicação e acessar `/v3/api-docs` (200 com o JSON do contrato) e
`/swagger-ui.html`. Os caminhos `/v3/api-docs/**` e `/swagger-ui/**` já estão
liberados no `SecurityConfig`. Critério US-FUND-01-03 do PRD cobre isso.

## Prós e contras das opções

### Opção A — springdoc-openapi
* Bom, porque é compatível com Jakarta e Spring Boot 4.1.
* Bom, porque é mantido e gera contrato + UI automaticamente.
* Neutro, porque requer configurar o esquema de segurança para endpoints JWT.

### Opção B — Springfox 2.9.2
* Ruim, porque está abandonado (sem releases desde 2020).
* Ruim, porque usa `javax.*` e quebra em Jakarta/Spring Boot 4.
* Ruim, porque contraria o briefing.

### Opção C — OpenAPI manual
* Bom, porque dá controle total sobre o contrato.
* Ruim, porque o contrato desalinha do código à primeira mudança; alto custo para equipe pequena.

## Mais informações

Config em `apps/api/src/main/java/.../config/OpenApiConfig.java`. Vincula-se a
[[ADR-004-autenticacao-stateless-via-jwt-hs256]] e a PERGAMINHO, dono da
documentação de API.

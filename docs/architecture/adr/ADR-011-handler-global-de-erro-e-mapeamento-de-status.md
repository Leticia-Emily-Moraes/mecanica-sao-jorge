---
status: aceito
date: 2026-11-07
decision-makers: [CARTOGRAFO (Arquiteto)]
consulted: [ESPRESSO (Dev Java), VIGIA (AppSec/LGPD), PERGAMINHO (API)]
informed: [REGENTE, CRIVO, ORLA]
---

# Handler global de erro: formato único e mapeamento de status HTTP

## Contexto e problema

A operação exige "erro tratado pelo handler global no formato timestamp, status,
erro, mensagem e path". A F00 já criou `GlobalExceptionHandler`/`ErrorResponse`,
mas hoje devolve **422** para validação de entrada, enquanto a convenção e os
critérios da F02 pedem **400** para Bean Validation. Além disso, o 401 do
resource server (ADR-004) precisa sair no mesmo formato, não no desafio
`WWW-Authenticate` padrão do Spring. Como padronizar o corpo e os status?

## Fatores de decisão

* Formato único de erro em toda a API (timestamp, status, erro, mensagem, path).
* Semântica HTTP correta: entrada malformada vs. regra de negócio vs. autenticação.
* Critérios da F02 (US-AUTH-01-04 pede 400; US-AUTH-01-08 pede 401 no formato do handler).
* Não vazar stack trace nem distinguir "email" de "senha" em erro de login (LGPD/segurança).

## Opções consideradas

Para validação de entrada:
* **Opção A — 400 Bad Request** para `MethodArgumentNotValidException`.
* **Opção B — manter 422 Unprocessable Entity** (estado atual da F00).

Para o erro de autenticação:
* **Opção C — AuthenticationEntryPoint customizado** escrevendo o `ErrorResponse`.
* **Opção D — desafio `WWW-Authenticate` padrão do Spring.**

## Resultado da decisão

**Validação — Opção A (400)**: `MethodArgumentNotValidException` e correlatas de
entrada malformada/ausente passam a devolver **400 Bad Request**, com os campos
inválidos listados pelo Bean Validation. Como ainda não há endpoint de feature
publicado, mudar o handler global agora não quebra contrato de cliente.

**Erro de autenticação — Opção C (entry point customizado)**: um
`AuthenticationEntryPoint` escreve o mesmo `ErrorResponse` (401) e um
`AccessDeniedHandler` escreve 403, ambos no formato padrão. O desafio
`WWW-Authenticate` padrão é suprimido.

Mapeamento de status consolidado:
* **400** — `MethodArgumentNotValidException` / entrada inválida (Bean Validation).
* **401** — não autenticado / bearer token ausente, inválido ou expirado (entry point).
* **403** — autenticado sem permissão (access denied handler) — reservado; sem uso nesta fatia (ADMIN=FUNCIONARIO).
* **422** — `AppError` (regra de negócio violada com entrada bem-formada), ex.: credencial de login inválida.
* **500** — `Exception` inesperada, mensagem genérica, sem stack trace.

**Login — credencial inválida**: tratada como `AppError` → **401** (não 422),
com mensagem genérica única ("Credenciais inválidas") para email inexistente e
senha incorreta, sem distinguir os casos (US-AUTH-01-02/03). Observação: o 401
de credencial no login vem do fluxo de autenticação (não do entry point de
bearer token), mas usa o mesmo formato de corpo.

### Consequências

* Bom, porque todo erro — validação, negócio, auth, inesperado — sai no mesmo formato, previsível para o app (ORLA).
* Bom, porque o status passa a ter semântica correta (400 para entrada malformada).
* Bom, porque o 401 do resource server deixa de ser o desafio opaco do Spring.
* Ruim, porque muda o status de validação de 422 para 400 em todo o projeto — aceitável agora (sem endpoint de feature publicado); exige atualizar o `GlobalExceptionHandlerTest`.
* Neutro, porque mantém `AppError` em 422 para regra de negócio, distinta de validação.

### Confirmação

* Teste (MockMvc): `POST /api/v1/auth/login` sem email/senha → 400 com campos listados; credencial inválida → 401 com mensagem genérica idêntica nos dois casos; rota protegida sem token → 401 no formato `ErrorResponse`.
* `GlobalExceptionHandlerTest` atualizado para 400 na validação.
* Nenhuma resposta de erro contém stack trace nem distingue email/senha.

## Prós e contras das opções

### Validação: Opção A (400) vs Opção B (422)
* A — Bom, porque é a semântica esperada pela convenção/critérios e pela maioria dos clientes REST. Ruim, porque muda o comportamento atual (teste a ajustar).
* B — Bom, porque é o estado atual (sem mudança). Ruim, porque contraria os critérios da F02 e a convenção da casa.

### Auth: Opção C (entry point) vs Opção D (padrão Spring)
* C — Bom, porque unifica o formato de erro. Neutro, porque exige um bean a mais.
* D — Bom, porque é zero código. Ruim, porque devolve corpo/headers fora do padrão, falhando US-AUTH-01-08.

## Mais informações

Formaliza o handler criado na F00 (`exception/GlobalExceptionHandler.java`,
`ErrorResponse.java`, `AppError.java`) e resolve a Dúvida 5 do PRD da F02.
Integra-se a [[ADR-004-autenticacao-stateless-via-jwt-hs256]] (entry point do
401) e [[ADR-001-organizar-pacotes-por-camada]] (pacote `exception`).

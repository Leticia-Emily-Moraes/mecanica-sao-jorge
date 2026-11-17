# Rascunho de feature: JSON malformado e Content-Type errado no login

Status: rascunho para a pessoa refinar. Precisa de número e de lugar no quadro antes da F03a (decisão da revisão humana de 2026-11-16). Não segue ainda o padrão de refinamento completo: falta dono e dúvidas fechadas.

## Contexto

O CRIVO reproduziu em `POST /api/v1/auth/login` (ver `F44-qa-crivo-2026-11-16.md`):

- corpo com JSON malformado devolve **500**;
- `Content-Type` diferente de `application/json` devolve **500**.

O esperado pelo ADR-011 (handler global) é 400 para corpo ilegível e 415 para tipo de mídia não suportado, no formato `timestamp, status, erro, mensagem, path`.

## Objetivo

Mapear `HttpMessageNotReadableException` para 400 e `HttpMediaTypeNotSupportedException` para 415 no `GlobalExceptionHandler`, sem vazar stack trace nem trecho do corpo (o corpo do login carrega senha).

## Dentro do escopo

- Dois handlers novos em `exception/` e testes de `GlobalExceptionHandlerTest` e de `AuthControllerTest` (MockMvc).
- Mensagem genérica, sem eco do corpo recebido.

## Fora do escopo

- Qualquer outro endpoint novo; mudança de regra de autenticação.

## Critérios (rascunho)

- US-ERR-01: Dado um corpo JSON malformado, Quando chamo o login, Então recebo 400 no formato do handler global, sem trecho do corpo.
- US-ERR-02: Dado `Content-Type: text/plain`, Quando chamo o login, Então recebo 415 no formato do handler global.
- US-ERR-03: Dado qualquer um dos dois erros, Quando leio o log, Então não há senha nem corpo da requisição.

## Dúvidas em aberto

1. Número e sprint da feature.
2. Ajustar também o 500 de outros verbos/rotas, ou só o handler global (que cobre todos)?

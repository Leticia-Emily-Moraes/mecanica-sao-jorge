package br.com.mecanicasaojorge.api.exception;

import java.time.OffsetDateTime;

/** Formato publico de erro (ADR-011): timestamp, status, erro, mensagem, path. */
public record ErrorResponse(
    OffsetDateTime timestamp, int status, String erro, String mensagem, String path) {}

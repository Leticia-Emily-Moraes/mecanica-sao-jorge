package br.com.mecanicasaojorge.api.exception;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * Formato publico de erro (ADR-011): timestamp, status, erro, mensagem, path. {@code erros}
 * acrescenta campo e chave i18n por erro (ADR-023) e vem sempre presente, vazio quando nao ha erro
 * de campo.
 */
public record ErrorResponse(
    OffsetDateTime timestamp,
    int status,
    String erro,
    String mensagem,
    String path,
    List<ErroCampo> erros) {

  public ErrorResponse {
    erros = erros == null ? List.of() : List.copyOf(erros);
  }

  public ErrorResponse(
      OffsetDateTime timestamp, int status, String erro, String mensagem, String path) {
    this(timestamp, status, erro, mensagem, path, List.of());
  }
}

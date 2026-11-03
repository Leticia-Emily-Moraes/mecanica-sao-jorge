package br.com.mecanicasaojorge.api.exception;

import lombok.Getter;

/**
 * Base para erros de dominio. Cada feature cria sua propria subclasse com um {@code code} estavel
 * (ex.: {@code "CLIENTE_CPF_DUPLICADO"}) e uma mensagem acionavel em portugues.
 */
@Getter
public abstract class AppError extends RuntimeException {

  private final String code;

  protected AppError(String code, String message) {
    super(message);
    this.code = code;
  }
}

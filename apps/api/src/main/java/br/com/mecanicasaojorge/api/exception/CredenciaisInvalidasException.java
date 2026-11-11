package br.com.mecanicasaojorge.api.exception;

/**
 * Login com email ou senha incorretos (ADR-011). Mensagem generica unica para os dois casos — a API
 * nunca indica se o email existe (US-AUTH-01-02/03).
 */
public class CredenciaisInvalidasException extends AppError {

  private static final String CODE = "AUTH_CREDENCIAIS_INVALIDAS";
  private static final String MESSAGE = "Credenciais inválidas";

  public CredenciaisInvalidasException() {
    super(CODE, MESSAGE);
  }
}

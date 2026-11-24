package br.com.mecanicasaojorge.api.exception;

/**
 * Recurso de dominio inexistente (ADR-019): vira 404 no handler global. A subclasse fixa a mensagem
 * e nao recebe id nem dado da requisicao.
 */
public abstract class RecursoNaoEncontradoException extends AppError {

  protected RecursoNaoEncontradoException(String code, String message) {
    super(code, message);
  }
}

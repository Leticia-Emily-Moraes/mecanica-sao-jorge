package br.com.mecanicasaojorge.api.exception;

/** Cliente inexistente para o id pedido (ADR-019). Mensagem fixa, sem o id. */
public class ClienteNaoEncontradoException extends RecursoNaoEncontradoException {

  private static final String CODE = "CLIENTE_NAO_ENCONTRADO";
  private static final String MESSAGE = "Cliente nao encontrado";

  public ClienteNaoEncontradoException() {
    super(CODE, MESSAGE);
  }
}

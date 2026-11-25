package br.com.mecanicasaojorge.api.exception;

/** Veiculo inexistente para o id pedido (ADR-019). Mensagem fixa, sem o id. */
public class VeiculoNaoEncontradoException extends RecursoNaoEncontradoException {

  private static final String CODE = "VEICULO_NAO_ENCONTRADO";
  private static final String MESSAGE = "Veiculo nao encontrado";

  public VeiculoNaoEncontradoException() {
    super(CODE, MESSAGE);
  }
}

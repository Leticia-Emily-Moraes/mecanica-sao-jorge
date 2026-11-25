package br.com.mecanicasaojorge.api.exception;

/** CPF ja pertence a outro cliente (indice {@code uk_clientes_cpf}, ADR-020). */
public class CpfJaCadastradoException extends ConflitoException {

  public static final String MENSAGEM = "CPF ja cadastrado";

  public CpfJaCadastradoException() {
    super(MENSAGEM);
  }
}

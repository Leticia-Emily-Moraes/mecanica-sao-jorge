package br.com.mecanicasaojorge.api.exception;

/** Email ja pertence a outro cliente (indice {@code uk_clientes_email}, ADR-026). */
public class EmailJaCadastradoException extends ConflitoException {

  public static final String MENSAGEM = "Email ja cadastrado";

  public EmailJaCadastradoException() {
    super(MENSAGEM);
  }
}

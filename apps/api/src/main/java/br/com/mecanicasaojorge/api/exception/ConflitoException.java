package br.com.mecanicasaojorge.api.exception;

import java.util.List;

/**
 * Conflito com o estado atual de um recurso (ADR-020): vira 409 no handler global. A subclasse fixa
 * a mensagem; nao recebe causa nem dado da requisicao, porque a causa de persistencia carrega o
 * valor duplicado. Pode apontar o campo em conflito (campo e chave i18n fixos, ADR-023).
 */
public abstract class ConflitoException extends RuntimeException {

  private final transient List<ErroCampo> erros;

  protected ConflitoException(String message) {
    this(message, List.of());
  }

  protected ConflitoException(String message, ErroCampo erro) {
    this(message, List.of(erro));
  }

  private ConflitoException(String message, List<ErroCampo> erros) {
    super(message, null, false, false);
    this.erros = erros;
  }

  public List<ErroCampo> getErros() {
    return erros;
  }
}

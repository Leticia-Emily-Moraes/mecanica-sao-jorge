package br.com.mecanicasaojorge.api.exception;

/**
 * Conflito com o estado atual de um recurso (ADR-020): vira 409 no handler global. A subclasse fixa
 * a mensagem; nao recebe causa nem dado da requisicao, porque a causa de persistencia carrega o
 * valor duplicado.
 */
public abstract class ConflitoException extends RuntimeException {

  protected ConflitoException(String message) {
    super(message, null, false, false);
  }
}

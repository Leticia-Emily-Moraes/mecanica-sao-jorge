package br.com.mecanicasaojorge.api.service;

/** Regra do alerta de estoque minimo (ADR-035). Funcao pura, reaproveitada pela F16. */
final class EstoqueMinimo {

  private EstoqueMinimo() {}

  /** Estoque baixo quando a quantidade atingiu ou ficou abaixo do minimo. */
  static boolean atingido(int quantidadeEstoque, int estoqueMinimo) {
    return quantidadeEstoque <= estoqueMinimo;
  }
}

package br.com.mecanicasaojorge.api.service;

import java.util.List;
import java.util.function.Function;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * Montagem de pagina compartilhada pelas listagens com busca (ADR-032). Funcao pura: nao valida
 * {@code page} e {@code size} (o controller ja validou) e nao loga.
 */
final class Paginacao {

  private Paginacao() {}

  /**
   * O Spring Data lanca excecao quando {@code page * size} passa de {@link Integer#MAX_VALUE}
   * (offset convertido para int). Alem desse ponto nao existe item, entao a consulta roda so para o
   * total, com uma pagina de 1 item, e a pagina pedida volta vazia (ADR-017, O3).
   */
  static <E> Page<E> paginar(int page, int size, Sort ordem, Function<Pageable, Page<E>> consulta) {
    if ((long) page * size > Integer.MAX_VALUE) {
      long total = consulta.apply(PageRequest.of(0, 1, ordem)).getTotalElements();
      return new PageImpl<>(List.of(), PageRequest.of(page, size, ordem), total);
    }
    return consulta.apply(PageRequest.of(page, size, ordem));
  }
}

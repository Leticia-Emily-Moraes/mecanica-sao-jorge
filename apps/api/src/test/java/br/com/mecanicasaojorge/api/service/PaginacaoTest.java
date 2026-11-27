package br.com.mecanicasaojorge.api.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

class PaginacaoTest {

  private static final Sort ORDEM = Sort.by(Sort.Order.asc("nome"), Sort.Order.asc("id"));

  @Test
  void shouldCallQueryWithRequestedPageWhenOffsetFitsInInteger() {
    List<Pageable> recebidos = new ArrayList<>();

    Page<String> resultado =
        Paginacao.paginar(
            2,
            10,
            ORDEM,
            pageable -> {
              recebidos.add(pageable);
              return new PageImpl<>(List.of("a"), pageable, 21);
            });

    assertThat(recebidos).containsExactly(PageRequest.of(2, 10, ORDEM));
    assertThat(resultado.getContent()).containsExactly("a");
    assertThat(resultado.getTotalElements()).isEqualTo(21);
  }

  @Test
  void shouldReturnEmptyPageWithRealTotalWhenOffsetExceedsIntegerMax() {
    List<Pageable> recebidos = new ArrayList<>();

    Page<String> resultado =
        Paginacao.paginar(
            Integer.MAX_VALUE,
            100,
            ORDEM,
            pageable -> {
              recebidos.add(pageable);
              return new PageImpl<>(List.of("a"), pageable, 25);
            });

    assertThat(recebidos).containsExactly(PageRequest.of(0, 1, ORDEM));
    assertThat(resultado.getContent()).isEmpty();
    assertThat(resultado.getTotalElements()).isEqualTo(25);
    assertThat(resultado.getNumber()).isEqualTo(Integer.MAX_VALUE);
    assertThat(resultado.getSize()).isEqualTo(100);
  }

  @Test
  void shouldNotShortCircuitWhenOffsetIsExactlyIntegerMax() {
    List<Pageable> recebidos = new ArrayList<>();

    Paginacao.paginar(
        Integer.MAX_VALUE,
        1,
        ORDEM,
        pageable -> {
          recebidos.add(pageable);
          return Page.empty(pageable);
        });

    assertThat(recebidos).containsExactly(PageRequest.of(Integer.MAX_VALUE, 1, ORDEM));
  }
}

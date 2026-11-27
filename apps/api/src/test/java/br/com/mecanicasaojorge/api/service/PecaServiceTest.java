package br.com.mecanicasaojorge.api.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import br.com.mecanicasaojorge.api.dto.PaginaResponse;
import br.com.mecanicasaojorge.api.dto.PecaListResponse;
import br.com.mecanicasaojorge.api.entity.Peca;
import br.com.mecanicasaojorge.api.mapper.PecaMapper;
import br.com.mecanicasaojorge.api.repository.PecaRepository;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class PecaServiceTest {

  @Mock private PecaRepository pecaRepository;

  private PecaService pecaService;

  @BeforeEach
  void setUp() {
    PecaMapper mapper = Mappers.getMapper(PecaMapper.class);
    pecaService = new PecaService(pecaRepository, mapper);
  }

  @Test
  void shouldFlagLowStockWhenQuantityEqualsMinimum() {
    assertThat(listarUma(5, 5).estoqueBaixo()).isTrue();
  }

  @Test
  void shouldFlagLowStockWhenQuantityIsBelowMinimum() {
    assertThat(listarUma(2, 5).estoqueBaixo()).isTrue();
  }

  @Test
  void shouldNotFlagLowStockWhenQuantityIsAboveMinimum() {
    assertThat(listarUma(6, 5).estoqueBaixo()).isFalse();
  }

  @Test
  void shouldFlagLowStockWhenMinimumAndQuantityAreZero() {
    assertThat(listarUma(0, 0).estoqueBaixo()).isTrue();
  }

  @Test
  void shouldMapOnlyContractFieldsWhenListing() {
    PecaListResponse item = listarUma(6, 5);

    assertThat(item.id()).isEqualTo(1L);
    assertThat(item.nome()).isEqualTo("Filtro de óleo");
    assertThat(item.codigo()).isEqualTo("FO-100");
    assertThat(item.precoVenda()).isEqualByComparingTo("25.00");
    assertThat(item.quantidadeEstoque()).isEqualTo(6);
    assertThat(item.estoqueMinimo()).isEqualTo(5);
    assertThat(PecaListResponse.class.getRecordComponents()).hasSize(7);
  }

  @Test
  void shouldPassNullPatternWhenTermIsBlank() {
    given(pecaRepository.buscar(any(), any(Pageable.class))).willReturn(Page.empty());

    PaginaResponse<PecaListResponse> resposta = pecaService.listar("   ", 0, 20, "7");

    assertThat(resposta.itens()).isEmpty();
    verify(pecaRepository).buscar(eq(null), any(Pageable.class));
  }

  @Test
  void shouldTrimEscapeWildcardsAndOrderByNameThenIdWhenListing() {
    given(pecaRepository.buscar(any(), any(Pageable.class))).willReturn(Page.empty());

    pecaService.listar("  100%_!  ", 2, 10, "7");

    ArgumentCaptor<Pageable> pageable = ArgumentCaptor.forClass(Pageable.class);
    verify(pecaRepository).buscar(eq("%100!%!_!!%"), pageable.capture());
    assertThat(pageable.getValue().getPageNumber()).isEqualTo(2);
    assertThat(pageable.getValue().getPageSize()).isEqualTo(10);
    assertThat(pageable.getValue().getSort().toString()).isEqualTo("nome: ASC,id: ASC");
  }

  private PecaListResponse listarUma(int quantidade, int minimo) {
    Peca peca =
        Peca.builder()
            .id(1L)
            .nome("Filtro de óleo")
            .codigo("FO-100")
            .custo(new BigDecimal("10.00"))
            .precoVenda(new BigDecimal("25.00"))
            .quantidadeEstoque(quantidade)
            .estoqueMinimo(minimo)
            .ativo(true)
            .build();
    given(pecaRepository.buscar(any(), any(Pageable.class)))
        .willReturn(new PageImpl<>(List.of(peca), PageRequest.of(0, 20), 1));

    return pecaService.listar(null, 0, 20, "7").itens().get(0);
  }
}

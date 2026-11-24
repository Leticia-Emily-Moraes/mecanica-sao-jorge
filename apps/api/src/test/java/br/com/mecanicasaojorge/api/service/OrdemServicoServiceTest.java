package br.com.mecanicasaojorge.api.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.mecanicasaojorge.api.dto.OrdemServicoListResponse;
import br.com.mecanicasaojorge.api.dto.PaginaResponse;
import br.com.mecanicasaojorge.api.entity.Cliente;
import br.com.mecanicasaojorge.api.entity.OrdemServico;
import br.com.mecanicasaojorge.api.entity.StatusOS;
import br.com.mecanicasaojorge.api.entity.Veiculo;
import br.com.mecanicasaojorge.api.mapper.OrdemServicoMapper;
import br.com.mecanicasaojorge.api.repository.OrdemServicoRepository;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.mockito.ArgumentCaptor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/** Montagem da pagina, normalizacao do termo e ordenacao fixa da lista de OS (ADR-037). */
class OrdemServicoServiceTest {

  private final OrdemServicoRepository repository = mock(OrdemServicoRepository.class);
  private final OrdemServicoMapper mapper = Mappers.getMapper(OrdemServicoMapper.class);
  private final OrdemServicoService service = new OrdemServicoService(repository, mapper);

  @Test
  void shouldPassNullPatternsAndFixedSortWhenThereIsNoFilter() {
    when(repository.buscar(any(), any(), any(), any())).thenReturn(Page.empty());

    service.listar(null, "   ", 0, 20, "u1");

    ArgumentCaptor<Pageable> pageable = ArgumentCaptor.forClass(Pageable.class);
    verify(repository).buscar(isNull(), isNull(), isNull(), pageable.capture());
    assertThat(pageable.getValue().getSort())
        .isEqualTo(Sort.by(Sort.Order.desc("dataAbertura"), Sort.Order.desc("id")));
  }

  @Test
  void shouldPassStatusAndNormalizedPatternsWhenFilterAndTermAreGiven() {
    when(repository.buscar(any(), any(), any(), any())).thenReturn(Page.empty());

    service.listar(StatusOS.ABERTA, " abc-12 ", 1, 10, "u1");

    ArgumentCaptor<Pageable> pageable = ArgumentCaptor.forClass(Pageable.class);
    verify(repository)
        .buscar(
            org.mockito.ArgumentMatchers.eq(StatusOS.ABERTA),
            org.mockito.ArgumentMatchers.eq("%abc-12%"),
            org.mockito.ArgumentMatchers.eq("%ABC12%"),
            pageable.capture());
    assertThat(pageable.getValue().getPageNumber()).isEqualTo(1);
    assertThat(pageable.getValue().getPageSize()).isEqualTo(10);
  }

  @Test
  void shouldMapOrderWithMinimalClientAndVehicleWhenListing() {
    Cliente cliente = Cliente.builder().id(7L).nome("Ana Exemplo").cpf("12345678901").build();
    Veiculo veiculo = Veiculo.builder().id(12L).placa("ABC1D23").modelo("Gol").marca("VW").build();
    OrdemServico ordem =
        OrdemServico.builder()
            .id(101L)
            .cliente(cliente)
            .veiculo(veiculo)
            .status(StatusOS.ABERTA)
            .valorTotal(new BigDecimal("0.00"))
            .dataAbertura(OffsetDateTime.of(2026, 11, 24, 9, 30, 0, 0, ZoneOffset.ofHours(-3)))
            .build();
    when(repository.buscar(any(), any(), any(), any()))
        .thenReturn(new PageImpl<>(List.of(ordem), PageRequest.of(0, 20), 1));

    PaginaResponse<OrdemServicoListResponse> pagina = service.listar(null, null, 0, 20, "u1");

    OrdemServicoListResponse item = pagina.itens().get(0);
    assertThat(item.dataAbertura().toString()).isEqualTo("2026-11-24T12:30:00Z");
    assertThat(item.previsaoEntrega()).isNull();
    assertThat(item.cliente().nome()).isEqualTo("Ana Exemplo");
    assertThat(item.veiculo().placa()).isEqualTo("ABC1D23");
    assertThat(item.toString()).doesNotContain("Ana", "ABC1D23");
    assertThat(pagina.totalItens()).isEqualTo(1);
  }
}

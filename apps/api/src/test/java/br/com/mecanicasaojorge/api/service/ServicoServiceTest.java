package br.com.mecanicasaojorge.api.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import br.com.mecanicasaojorge.api.dto.PaginaResponse;
import br.com.mecanicasaojorge.api.dto.ServicoListResponse;
import br.com.mecanicasaojorge.api.entity.Servico;
import br.com.mecanicasaojorge.api.mapper.ServicoMapper;
import br.com.mecanicasaojorge.api.repository.ServicoRepository;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class ServicoServiceTest {

  @Mock private ServicoRepository servicoRepository;
  @Mock private ServicoMapper servicoMapper;

  private ServicoService servicoService;
  private ListAppender<ILoggingEvent> logs;
  private Logger logger;

  @BeforeEach
  void setUp() {
    servicoService = new ServicoService(servicoRepository, servicoMapper);
    logger = (Logger) LoggerFactory.getLogger(ServicoService.class);
    logs = new ListAppender<>();
    logs.start();
    logger.addAppender(logs);
  }

  @AfterEach
  void tearDown() {
    logger.detachAppender(logs);
  }

  @Test
  void shouldPassNullPatternAndNullActiveWhenTermAndFilterAreAbsent() {
    given(servicoRepository.buscar(any(), any(), any(Pageable.class))).willReturn(Page.empty());

    PaginaResponse<ServicoListResponse> resposta = servicoService.listar("   ", null, 0, 20, "7");

    assertThat(resposta.itens()).isEmpty();
    verify(servicoRepository).buscar(eq(null), eq(null), any(Pageable.class));
  }

  @Test
  void shouldEscapeWildcardsAndOrderByNameThenIdWhenListing() {
    given(servicoRepository.buscar(any(), any(), any(Pageable.class))).willReturn(Page.empty());

    servicoService.listar("100%_!", true, 2, 10, "7");

    ArgumentCaptor<Pageable> pageable = ArgumentCaptor.forClass(Pageable.class);
    verify(servicoRepository).buscar(eq("%100!%!_!!%"), eq(true), pageable.capture());
    assertThat(pageable.getValue().getPageNumber()).isEqualTo(2);
    assertThat(pageable.getValue().getPageSize()).isEqualTo(10);
    assertThat(pageable.getValue().getSort().toString()).isEqualTo("nome: ASC,id: ASC");
  }

  @Test
  void shouldMapItemsAndKeepTotalsWhenListing() {
    Servico servico = Servico.builder().id(3L).nome("Troca de Óleo").ativo(true).build();
    ServicoListResponse item =
        new ServicoListResponse(3L, "Troca de Óleo", new BigDecimal("60.00"), null, true);
    given(servicoRepository.buscar(any(), any(), any(Pageable.class)))
        .willReturn(new PageImpl<>(List.of(servico), PageRequest.of(0, 20), 1));
    given(servicoMapper.toListResponse(servico)).willReturn(item);

    PaginaResponse<ServicoListResponse> resposta = servicoService.listar("oleo", null, 0, 20, "7");

    assertThat(resposta.itens()).containsExactly(item);
    assertThat(resposta.totalItens()).isEqualTo(1);
    assertThat(resposta.totalPaginas()).isEqualTo(1);
  }

  @Test
  void shouldLogLengthAndUserButNeverTheTermWhenListing() {
    given(servicoRepository.buscar(any(), any(), any(Pageable.class))).willReturn(Page.empty());

    servicoService.listar("segredo", false, 0, 20, "7");

    assertThat(logs.list).hasSize(1);
    assertThat(logs.list.get(0).getFormattedMessage())
        .isEqualTo("servicos.listar qLen=7 ativo=false page=0 size=20 total=0 usuarioId=7")
        .doesNotContain("segredo");
  }
}

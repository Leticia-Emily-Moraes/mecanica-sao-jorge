package br.com.mecanicasaojorge.api.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import br.com.mecanicasaojorge.api.dto.ClienteListResponse;
import br.com.mecanicasaojorge.api.dto.PaginaResponse;
import br.com.mecanicasaojorge.api.entity.Cliente;
import br.com.mecanicasaojorge.api.mapper.ClienteMapper;
import br.com.mecanicasaojorge.api.repository.ClienteRepository;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ClienteServiceTest {

  @Mock private ClienteRepository clienteRepository;
  @Mock private ClienteMapper clienteMapper;

  private ClienteService clienteService;
  private ListAppender<ILoggingEvent> logs;
  private Logger logger;

  @BeforeEach
  void setUp() {
    clienteService = new ClienteService(clienteRepository, clienteMapper);
    logger = (Logger) LoggerFactory.getLogger(ClienteService.class);
    logs = new ListAppender<>();
    logs.start();
    logger.addAppender(logs);
    given(clienteMapper.toListResponse(any(Cliente.class)))
        .willAnswer(
            inv -> {
              Cliente c = inv.getArgument(0);
              return new ClienteListResponse(c.getId(), c.getNome(), c.getTelefone(), c.getEmail());
            });
  }

  @AfterEach
  void tearDown() {
    logger.detachAppender(logs);
  }

  @Test
  void shouldListWithoutFilterWhenTermIsBlank() {
    given(clienteRepository.findAll(any(Pageable.class)))
        .willReturn(new PageImpl<>(List.of(cliente(1L, "Ana")), PageRequest.of(0, 20), 1));

    PaginaResponse<ClienteListResponse> resposta = clienteService.listar("   ", 0, 20, "7");

    assertThat(resposta.itens()).extracting(ClienteListResponse::nome).containsExactly("Ana");
    assertThat(resposta.totalItens()).isEqualTo(1);
    verify(clienteRepository, never()).buscar(any(), any(), any());
  }

  @Test
  void shouldOrderByNameThenIdWhenListing() {
    given(clienteRepository.findAll(any(Pageable.class))).willReturn(Page.empty());

    clienteService.listar(null, 2, 10, "7");

    ArgumentCaptor<Pageable> captor = ArgumentCaptor.forClass(Pageable.class);
    verify(clienteRepository).findAll(captor.capture());
    Pageable pageable = captor.getValue();
    assertThat(pageable.getPageNumber()).isEqualTo(2);
    assertThat(pageable.getPageSize()).isEqualTo(10);
    assertThat(pageable.getSort().stream().map(o -> o.getProperty() + ":" + o.getDirection()))
        .containsExactly("nome:ASC", "id:ASC");
  }

  @Test
  void shouldSearchWithEscapedPatternAndPhoneDigitsWhenTermHasMaskAndWildcard() {
    given(clienteRepository.buscar(any(), any(), any(Pageable.class))).willReturn(Page.empty());

    clienteService.listar("(11) 9_8", 0, 20, "7");

    verify(clienteRepository).buscar(eq("%(11) 9!_8%"), eq("%1198%"), any(Pageable.class));
  }

  @Test
  void shouldPassNullPhoneWhenTermHasNoDigit() {
    given(clienteRepository.buscar(any(), any(), any(Pageable.class))).willReturn(Page.empty());

    clienteService.listar("ana", 0, 20, "7");

    verify(clienteRepository).buscar(eq("%ana%"), eq(null), any(Pageable.class));
  }

  @Test
  void shouldReturnEmptyItemsWithRealTotalsWhenPageIsBeyondTheEnd() {
    Pageable alemDoFim = PageRequest.of(5, 10);
    given(clienteRepository.findAll(any(Pageable.class)))
        .willReturn(new PageImpl<>(List.of(), alemDoFim, 25));

    PaginaResponse<ClienteListResponse> resposta = clienteService.listar(null, 5, 10, "7");

    assertThat(resposta.itens()).isEmpty();
    assertThat(resposta.pagina()).isEqualTo(5);
    assertThat(resposta.tamanho()).isEqualTo(10);
    assertThat(resposta.totalItens()).isEqualTo(25);
    assertThat(resposta.totalPaginas()).isEqualTo(3);
  }

  @Test
  void shouldLogOnlyLengthPageSizeTotalAndUserWhenSearchingByNameEmailAndPhone() {
    given(clienteRepository.buscar(any(), any(), any(Pageable.class)))
        .willReturn(new PageImpl<>(List.of(cliente(1L, "x")), PageRequest.of(0, 20), 1));

    clienteService.listar("Joao Silva", 0, 20, "7");
    clienteService.listar("joao.silva@example.com", 0, 20, "7");
    clienteService.listar("(11) 98765-4321", 0, 20, "7");

    List<String> mensagens = logs.list.stream().map(ILoggingEvent::getFormattedMessage).toList();
    assertThat(mensagens)
        .containsExactly(
            "clientes.listar qLen=10 page=0 size=20 total=1 usuarioId=7",
            "clientes.listar qLen=22 page=0 size=20 total=1 usuarioId=7",
            "clientes.listar qLen=15 page=0 size=20 total=1 usuarioId=7");
    String saida = String.join("\n", mensagens);
    assertThat(saida)
        .doesNotContainIgnoringCase("joao")
        .doesNotContainIgnoringCase("silva")
        .doesNotContain("example.com")
        .doesNotContain("98765")
        .doesNotContain("4321");
  }

  private static Cliente cliente(Long id, String nome) {
    return Cliente.builder().id(id).nome(nome).build();
  }
}

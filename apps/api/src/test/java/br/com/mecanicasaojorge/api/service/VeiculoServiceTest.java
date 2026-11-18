package br.com.mecanicasaojorge.api.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import br.com.mecanicasaojorge.api.dto.VeiculoDetalheResponse;
import br.com.mecanicasaojorge.api.dto.VeiculoListResponse;
import br.com.mecanicasaojorge.api.dto.VeiculoRequest;
import br.com.mecanicasaojorge.api.dto.VeiculoResponse;
import br.com.mecanicasaojorge.api.entity.Cliente;
import br.com.mecanicasaojorge.api.entity.Veiculo;
import br.com.mecanicasaojorge.api.exception.ClienteNaoEncontradoException;
import br.com.mecanicasaojorge.api.exception.PlacaJaCadastradaException;
import br.com.mecanicasaojorge.api.exception.VeiculoNaoEncontradoException;
import br.com.mecanicasaojorge.api.mapper.VeiculoMapperImpl;
import br.com.mecanicasaojorge.api.repository.ClienteRepository;
import br.com.mecanicasaojorge.api.repository.VeiculoRepository;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import java.util.List;
import java.util.Optional;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;

/** Regras do {@link VeiculoService} com o mapper real e repositorios simulados (F04). */
@ExtendWith(MockitoExtension.class)
class VeiculoServiceTest {

  private static final String PLACA = "ABC1D23";

  @Mock private VeiculoRepository veiculoRepository;
  @Mock private ClienteRepository clienteRepository;

  private VeiculoService service;
  private ListAppender<ILoggingEvent> logs;
  private Logger logger;

  @BeforeEach
  void setUp() {
    service = new VeiculoService(veiculoRepository, clienteRepository, new VeiculoMapperImpl());
    logger = (Logger) LoggerFactory.getLogger(VeiculoService.class);
    logs = new ListAppender<>();
    logs.start();
    logger.addAppender(logs);
  }

  @AfterEach
  void tearDown() {
    logger.detachAppender(logs);
  }

  @Test
  void shouldCreateVehicleInPathClientAndLogOnlyMaskedPlateWhenRequestIsValid() {
    Cliente dono = cliente(4L);
    given(clienteRepository.findById(4L)).willReturn(Optional.of(dono));
    given(veiculoRepository.saveAndFlush(any(Veiculo.class)))
        .willAnswer(
            inv -> {
              Veiculo v = inv.getArgument(0);
              v.setId(9L);
              return v;
            });

    VeiculoResponse resposta = service.criar(4L, requisicao(" abc-1d23 "), "3");

    ArgumentCaptor<Veiculo> gravado = ArgumentCaptor.forClass(Veiculo.class);
    verify(veiculoRepository).saveAndFlush(gravado.capture());
    assertThat(gravado.getValue().getPlaca()).isEqualTo(PLACA);
    assertThat(gravado.getValue().getCliente()).isSameAs(dono);
    assertThat(resposta.id()).isEqualTo(9L);
    assertThat(resposta.clienteId()).isEqualTo(4L);
    assertThat(resposta.placa()).isEqualTo(PLACA);
    assertThat(mensagens())
        .containsExactly("veiculos.criar veiculoId=9 clienteId=4 usuarioId=3 placa=****D23");
  }

  @Test
  void shouldThrowClienteNaoEncontradoAndSaveNothingWhenClientDoesNotExist() {
    given(clienteRepository.findById(99L)).willReturn(Optional.empty());

    assertThatThrownBy(() -> service.criar(99L, requisicao(PLACA), "3"))
        .isInstanceOf(ClienteNaoEncontradoException.class);

    verify(veiculoRepository, never()).saveAndFlush(any());
    assertThat(mensagens())
        .containsExactly("veiculos.criar.clienteNaoEncontrado clienteId=99 usuarioId=3");
  }

  @Test
  void shouldThrowPlacaJaCadastradaWithoutCauseNorFullPlateInLogWhenIndexIsViolated() {
    given(clienteRepository.findById(4L)).willReturn(Optional.of(cliente(4L)));
    given(veiculoRepository.saveAndFlush(any(Veiculo.class)))
        .willThrow(violacaoDoIndice("veiculos.uk_veiculos_placa"));

    assertThatThrownBy(() -> service.criar(4L, requisicao("abc1d23"), "3"))
        .isInstanceOf(PlacaJaCadastradaException.class)
        .hasMessage("Placa ja cadastrada")
        .hasNoCause();

    assertThat(mensagens())
        .containsExactly("veiculos.criar.placaDuplicada clienteId=4 usuarioId=3 placa=****D23");
    assertThat(mensagens()).noneMatch(m -> m.contains(PLACA));
  }

  @Test
  void shouldRethrowOriginalErrorWhenViolatedConstraintIsNotThePlateIndex() {
    given(clienteRepository.findById(4L)).willReturn(Optional.of(cliente(4L)));
    DataIntegrityViolationException original = violacaoDoIndice("veiculos.ck_veiculos_placa_formato");
    given(veiculoRepository.saveAndFlush(any(Veiculo.class))).willThrow(original);

    assertThatThrownBy(() -> service.criar(4L, requisicao(PLACA), "3")).isSameAs(original);
  }

  @Test
  void shouldUpdateLoadedEntityKeepingOwnerAndMileageWhenEditing() {
    Cliente dono = cliente(4L);
    Veiculo existente = veiculo(9L, dono, "ABC1234");
    existente.setQuilometragem(55000);
    given(veiculoRepository.findById(9L)).willReturn(Optional.of(existente));
    given(veiculoRepository.saveAndFlush(existente)).willReturn(existente);

    VeiculoResponse resposta = service.editar(9L, requisicao(PLACA), "3");

    assertThat(existente.getCliente()).isSameAs(dono);
    assertThat(existente.getQuilometragem()).isEqualTo(55000);
    assertThat(existente.getPlaca()).isEqualTo(PLACA);
    assertThat(existente.getModelo()).isEqualTo("Uno");
    assertThat(resposta.clienteId()).isEqualTo(4L);
    assertThat(mensagens())
        .containsExactly("veiculos.editar veiculoId=9 usuarioId=3 placa=****D23 placaAlterada=true");
  }

  @Test
  void shouldReportPlateNotChangedWhenEditingKeepingSamePlate() {
    Veiculo existente = veiculo(9L, cliente(4L), PLACA);
    given(veiculoRepository.findById(9L)).willReturn(Optional.of(existente));
    given(veiculoRepository.saveAndFlush(existente)).willReturn(existente);

    service.editar(9L, requisicao(PLACA), "3");

    assertThat(mensagens())
        .containsExactly(
            "veiculos.editar veiculoId=9 usuarioId=3 placa=****D23 placaAlterada=false");
  }

  @Test
  void shouldThrowPlacaJaCadastradaWhenEditedPlateBelongsToAnotherVehicle() {
    Veiculo existente = veiculo(9L, cliente(4L), "ABC1234");
    given(veiculoRepository.findById(9L)).willReturn(Optional.of(existente));
    given(veiculoRepository.saveAndFlush(existente))
        .willThrow(violacaoDoIndice("veiculos.uk_veiculos_placa"));

    assertThatThrownBy(() -> service.editar(9L, requisicao(PLACA), "3"))
        .isInstanceOf(PlacaJaCadastradaException.class)
        .hasNoCause();

    assertThat(mensagens())
        .containsExactly("veiculos.editar.placaDuplicada veiculoId=9 usuarioId=3 placa=****D23");
  }

  @Test
  void shouldThrowVeiculoNaoEncontradoWhenEditingMissingVehicle() {
    given(veiculoRepository.findById(9L)).willReturn(Optional.empty());

    assertThatThrownBy(() -> service.editar(9L, requisicao(PLACA), "3"))
        .isInstanceOf(VeiculoNaoEncontradoException.class);

    assertThat(mensagens()).containsExactly("veiculos.editar.naoEncontrado veiculoId=9 usuarioId=3");
  }

  @Test
  void shouldReturnDetailWithEmptyHistoryAndOwnerWhenVehicleExists() {
    Cliente dono = cliente(4L);
    dono.setNome("Ana Exemplo");
    given(veiculoRepository.findById(9L)).willReturn(Optional.of(veiculo(9L, dono, PLACA)));

    VeiculoDetalheResponse detalhe = service.detalhar(9L, "3");

    assertThat(detalhe.clienteId()).isEqualTo(4L);
    assertThat(detalhe.clienteNome()).isEqualTo("Ana Exemplo");
    assertThat(detalhe.placa()).isEqualTo(PLACA);
    assertThat(detalhe.historicoOs()).isNotNull().isEmpty();
    assertThat(mensagens())
        .containsExactly("veiculos.detalhar veiculoId=9 usuarioId=3 placa=****D23");
    assertThat(mensagens()).noneMatch(m -> m.contains("Ana") || m.contains("Fiat"));
  }

  @Test
  void shouldThrowVeiculoNaoEncontradoWhenDetailOfMissingVehicle() {
    given(veiculoRepository.findById(9L)).willReturn(Optional.empty());

    assertThatThrownBy(() -> service.detalhar(9L, "3"))
        .isInstanceOf(VeiculoNaoEncontradoException.class);

    assertThat(mensagens())
        .containsExactly("veiculos.detalhar.naoEncontrado veiculoId=9 usuarioId=3");
  }

  @Test
  void shouldListClientVehiclesInRepositoryOrderWithoutLoggingPlates() {
    Cliente dono = cliente(4L);
    given(clienteRepository.existsById(4L)).willReturn(true);
    given(veiculoRepository.findByClienteIdOrderByPlacaAscIdAsc(4L))
        .willReturn(List.of(veiculo(1L, dono, "ABC1234"), veiculo(2L, dono, PLACA)));

    List<VeiculoListResponse> lista = service.listarPorCliente(4L, "3");

    assertThat(lista).extracting(VeiculoListResponse::placa).containsExactly("ABC1234", PLACA);
    assertThat(mensagens())
        .containsExactly("veiculos.listarPorCliente clienteId=4 total=2 usuarioId=3");
  }

  @Test
  void shouldReturnEmptyListWhenClientHasNoVehicles() {
    given(clienteRepository.existsById(4L)).willReturn(true);
    given(veiculoRepository.findByClienteIdOrderByPlacaAscIdAsc(4L)).willReturn(List.of());

    assertThat(service.listarPorCliente(4L, "3")).isNotNull().isEmpty();
  }

  @Test
  void shouldThrowClienteNaoEncontradoWhenListingVehiclesOfMissingClient() {
    given(clienteRepository.existsById(99L)).willReturn(false);

    assertThatThrownBy(() -> service.listarPorCliente(99L, "3"))
        .isInstanceOf(ClienteNaoEncontradoException.class);

    assertThat(mensagens())
        .containsExactly("veiculos.listarPorCliente.clienteNaoEncontrado clienteId=99 usuarioId=3");
  }

  private List<String> mensagens() {
    return logs.list.stream().map(ILoggingEvent::getFormattedMessage).toList();
  }

  private static VeiculoRequest requisicao(String placa) {
    return new VeiculoRequest(placa, "Fiat", "Uno", 2015, "Prata");
  }

  private static Cliente cliente(Long id) {
    Cliente cliente = new Cliente();
    cliente.setId(id);
    return cliente;
  }

  private static Veiculo veiculo(Long id, Cliente dono, String placa) {
    Veiculo veiculo = new Veiculo();
    veiculo.setId(id);
    veiculo.setCliente(dono);
    veiculo.setPlaca(placa);
    veiculo.setMarca("Fiat");
    veiculo.setModelo("Uno");
    veiculo.setAno(2015);
    return veiculo;
  }

  private static DataIntegrityViolationException violacaoDoIndice(String restricao) {
    ConstraintViolationException causa =
        new ConstraintViolationException(
            "Duplicate entry 'ABC1D23' for key '" + restricao + "'",
            new java.sql.SQLException("x", "23000", 1062),
            restricao);
    return new DataIntegrityViolationException("msg", causa);
  }
}

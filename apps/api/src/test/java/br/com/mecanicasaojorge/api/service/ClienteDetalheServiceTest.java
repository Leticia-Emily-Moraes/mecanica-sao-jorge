package br.com.mecanicasaojorge.api.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import br.com.mecanicasaojorge.api.dto.ClienteDetalheResponse;
import br.com.mecanicasaojorge.api.entity.Cliente;
import br.com.mecanicasaojorge.api.exception.ClienteNaoEncontradoException;
import br.com.mecanicasaojorge.api.mapper.ClienteMapper;
import br.com.mecanicasaojorge.api.repository.ClienteRepository;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.LoggerFactory;

/**
 * Detalhe do cliente no service (F03b): sucesso, 404 de dominio e linhas de log da politica 6.4.
 */
@ExtendWith(MockitoExtension.class)
class ClienteDetalheServiceTest {

  private static final String CPF = "12345678900";
  private static final String TELEFONE = "11912345678";

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
  }

  @AfterEach
  void tearDown() {
    logger.detachAppender(logs);
  }

  @Test
  void shouldReturnDetailAndLogOnlyIdsWhenClientExists() {
    Cliente cliente =
        Cliente.builder()
            .id(7L)
            .nome("Ana Exemplo")
            .cpf(CPF)
            .telefone(TELEFONE)
            .email("ana@example.com")
            .endereco("Rua Modelo, 100")
            .build();
    ClienteDetalheResponse esperado =
        new ClienteDetalheResponse(
            7L, "Ana Exemplo", CPF, TELEFONE, "ana@example.com", "Rua Modelo, 100");
    given(clienteRepository.findById(7L)).willReturn(Optional.of(cliente));
    given(clienteMapper.toDetalheResponse(cliente)).willReturn(esperado);

    ClienteDetalheResponse resposta = clienteService.detalhar(7L, "3");

    assertThat(resposta).isSameAs(esperado);
    assertThat(logs.list).hasSize(1);
    assertThat(logs.list.get(0).getFormattedMessage())
        .isEqualTo("clientes.detalhar clienteId=7 usuarioId=3");
  }

  @Test
  void shouldThrowDomainNotFoundAndLogNotFoundLineWhenClientDoesNotExist() {
    given(clienteRepository.findById(999999L)).willReturn(Optional.empty());

    assertThatThrownBy(() -> clienteService.detalhar(999999L, "3"))
        .isInstanceOf(ClienteNaoEncontradoException.class)
        .hasMessage("Cliente nao encontrado");

    assertThat(logs.list).hasSize(1);
    assertThat(logs.list.get(0).getFormattedMessage())
        .isEqualTo("clientes.detalhar.naoEncontrado clienteId=999999 usuarioId=3");
    verify(clienteRepository).findById(999999L);
  }

  @Test
  void shouldNeverLogPersonalDataWhenClientExists() {
    Cliente cliente =
        Cliente.builder().id(7L).nome("Ana Exemplo").cpf(CPF).telefone(TELEFONE).build();
    given(clienteRepository.findById(7L)).willReturn(Optional.of(cliente));
    given(clienteMapper.toDetalheResponse(any(Cliente.class)))
        .willReturn(new ClienteDetalheResponse(7L, "Ana Exemplo", CPF, TELEFONE, null, null));

    clienteService.detalhar(7L, "3");

    assertThat(logs.list)
        .allSatisfy(
            e ->
                assertThat(e.getFormattedMessage())
                    .doesNotContain("Ana", CPF, TELEFONE, "12345", "***", "5678"));
  }

  @Test
  void shouldHideCpfAndAddressFromBuilderToString() {
    String texto = Cliente.builder().cpf(CPF).endereco("Rua Modelo, 100").build().toString();
    String builder = Cliente.builder().cpf(CPF).endereco("Rua Modelo, 100").toString();

    assertThat(texto).doesNotContain(CPF, "Rua Modelo");
    assertThat(builder).doesNotContain(CPF, "Rua Modelo");
  }
}

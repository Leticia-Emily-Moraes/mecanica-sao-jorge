package br.com.mecanicasaojorge.api.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import br.com.mecanicasaojorge.api.dto.ClienteDetalheResponse;
import br.com.mecanicasaojorge.api.dto.ClienteRequest;
import br.com.mecanicasaojorge.api.entity.Cliente;
import br.com.mecanicasaojorge.api.exception.CpfJaCadastradoException;
import br.com.mecanicasaojorge.api.mapper.ClienteMapperImpl;
import br.com.mecanicasaojorge.api.repository.ClienteRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

/** Criacao de cliente (F03c): normalizacao pelo mapper real e traducao do indice de CPF. */
@ExtendWith(MockitoExtension.class)
class ClienteCriarServiceTest {

  @Mock private ClienteRepository clienteRepository;

  private ClienteService clienteService;

  @BeforeEach
  void setUp() {
    clienteService = new ClienteService(clienteRepository, new ClienteMapperImpl());
  }

  @Test
  void shouldSaveOnlyDigitsAndTrimmedNameWhenRequestHasMasks() {
    given(clienteRepository.saveAndFlush(any(Cliente.class)))
        .willAnswer(
            inv -> {
              Cliente c = inv.getArgument(0);
              c.setId(10L);
              return c;
            });

    ClienteDetalheResponse resposta =
        clienteService.criar(
            new ClienteRequest(
                "  Ana Exemplo ", "123.456.789-00", "(11) 91234-5678", "ana@example.com", null),
            "3");

    ArgumentCaptor<Cliente> gravado = ArgumentCaptor.forClass(Cliente.class);
    Mockito.verify(clienteRepository).saveAndFlush(gravado.capture());
    assertThat(gravado.getValue().getCpf()).isEqualTo("12345678900");
    assertThat(gravado.getValue().getTelefone()).isEqualTo("11912345678");
    assertThat(gravado.getValue().getNome()).isEqualTo("Ana Exemplo");
    assertThat(gravado.getValue().getEndereco()).isNull();
    assertThat(resposta.id()).isEqualTo(10L);
    assertThat(resposta.cpf()).isEqualTo("12345678900");
  }

  @Test
  void shouldThrowCpfJaCadastradoWithoutCauseWhenUniqueIndexIsViolated() {
    ConstraintViolationException causa =
        new ConstraintViolationException(
            "Duplicate entry '12345678900' for key 'clientes.uk_clientes_cpf'",
            new java.sql.SQLException("x", "23000", 1062),
            "clientes.uk_clientes_cpf");
    given(clienteRepository.saveAndFlush(any(Cliente.class)))
        .willThrow(new DataIntegrityViolationException("msg", causa));

    assertThatThrownBy(() -> clienteService.criar(requisicaoValida(), "3"))
        .isInstanceOf(CpfJaCadastradoException.class)
        .hasMessage("CPF ja cadastrado")
        .hasNoCause();
  }

  @Test
  void shouldRethrowOriginalErrorWhenViolatedConstraintIsNotTheCpfIndex() {
    ConstraintViolationException causa =
        new ConstraintViolationException(
            "x",
            new java.sql.SQLException("x", "23000", 3819),
            "clientes.ck_clientes_telefone_digitos");
    DataIntegrityViolationException original = new DataIntegrityViolationException("msg", causa);
    given(clienteRepository.saveAndFlush(any(Cliente.class))).willThrow(original);

    assertThatThrownBy(() -> clienteService.criar(requisicaoValida(), "3")).isSameAs(original);
  }

  private static ClienteRequest requisicaoValida() {
    return new ClienteRequest("Ana Exemplo", "12345678900", "11912345678", null, null);
  }
}

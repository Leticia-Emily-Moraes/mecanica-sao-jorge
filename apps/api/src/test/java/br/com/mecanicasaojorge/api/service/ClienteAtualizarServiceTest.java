package br.com.mecanicasaojorge.api.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import br.com.mecanicasaojorge.api.dto.ClienteDetalheResponse;
import br.com.mecanicasaojorge.api.dto.ClienteRequest;
import br.com.mecanicasaojorge.api.entity.Cliente;
import br.com.mecanicasaojorge.api.exception.ClienteNaoEncontradoException;
import br.com.mecanicasaojorge.api.exception.CpfJaCadastradoException;
import br.com.mecanicasaojorge.api.exception.EmailJaCadastradoException;
import br.com.mecanicasaojorge.api.mapper.ClienteMapperImpl;
import br.com.mecanicasaojorge.api.repository.ClienteRepository;
import java.util.Optional;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

/** Edicao de cliente (F03d): mapper real, traducao dos indices e escolha da entidade carregada. */
@ExtendWith(MockitoExtension.class)
class ClienteAtualizarServiceTest {

  private static final long ID = 10L;

  @Mock private ClienteRepository clienteRepository;

  private ClienteService clienteService;

  @BeforeEach
  void setUp() {
    clienteService = new ClienteService(clienteRepository, new ClienteMapperImpl());
  }

  @Test
  void shouldCopyNormalizedFieldsOverLoadedEntityKeepingIdWhenClientExists() {
    Cliente existente = clienteExistente();
    given(clienteRepository.findById(ID)).willReturn(Optional.of(existente));
    given(clienteRepository.saveAndFlush(any(Cliente.class))).willAnswer(inv -> inv.getArgument(0));

    ClienteDetalheResponse resposta =
        clienteService.atualizar(
            ID,
            new ClienteRequest(
                "  Ana Nova ", "987.654.321-00", "(11) 3456-7890", "  Ana@Example.COM ", null),
            "3");

    assertThat(resposta.id()).isEqualTo(ID);
    assertThat(resposta.nome()).isEqualTo("Ana Nova");
    assertThat(resposta.cpf()).isEqualTo("98765432100");
    assertThat(resposta.telefone()).isEqualTo("1134567890");
    assertThat(resposta.email()).isEqualTo("ana@example.com");
    assertThat(resposta.endereco()).isNull();
    verify(clienteRepository).saveAndFlush(existente);
  }

  @Test
  void shouldThrowClienteNaoEncontradoWithoutSavingWhenIdDoesNotExist() {
    given(clienteRepository.findById(ID)).willReturn(Optional.empty());

    assertThatThrownBy(() -> clienteService.atualizar(ID, requisicao(null), "3"))
        .isInstanceOf(ClienteNaoEncontradoException.class);
    verify(clienteRepository, never()).saveAndFlush(any());
  }

  @Test
  void shouldThrowCpfJaCadastradoWithoutCauseWhenCpfIndexIsViolated() {
    given(clienteRepository.findById(ID)).willReturn(Optional.of(clienteExistente()));
    given(clienteRepository.saveAndFlush(any(Cliente.class)))
        .willThrow(violacao("clientes.uk_clientes_cpf"));

    assertThatThrownBy(() -> clienteService.atualizar(ID, requisicao(null), "3"))
        .isInstanceOf(CpfJaCadastradoException.class)
        .hasMessage("CPF ja cadastrado")
        .hasNoCause();
  }

  @Test
  void shouldThrowEmailJaCadastradoWithoutCauseWhenEmailIndexIsViolated() {
    given(clienteRepository.findById(ID)).willReturn(Optional.of(clienteExistente()));
    given(clienteRepository.saveAndFlush(any(Cliente.class)))
        .willThrow(violacao("clientes.UK_CLIENTES_EMAIL"));

    assertThatThrownBy(() -> clienteService.atualizar(ID, requisicao("a@example.com"), "3"))
        .isInstanceOf(EmailJaCadastradoException.class)
        .hasMessage("Email ja cadastrado")
        .hasNoCause();
  }

  @Test
  void shouldRethrowOriginalErrorWhenViolatedConstraintIsUnknown() {
    given(clienteRepository.findById(ID)).willReturn(Optional.of(clienteExistente()));
    DataIntegrityViolationException original = violacao("clientes.ck_clientes_telefone_digitos");
    given(clienteRepository.saveAndFlush(any(Cliente.class))).willThrow(original);

    assertThatThrownBy(() -> clienteService.atualizar(ID, requisicao(null), "3"))
        .isSameAs(original);
  }

  @Test
  void shouldNormalizeEmailOnlyForAsciiLettersWhenMappingRequest() {
    Cliente existente = clienteExistente();
    given(clienteRepository.findById(ID)).willReturn(Optional.of(existente));
    given(clienteRepository.saveAndFlush(any(Cliente.class))).willAnswer(inv -> inv.getArgument(0));

    // U+212A (sinal Kelvin) e U+0130 nao podem ser trocados por toLowerCase
    clienteService.atualizar(ID, requisicao("KAİ@Example.com"), "3");

    assertThat(existente.getEmail()).isEqualTo("Kaİ@example.com");
  }

  private static DataIntegrityViolationException violacao(String restricao) {
    ConstraintViolationException causa =
        new ConstraintViolationException(
            "Duplicate entry 'valor-ficticio' for key '" + restricao + "'",
            new java.sql.SQLException("x", "23000", 1062),
            restricao);
    return new DataIntegrityViolationException("msg", causa);
  }

  private static Cliente clienteExistente() {
    Cliente cliente = new Cliente();
    cliente.setId(ID);
    cliente.setNome("Ana Antiga");
    cliente.setCpf("12345678900");
    cliente.setTelefone("11912345678");
    cliente.setEmail("antiga@example.com");
    cliente.setEndereco("Rua Velha, 1");
    return cliente;
  }

  private static ClienteRequest requisicao(String email) {
    return new ClienteRequest("Ana Nova", "98765432100", "11912345678", email, null);
  }
}

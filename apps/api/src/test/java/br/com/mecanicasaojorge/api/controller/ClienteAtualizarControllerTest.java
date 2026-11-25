package br.com.mecanicasaojorge.api.controller;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.mecanicasaojorge.api.dto.ClienteDetalheResponse;
import br.com.mecanicasaojorge.api.dto.ClienteRequest;
import br.com.mecanicasaojorge.api.exception.ClienteNaoEncontradoException;
import br.com.mecanicasaojorge.api.exception.CpfJaCadastradoException;
import br.com.mecanicasaojorge.api.exception.EmailJaCadastradoException;
import br.com.mecanicasaojorge.api.security.JwtConfig;
import br.com.mecanicasaojorge.api.security.RestAuthenticationEntryPoint;
import br.com.mecanicasaojorge.api.security.SecurityConfig;
import br.com.mecanicasaojorge.api.service.ClienteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.CannotAcquireLockException;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

/** PUT /api/v1/clientes/{id} na camada web (F03d): contrato HTTP com o service simulado. */
@WebMvcTest(controllers = ClienteController.class)
@Import({SecurityConfig.class, JwtConfig.class, RestAuthenticationEntryPoint.class})
@EnableConfigurationProperties(br.com.mecanicasaojorge.api.config.JwtProperties.class)
@TestPropertySource(
    properties = {"jwt.secret=01234567890123456789012345678901", "jwt.expiration-minutes=10080"})
class ClienteAtualizarControllerTest {

  private static final String URL = "/api/v1/clientes/5";
  private static final String CORPO =
      "{\"id\":99,\"nome\":\"Ana Exemplo\",\"cpf\":\"123.456.789-00\","
          + "\"telefone\":\"(11) 91234-5678\"}";

  @Autowired private MockMvc mockMvc;

  @MockitoBean private ClienteService clienteService;

  @Test
  void shouldReturn200WithBodyAndUseOnlyPathIdWhenRequestIsValid() throws Exception {
    given(clienteService.atualizar(eq(5L), any(ClienteRequest.class), eq("7")))
        .willReturn(
            new ClienteDetalheResponse(
                5L, "Ana Exemplo", "12345678900", "11912345678", null, null));

    mockMvc
        .perform(
            put(URL)
                .with(jwt().jwt(j -> j.subject("7")))
                .contentType(MediaType.APPLICATION_JSON)
                .content(CORPO))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(5))
        .andExpect(jsonPath("$.cpf").value("12345678900"));
  }

  @Test
  void shouldReturn404WithGlobalFormatWhenServiceReportsMissingClient() throws Exception {
    given(clienteService.atualizar(eq(5L), any(), any()))
        .willThrow(new ClienteNaoEncontradoException());

    mockMvc
        .perform(put(URL).with(jwt()).contentType(MediaType.APPLICATION_JSON).content(CORPO))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.status").value(404))
        .andExpect(jsonPath("$.erro").value("Not Found"))
        .andExpect(jsonPath("$.mensagem").value("Cliente nao encontrado"))
        .andExpect(jsonPath("$.path").value(URL))
        .andExpect(jsonPath("$.timestamp").exists());
  }

  @Test
  void shouldReturn409WithFixedMessageWhenServiceReportsRepeatedCpf() throws Exception {
    given(clienteService.atualizar(any(), any(), any())).willThrow(new CpfJaCadastradoException());

    mockMvc
        .perform(put(URL).with(jwt()).contentType(MediaType.APPLICATION_JSON).content(CORPO))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.mensagem").value("CPF ja cadastrado"))
        .andExpect(jsonPath("$.erros").isEmpty());
  }

  @Test
  void shouldReturn409WithFixedMessageWhenServiceReportsRepeatedEmail() throws Exception {
    given(clienteService.atualizar(any(), any(), any()))
        .willThrow(new EmailJaCadastradoException());

    mockMvc
        .perform(put(URL).with(jwt()).contentType(MediaType.APPLICATION_JSON).content(CORPO))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.mensagem").value("Email ja cadastrado"))
        .andExpect(jsonPath("$.erros").isEmpty());
  }

  @Test
  void shouldReturn409WithFixedMessageWhenDatabaseReportsDeadlock() throws Exception {
    given(clienteService.atualizar(any(), any(), any()))
        .willThrow(new CannotAcquireLockException("Deadlock found when trying to get lock"));

    mockMvc
        .perform(put(URL).with(jwt()).contentType(MediaType.APPLICATION_JSON).content(CORPO))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.mensagem").value("Conflito de gravacao simultanea, tente novamente"))
        .andExpect(jsonPath("$.erros").isEmpty());
  }

  @Test
  void shouldReturn400WithoutCallingServiceWhenBodyIsInvalid() throws Exception {
    mockMvc
        .perform(
            put(URL)
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nome\":\"  \",\"cpf\":\"123\",\"telefone\":\"1\"}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.mensagem").value(containsString("nome")))
        .andExpect(jsonPath("$.mensagem").value(containsString("cpf")))
        .andExpect(jsonPath("$.mensagem").value(containsString("telefone")));

    verifyNoInteractions(clienteService);
  }

  @Test
  void shouldReturn400WithoutCallingServiceWhenPathIdIsNotPositive() throws Exception {
    mockMvc
        .perform(
            put("/api/v1/clientes/0")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(CORPO))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(clienteService);
  }

  @Test
  void shouldReturn401WithoutCallingServiceWhenTokenIsMissing() throws Exception {
    mockMvc
        .perform(put(URL).contentType(MediaType.APPLICATION_JSON).content(CORPO))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401));

    verifyNoInteractions(clienteService);
  }

  @Test
  void shouldReturn415WhenContentTypeIsNotJson() throws Exception {
    mockMvc
        .perform(put(URL).with(jwt()).contentType(MediaType.TEXT_PLAIN).content(CORPO))
        .andExpect(status().isUnsupportedMediaType());

    verifyNoInteractions(clienteService);
  }
}

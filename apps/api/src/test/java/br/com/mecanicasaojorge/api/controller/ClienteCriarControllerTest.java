package br.com.mecanicasaojorge.api.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.mecanicasaojorge.api.dto.ClienteDetalheResponse;
import br.com.mecanicasaojorge.api.dto.ClienteRequest;
import br.com.mecanicasaojorge.api.exception.CpfJaCadastradoException;
import br.com.mecanicasaojorge.api.security.JwtConfig;
import br.com.mecanicasaojorge.api.security.RestAuthenticationEntryPoint;
import br.com.mecanicasaojorge.api.security.SecurityConfig;
import br.com.mecanicasaojorge.api.service.ClienteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

/** POST /api/v1/clientes na camada web (F03c): contrato HTTP com o service simulado. */
@WebMvcTest(controllers = ClienteController.class)
@Import({SecurityConfig.class, JwtConfig.class, RestAuthenticationEntryPoint.class})
@EnableConfigurationProperties(br.com.mecanicasaojorge.api.config.JwtProperties.class)
@TestPropertySource(
    properties = {"jwt.secret=01234567890123456789012345678901", "jwt.expiration-minutes=10080"})
class ClienteCriarControllerTest {

  private static final String URL = "/api/v1/clientes";
  private static final String CORPO =
      "{\"nome\":\"Ana Exemplo\",\"cpf\":\"123.456.789-00\",\"telefone\":\"(11) 91234-5678\"}";

  @Autowired private MockMvc mockMvc;

  @MockitoBean private ClienteService clienteService;

  @Test
  void shouldReturn201WithLocationAndBodyWhenRequestIsValid() throws Exception {
    given(clienteService.criar(any(ClienteRequest.class), eq("7")))
        .willReturn(
            new ClienteDetalheResponse(
                5L, "Ana Exemplo", "12345678900", "11912345678", null, null));

    mockMvc
        .perform(
            post(URL)
                .with(jwt().jwt(j -> j.subject("7")))
                .contentType(MediaType.APPLICATION_JSON)
                .content(CORPO))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location", URL + "/5"))
        .andExpect(jsonPath("$.id").value(5))
        .andExpect(jsonPath("$.cpf").value("12345678900"));
  }

  @Test
  void shouldReturn409WithFixedMessageWhenServiceReportsRepeatedCpf() throws Exception {
    given(clienteService.criar(any(ClienteRequest.class), any()))
        .willThrow(new CpfJaCadastradoException());

    mockMvc
        .perform(post(URL).with(jwt()).contentType(MediaType.APPLICATION_JSON).content(CORPO))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.mensagem").value("CPF ja cadastrado"));
  }

  @Test
  void shouldReturn400WithoutCallingServiceWhenBodyIsInvalid() throws Exception {
    mockMvc
        .perform(
            post(URL)
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nome\":\"  \",\"cpf\":\"123\",\"telefone\":\"1\"}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.mensagem").value(org.hamcrest.Matchers.containsString("nome")))
        .andExpect(jsonPath("$.mensagem").value(org.hamcrest.Matchers.containsString("cpf")))
        .andExpect(jsonPath("$.mensagem").value(org.hamcrest.Matchers.containsString("telefone")));

    verifyNoInteractions(clienteService);
  }

  @Test
  void shouldReturn401WithoutCallingServiceWhenTokenIsMissing() throws Exception {
    mockMvc
        .perform(post(URL).contentType(MediaType.APPLICATION_JSON).content(CORPO))
        .andExpect(status().isUnauthorized());

    verifyNoInteractions(clienteService);
  }

  @Test
  void shouldReturn415WhenContentTypeIsNotJson() throws Exception {
    mockMvc
        .perform(post(URL).with(jwt()).contentType(MediaType.TEXT_PLAIN).content(CORPO))
        .andExpect(status().isUnsupportedMediaType());

    verifyNoInteractions(clienteService);
  }
}

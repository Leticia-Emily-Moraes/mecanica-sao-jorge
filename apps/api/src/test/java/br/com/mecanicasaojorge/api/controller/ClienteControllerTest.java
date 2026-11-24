package br.com.mecanicasaojorge.api.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.mecanicasaojorge.api.dto.ClienteDetalheResponse;
import br.com.mecanicasaojorge.api.dto.ClienteListResponse;
import br.com.mecanicasaojorge.api.dto.PaginaResponse;
import br.com.mecanicasaojorge.api.exception.ClienteNaoEncontradoException;
import br.com.mecanicasaojorge.api.security.JwtConfig;
import br.com.mecanicasaojorge.api.security.RestAuthenticationEntryPoint;
import br.com.mecanicasaojorge.api.security.SecurityConfig;
import br.com.mecanicasaojorge.api.service.ClienteService;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

/** Endpoint protegido de clientes (F03a, ADR-017): sucesso, 400 por parametro e 401. */
@WebMvcTest(controllers = ClienteController.class)
@Import({SecurityConfig.class, JwtConfig.class, RestAuthenticationEntryPoint.class})
@EnableConfigurationProperties(br.com.mecanicasaojorge.api.config.JwtProperties.class)
@TestPropertySource(
    properties = {"jwt.secret=01234567890123456789012345678901", "jwt.expiration-minutes=10080"})
class ClienteControllerTest {

  private static final String URL = "/api/v1/clientes";

  @Autowired private MockMvc mockMvc;
  @Autowired private JwtEncoder jwtEncoder;

  @MockitoBean private ClienteService clienteService;

  @Test
  void shouldReturnPageWithOnlyAllowedFieldsWhenAuthenticated() throws Exception {
    given(clienteService.listar(any(), anyInt(), anyInt(), any()))
        .willReturn(
            new PaginaResponse<>(
                List.of(new ClienteListResponse(1L, "Ana", "11987654321", "ana@example.com")),
                0,
                20,
                1,
                1));

    mockMvc
        .perform(get(URL).param("q", "ana").with(jwt().jwt(j -> j.subject("7"))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens[0].id").value(1))
        .andExpect(jsonPath("$.itens[0].nome").value("Ana"))
        .andExpect(jsonPath("$.itens[0].telefone").value("11987654321"))
        .andExpect(jsonPath("$.itens[0].email").value("ana@example.com"))
        .andExpect(jsonPath("$.itens[0].cpf").doesNotExist())
        .andExpect(jsonPath("$.itens[0].createdAt").doesNotExist())
        .andExpect(jsonPath("$.itens[0].length()").value(4))
        .andExpect(jsonPath("$.pagina").value(0))
        .andExpect(jsonPath("$.tamanho").value(20))
        .andExpect(jsonPath("$.totalItens").value(1))
        .andExpect(jsonPath("$.totalPaginas").value(1));
    verify(clienteService).listar(eq("ana"), eq(0), eq(20), eq("7"));
  }

  @Test
  void shouldUseDefaultsWhenNoParameterIsGiven() throws Exception {
    given(clienteService.listar(any(), anyInt(), anyInt(), any()))
        .willReturn(new PaginaResponse<>(List.of(), 0, 20, 0, 0));

    mockMvc.perform(get(URL).with(jwt())).andExpect(status().isOk());

    verify(clienteService).listar(eq(null), eq(0), eq(20), any());
  }

  @Test
  void shouldAcceptBoundaryValuesWhenSizeIs100AndTermHas100Characters() throws Exception {
    given(clienteService.listar(any(), anyInt(), anyInt(), any()))
        .willReturn(new PaginaResponse<>(List.of(), 0, 100, 0, 0));

    mockMvc
        .perform(get(URL).param("q", "a".repeat(100)).param("size", "100").with(jwt()))
        .andExpect(status().isOk());
    mockMvc.perform(get(URL).param("q", " ".repeat(100)).with(jwt())).andExpect(status().isOk());
  }

  @ParameterizedTest(name = "{0}")
  @MethodSource("parametrosInvalidos")
  void shouldReturnBadRequestInStandardFormatWithoutEchoingValueWhenParameterIsInvalid(
      String parametro, String valor) throws Exception {
    String corpo =
        mockMvc
            .perform(get(URL).param(parametro, valor).with(jwt()))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400))
            .andExpect(jsonPath("$.erro").value("Bad Request"))
            .andExpect(jsonPath("$.mensagem").value("Parametro invalido: " + parametro))
            .andExpect(jsonPath("$.path").value(URL))
            .andExpect(jsonPath("$.timestamp").exists())
            .andReturn()
            .getResponse()
            .getContentAsString();

    // valores numericos podem coincidir com digitos do timestamp; so os textuais provam o "sem eco"
    if (valor.chars().anyMatch(Character::isLetter)) {
      assertThat(corpo).doesNotContain(valor);
    }
    assertThat(corpo).doesNotContain("Exception").doesNotContain("at br.com");
    verifyNoInteractions(clienteService);
  }

  static Stream<Arguments> parametrosInvalidos() {
    return Stream.of(
        Arguments.of("size", "0"),
        Arguments.of("size", "101"),
        Arguments.of("size", "abc"),
        Arguments.of("page", "-1"),
        Arguments.of("page", "abc"),
        Arguments.of("q", "x".repeat(101)),
        Arguments.of("q", " ".repeat(101)));
  }

  @Test
  void shouldReturnDetailWithSixFieldsAndNoStoreWhenAuthenticated() throws Exception {
    given(clienteService.detalhar(eq(7L), any()))
        .willReturn(
            new ClienteDetalheResponse(
                7L,
                "Ana Exemplo",
                "12345678900",
                "11912345678",
                "ana@example.com",
                "Rua Modelo, 100"));

    mockMvc
        .perform(get(URL + "/7").with(jwt().jwt(j -> j.subject("3"))))
        .andExpect(status().isOk())
        .andExpect(header().string("Cache-Control", containsString("no-store")))
        .andExpect(jsonPath("$.id").value(7))
        .andExpect(jsonPath("$.nome").value("Ana Exemplo"))
        .andExpect(jsonPath("$.cpf").value("12345678900"))
        .andExpect(jsonPath("$.telefone").value("11912345678"))
        .andExpect(jsonPath("$.email").value("ana@example.com"))
        .andExpect(jsonPath("$.endereco").value("Rua Modelo, 100"))
        .andExpect(jsonPath("$.createdAt").doesNotExist())
        .andExpect(jsonPath("$.length()").value(6));
    verify(clienteService).detalhar(7L, "3");
  }

  @Test
  void shouldReturnNullFieldsPresentInJsonWhenOptionalDataIsMissing() throws Exception {
    given(clienteService.detalhar(eq(8L), any()))
        .willReturn(new ClienteDetalheResponse(8L, "Bia Exemplo", null, null, null, null));

    mockMvc
        .perform(get(URL + "/8").with(jwt()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(6))
        .andExpect(jsonPath("$.cpf").value(nullValue()))
        .andExpect(jsonPath("$.telefone").value(nullValue()))
        .andExpect(jsonPath("$.email").value(nullValue()))
        .andExpect(jsonPath("$.endereco").value(nullValue()));
  }

  @Test
  void shouldReturnNotFoundInStandardFormatWhenClientDoesNotExist() throws Exception {
    given(clienteService.detalhar(eq(999999L), any()))
        .willThrow(new ClienteNaoEncontradoException());

    String corpo =
        mockMvc
            .perform(get(URL + "/999999").with(jwt()))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.status").value(404))
            .andExpect(jsonPath("$.erro").value("Not Found"))
            .andExpect(jsonPath("$.mensagem").value("Cliente nao encontrado"))
            .andExpect(jsonPath("$.path").value(URL + "/999999"))
            .andExpect(jsonPath("$.timestamp").exists())
            .andReturn()
            .getResponse()
            .getContentAsString();

    assertThat(corpo).doesNotContain("Exception", "at br.com");
  }

  @ParameterizedTest(name = "id={0}")
  @ValueSource(strings = {"abc", "0", "-1", "99999999999999999999", "1.5"})
  void shouldReturnBadRequestWithoutEchoingValueWhenIdIsInvalid(String id) throws Exception {
    String corpo =
        mockMvc
            .perform(get(URL + "/" + id).with(jwt()))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400))
            .andExpect(jsonPath("$.erro").value("Bad Request"))
            .andExpect(jsonPath("$.mensagem").value("Parametro invalido: id"))
            .andExpect(jsonPath("$.path").value(URL + "/" + id))
            .andReturn()
            .getResponse()
            .getContentAsString();

    assertThat(corpo).doesNotContain("Exception", "at br.com");
    verifyNoInteractions(clienteService);
  }

  @Test
  void shouldReturnUnauthorizedWithoutQueryingWhenDetailHasNoOrInvalidToken() throws Exception {
    mockMvc
        .perform(get(URL + "/7"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401))
        .andExpect(jsonPath("$.erro").value("Unauthorized"))
        .andExpect(jsonPath("$.path").value(URL + "/7"))
        .andExpect(jsonPath("$.cpf").doesNotExist());
    mockMvc
        .perform(get(URL + "/7").header(HttpHeaders.AUTHORIZATION, "Bearer token.invalido.x"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401));
    verifyNoInteractions(clienteService);
  }

  @Test
  void shouldReturnUnauthorizedAndNoDataWhenThereIsNoToken() throws Exception {
    mockMvc
        .perform(get(URL))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401))
        .andExpect(jsonPath("$.erro").value("Unauthorized"))
        .andExpect(jsonPath("$.path").value(URL))
        .andExpect(jsonPath("$.itens").doesNotExist());
    verifyNoInteractions(clienteService);
  }

  @Test
  void shouldReturnUnauthorizedWhenTokenIsExpired() throws Exception {
    Instant emitidoEm = Instant.now().minus(8, ChronoUnit.DAYS);
    JwtClaimsSet claims =
        JwtClaimsSet.builder()
            .issuer("mecanica-sao-jorge-api")
            .issuedAt(emitidoEm)
            .expiresAt(emitidoEm.plus(7, ChronoUnit.DAYS))
            .subject("1")
            .claim("perfil", "ADMIN")
            .build();
    String tokenExpirado =
        jwtEncoder
            .encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
            .getTokenValue();

    mockMvc
        .perform(get(URL).header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenExpirado))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401));
    verifyNoInteractions(clienteService);
  }
}

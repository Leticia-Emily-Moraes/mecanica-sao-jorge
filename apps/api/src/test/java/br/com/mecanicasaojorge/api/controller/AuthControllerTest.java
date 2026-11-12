package br.com.mecanicasaojorge.api.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.mecanicasaojorge.api.dto.LoginRequest;
import br.com.mecanicasaojorge.api.dto.LoginResponse;
import br.com.mecanicasaojorge.api.dto.UsuarioResumo;
import br.com.mecanicasaojorge.api.entity.Perfil;
import br.com.mecanicasaojorge.api.exception.CredenciaisInvalidasException;
import br.com.mecanicasaojorge.api.security.JwtConfig;
import br.com.mecanicasaojorge.api.security.RestAuthenticationEntryPoint;
import br.com.mecanicasaojorge.api.security.SecurityConfig;
import br.com.mecanicasaojorge.api.service.AuthService;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

/**
 * Endpoints protegidos pelo oauth2 resource server (US-AUTH-01, ADR-004/ADR-011): login publico,
 * credencial invalida, validacao de entrada e acesso sem token.
 */
@WebMvcTest(controllers = AuthController.class)
@Import({SecurityConfig.class, JwtConfig.class, RestAuthenticationEntryPoint.class})
@EnableConfigurationProperties(br.com.mecanicasaojorge.api.config.JwtProperties.class)
@TestPropertySource(
    properties = {"jwt.secret=01234567890123456789012345678901", "jwt.expiration-minutes=10080"})
class AuthControllerTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  @Autowired private JwtEncoder jwtEncoder;

  @MockitoBean private AuthService authService;

  @Test
  void shouldReturnOkWithTokenWhenCredentialsAreValid() throws Exception {
    LoginResponse resposta =
        new LoginResponse(
            "jwt-fake-token",
            "Bearer",
            Instant.parse("2026-11-14T00:00:00Z"),
            new UsuarioResumo(1L, "Ana Paula", "ana.paula@mecanicasaojorge.com.br", Perfil.ADMIN));
    given(authService.login(any(LoginRequest.class))).willReturn(resposta);

    mockMvc
        .perform(
            post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        new LoginRequest("ana.paula@mecanicasaojorge.com.br", "SenhaForte#1"))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").value("jwt-fake-token"))
        .andExpect(jsonPath("$.tipo").value("Bearer"))
        .andExpect(jsonPath("$.usuario.email").value("ana.paula@mecanicasaojorge.com.br"))
        .andExpect(jsonPath("$.usuario.perfil").value("ADMIN"))
        .andExpect(jsonPath("$.senha").doesNotExist())
        .andExpect(jsonPath("$.usuario.senhaHash").doesNotExist());
  }

  @Test
  void shouldReturnUnauthorizedWithStandardBodyWhenCredentialsAreInvalid() throws Exception {
    given(authService.login(any(LoginRequest.class)))
        .willThrow(new CredenciaisInvalidasException());

    mockMvc
        .perform(
            post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        new LoginRequest("ana.paula@mecanicasaojorge.com.br", "senha-errada"))))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401))
        .andExpect(jsonPath("$.mensagem").value("Credenciais inválidas"))
        .andExpect(jsonPath("$.path").value("/api/v1/auth/login"));
  }

  @Test
  void shouldReturnSameMessageWhenEmailDoesNotExist() throws Exception {
    given(authService.login(any(LoginRequest.class)))
        .willThrow(new CredenciaisInvalidasException());

    mockMvc
        .perform(
            post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        new LoginRequest("inexistente@mecanicasaojorge.com.br", "qualquer"))))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.mensagem").value("Credenciais inválidas"));
  }

  @Test
  void shouldReturnBadRequestWhenEmailAndSenhaAreBlank() throws Exception {
    mockMvc
        .perform(
            post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new LoginRequest("", ""))))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON));
  }

  @Test
  void shouldReturnUnauthorizedInStandardFormatWhenProtectedRouteHasNoToken() throws Exception {
    mockMvc
        .perform(get("/api/v1/perfil"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401))
        .andExpect(jsonPath("$.erro").value("Unauthorized"))
        .andExpect(jsonPath("$.path").value("/api/v1/perfil"));
  }

  @Test
  void shouldReturnUnauthorizedInStandardFormatWhenTokenIsMalformed() throws Exception {
    mockMvc
        .perform(get("/api/v1/perfil").header(HttpHeaders.AUTHORIZATION, "Bearer token-invalido"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401))
        .andExpect(jsonPath("$.erro").value("Unauthorized"))
        .andExpect(jsonPath("$.path").value("/api/v1/perfil"));
  }

  @Test
  void shouldReturnUnauthorizedInStandardFormatWhenTokenIsExpired() throws Exception {
    Instant emitidoEm = Instant.now().minus(8, ChronoUnit.DAYS);
    Instant expiradoEm = emitidoEm.plus(7, ChronoUnit.DAYS);
    JwtClaimsSet claims =
        JwtClaimsSet.builder()
            .issuer("mecanica-sao-jorge-api")
            .issuedAt(emitidoEm)
            .expiresAt(expiradoEm)
            .subject("1")
            .claim("perfil", "ADMIN")
            .build();
    JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
    String tokenExpirado =
        jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();

    mockMvc
        .perform(get("/api/v1/perfil").header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenExpirado))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401))
        .andExpect(jsonPath("$.erro").value("Unauthorized"))
        .andExpect(jsonPath("$.path").value("/api/v1/perfil"));
  }
}

package br.com.mecanicasaojorge.api.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.List;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Autenticacao das quatro rotas de veiculo com token forjado, usando o decodificador real (sem o
 * post-processor {@code jwt()}), contra MySQL real (F04, criterio 11; A1 do VIGIA). Placas e nomes
 * sao ficticios.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@Testcontainers
class VeiculoSegurancaIT {

  private static final String PLACA = "ABC1D23";
  private static final String MARCA = "Fiat";
  private static final String NOME_CLIENTE = "Ana Exemplo";
  private static final String ISSUER = "mecanica-sao-jorge-api";
  private static final String CORPO =
      "{\"placa\":\"QWE1R23\",\"marca\":\"HACK\",\"modelo\":\"HACK\",\"ano\":2015}";

  @Container
  static final MySQLContainer<?> MYSQL =
      new MySQLContainer<>("mysql:8.4")
          .withDatabaseName("mecanica_sao_jorge_it")
          .withUsername("mecanica_it")
          .withPassword("mecanica_it_password");

  @DynamicPropertySource
  static void datasourceProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", MYSQL::getJdbcUrl);
    registry.add("spring.datasource.username", MYSQL::getUsername);
    registry.add("spring.datasource.password", MYSQL::getPassword);
    registry.add("jwt.secret", () -> "it-test-secret-nao-usar-em-producao-0123456789");
  }

  @Autowired private MockMvc mockMvc;
  @Autowired private JdbcTemplate jdbcTemplate;
  @Autowired private JwtEncoder jwtEncoder;

  private ListAppender<ILoggingEvent> logs;
  private Logger rootLogger;
  private long clienteId;
  private long veiculoId;

  @BeforeEach
  void setUp() {
    jdbcTemplate.update("DELETE FROM veiculos");
    jdbcTemplate.update("DELETE FROM clientes");
    jdbcTemplate.update("INSERT INTO clientes (nome) VALUES (?)", NOME_CLIENTE);
    clienteId = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
    jdbcTemplate.update(
        "INSERT INTO veiculos (cliente_id, placa, modelo, marca, ano) VALUES (?, ?, 'Uno', ?,"
            + " 2015)",
        clienteId,
        PLACA,
        MARCA);
    veiculoId = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
    rootLogger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
    logs = new ListAppender<>();
    logs.start();
    rootLogger.addAppender(logs);
  }

  @AfterEach
  void tearDown() {
    rootLogger.detachAppender(logs);
  }

  @Test
  void shouldReturn200OnReadRoutesWhenTokenIsValidAndSignedWithApplicationKey() throws Exception {
    String token = assinar(jwtEncoder, MacAlgorithm.HS256, Instant.now().plus(1, ChronoUnit.HOURS));

    mockMvc
        .perform(get("/api/v1/veiculos/" + veiculoId).header(HttpHeaders.AUTHORIZATION, token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.placa").value(PLACA));
    mockMvc
        .perform(
            get("/api/v1/clientes/" + clienteId + "/veiculos")
                .header(HttpHeaders.AUTHORIZATION, token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].placa").value(PLACA));
  }

  @ParameterizedTest
  @ValueSource(strings = {"expirado", "outraChave", "algNone", "payloadAdulterado"})
  void shouldReturn401AndChangeNothingOnAllFourRoutesWhenTokenIsForged(String tipo)
      throws Exception {
    String autorizacao = forjar(tipo);
    logs.list.clear();

    for (MockHttpServletRequestBuilder requisicao :
        List.of(
            post("/api/v1/clientes/" + clienteId + "/veiculos").content(CORPO),
            put("/api/v1/veiculos/" + veiculoId).content(CORPO),
            get("/api/v1/veiculos/" + veiculoId),
            get("/api/v1/clientes/" + clienteId + "/veiculos"))) {
      MvcResult resultado =
          mockMvc
              .perform(
                  requisicao
                      .contentType(MediaType.APPLICATION_JSON)
                      .header(HttpHeaders.AUTHORIZATION, autorizacao))
              .andExpect(status().isUnauthorized())
              .andExpect(jsonPath("$.status").value(401))
              .andExpect(jsonPath("$.erros").isEmpty())
              .andReturn();

      assertThat(resultado.getResponse().getContentAsString())
          .doesNotContain(PLACA, MARCA, NOME_CLIENTE);
    }

    assertThat(jdbcTemplate.queryForObject("SELECT COUNT(*) FROM veiculos", Long.class))
        .isEqualTo(1L);
    assertThat(
            jdbcTemplate.queryForMap(
                "SELECT placa, marca, modelo FROM veiculos WHERE id = ?", veiculoId))
        .containsEntry("placa", PLACA)
        .containsEntry("marca", MARCA)
        .containsEntry("modelo", "Uno");
    assertThat(logs.list)
        .noneMatch(evento -> evento.getFormattedMessage().contains("veiculos."))
        .noneMatch(evento -> evento.getFormattedMessage().contains(PLACA));
  }

  private String forjar(String tipo) {
    Instant futuro = Instant.now().plus(1, ChronoUnit.HOURS);
    return switch (tipo) {
      case "expirado" ->
          assinar(
              jwtEncoder,
              MacAlgorithm.HS256,
              Instant.now().minus(8, ChronoUnit.DAYS),
              Instant.now().minus(1, ChronoUnit.DAYS));
      case "outraChave" -> assinar(encoderComOutraChave(), MacAlgorithm.HS256, futuro);
      case "algNone" -> tokenSemAssinatura(futuro);
      case "payloadAdulterado" -> tokenComPayloadAdulterado(futuro);
      default -> throw new IllegalArgumentException(tipo);
    };
  }

  private static NimbusJwtEncoder encoderComOutraChave() {
    byte[] outra =
        "outra-chave-qualquer-com-mais-de-32-bytes-9876543210".getBytes(StandardCharsets.UTF_8);
    return new NimbusJwtEncoder(new ImmutableSecret<>(new SecretKeySpec(outra, "HmacSHA256")));
  }

  private static String assinar(JwtEncoder encoder, MacAlgorithm algoritmo, Instant expiraEm) {
    return assinar(encoder, algoritmo, expiraEm.minus(1, ChronoUnit.HOURS), expiraEm);
  }

  private static String assinar(
      JwtEncoder encoder, MacAlgorithm algoritmo, Instant emitidoEm, Instant expiraEm) {
    JwtClaimsSet claims =
        JwtClaimsSet.builder()
            .issuer(ISSUER)
            .issuedAt(emitidoEm)
            .expiresAt(expiraEm)
            .subject("1")
            .build();
    String valor =
        encoder
            .encode(JwtEncoderParameters.from(JwsHeader.with(algoritmo).build(), claims))
            .getTokenValue();
    return "Bearer " + valor;
  }

  private static String tokenSemAssinatura(Instant expiraEm) {
    String cabecalho = base64Url("{\"alg\":\"none\",\"typ\":\"JWT\"}");
    return "Bearer " + cabecalho + "." + base64Url(payload("1", expiraEm)) + ".";
  }

  private String tokenComPayloadAdulterado(Instant expiraEm) {
    String valido = assinar(jwtEncoder, MacAlgorithm.HS256, expiraEm).substring("Bearer ".length());
    String[] partes = valido.split("\\.");
    return "Bearer " + partes[0] + "." + base64Url(payload("999", expiraEm)) + "." + partes[2];
  }

  private static String payload(String subject, Instant expiraEm) {
    return "{\"iss\":\""
        + ISSUER
        + "\",\"sub\":\""
        + subject
        + "\",\"iat\":"
        + Instant.now().getEpochSecond()
        + ",\"exp\":"
        + expiraEm.getEpochSecond()
        + "}";
  }

  private static String base64Url(String texto) {
    return Base64.getUrlEncoder()
        .withoutPadding()
        .encodeToString(texto.getBytes(StandardCharsets.UTF_8));
  }
}

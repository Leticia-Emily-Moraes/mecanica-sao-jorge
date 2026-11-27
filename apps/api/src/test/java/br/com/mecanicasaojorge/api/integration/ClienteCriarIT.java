package br.com.mecanicasaojorge.api.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
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
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * POST /api/v1/clientes de ponta a ponta contra MySQL real, com V1 a V6 aplicadas pelo Flyway e
 * {@code ddl-auto: validate} (F03c, US-CLI-15 a 20.8; ADR-020 e ADR-021). Todo dado e ficticio.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@Testcontainers
class ClienteCriarIT {

  private static final String URL = "/api/v1/clientes";
  private static final String CPF = "12345678900";
  private static final String CPF_MASCARADO = "123.456.789-00";
  private static final String TELEFONE = "11912345678";
  private static final String TELEFONE_MASCARADO = "(11) 91234-5678";

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

  @BeforeEach
  void setUp() {
    jdbcTemplate.update("DELETE FROM clientes");
    rootLogger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
    logs = new ListAppender<>();
    logs.start();
    rootLogger.addAppender(logs);
  }

  @AfterEach
  void tearDown() {
    rootLogger.detachAppender(logs);
  }

  // US-CLI-15

  @Test
  void shouldReturn201WithLocationAndStoreOnlyDigitsWhenRequestIsValid() throws Exception {
    MvcResult resultado =
        enviar(
                json(
                    "Ana Exemplo",
                    CPF_MASCARADO,
                    TELEFONE_MASCARADO,
                    "ana@example.com",
                    "Rua A, 1"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.nome").value("Ana Exemplo"))
            .andExpect(jsonPath("$.cpf").value(CPF))
            .andExpect(jsonPath("$.telefone").value(TELEFONE))
            .andExpect(jsonPath("$.email").value("ana@example.com"))
            .andExpect(jsonPath("$.endereco").value("Rua A, 1"))
            .andExpect(jsonPath("$.length()").value(6))
            .andReturn();

    long id = idDe(resultado);
    assertThat(resultado.getResponse().getHeader(HttpHeaders.LOCATION)).isEqualTo(URL + "/" + id);
    assertThat(jdbcTemplate.queryForMap("SELECT cpf, telefone FROM clientes WHERE id = ?", id))
        .containsEntry("cpf", CPF)
        .containsEntry("telefone", TELEFONE);
  }

  @Test
  void shouldCreateClientWithoutEmailAndAddressWhenOptionalFieldsAreAbsent() throws Exception {
    enviar(json("Bia Exemplo", CPF, TELEFONE, null, null))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.email").doesNotExist())
        .andExpect(jsonPath("$.endereco").doesNotExist());

    assertThat(jdbcTemplate.queryForMap("SELECT email, endereco FROM clientes"))
        .containsEntry("email", null)
        .containsEntry("endereco", null);
  }

  // US-CLI-16

  @ParameterizedTest
  @CsvSource({
    "nome,ABSENT",
    "nome,BLANK",
    "cpf,ABSENT",
    "cpf,BLANK",
    "telefone,ABSENT",
    "telefone,BLANK"
  })
  void shouldReturn400NamingFieldWhenRequiredFieldIsAbsentOrBlank(String campo, String caso)
      throws Exception {
    String nome = valor("nome", campo, caso, "Ana Exemplo");
    String cpf = valor("cpf", campo, caso, CPF);
    String telefone = valor("telefone", campo, caso, TELEFONE);

    enviar(json(nome, cpf, telefone, null, null))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.status").value(400))
        .andExpect(jsonPath("$.erro").value("Bad Request"))
        .andExpect(jsonPath("$.mensagem").value(startsWith(campo + " e obrigatorio")))
        .andExpect(jsonPath("$.path").value(URL));

    assertThat(totalClientes()).isZero();
  }

  // US-CLI-17

  @ParameterizedTest
  @ValueSource(strings = {"1234567890A", "abcdefghijk", "1234567890", "123456789012"})
  void shouldReturn400NamingCpfWithoutEchoingValueWhenCpfFormatIsInvalid(String cpfInvalido)
      throws Exception {
    String corpo =
        enviar(json("Ana Exemplo", cpfInvalido, TELEFONE, null, null))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.mensagem").value(startsWith("cpf")))
            .andReturn()
            .getResponse()
            .getContentAsString();

    assertThat(corpo).doesNotContain(cpfInvalido);
    assertThat(totalClientes()).isZero();
  }

  // US-CLI-18

  @Test
  void shouldReturn400NamingEmailWhenEmailHasNoAtSign() throws Exception {
    String corpo =
        enviar(json("Ana Exemplo", CPF, TELEFONE, "ana.example.com", null))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.mensagem").value(startsWith("email")))
            .andReturn()
            .getResponse()
            .getContentAsString();

    assertThat(corpo).doesNotContain("ana.example.com");
    assertThat(totalClientes()).isZero();
  }

  // US-CLI-19

  @Test
  void shouldNeverEchoSentValuesNorLogCpfOrPhoneWhenRequestSucceedsOrFails() throws Exception {
    enviar(json("Ana Exemplo", CPF_MASCARADO, TELEFONE_MASCARADO, "ana@example.com", "Rua A, 1"))
        .andExpect(status().isCreated());
    enviar(json("Ana Exemplo", "999.888.777-6", "(11) 9999-888", "sem-arroba", null))
        .andExpect(status().isBadRequest());
    enviar(json("Outra Ana", CPF, TELEFONE, null, null)).andExpect(status().isConflict());
    mockMvc
        .perform(post(URL).contentType(MediaType.APPLICATION_JSON).content("{\"cpf\": \"" + CPF))
        .andExpect(status().isUnauthorized());
    enviar("{\"nome\": \"Ana\", \"cpf\": ").andExpect(status().isBadRequest());

    List<String> mensagens = logs.list.stream().map(ILoggingEvent::getFormattedMessage).toList();
    assertThat(mensagens).anyMatch(m -> m.startsWith("clientes.criar clienteId="));
    assertThat(mensagens)
        .noneMatch(
            m ->
                m.contains(CPF)
                    || m.contains(CPF_MASCARADO)
                    || m.contains("123.***.***-00")
                    || m.contains("***.*56.7**-**")
                    || m.contains(TELEFONE)
                    || m.contains(TELEFONE_MASCARADO)
                    || m.contains("5678")
                    || m.contains("Ana")
                    || m.contains("ana@example.com")
                    || m.contains("Rua A"));
    imprimir("log do POST (sucesso, 400, 409, 401):", mensagens);
  }

  // US-CLI-20.3

  @ParameterizedTest
  @ValueSource(strings = {"119123456", "119123456789", "(11) 9123-456", "11 91234 56789 0"})
  void shouldReturn400NamingPhoneWhenPhoneHasLessThan10OrMoreThan11Digits(String telefone)
      throws Exception {
    String corpo =
        enviar(json("Ana Exemplo", CPF, telefone, null, null))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.mensagem").value(startsWith("telefone")))
            .andReturn()
            .getResponse()
            .getContentAsString();

    assertThat(corpo).doesNotContain(telefone);
    assertThat(totalClientes()).isZero();
  }

  @ParameterizedTest
  @CsvSource({
    "1191234567,1191234567,12345678901",
    "(11) 9123-4567,1191234567,12345678902",
    "11912345678,11912345678,12345678903",
    "(11) 91234-5678,11912345678,12345678904"
  })
  void shouldAcceptPhoneWith10Or11DigitsWithOrWithoutMask(
      String enviado, String gravado, String cpf) throws Exception {
    MvcResult resultado =
        enviar(json("Ana Exemplo", cpf, enviado, null, null))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.telefone").value(gravado))
            .andReturn();

    assertThat(
            jdbcTemplate.queryForObject(
                "SELECT telefone FROM clientes WHERE id = ?", String.class, idDe(resultado)))
        .isEqualTo(gravado);
  }

  // US-CLI-20.4

  @Test
  void shouldAcceptNameWith120CharactersAndRejectWith121() throws Exception {
    enviar(json("a".repeat(120), CPF, TELEFONE, null, null)).andExpect(status().isCreated());
    assertThat(totalClientes()).isEqualTo(1);

    enviar(json("a".repeat(121), "98765432100", TELEFONE, null, null))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.mensagem").value(startsWith("nome")));
    assertThat(totalClientes()).isEqualTo(1);
  }

  // US-CLI-20.5

  @Test
  void shouldReturn401AndCreateNothingWhenTokenIsMissingMalformedOrExpired() throws Exception {
    String corpo = json("Ana Exemplo", CPF, TELEFONE, null, null);
    Instant emitidoEm = Instant.now().minus(8, ChronoUnit.DAYS);
    JwtClaimsSet claims =
        JwtClaimsSet.builder()
            .issuer("mecanica-sao-jorge-api")
            .issuedAt(emitidoEm)
            .expiresAt(emitidoEm.plus(7, ChronoUnit.DAYS))
            .subject("1")
            .build();
    String expirado =
        jwtEncoder
            .encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
            .getTokenValue();

    for (String autorizacao : new String[] {null, "Bearer abc.def.ghi", "Bearer " + expirado}) {
      var requisicao = post(URL).contentType(MediaType.APPLICATION_JSON).content(corpo);
      if (autorizacao != null) {
        requisicao.header(HttpHeaders.AUTHORIZATION, autorizacao);
      }
      mockMvc
          .perform(requisicao)
          .andExpect(status().isUnauthorized())
          .andExpect(jsonPath("$.status").value(401));
    }

    assertThat(totalClientes()).isZero();
  }

  // US-CLI-20.6 (ADR-020: o 201 provisorio caiu; CPF repetido responde 409)

  @Test
  void shouldReturn409WithoutCpfNorExistingIdWhenCpfIsRepeatedInAnyFormat() throws Exception {
    MvcResult primeiro =
        enviar(json("Ana Exemplo", CPF, TELEFONE, null, null))
            .andExpect(status().isCreated())
            .andReturn();

    logs.list.clear();
    MvcResult segundo =
        enviar(json("Outra Ana", CPF_MASCARADO, TELEFONE, null, null))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.status").value(409))
            .andExpect(jsonPath("$.mensagem").value("CPF ja cadastrado"))
            .andReturn();

    String corpo = segundo.getResponse().getContentAsString();
    assertThat(corpo).doesNotContain(CPF, CPF_MASCARADO, "Ana", "\"id\"");
    assertThat(segundo.getResponse().getHeader(HttpHeaders.LOCATION)).isNull();
    assertThat(idDe(primeiro)).isPositive();
    assertThat(totalClientes()).isEqualTo(1);
    assertThat(logs.list)
        .noneMatch(e -> e.getLevel().isGreaterOrEqual(Level.ERROR))
        .noneMatch(e -> e.getFormattedMessage().startsWith("clientes.criar"))
        .noneMatch(e -> e.getFormattedMessage().contains(CPF));
  }

  // A1: espaco Unicode nas pontas do email (String.strip nao remove NBSP)

  @Test
  void shouldStoreTrimmedEmailAndReturn409WhenSameEmailComesBackWithNbspAtTheEdges()
      throws Exception {
    enviar(json("Ana Exemplo", CPF, TELEFONE, "\\u00A0Ana@Example.com\\u00A0", null))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.email").value("ana@example.com"));

    enviar(json("Outra Ana", "52998224725", TELEFONE, "ana@example.com\\u202F", null))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.mensagem").value("Email ja cadastrado"));

    assertThat(totalClientes()).isEqualTo(1);
  }

  @Test
  void shouldCreateExactlyOneWhenTenRequestsWithSameCpfRunConcurrently() throws Exception {
    ExecutorService pool = Executors.newFixedThreadPool(10);
    try {
      List<Callable<Integer>> tarefas = new ArrayList<>();
      for (int i = 0; i < 10; i++) {
        String corpo = json("Concorrente " + i, CPF, TELEFONE, null, null);
        tarefas.add(() -> enviar(corpo).andReturn().getResponse().getStatus());
      }
      List<Integer> codigos = new ArrayList<>();
      for (Future<Integer> f : pool.invokeAll(tarefas)) {
        codigos.add(f.get());
      }

      assertThat(codigos.stream().filter(c -> c == 201).count()).isEqualTo(1);
      assertThat(codigos.stream().filter(c -> c == 409).count()).isEqualTo(9);
      assertThat(totalClientes()).isEqualTo(1);
    } finally {
      pool.shutdownNow();
    }
  }

  @Test
  void shouldAllowManyRowsWithNullCpfWhenInsertedDirectlyInDatabase() {
    jdbcTemplate.update("INSERT INTO clientes (nome) VALUES ('Sem Cpf Um')");
    jdbcTemplate.update("INSERT INTO clientes (nome) VALUES ('Sem Cpf Dois')");

    assertThat(totalClientes()).isEqualTo(2);
  }

  // US-CLI-20.8

  @Test
  void shouldDocumentPostClientesWithRequestExampleAnd400And401And409InOpenApi() throws Exception {
    String docs =
        mockMvc
            .perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(
                    "/v3/api-docs"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.paths['/api/v1/clientes'].post").exists())
            .andExpect(
                jsonPath(
                        "$.paths['/api/v1/clientes'].post.requestBody.content['application/json']"
                            + ".examples")
                    .exists())
            .andExpect(jsonPath("$.paths['/api/v1/clientes'].post.responses['201']").exists())
            .andExpect(jsonPath("$.paths['/api/v1/clientes'].post.responses['400']").exists())
            .andExpect(jsonPath("$.paths['/api/v1/clientes'].post.responses['401']").exists())
            .andExpect(jsonPath("$.paths['/api/v1/clientes'].post.responses['409']").exists())
            .andReturn()
            .getResponse()
            .getContentAsString();

    assertThat(docs).contains("ana@example.com", "CPF ja cadastrado", "Nao autenticado");
  }

  // premissa 6: migration roda sobre o schema atual

  @Test
  void shouldApplyMigrationsV1ToV7AndKeepCheckAndUniqueConstraintsOnClientes() {
    List<String> versoes =
        jdbcTemplate.queryForList(
            "SELECT version FROM flyway_schema_history WHERE success = 1 ORDER BY installed_rank",
            String.class);
    List<String> restricoes =
        jdbcTemplate.queryForList(
            "SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE "
                + "TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'clientes' ORDER BY CONSTRAINT_NAME",
            String.class);

    assertThat(versoes).containsExactly("1", "2", "3", "4", "5", "6", "7", "8", "9", "10");
    assertThat(restricoes)
        .contains(
            "ck_clientes_cpf_digitos",
            "ck_clientes_telefone_digitos",
            "uk_clientes_cpf",
            "uk_clientes_email");
  }

  private org.springframework.test.web.servlet.ResultActions enviar(String corpo) throws Exception {
    return mockMvc.perform(
        post(URL)
            .with(jwt().jwt(j -> j.subject("3")))
            .contentType(MediaType.APPLICATION_JSON)
            .content(corpo));
  }

  private long totalClientes() {
    return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM clientes", Long.class);
  }

  private static long idDe(MvcResult resultado) throws Exception {
    String corpo = resultado.getResponse().getContentAsString();
    java.util.regex.Matcher m = java.util.regex.Pattern.compile("\"id\":(\\d+)").matcher(corpo);
    assertThat(m.find()).isTrue();
    return Long.parseLong(m.group(1));
  }

  private static String valor(String campo, String alvo, String caso, String normal) {
    if (!campo.equals(alvo)) {
      return normal;
    }
    return "ABSENT".equals(caso) ? null : "   ";
  }

  private static String json(
      String nome, String cpf, String telefone, String email, String endereco) {
    List<String> campos = new ArrayList<>();
    adicionar(campos, "nome", nome);
    adicionar(campos, "cpf", cpf);
    adicionar(campos, "telefone", telefone);
    adicionar(campos, "email", email);
    adicionar(campos, "endereco", endereco);
    return "{" + String.join(",", campos) + "}";
  }

  private static void adicionar(List<String> campos, String chave, String valor) {
    if (valor != null) {
      campos.add("\"" + chave + "\":\"" + valor + "\"");
    }
  }

  private static void imprimir(String titulo, List<String> linhas) {
    System.out.println("== " + titulo);
    linhas.stream().filter(l -> l.startsWith("clientes.")).forEach(System.out::println);
  }
}

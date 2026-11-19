package br.com.mecanicasaojorge.api.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
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
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * PUT /api/v1/clientes/{id} de ponta a ponta contra MySQL real, com V1 a V8 aplicadas pelo Flyway e
 * {@code ddl-auto: validate} (F03d, US-CLI-21 a 33; ADR-020, ADR-026 e ADR-027). Todo dado e
 * ficticio.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@Testcontainers
class ClienteAtualizarIT {

  private static final String URL = "/api/v1/clientes";
  private static final String CPF_A = "11111111111";
  private static final String CPF_B = "22222222222";
  private static final String CPF_C = "33333333333";
  private static final String TEL = "11912345678";

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

  private ListAppender<ILoggingEvent> logs;
  private Logger rootLogger;
  private long idA;
  private long idB;

  @BeforeEach
  void setUp() {
    jdbcTemplate.update("DELETE FROM clientes");
    idA = inserir("Ana Antiga", CPF_A, "ana@example.com", "Rua Velha, 1");
    idB = inserir("Beto Exemplo", CPF_B, "beto@example.com", null);
    rootLogger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
    logs = new ListAppender<>();
    logs.start();
    rootLogger.addAppender(logs);
  }

  @AfterEach
  void tearDown() {
    rootLogger.detachAppender(logs);
  }

  // US-CLI-21

  @Test
  void shouldReturn200WithNewDataAndDetailReturnsSameValuesWhenRequestIsValid() throws Exception {
    enviar(
            idA,
            json("Ana Nova", "123.456.789-00", "(11) 3456-7890", "nova@example.com", "Rua Nova, 2"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(idA))
        .andExpect(jsonPath("$.nome").value("Ana Nova"))
        .andExpect(jsonPath("$.cpf").value("12345678900"))
        .andExpect(jsonPath("$.telefone").value("1134567890"))
        .andExpect(jsonPath("$.email").value("nova@example.com"))
        .andExpect(jsonPath("$.endereco").value("Rua Nova, 2"))
        .andExpect(jsonPath("$.length()").value(6));

    mockMvc
        .perform(get(URL + "/" + idA).with(jwt()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.nome").value("Ana Nova"))
        .andExpect(jsonPath("$.cpf").value("12345678900"))
        .andExpect(jsonPath("$.telefone").value("1134567890"))
        .andExpect(jsonPath("$.email").value("nova@example.com"))
        .andExpect(jsonPath("$.endereco").value("Rua Nova, 2"));
  }

  @Test
  void shouldReplaceOptionalFieldsWithNullAndKeepCreatedAtWhenTheyAreOmitted() throws Exception {
    Object criadoEm =
        jdbcTemplate.queryForObject(
            "SELECT created_at FROM clientes WHERE id = ?", Object.class, idA);

    enviar(idA, json("Ana Nova", CPF_A, TEL, null, null))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").doesNotExist())
        .andExpect(jsonPath("$.endereco").doesNotExist());

    assertThat(linha(idA)).containsEntry("email", null).containsEntry("endereco", null);
    assertThat(
            jdbcTemplate.queryForObject(
                "SELECT created_at FROM clientes WHERE id = ?", Object.class, idA))
        .isEqualTo(criadoEm);
  }

  // US-CLI-22

  @ParameterizedTest
  @CsvSource({"nome", "cpf", "telefone"})
  void shouldReturn400NamingFieldAndChangeNothingWhenRequiredFieldIsBlank(String campo)
      throws Exception {
    String corpo =
        json(
            "nome".equals(campo) ? "  " : "Outro Nome",
            "cpf".equals(campo) ? "" : "99999999999",
            "telefone".equals(campo) ? null : TEL,
            "outro@example.com",
            "Outro Endereco");

    enviar(idA, corpo)
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.status").value(400))
        .andExpect(jsonPath("$.erro").value("Bad Request"))
        .andExpect(jsonPath("$.mensagem").value(startsWith(campo + " e obrigatorio")))
        .andExpect(jsonPath("$.path").value(URL + "/" + idA));

    assertThatClienteAIsUnchanged();
  }

  @Test
  void shouldReturn400WithoutEchoingValueAndChangeNothingWhenCpfAndEmailAreInvalid()
      throws Exception {
    String corpo =
        enviar(idA, json("Ana Nova", "1234567890A", TEL, "sem-arroba", null))
            .andExpect(status().isBadRequest())
            .andReturn()
            .getResponse()
            .getContentAsString();

    assertThat(corpo).doesNotContain("1234567890A", "sem-arroba");
    assertThatClienteAIsUnchanged();
  }

  // US-CLI-23

  @Test
  void shouldReturn404InGlobalFormatWhenIdDoesNotExist() throws Exception {
    enviar(987654L, json("Ana Nova", CPF_A, TEL, null, null))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.status").value(404))
        .andExpect(jsonPath("$.erro").value("Not Found"))
        .andExpect(jsonPath("$.mensagem").value("Cliente nao encontrado"))
        .andExpect(jsonPath("$.path").value(URL + "/987654"))
        .andExpect(jsonPath("$.timestamp").exists());

    assertThat(totalClientes()).isEqualTo(2);
  }

  // US-CLI-27

  @Test
  void shouldReturn409NamingCpfWithoutValueNorOtherIdAndChangeNothingWhenCpfBelongsToAnother()
      throws Exception {
    logs.list.clear();
    MvcResult resultado =
        enviar(idA, json("Ana Nova", "222.222.222-22", "11900000000", "novo@example.com", "X"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.status").value(409))
            .andExpect(jsonPath("$.erro").value("Conflict"))
            .andExpect(jsonPath("$.mensagem").value("CPF ja cadastrado"))
            .andExpect(jsonPath("$.erros").isEmpty())
            .andExpect(jsonPath("$.path").value(URL + "/" + idA))
            .andReturn();

    String corpo = resultado.getResponse().getContentAsString();
    assertThat(corpo).doesNotContain(CPF_B, "222.222.222-22", "Beto", "\"id\"");
    assertThatClienteAIsUnchanged();
    assertThat(logs.list)
        .noneMatch(e -> e.getLevel().isGreaterOrEqual(Level.ERROR))
        .anyMatch(
            e ->
                e.getFormattedMessage()
                    .equals(
                        "clientes.editar.conflito clienteId=" + idA + " usuarioId=3 campo=cpf"));
  }

  // US-CLI-28

  @Test
  void shouldReturn200WhenOnlyPhoneChangesAndCpfIsSentWithDifferentPunctuation() throws Exception {
    enviar(idA, json("Ana Antiga", "111.111.111-11", "11988887777", "ana@example.com", null))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.cpf").value(CPF_A))
        .andExpect(jsonPath("$.telefone").value("11988887777"));

    assertThat(linha(idA)).containsEntry("telefone", "11988887777").containsEntry("cpf", CPF_A);
  }

  // US-CLI-31

  @ParameterizedTest
  @CsvSource(
      value = {"BETO@EXAMPLE.COM", "'  beto@example.com  '", "' Beto@Example.com'"},
      quoteCharacter = '\'')
  void shouldReturn409NamingEmailWithoutValueNorOtherIdWhenEmailBelongsToAnother(String email)
      throws Exception {
    MvcResult resultado =
        enviar(idA, json("Ana Nova", "99999999999", "11900000000", email, "X"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.mensagem").value("Email ja cadastrado"))
            .andExpect(jsonPath("$.erros").isEmpty())
            .andExpect(jsonPath("$.path").value(URL + "/" + idA))
            .andReturn();

    String corpo = resultado.getResponse().getContentAsString();
    assertThat(corpo.toLowerCase()).doesNotContain("beto", "\"id\"");
    assertThatClienteAIsUnchanged();
    assertThat(logs.list).noneMatch(e -> e.getLevel().isGreaterOrEqual(Level.ERROR));
  }

  // A1: espaco Unicode nas pontas do email (String.strip nao remove NBSP)

  @ParameterizedTest
  @ValueSource(
      strings = {
        "\\u00A0beto@example.com",
        "beto@example.com\\u00A0",
        "\\u2007beto@example.com\\u202F"
      })
  void shouldReturn409NamingEmailWhenEmailBelongsToAnotherAndHasUnicodeSpaceAtTheEdges(
      String email) throws Exception {
    enviar(idA, json("Ana Nova", "99999999999", "11900000000", email, "X"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.mensagem").value("Email ja cadastrado"));

    assertThatClienteAIsUnchanged();
  }

  @Test
  void shouldStoreEmailWithoutUnicodeSpaceWhenSameEmailIsSentWithNbspAtTheEdges() throws Exception {
    enviar(idA, json("Ana Antiga", CPF_A, "11988887777", "\\u00A0ANA@Example.COM\\u00A0", null))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("ana@example.com"));

    assertThat(linha(idA)).containsEntry("email", "ana@example.com");
  }

  // US-CLI-32

  @Test
  void shouldReturn200AndStoreLowercaseWhenSameEmailIsSentWithDifferentCase() throws Exception {
    enviar(idA, json("Ana Antiga", CPF_A, "11988887777", "  ANA@Example.COM ", null))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("ana@example.com"));

    assertThat(linha(idA)).containsEntry("email", "ana@example.com");
  }

  // US-CLI-33

  @Test
  void shouldReturnOne200AndOne409WithoutAny500WhenTwoClientsEditToSameCpf() throws Exception {
    long idC = inserir("Cida Exemplo", CPF_C, "cida@example.com", null);

    List<Integer> codigos =
        emParalelo(
            () -> enviar(idA, json("A", "44444444444", TEL, "a@example.com", null)),
            () -> enviar(idC, json("C", "44444444444", TEL, "c@example.com", null)));

    assertThat(codigos).containsExactlyInAnyOrder(200, 409);
    assertThat(
            jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM clientes WHERE cpf = '44444444444'", Long.class))
        .isEqualTo(1);
  }

  @Test
  void shouldReturnOne200AndOne409WithoutAny500WhenTwoClientsEditToSameEmail() throws Exception {
    long idC = inserir("Cida Exemplo", CPF_C, "cida@example.com", null);

    List<Integer> codigos =
        emParalelo(
            () -> enviar(idA, json("A", CPF_A, TEL, "mesmo@example.com", null)),
            () -> enviar(idC, json("C", CPF_C, TEL, "MESMO@example.com", null)));

    assertThat(codigos).containsExactlyInAnyOrder(200, 409);
    assertThat(
            jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM clientes WHERE email = 'mesmo@example.com'", Long.class))
        .isEqualTo(1);
  }

  @Test
  void shouldNeverReturn500WhenManyClientsEditToSameCpfAndEmailAtOnce() throws Exception {
    List<Long> ids = new ArrayList<>();
    for (int i = 0; i < 6; i++) {
      ids.add(inserir("Cliente " + i, "5000000000" + i, "c" + i + "@example.com", null));
    }
    List<Callable<ResultActions>> chamadas = new ArrayList<>();
    for (long id : ids) {
      chamadas.add(() -> enviar(id, json("Z", "55555555555", TEL, "z@example.com", null)));
    }

    List<Integer> codigos = emParalelo(chamadas);

    assertThat(codigos).doesNotContain(500).containsOnly(200, 409);
    assertThat(codigos.stream().filter(c -> c == 200).count()).isEqualTo(1);
  }

  // US-CLI-29

  @Test
  void shouldReturn401AndChangeNothingWhenTokenIsMissingOrInvalid() throws Exception {
    String corpo = json("Ana Nova", CPF_A, TEL, null, null);

    mockMvc
        .perform(put(URL + "/" + idA).contentType(MediaType.APPLICATION_JSON).content(corpo))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401))
        .andExpect(jsonPath("$.erro").value("Unauthorized"));
    mockMvc
        .perform(
            put(URL + "/" + idA)
                .header("Authorization", "Bearer abc.def.ghi")
                .contentType(MediaType.APPLICATION_JSON)
                .content(corpo))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401));

    assertThatClienteAIsUnchanged();
  }

  // US-CLI-30

  @Test
  void shouldChangeOnlyPathClientAndIgnoreBodyIdWhenBodyIdDiffers() throws Exception {
    String corpo =
        "{\"id\":"
            + idB
            + ",\"createdAt\":\"2000-01-01T00:00:00Z\",\"nome\":\"Ana Nova\","
            + "\"cpf\":\""
            + CPF_A
            + "\",\"telefone\":\""
            + TEL
            + "\"}";

    enviar(idA, corpo)
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(idA))
        .andExpect(jsonPath("$.nome").value("Ana Nova"));

    assertThat(linha(idB))
        .containsEntry("nome", "Beto Exemplo")
        .containsEntry("cpf", CPF_B)
        .containsEntry("email", "beto@example.com");
    assertThat(totalClientes()).isEqualTo(2);
  }

  // US-CLI-25

  @Test
  void shouldNeverLogCpfPhoneEmailNorBodyWhenEditSucceedsOrFails() throws Exception {
    enviar(
            idA,
            json(
                "Ana Sigilosa",
                "777.888.999-00",
                "(11) 97777-6666",
                "sigilo@example.com",
                "Rua Secreta, 9"))
        .andExpect(status().isOk());
    enviar(
            idA,
            json("Ana Sigilosa", "222.222.222-22", "(11) 97777-6666", "outro@example.com", null))
        .andExpect(status().isConflict());
    enviar(idA, json("Ana Sigilosa", "77788899900", "(11) 97777-6666", "BETO@example.com", null))
        .andExpect(status().isConflict());
    enviar(987654L, json("Ana Sigilosa", "77788899900", "(11) 97777-6666", null, null))
        .andExpect(status().isNotFound());
    enviar(idA, json("Ana Sigilosa", "7", "(11) 97777-6666", "sigilo@example.com", null))
        .andExpect(status().isBadRequest());

    List<String> mensagens = logs.list.stream().map(ILoggingEvent::getFormattedMessage).toList();
    assertThat(mensagens)
        .anyMatch(m -> m.startsWith("clientes.editar clienteId=" + idA))
        .anyMatch(m -> m.startsWith("clientes.editar.naoEncontrado"))
        .anyMatch(m -> m.contains("campo=cpf"))
        .anyMatch(m -> m.contains("campo=email"));
    assertThat(mensagens)
        .noneMatch(
            m ->
                m.contains("77788899900")
                    || m.contains("777.888.999-00")
                    || m.contains("97777")
                    || m.contains("6666")
                    || m.contains("sigilo")
                    || m.contains("Sigilosa")
                    || m.contains("Rua Secreta")
                    || m.contains("222222")
                    || m.contains("beto@"));
  }

  // OpenAPI

  @Test
  void shouldDocumentPutClientesWith200And400And401And404And409InOpenApi() throws Exception {
    mockMvc
        .perform(get("/v3/api-docs"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.paths['/api/v1/clientes/{id}'].put").exists())
        .andExpect(jsonPath("$.paths['/api/v1/clientes/{id}'].put.responses['200']").exists())
        .andExpect(jsonPath("$.paths['/api/v1/clientes/{id}'].put.responses['400']").exists())
        .andExpect(jsonPath("$.paths['/api/v1/clientes/{id}'].put.responses['401']").exists())
        .andExpect(jsonPath("$.paths['/api/v1/clientes/{id}'].put.responses['404']").exists())
        .andExpect(jsonPath("$.paths['/api/v1/clientes/{id}'].put.responses['409']").exists());
  }

  // ADR-026: indice no banco

  @Test
  void shouldRejectDuplicateEmailDirectlyInDatabaseButAllowManyNullEmails() {
    inserir("Sem Email Um", "60000000001", null, null);
    inserir("Sem Email Dois", "60000000002", null, null);

    assertThat(
            org.junit.jupiter.api.Assertions.assertThrows(
                org.springframework.dao.DuplicateKeyException.class,
                () -> inserir("Repetido", "60000000003", "ana@example.com", null)))
        .isNotNull();
  }

  private void assertThatClienteAIsUnchanged() {
    assertThat(linha(idA))
        .containsEntry("nome", "Ana Antiga")
        .containsEntry("cpf", CPF_A)
        .containsEntry("telefone", TEL)
        .containsEntry("email", "ana@example.com")
        .containsEntry("endereco", "Rua Velha, 1");
  }

  private java.util.Map<String, Object> linha(long id) {
    return jdbcTemplate.queryForMap(
        "SELECT nome, cpf, telefone, email, endereco FROM clientes WHERE id = ?", id);
  }

  private long inserir(String nome, String cpf, String email, String endereco) {
    jdbcTemplate.update(
        "INSERT INTO clientes (nome, cpf, telefone, email, endereco) VALUES (?, ?, ?, ?, ?)",
        nome,
        cpf,
        TEL,
        email,
        endereco);
    return jdbcTemplate.queryForObject("SELECT MAX(id) FROM clientes", Long.class);
  }

  private long totalClientes() {
    return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM clientes", Long.class);
  }

  private ResultActions enviar(long id, String corpo) throws Exception {
    return mockMvc.perform(
        put(URL + "/" + id)
            .with(jwt().jwt(j -> j.subject("3")))
            .contentType(MediaType.APPLICATION_JSON)
            .content(corpo));
  }

  @SafeVarargs
  private static List<Integer> emParalelo(Callable<ResultActions>... chamadas) throws Exception {
    return emParalelo(List.of(chamadas));
  }

  /** Dispara todas as chamadas juntas, soltas por uma trava, e devolve so os status HTTP. */
  private static List<Integer> emParalelo(List<Callable<ResultActions>> chamadas) throws Exception {
    ExecutorService pool = Executors.newFixedThreadPool(chamadas.size());
    CountDownLatch largada = new CountDownLatch(1);
    try {
      List<Future<Integer>> futuros = new ArrayList<>();
      for (Callable<ResultActions> chamada : chamadas) {
        futuros.add(
            pool.submit(
                () -> {
                  largada.await();
                  return chamada.call().andReturn().getResponse().getStatus();
                }));
      }
      largada.countDown();
      List<Integer> codigos = new ArrayList<>();
      for (Future<Integer> futuro : futuros) {
        codigos.add(futuro.get());
      }
      return codigos;
    } finally {
      pool.shutdownNow();
    }
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
}

package br.com.mecanicasaojorge.api.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * GET /api/v1/clientes/{id} de ponta a ponta contra MySQL real (todas as migrations do zero, V4
 * incluida): 200, 404 (nunca 500), 400, 401, 405, log e CHECK do CPF (F03b, US-CLI-DET-02, 04, 05,
 * 06 e 11; ADR-018 e ADR-019).
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@Testcontainers
class ClienteDetalheIT {

  private static final String URL = "/api/v1/clientes";
  private static final String CPF = "12345678900";
  private static final String TELEFONE = "11912345678";

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

  @Test
  void shouldReturnFullDetailWithSixFieldsWhenClientExists() throws Exception {
    long id =
        inserir(
            "Ana Exemplo", TELEFONE, "ana@example.com", CPF, "Rua Modelo, 100 - Jardim Exemplo");

    mockMvc
        .perform(get(URL + "/" + id).with(jwt().jwt(j -> j.subject("3"))))
        .andExpect(status().isOk())
        .andExpect(header().string("Cache-Control", containsString("no-store")))
        .andExpect(jsonPath("$.id").value(id))
        .andExpect(jsonPath("$.nome").value("Ana Exemplo"))
        .andExpect(jsonPath("$.cpf").value(CPF))
        .andExpect(jsonPath("$.telefone").value(TELEFONE))
        .andExpect(jsonPath("$.email").value("ana@example.com"))
        .andExpect(jsonPath("$.endereco").value("Rua Modelo, 100 - Jardim Exemplo"))
        .andExpect(jsonPath("$.createdAt").doesNotExist())
        .andExpect(jsonPath("$.length()").value(6));
  }

  @Test
  void shouldReturnNullsPresentWhenClientWasCreatedBeforeV4Columns() throws Exception {
    long id = inserir("Bia Exemplo", null, null, null, null);

    mockMvc
        .perform(get(URL + "/" + id).with(jwt()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(6))
        .andExpect(jsonPath("$.cpf").value(nullValue()))
        .andExpect(jsonPath("$.telefone").value(nullValue()))
        .andExpect(jsonPath("$.email").value(nullValue()))
        .andExpect(jsonPath("$.endereco").value(nullValue()));
  }

  @Test
  void shouldNotExposeCpfOrAddressInListingWhenColumnsArePopulated() throws Exception {
    inserir("Ana Exemplo", TELEFONE, "ana@example.com", CPF, "Rua Modelo, 100");

    String corpo =
        mockMvc
            .perform(get(URL).with(jwt()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.itens[0].length()").value(4))
            .andReturn()
            .getResponse()
            .getContentAsString();

    assertThat(corpo).doesNotContain(CPF, "Rua Modelo", "endereco", "cpf");
  }

  @Test
  void shouldReturnNotFoundNotServerErrorWhenIdDoesNotExist() throws Exception {
    String corpo =
        mockMvc
            .perform(get(URL + "/999999").with(jwt().jwt(j -> j.subject("3"))))
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
    assertThat(logs.list).noneMatch(e -> e.getLevel().toInt() >= 40000);
  }

  @Test
  void shouldReturnBadRequestWhenIdIsInvalid() throws Exception {
    for (String id : List.of("abc", "0", "-1", "99999999999999999999")) {
      mockMvc
          .perform(get(URL + "/" + id).with(jwt()))
          .andExpect(status().isBadRequest())
          .andExpect(jsonPath("$.status").value(400))
          .andExpect(jsonPath("$.mensagem").value("Parametro invalido: id"))
          .andExpect(jsonPath("$.path").value(URL + "/" + id));
    }
  }

  @Test
  void shouldReturnUnauthorizedWithoutQueryingWhenTokenIsMissingOrInvalid() throws Exception {
    long id = inserir("Ana Exemplo", TELEFONE, null, CPF, null);

    String semToken =
        mockMvc
            .perform(get(URL + "/" + id))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.status").value(401))
            .andExpect(jsonPath("$.erro").value("Unauthorized"))
            .andExpect(jsonPath("$.path").value(URL + "/" + id))
            .andReturn()
            .getResponse()
            .getContentAsString();
    String tokenInvalido =
        mockMvc
            .perform(get(URL + "/" + id).header("Authorization", "Bearer abc.def.ghi"))
            .andExpect(status().isUnauthorized())
            .andReturn()
            .getResponse()
            .getContentAsString();

    assertThat(semToken + tokenInvalido).doesNotContain(CPF, "Ana");
    assertThat(logs.list).noneMatch(e -> e.getFormattedMessage().startsWith("clientes.detalhar"));
  }

  @Test
  void shouldReturnMethodNotAllowedWithAllowGetWhenDeletingClient() throws Exception {
    long id = inserir("Ana Exemplo", null, null, null, null);

    mockMvc
        .perform(delete(URL + "/" + id).with(jwt()))
        .andExpect(status().isMethodNotAllowed())
        .andExpect(header().string("Allow", containsString("GET")))
        .andExpect(jsonPath("$.mensagem").value("Metodo nao permitido"));
  }

  @Test
  void shouldLogOnlyIdsWithoutAnyPersonalDataWhenDetailIsRequested() throws Exception {
    long id = inserir("Ana Exemplo", TELEFONE, "ana@example.com", CPF, "Rua Modelo, 100");

    mockMvc
        .perform(get(URL + "/" + id).with(jwt().jwt(j -> j.subject("3"))))
        .andExpect(status().isOk());
    mockMvc
        .perform(get(URL + "/999999").with(jwt().jwt(j -> j.subject("3"))))
        .andExpect(status().isNotFound());
    mockMvc.perform(get(URL + "/abc").with(jwt())).andExpect(status().isBadRequest());
    mockMvc.perform(get(URL + "/" + id)).andExpect(status().isUnauthorized());

    List<String> mensagens = logs.list.stream().map(ILoggingEvent::getFormattedMessage).toList();
    assertThat(mensagens)
        .contains(
            "clientes.detalhar clienteId=" + id + " usuarioId=3",
            "clientes.detalhar.naoEncontrado clienteId=999999 usuarioId=3");
    assertThat(mensagens)
        .noneMatch(
            m ->
                m.contains(CPF)
                    || m.contains(TELEFONE)
                    || m.contains("123.***.***-00")
                    || m.contains("***.*56.7**-**")
                    || m.contains("Ana")
                    || m.contains("ana@example.com")
                    || m.contains("Rua Modelo")
                    || m.contains("(11) 91234-5678")
                    || m.contains("5678"));
  }

  @Test
  void shouldRejectCpfOutsideElevenDigitsWhenInsertingDirectlyInDatabase() {
    for (String cpfInvalido : List.of("123.456.789-00", "1234567890", "", "abcdefghijk")) {
      assertThatThrownBy(() -> inserir("Cli Invalido", null, null, cpfInvalido, null))
          .isInstanceOf(DataAccessException.class);
    }
  }

  @Test
  void shouldCreateOptionalCpfAndAddressColumnsWhenMigrationsRanFromScratch() {
    // V4 e aditiva: coluna nova aceita NULL e nao exige default (ADR-018, regra 1)
    List<String> colunas =
        jdbcTemplate.queryForList(
            "SELECT CONCAT(COLUMN_NAME, ':', IS_NULLABLE, ':', COLUMN_TYPE) FROM "
                + "information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = "
                + "'clientes' AND COLUMN_NAME IN ('cpf','endereco') ORDER BY COLUMN_NAME",
            String.class);

    assertThat(colunas).containsExactly("cpf:YES:varchar(11)", "endereco:YES:varchar(255)");
  }

  private long inserir(String nome, String telefone, String email, String cpf, String endereco) {
    jdbcTemplate.update(
        "INSERT INTO clientes (nome, telefone, email, cpf, endereco) VALUES (?, ?, ?, ?, ?)",
        nome,
        telefone,
        email,
        cpf,
        endereco);
    return jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
  }
}

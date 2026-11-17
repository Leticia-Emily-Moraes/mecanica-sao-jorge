package br.com.mecanicasaojorge.api.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doThrow;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.mecanicasaojorge.api.exception.GlobalExceptionHandler;
import br.com.mecanicasaojorge.api.service.ClienteService;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import com.jayway.jsonpath.JsonPath;
import java.util.List;
import org.assertj.core.api.ListAssert;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * GET /api/v1/clientes de ponta a ponta contra MySQL real (Testcontainers, todas as migrations do
 * zero): busca, curingas literais, telefone por digitos, paginacao, 400, 401, 500 e formato do DTO
 * (F03a, US-CLI-01 a US-CLI-06a; ADR-017).
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@Testcontainers
class ClienteListagemIT {

  private static final String URL = "/api/v1/clientes";

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

  @MockitoSpyBean private ClienteService clienteService;

  @BeforeEach
  void limparClientes() {
    jdbcTemplate.update("DELETE FROM clientes");
  }

  @Test
  void shouldUseUtf8mb4SessionAndFixedCollationWhenMigrationsRanFromScratch() {
    assertThat(jdbcTemplate.queryForObject("SELECT @@character_set_connection", String.class))
        .isEqualTo("utf8mb4");

    List<String> collations =
        jdbcTemplate.queryForList(
            "SELECT COLLATION_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() "
                + "AND TABLE_NAME = 'clientes' AND COLUMN_NAME IN ('nome','telefone','email')",
            String.class);
    assertThat(collations).hasSize(3).containsOnly("utf8mb4_0900_ai_ci");
  }

  @Test
  void shouldFindByNameIgnoringCaseAndAccentWhenTermIsPartOfName() throws Exception {
    inserir("José Antônio", "11987654321", "jose@example.com");
    inserir("Maria Souza", null, null);

    nomes("jose").containsExactly("José Antônio");
    nomes("JOSÉ").containsExactly("José Antônio");
    nomes("antonio").containsExactly("José Antônio");
    nomes("ANTÔNIO").containsExactly("José Antônio");
  }

  @Test
  void shouldFindByEmailFragmentWhenTermMatchesEmail() throws Exception {
    inserir("José Antônio", null, "jose.antonio@oficina.example");
    inserir("Maria Souza", null, "maria@example.com");

    nomes("oficina.EXAMPLE").containsExactly("José Antônio");
  }

  @Test
  void shouldFindByPhoneDigitsWhenTermHasMaskOrNot() throws Exception {
    inserir("Ana Lima", "11987654321", null);
    inserir("Bruno Reis", "2133334444", null);

    nomes("(11) 98765-4321").containsExactly("Ana Lima");
    nomes("98765").containsExactly("Ana Lima");
    nomes("11987654321").containsExactly("Ana Lima");
    nomes("3333-4444").containsExactly("Bruno Reis");
  }

  @Test
  void shouldTreatWildcardsAndEscapeAsLiteralTextWhenTermHasSpecialCharacters() throws Exception {
    inserir("100% Peças", null, null);
    inserir("Carlos Dias", null, "carlos_dias@example.com");
    inserir("Barra\\Invertida", null, null);
    inserir("Uau! Auto", null, null);
    inserir("Joana Plain", null, "joana@example.com");

    nomes("%").containsExactly("100% Peças");
    nomes("_").containsExactly("Carlos Dias");
    nomes("\\").containsExactly("Barra\\Invertida");
    nomes("uau!").containsExactly("Uau! Auto");
    nomes("' OR '1'='1").isEmpty();
    nomes("a'; DROP TABLE clientes; --").isEmpty();
    assertThat(jdbcTemplate.queryForObject("SELECT COUNT(*) FROM clientes", Integer.class))
        .isEqualTo(5);
  }

  @Test
  void shouldNotMatchPhoneWhenTermHasOnlyLetters() throws Exception {
    inserir("Zed", "11000000000", null);
    inserir("Ana Paula", null, null);

    nomes("ana").containsExactly("Ana Paula");
  }

  @Test
  void shouldFindDecomposedAccentWhenTermIsInNfd() throws Exception {
    inserir("José Antônio", null, null);

    nomes("José").containsExactly("José Antônio");
  }

  @Test
  void shouldReturnEmptyPageWithZeroTotalsWhenNothingMatches() throws Exception {
    inserir("Ana Lima", null, null);

    listar("zzzz")
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens").isEmpty())
        .andExpect(jsonPath("$.totalItens").value(0))
        .andExpect(jsonPath("$.totalPaginas").value(0));
  }

  @Test
  void shouldListWithoutFilterWhenTermIsMissingEmptyOrBlank() throws Exception {
    inserir("Ana Lima", null, null);
    inserir("Bruno Reis", null, null);

    mockMvc
        .perform(get(URL).with(jwt()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.totalItens").value(2));
    nomes("").containsExactly("Ana Lima", "Bruno Reis");
    nomes("   ").containsExactly("Ana Lima", "Bruno Reis");
  }

  @Test
  void shouldPaginateOrderedByNameWhenThereAre25Clients() throws Exception {
    for (int i = 25; i >= 1; i--) {
      inserir("Cliente %02d".formatted(i), null, null);
    }

    mockMvc
        .perform(get(URL).param("size", "10").with(jwt()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens.length()").value(10))
        .andExpect(jsonPath("$.itens[0].nome").value("Cliente 01"))
        .andExpect(jsonPath("$.itens[9].nome").value("Cliente 10"))
        .andExpect(jsonPath("$.pagina").value(0))
        .andExpect(jsonPath("$.tamanho").value(10))
        .andExpect(jsonPath("$.totalItens").value(25))
        .andExpect(jsonPath("$.totalPaginas").value(3));
    mockMvc
        .perform(get(URL).param("size", "10").param("page", "2").with(jwt()))
        .andExpect(jsonPath("$.itens.length()").value(5))
        .andExpect(jsonPath("$.itens[0].nome").value("Cliente 21"));
  }

  @Test
  void shouldReturnEmptyItemsWithRealTotalWhenPageIsBeyondTheEnd() throws Exception {
    for (int i = 1; i <= 25; i++) {
      inserir("Cliente %02d".formatted(i), null, null);
    }

    mockMvc
        .perform(get(URL).param("size", "10").param("page", "5").with(jwt()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens").isEmpty())
        .andExpect(jsonPath("$.pagina").value(5))
        .andExpect(jsonPath("$.totalItens").value(25))
        .andExpect(jsonPath("$.totalPaginas").value(3));
  }

  @Test
  void shouldBreakNameTieByIdWhenNamesDifferOnlyByAccent() throws Exception {
    long primeiro = inserir("Alvaro", null, null);
    long segundo = inserir("Álvaro", null, null);

    listar("alvaro")
        .andExpect(jsonPath("$.itens[0].id").value(primeiro))
        .andExpect(jsonPath("$.itens[1].id").value(segundo));
  }

  @Test
  void shouldReturnOnlyIdNameTelefoneAndEmailWhenListing() throws Exception {
    inserir("Ana Lima", "11987654321", "ana@example.com");

    String corpo =
        listar("ana").andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

    assertThat(corpo)
        .contains("\"id\"", "\"nome\"", "\"telefone\"", "\"email\"")
        .doesNotContain("cpf", "endereco", "createdAt", "created_at");
    listar("ana").andExpect(jsonPath("$.itens[0].length()").value(4));
  }

  @Test
  void shouldReturnBadRequestWhenParametersAreInvalid() throws Exception {
    for (String[] par :
        new String[][] {
          {"size", "0"}, {"size", "101"}, {"size", "abc"}, {"page", "-1"}, {"q", "x".repeat(101)}
        }) {
      mockMvc
          .perform(get(URL).param(par[0], par[1]).with(jwt()))
          .andExpect(status().isBadRequest())
          .andExpect(jsonPath("$.status").value(400))
          .andExpect(jsonPath("$.mensagem").value("Parametro invalido: " + par[0]));
    }
  }

  @Test
  void shouldReturnUnauthorizedWhenThereIsNoToken() throws Exception {
    inserir("Ana Lima", null, null);

    mockMvc
        .perform(get(URL))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.itens").doesNotExist());
  }

  @Test
  void shouldReturnInternalErrorWithoutLeakingDataWhenDatabaseFails() throws Exception {
    Logger logger = (Logger) LoggerFactory.getLogger(GlobalExceptionHandler.class);
    ListAppender<ILoggingEvent> logs = new ListAppender<>();
    logs.start();
    logger.addAppender(logs);
    try {
      doThrow(
              new DataAccessResourceFailureException(
                  "Communications link failure para cliente Joao Silva 11987654321"))
          .when(clienteService)
          .listar(any(), anyInt(), anyInt(), any());

      String corpo =
          mockMvc
              .perform(get(URL).param("q", "Joao Silva").with(jwt()))
              .andExpect(status().isInternalServerError())
              .andExpect(jsonPath("$.status").value(500))
              .andExpect(jsonPath("$.mensagem").value("Erro interno inesperado"))
              .andExpect(jsonPath("$.path").value(URL))
              .andReturn()
              .getResponse()
              .getContentAsString();

      assertThat(corpo)
          .doesNotContain("Joao", "Silva", "11987654321", "Communications", "SQL", "at br.com");
      assertThat(logs.list).hasSize(1);
      String registro = logs.list.get(0).getFormattedMessage();
      assertThat(registro).contains("DataAccessResourceFailureException").contains(URL);
      assertThat(registro).doesNotContain("Joao", "Silva", "11987654321");
      assertThat(logs.list.get(0).getThrowableProxy()).isNull();
    } finally {
      logger.detachAppender(logs);
    }
  }

  private ListAssert<String> nomes(String q) throws Exception {
    String json =
        listar(q).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    return assertThat(JsonPath.<List<String>>read(json, "$.itens[*].nome"));
  }

  private ResultActions listar(String q) throws Exception {
    return mockMvc.perform(get(URL).param("q", q).with(jwt()));
  }

  private long inserir(String nome, String telefone, String email) {
    jdbcTemplate.update(
        "INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)", nome, telefone, email);
    return jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
  }
}

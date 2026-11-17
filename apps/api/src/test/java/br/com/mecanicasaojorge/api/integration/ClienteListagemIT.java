package br.com.mecanicasaojorge.api.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doThrow;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.mecanicasaojorge.api.exception.GlobalExceptionHandler;
import br.com.mecanicasaojorge.api.service.ClienteService;
import ch.qos.logback.classic.Level;
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

  /**
   * US-CLI-01a/01b: 20 telefones com o digito 5 e um email com 5; termo misto nao casa telefone.
   */
  @Test
  void shouldReturnOnlyTheEmailOwnerWhenMixedTermHasDigitAndMatchesPhones() throws Exception {
    for (int i = 0; i < 20; i++) {
      inserir("Cliente %02d".formatted(i), "1198%03d5%02d".formatted(i, i), null);
    }
    for (int i = 20; i < 25; i++) {
      inserir("Cliente %02d".formatted(i), "1198000%04d".formatted(i), null);
    }
    inserir("Zeta Cinco", null, "zeta5@example.org");

    listar("zeta5@example.org")
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.totalItens").value(1))
        .andExpect(jsonPath("$.itens.length()").value(1))
        .andExpect(jsonPath("$.itens[0].email").value("zeta5@example.org"));
    for (String termo : new String[] {"%", "_", "ana", "rua 7", "5a"}) {
      nomes(termo).doesNotContain("Cliente 00", "Cliente 10");
    }
  }

  /** US-CLI-01c: termo numerico busca telefone e tambem nome e email. */
  @Test
  void shouldFindPhoneAndNameOrEmailWhenTermIsNumeric() throws Exception {
    inserir("Ana Lima", "11987654321", null);
    inserir("Oficina 987", null, null);
    inserir("Bruno Reis", "2133334444", "bruno987@example.com");
    inserir("Carla Dias", "2155556666", null);

    for (String termo :
        new String[] {"11987654321", "(11) 98765-4321", "11.98765.4321", "+11 98765-4321"}) {
      nomes(termo).containsExactly("Ana Lima");
    }
    nomes("987").containsExactly("Ana Lima", "Bruno Reis", "Oficina 987");
    nomes("()-").isEmpty();
    nomes("٥٥٥").isEmpty();
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

  /** US-CLI-03c: limiar de page*size > Integer.MAX_VALUE nao pode virar 500. */
  @Test
  void shouldReturnEmptyItemsWithRealTotalWhenOffsetExceedsIntegerMax() throws Exception {
    for (int i = 1; i <= 25; i++) {
      inserir("Cliente %02d".formatted(i), null, null);
    }
    String[][] casos = {
      {"21474836", "100"},
      {"21474837", "100"},
      {"2147483647", "100"},
      {"2147483647", "1"},
      {"2147483647", "2"}
    };

    for (String[] caso : casos) {
      mockMvc
          .perform(get(URL).param("page", caso[0]).param("size", caso[1]).with(jwt()))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.itens").isEmpty())
          .andExpect(jsonPath("$.pagina").value(Integer.parseInt(caso[0])))
          .andExpect(jsonPath("$.tamanho").value(Integer.parseInt(caso[1])))
          .andExpect(jsonPath("$.totalItens").value(25));
    }
  }

  @Test
  void shouldKeepSearchTotalWhenOffsetExceedsIntegerMaxWithTerm() throws Exception {
    inserir("Ana Lima", null, null);
    inserir("Ana Paula", null, null);
    inserir("Ana Souza", null, null);
    inserir("Bruno Reis", null, null);

    mockMvc
        .perform(
            get(URL).param("q", "ana").param("page", "21474837").param("size", "100").with(jwt()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens").isEmpty())
        .andExpect(jsonPath("$.totalItens").value(3));
  }

  @Test
  void shouldReturnBadRequestWhenPageDoesNotFitInInteger() throws Exception {
    mockMvc
        .perform(get(URL).param("page", "2147483648").with(jwt()))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.mensagem").value("Parametro invalido: page"));
  }

  /** US-CLI-05a: 404 no formato do handler global, sem query string no path nem no log. */
  @Test
  void shouldReturnNotFoundWithoutLoggingQueryWhenRouteDoesNotExist() throws Exception {
    Logger logger = (Logger) LoggerFactory.getLogger(GlobalExceptionHandler.class);
    ListAppender<ILoggingEvent> logs = new ListAppender<>();
    logs.start();
    logger.addAppender(logs);
    try {
      String corpo =
          mockMvc
              .perform(get("/api/v1/rota-inexistente").param("q", "ana").with(jwt()))
              .andExpect(status().isNotFound())
              .andExpect(jsonPath("$.status").value(404))
              .andExpect(jsonPath("$.erro").value("Not Found"))
              .andExpect(jsonPath("$.mensagem").value("Recurso nao encontrado"))
              .andExpect(jsonPath("$.path").value("/api/v1/rota-inexistente"))
              .andReturn()
              .getResponse()
              .getContentAsString();

      assertThat(corpo).doesNotContain("ana", "at br.com", "Exception");
      assertThat(logs.list).noneMatch(e -> e.getLevel().isGreaterOrEqual(Level.ERROR));
      assertThat(logs.list)
          .allSatisfy(e -> assertThat(e.getFormattedMessage()).doesNotContain("ana", "q="));
    } finally {
      logger.detachAppender(logs);
    }
  }

  /** US-CLI-05b: DELETE usado porque o POST passa a existir na F03c. */
  @Test
  void shouldReturnMethodNotAllowedWithAllowHeaderWhenMethodIsNotSupported() throws Exception {
    Logger logger = (Logger) LoggerFactory.getLogger(GlobalExceptionHandler.class);
    ListAppender<ILoggingEvent> logs = new ListAppender<>();
    logs.start();
    logger.addAppender(logs);
    try {
      String corpo =
          mockMvc
              .perform(delete(URL).param("q", "ana").with(jwt()))
              .andExpect(status().isMethodNotAllowed())
              .andExpect(header().string("Allow", containsString("GET")))
              .andExpect(jsonPath("$.status").value(405))
              .andExpect(jsonPath("$.erro").value("Method Not Allowed"))
              .andExpect(jsonPath("$.mensagem").value("Metodo nao permitido"))
              .andExpect(jsonPath("$.path").value(URL))
              .andReturn()
              .getResponse()
              .getContentAsString();

      assertThat(corpo).doesNotContain("ana", "at br.com", "Exception");
      assertThat(logs.list).noneMatch(e -> e.getLevel().isGreaterOrEqual(Level.ERROR));
      assertThat(logs.list)
          .allSatisfy(e -> assertThat(e.getFormattedMessage()).doesNotContain("ana", "q="));
    } finally {
      logger.detachAppender(logs);
    }
  }

  /** US-CLI-05c: sem token, 401 vem antes de 404 e 405 (nao revela quais rotas existem). */
  @Test
  void shouldReturnUnauthorizedBeforeNotFoundOrMethodNotAllowedWhenThereIsNoToken()
      throws Exception {
    mockMvc.perform(get("/api/v1/rota-inexistente")).andExpect(status().isUnauthorized());
    mockMvc.perform(delete(URL)).andExpect(status().isUnauthorized());
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

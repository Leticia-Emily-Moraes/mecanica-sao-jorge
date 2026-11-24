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
import br.com.mecanicasaojorge.api.service.ServicoService;
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
 * GET /api/v1/servicos de ponta a ponta contra MySQL real (Testcontainers, todas as migrations do
 * zero): busca, curingas literais, filtro ativo, paginacao, 400, 401 e 500 (F05a, US-SRV-01 a
 * US-SRV-06; ADR-032 e ADR-033).
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@Testcontainers
class ServicoListagemIT {

  private static final String URL = "/api/v1/servicos";

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

  @MockitoSpyBean private ServicoService servicoService;

  @BeforeEach
  void limparServicos() {
    jdbcTemplate.update("DELETE FROM servicos");
  }

  @Test
  void shouldFixCollationOnNameColumnWhenMigrationsRanFromScratch() {
    assertThat(
            jdbcTemplate.queryForObject(
                "SELECT COLLATION_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = "
                    + "DATABASE() AND TABLE_NAME = 'servicos' AND COLUMN_NAME = 'nome'",
                String.class))
        .isEqualTo("utf8mb4_0900_ai_ci");
  }

  /** US-SRV-01: so os que contem o trecho, ordenados por nome. */
  @Test
  void shouldReturnOnlyMatchingServicesOrderedByNameWhenTermIsPartOfName() throws Exception {
    inserir("Troca de Óleo", true);
    inserir("Alinhamento", true);
    inserir("Revisão de freios", true);
    inserir("Troca de pastilhas", true);

    nomes("troca").containsExactly("Troca de Óleo", "Troca de pastilhas");
    nomes("").containsExactly(
        "Alinhamento", "Revisão de freios", "Troca de Óleo", "Troca de pastilhas");
  }

  @Test
  void shouldFindIgnoringCaseAndAccentWhenTermDiffersFromStoredName() throws Exception {
    inserir("Troca de Óleo", true);
    inserir("Revisão", true);

    nomes("oleo").containsExactly("Troca de Óleo");
    nomes("ÓLEO").containsExactly("Troca de Óleo");
    nomes("REVISAO").containsExactly("Revisão");
    nomes("Óleo").containsExactly("Troca de Óleo");
  }

  @Test
  void shouldTreatWildcardsAndEscapeAsLiteralTextWhenTermHasSpecialCharacters() throws Exception {
    inserir("Desconto 100% peças", true);
    inserir("Alinhamento_3D", true);
    inserir("Barra\\Invertida", true);
    inserir("Uau! Lavagem", true);
    inserir("Balanceamento", true);

    nomes("%").containsExactly("Desconto 100% peças");
    nomes("_").containsExactly("Alinhamento_3D");
    nomes("\\").containsExactly("Barra\\Invertida");
    nomes("uau!").containsExactly("Uau! Lavagem");
    nomes("' OR '1'='1").isEmpty();
    assertThat(jdbcTemplate.queryForObject("SELECT COUNT(*) FROM servicos", Integer.class))
        .isEqualTo(5);
  }

  /** US-SRV-02. */
  @Test
  void shouldReturnEmptyPageWithZeroTotalWhenNothingMatches() throws Exception {
    inserir("Alinhamento", true);

    listar("zzzz")
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens").isEmpty())
        .andExpect(jsonPath("$.totalItens").value(0))
        .andExpect(jsonPath("$.totalPaginas").value(0));
  }

  /** US-SRV-03: primeira pagina com 20 itens por padrao. */
  @Test
  void shouldReturnFirstPageWith20ItemsWhenThereAreMoreServicesThanPageSize() throws Exception {
    for (int i = 25; i >= 1; i--) {
      inserir("Servico %02d".formatted(i), true);
    }

    mockMvc
        .perform(get(URL).with(jwt()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens.length()").value(20))
        .andExpect(jsonPath("$.itens[0].nome").value("Servico 01"))
        .andExpect(jsonPath("$.itens[19].nome").value("Servico 20"))
        .andExpect(jsonPath("$.pagina").value(0))
        .andExpect(jsonPath("$.tamanho").value(20))
        .andExpect(jsonPath("$.totalItens").value(25))
        .andExpect(jsonPath("$.totalPaginas").value(2));
    mockMvc
        .perform(get(URL).param("page", "1").with(jwt()))
        .andExpect(jsonPath("$.itens.length()").value(5))
        .andExpect(jsonPath("$.itens[0].nome").value("Servico 21"));
  }

  @Test
  void shouldReturnEmptyItemsWithRealTotalWhenPageIsBeyondTheEnd() throws Exception {
    for (int i = 1; i <= 25; i++) {
      inserir("Servico %02d".formatted(i), true);
    }

    mockMvc
        .perform(get(URL).param("size", "10").param("page", "5").with(jwt()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens").isEmpty())
        .andExpect(jsonPath("$.totalItens").value(25))
        .andExpect(jsonPath("$.totalPaginas").value(3));
  }

  @Test
  void shouldReturnEmptyItemsWithRealTotalWhenOffsetExceedsIntegerMax() throws Exception {
    inserir("Alinhamento", true);
    inserir("Balanceamento", false);

    for (String[] caso : new String[][] {{"21474837", "100"}, {"2147483647", "100"}}) {
      mockMvc
          .perform(get(URL).param("page", caso[0]).param("size", caso[1]).with(jwt()))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.itens").isEmpty())
          .andExpect(jsonPath("$.pagina").value(Integer.parseInt(caso[0])))
          .andExpect(jsonPath("$.totalItens").value(2));
    }
    mockMvc
        .perform(
            get(URL).param("ativo", "true").param("page", "21474837").param("size", "100")
                .with(jwt()))
        .andExpect(jsonPath("$.itens").isEmpty())
        .andExpect(jsonPath("$.totalItens").value(1));
  }

  /** US-SRV-04. */
  @Test
  void shouldFilterByActiveWhenParameterIsGiven() throws Exception {
    inserir("Alinhamento", true);
    inserir("Balanceamento", false);
    inserir("Cambagem", true);

    ativoNomes("true").containsExactly("Alinhamento", "Cambagem");
    ativoNomes("false").containsExactly("Balanceamento");
    nomes("").containsExactly("Alinhamento", "Balanceamento", "Cambagem");
    mockMvc
        .perform(get(URL).with(jwt()))
        .andExpect(jsonPath("$.itens[1].ativo").value(false))
        .andExpect(jsonPath("$.itens[0].ativo").value(true));
  }

  @Test
  void shouldCombineTermAndActiveFilterWhenBothAreGiven() throws Exception {
    inserir("Troca de óleo", true);
    inserir("Troca de correia", false);

    String json =
        mockMvc
            .perform(get(URL).param("q", "troca").param("ativo", "true").with(jwt()))
            .andReturn()
            .getResponse()
            .getContentAsString();

    assertThat(JsonPath.<List<String>>read(json, "$.itens[*].nome")).containsExactly("Troca de óleo");
  }

  /** Confirma a suposicao do ADR-032 sobre o conversor padrao do Spring para {@code ativo}. */
  @Test
  void shouldAcceptSpringBooleanSynonymsAndTreatEmptyAsAbsentWhenParsingActive() throws Exception {
    inserir("Alinhamento", true);
    inserir("Balanceamento", false);

    ativoNomes("1").containsExactly("Alinhamento");
    ativoNomes("on").containsExactly("Alinhamento");
    ativoNomes("yes").containsExactly("Alinhamento");
    ativoNomes("0").containsExactly("Balanceamento");
    ativoNomes("off").containsExactly("Balanceamento");
    ativoNomes("TRUE").containsExactly("Alinhamento");
    ativoNomes("").containsExactly("Alinhamento", "Balanceamento");
  }

  @Test
  void shouldReturnBadRequestWhenActiveIsNotBoolean() throws Exception {
    mockMvc
        .perform(get(URL).param("ativo", "abc").with(jwt()))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.mensagem").value("Parametro invalido: ativo"));
  }

  /** US-SRV-03: size=101 responde 400, junto dos demais parametros invalidos. */
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
  void shouldReturnAllItemFieldsAndNothingElseWhenListing() throws Exception {
    jdbcTemplate.update(
        "INSERT INTO servicos (nome, valor_padrao_mao_obra, tempo_estimado_horas, ativo) "
            + "VALUES ('Troca de Óleo', 60.00, 0.50, TRUE)");
    inserir("Sem tempo", true);

    mockMvc
        .perform(get(URL).param("q", "troca").with(jwt()))
        .andExpect(jsonPath("$.itens[0].length()").value(5))
        .andExpect(jsonPath("$.itens[0].valorPadraoMaoObra").value(60.0))
        .andExpect(jsonPath("$.itens[0].tempoEstimadoHoras").value(0.5));
    mockMvc
        .perform(get(URL).param("q", "sem tempo").with(jwt()))
        .andExpect(jsonPath("$.itens[0].tempoEstimadoHoras").value((Object) null));
  }

  /** US-SRV-05. */
  @Test
  void shouldReturnUnauthorizedWhenThereIsNoToken() throws Exception {
    inserir("Alinhamento", true);

    mockMvc
        .perform(get(URL))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.itens").doesNotExist());
  }

  /** US-SRV-06. */
  @Test
  void shouldReturnInternalErrorWithoutLeakingDataWhenDatabaseFails() throws Exception {
    Logger logger = (Logger) LoggerFactory.getLogger(GlobalExceptionHandler.class);
    ListAppender<ILoggingEvent> logs = new ListAppender<>();
    logs.start();
    logger.addAppender(logs);
    try {
      doThrow(new DataAccessResourceFailureException("Communications link failure select * from"))
          .when(servicoService)
          .listar(any(), any(), anyInt(), anyInt(), any());

      String corpo =
          mockMvc
              .perform(get(URL).param("q", "oleo").with(jwt()))
              .andExpect(status().isInternalServerError())
              .andExpect(jsonPath("$.status").value(500))
              .andExpect(jsonPath("$.mensagem").value("Erro interno inesperado"))
              .andExpect(jsonPath("$.path").value(URL))
              .andReturn()
              .getResponse()
              .getContentAsString();

      assertThat(corpo).doesNotContain("Communications", "select", "SQL", "at br.com");
      assertThat(logs.list).hasSize(1);
      assertThat(logs.list.get(0).getThrowableProxy()).isNull();
    } finally {
      logger.detachAppender(logs);
    }
  }

  private ListAssert<String> nomes(String q) throws Exception {
    return nomesDe(listar(q));
  }

  private ListAssert<String> ativoNomes(String ativo) throws Exception {
    return nomesDe(mockMvc.perform(get(URL).param("ativo", ativo).with(jwt())));
  }

  private ListAssert<String> nomesDe(ResultActions acao) throws Exception {
    String json =
        acao.andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    return assertThat(JsonPath.<List<String>>read(json, "$.itens[*].nome"));
  }

  private ResultActions listar(String q) throws Exception {
    return mockMvc.perform(get(URL).param("q", q).with(jwt()));
  }

  private void inserir(String nome, boolean ativo) {
    jdbcTemplate.update(
        "INSERT INTO servicos (nome, valor_padrao_mao_obra, ativo) VALUES (?, 50.00, ?)",
        nome,
        ativo);
  }
}

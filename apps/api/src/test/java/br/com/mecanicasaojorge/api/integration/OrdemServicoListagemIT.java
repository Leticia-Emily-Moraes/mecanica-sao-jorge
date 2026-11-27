package br.com.mecanicasaojorge.api.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.mecanicasaojorge.api.exception.GlobalExceptionHandler;
import br.com.mecanicasaojorge.api.service.OrdemServicoService;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import com.jayway.jsonpath.JsonPath;
import jakarta.persistence.EntityManagerFactory;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.hibernate.SessionFactory;
import org.hibernate.stat.Statistics;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * GET /api/v1/ordens-servico de ponta a ponta contra MySQL real (Testcontainers, todas as
 * migrations do zero): ordenacao, paginacao, filtro de status, busca por cliente e placa,
 * minimizacao, contagem de comandos SQL, data em UTC, 400, 401 e log sem termo (F06a; ADR-037 a
 * ADR-039). Todos os nomes, placas e documentos sao ficticios.
 */
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.MOCK,
    properties = "spring.jpa.properties.hibernate.generate_statistics=true")
@AutoConfigureMockMvc
@Testcontainers
class OrdemServicoListagemIT {

  private static final String URL = "/api/v1/ordens-servico";

  /** Observado: com status repetido o conversor do Spring usa o primeiro valor (ABERTA). */
  private static final int OBSERVADO_STATUS_REPETIDO = 1;

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
  @Autowired private EntityManagerFactory entityManagerFactory;

  private final ListAppender<ILoggingEvent> logs = new ListAppender<>();
  private final Logger servicoLogger = (Logger) LoggerFactory.getLogger(OrdemServicoService.class);
  private final Logger handlerLogger =
      (Logger) LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @BeforeEach
  void limparEPrepararLogs() {
    jdbcTemplate.update("DELETE FROM ordens_servico");
    jdbcTemplate.update("DELETE FROM veiculos");
    jdbcTemplate.update("DELETE FROM clientes");
    logs.start();
    servicoLogger.addAppender(logs);
    handlerLogger.addAppender(logs);
  }

  @AfterEach
  void soltarLogs() {
    servicoLogger.detachAppender(logs);
    handlerLogger.detachAppender(logs);
    logs.stop();
  }

  /** US-OS-LST-01. */
  @Test
  void shouldListFromNewestToOldestWithDefaultPagingWhenThereAreNoParameters() throws Exception {
    long maria = cliente("Maria Souza");
    long veiculo = veiculo(maria, "ABC1234", "Gol");
    os(maria, veiculo, "ABERTA", "2026-11-01 10:00:00");
    os(maria, veiculo, "ABERTA", "2026-11-03 10:00:00");
    os(maria, veiculo, "ABERTA", "2026-11-02 10:00:00");

    listar("")
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens.length()").value(3))
        .andExpect(jsonPath("$.itens[0].dataAbertura").value("2026-11-03T10:00:00Z"))
        .andExpect(jsonPath("$.itens[1].dataAbertura").value("2026-11-02T10:00:00Z"))
        .andExpect(jsonPath("$.itens[2].dataAbertura").value("2026-11-01T10:00:00Z"))
        .andExpect(jsonPath("$.pagina").value(0))
        .andExpect(jsonPath("$.tamanho").value(20))
        .andExpect(jsonPath("$.totalItens").value(3));
  }

  /** US-OS-LST-01b: mesma data de abertura desempata por id decrescente. */
  @Test
  void shouldBreakTiesByIdDescendingWhenOpeningDatesAreEqual() throws Exception {
    long cliente = cliente("Maria Souza");
    long veiculo = veiculo(cliente, "ABC1234", "Gol");
    long primeira = os(cliente, veiculo, "ABERTA", "2026-11-01 10:00:00");
    long segunda = os(cliente, veiculo, "ABERTA", "2026-11-01 10:00:00");
    long terceira = os(cliente, veiculo, "ABERTA", "2026-11-01 10:00:00");

    assertThat(ids(listar(""))).containsExactly((int) terceira, (int) segunda, (int) primeira);
  }

  /** US-OS-LST-02. */
  @Test
  void shouldPaginateWhenThereAre25Orders() throws Exception {
    long cliente = cliente("Maria Souza");
    long veiculo = veiculo(cliente, "ABC1234", "Gol");
    for (int dia = 1; dia <= 25; dia++) {
      os(cliente, veiculo, "ABERTA", "2026-10-%02d 10:00:00".formatted(dia));
    }

    ResultActions pagina =
        mockMvc.perform(get(URL).param("page", "1").param("size", "10").with(jwt()));

    pagina
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens.length()").value(10))
        .andExpect(jsonPath("$.totalPaginas").value(3))
        .andExpect(jsonPath("$.totalItens").value(25))
        .andExpect(jsonPath("$.itens[0].dataAbertura").value("2026-10-15T10:00:00Z"))
        .andExpect(jsonPath("$.itens[9].dataAbertura").value("2026-10-06T10:00:00Z"));
  }

  /** US-OS-LST-03. */
  @Test
  void shouldReturnBadRequestWithParameterNameWhenPagingIsOutOfBounds() throws Exception {
    for (String[] par : new String[][] {{"size", "101"}, {"size", "0"}, {"page", "-1"}}) {
      mockMvc
          .perform(get(URL).param(par[0], par[1]).with(jwt()))
          .andExpect(status().isBadRequest())
          .andExpect(jsonPath("$.status").value(400))
          .andExpect(jsonPath("$.path").value(URL))
          .andExpect(jsonPath("$.mensagem").value("Parametro invalido: " + par[0]));
    }
  }

  /** US-OS-LST-04. */
  @Test
  void shouldReturnOnlyMatchingStatusAndCountOnlyThemWhenStatusIsGiven() throws Exception {
    long cliente = cliente("Maria Souza");
    long veiculo = veiculo(cliente, "ABC1234", "Gol");
    os(cliente, veiculo, "ABERTA", "2026-11-01 10:00:00");
    os(cliente, veiculo, "EM_ANALISE", "2026-11-02 10:00:00");
    os(cliente, veiculo, "EM_ANALISE", "2026-11-03 10:00:00");

    mockMvc
        .perform(get(URL).param("status", "EM_ANALISE").with(jwt()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens.length()").value(2))
        .andExpect(
            jsonPath("$.itens[*].status")
                .value(org.hamcrest.Matchers.everyItem(org.hamcrest.Matchers.is("EM_ANALISE"))))
        .andExpect(jsonPath("$.totalItens").value(2));
  }

  /** US-OS-LST-05 e comportamento de caixa, vazio e repetido do parametro status. */
  @Test
  void shouldReturnBadRequestWithoutEchoingValueWhenStatusIsInvalid() throws Exception {
    for (String invalido : new String[] {"XYZ", "aberta"}) {
      String corpo =
          mockMvc
              .perform(get(URL).param("status", invalido).with(jwt()))
              .andExpect(status().isBadRequest())
              .andExpect(jsonPath("$.mensagem").value("Parametro invalido: status"))
              .andReturn()
              .getResponse()
              .getContentAsString();
      assertThat(corpo).doesNotContain(invalido);
    }
  }

  /** Comportamento observado do conversor do Spring (ADR-037, Mais informacoes). */
  @Test
  void shouldListAllWhenStatusIsEmptyAndUseFirstValueWhenStatusIsRepeated() throws Exception {
    long cliente = cliente("Maria Souza");
    long veiculo = veiculo(cliente, "ABC1234", "Gol");
    os(cliente, veiculo, "ABERTA", "2026-11-01 10:00:00");
    os(cliente, veiculo, "EM_ANALISE", "2026-11-02 10:00:00");

    mockMvc
        .perform(get(URL).param("status", "").with(jwt()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.totalItens").value(2));
    mockMvc
        .perform(get(URL).param("status", "ABERTA", "EM_ANALISE").with(jwt()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.totalItens").value(OBSERVADO_STATUS_REPETIDO));
  }

  /** US-OS-LST-06. */
  @Test
  void shouldFindByClientNameIgnoringCaseWhenTermMatches() throws Exception {
    long maria = cliente("Maria Souza");
    long joao = cliente("João Lima");
    os(maria, veiculo(maria, "ABC1234", "Gol"), "ABERTA", "2026-11-01 10:00:00");
    os(joao, veiculo(joao, "XYZ9876", "Uno"), "ABERTA", "2026-11-02 10:00:00");

    assertThat(nomes(listar("souza"))).containsExactly("Maria Souza");
    assertThat(nomes(listar("SOUZA"))).containsExactly("Maria Souza");
    assertThat(nomes(listar("joao"))).containsExactly("João Lima");
  }

  /** US-OS-LST-07. */
  @Test
  void shouldFindByPlateIgnoringHyphenAndCaseWhenTermMatches() throws Exception {
    long maria = cliente("Maria Souza");
    long joao = cliente("João Lima");
    os(maria, veiculo(maria, "ABC1234", "Gol"), "ABERTA", "2026-11-01 10:00:00");
    os(joao, veiculo(joao, "XYZ9876", "Uno"), "ABERTA", "2026-11-02 10:00:00");

    assertThat(nomes(listar("abc-12"))).containsExactly("Maria Souza");
    assertThat(nomes(listar("ABC 12"))).containsExactly("Maria Souza");
    assertThat(nomes(listar("9876"))).containsExactly("João Lima");
  }

  /** US-OS-LST-08. */
  @Test
  void shouldCombineStatusAndTermWithAndWhenBothAreGiven() throws Exception {
    long maria = cliente("Maria Souza");
    long joao = cliente("João Lima");
    long carroMaria = veiculo(maria, "ABC1234", "Gol");
    long carroJoao = veiculo(joao, "XYZ9876", "Uno");
    long esperada = os(maria, carroMaria, "ABERTA", "2026-11-01 10:00:00");
    os(maria, carroMaria, "EM_ANALISE", "2026-11-02 10:00:00");
    os(joao, carroJoao, "ABERTA", "2026-11-03 10:00:00");

    ResultActions resposta =
        mockMvc.perform(get(URL).param("status", "ABERTA").param("q", "souza").with(jwt()));

    assertThat(ids(resposta)).containsExactly((int) esperada);
  }

  /** US-OS-LST-09. */
  @Test
  void shouldReturnEmptyPageWith200WhenThereIsNoMatch() throws Exception {
    listar("")
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens").isEmpty())
        .andExpect(jsonPath("$.totalItens").value(0));

    long cliente = cliente("Maria Souza");
    os(cliente, veiculo(cliente, "ABC1234", "Gol"), "ABERTA", "2026-11-01 10:00:00");
    listar("zzzz")
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens").isEmpty())
        .andExpect(jsonPath("$.totalItens").value(0));
  }

  /** US-OS-LST-10. */
  @Test
  void shouldReturnUnauthorizedWithoutDataWhenTokenIsMissingOrInvalid() throws Exception {
    long cliente = cliente("Maria Souza");
    os(cliente, veiculo(cliente, "ABC1234", "Gol"), "ABERTA", "2026-11-01 10:00:00");

    mockMvc
        .perform(get(URL))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.itens").doesNotExist());
    mockMvc
        .perform(get(URL).header("Authorization", "Bearer token.invalido.aqui"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.itens").doesNotExist());
  }

  /** US-OS-LST-11. */
  @Test
  void shouldReturnOnlyContractFieldsWhenClientHasSensitiveData() throws Exception {
    jdbcTemplate.update(
        "INSERT INTO clientes (nome, telefone, email, cpf, endereco) VALUES "
            + "('Maria Souza', '11912345678', 'maria@example.com', '12345678901', 'Rua Ficticia 1')");
    long cliente = jdbcTemplate.queryForObject("SELECT MAX(id) FROM clientes", Long.class);
    long veiculo = veiculo(cliente, "ABC1234", "Gol");
    os(cliente, veiculo, "ABERTA", "2026-11-01 10:00:00");

    String json = listar("").andReturn().getResponse().getContentAsString();

    assertThat(JsonPath.<Map<String, Object>>read(json, "$.itens[0]").keySet())
        .containsExactlyInAnyOrder(
            "id", "status", "dataAbertura", "previsaoEntrega", "valorTotal", "cliente", "veiculo");
    assertThat(JsonPath.<Map<String, Object>>read(json, "$.itens[0].cliente").keySet())
        .containsExactlyInAnyOrder("id", "nome");
    assertThat(JsonPath.<Map<String, Object>>read(json, "$.itens[0].veiculo").keySet())
        .containsExactlyInAnyOrder("id", "placa", "modelo");
    assertThat(json)
        .doesNotContain("11912345678", "maria@example.com", "12345678901", "Rua Ficticia");
  }

  /** US-OS-LST-12: mesmo numero de comandos SQL com 20 e com 1 OS na pagina. */
  @Test
  void shouldRunSameNumberOfStatementsWhenPageHas20OrdersOr1() throws Exception {
    for (int i = 1; i <= 21; i++) {
      long cliente = cliente("Cliente Ficticio %02d".formatted(i));
      long veiculo = veiculo(cliente, "AAA%04d".formatted(i), "Modelo %02d".formatted(i));
      os(cliente, veiculo, "ABERTA", "2026-10-%02d 10:00:00".formatted(i));
    }
    Statistics estatisticas = entityManagerFactory.unwrap(SessionFactory.class).getStatistics();

    long comandosPagina20 = comandos(estatisticas, "20");
    long cargasPagina20 = estatisticas.getEntityFetchCount();
    long comandosPagina1 = comandos(estatisticas, "1");
    long cargasPagina1 = estatisticas.getEntityFetchCount();

    assertThat(comandosPagina20).isEqualTo(comandosPagina1).isEqualTo(2);
    assertThat(cargasPagina20).isZero();
    assertThat(cargasPagina1).isZero();
  }

  /** US-OS-LST-13. */
  @Test
  void shouldReturnNullPrevisaoEntregaWithoutOmittingFieldWhenThereIsNoForecast() throws Exception {
    long cliente = cliente("Maria Souza");
    long veiculo = veiculo(cliente, "ABC1234", "Gol");
    os(cliente, veiculo, "ABERTA", "2026-11-01 10:00:00");
    jdbcTemplate.update(
        "INSERT INTO ordens_servico (cliente_id, veiculo_id, status, data_abertura, "
            + "data_previsao_entrega) VALUES (?, ?, 'ABERTA', '2026-11-02 10:00:00', '2026-12-01')",
        cliente,
        veiculo);

    String json = listar("").andReturn().getResponse().getContentAsString();

    assertThat(JsonPath.<Map<String, Object>>read(json, "$.itens[1]"))
        .containsEntry("previsaoEntrega", null);
    assertThat(JsonPath.<String>read(json, "$.itens[0].previsaoEntrega")).isEqualTo("2026-12-01");
    assertThat(JsonPath.<Number>read(json, "$.itens[0].valorTotal").doubleValue()).isZero();
  }

  /** US-OS-LST-14: q fora do log e da mensagem de erro, mesmo com status invalido. */
  @Test
  void shouldKeepTermOutOfLogAndErrorMessageWhenStatusIsInvalid() throws Exception {
    String corpo =
        mockMvc
            .perform(get(URL).param("status", "XYZ").param("q", "souza").with(jwt()))
            .andExpect(status().isBadRequest())
            .andReturn()
            .getResponse()
            .getContentAsString();

    assertThat(corpo).doesNotContain("souza");
    assertThat(mensagensDeLog()).noneMatch(m -> m.toLowerCase().contains("souza"));
  }

  @Test
  void shouldLogOnlyTermLengthWhenListingWithTerm() throws Exception {
    long cliente = cliente("Maria Souza");
    os(cliente, veiculo(cliente, "ABC1234", "Gol"), "ABERTA", "2026-11-01 10:00:00");

    mockMvc
        .perform(
            get(URL)
                .param("q", "souza")
                .param("status", "ABERTA")
                .with(jwt().jwt(j -> j.subject("42"))))
        .andExpect(status().isOk());

    assertThat(mensagensDeLog())
        .singleElement()
        .isEqualTo(
            "ordens-servico.listar qLen=5 status=ABERTA page=0 size=20 total=1 usuarioId=42");
  }

  /** US-OS-LST-01b e ADR-039: data com default do banco e fuso da JVM diferente de UTC. */
  @Test
  void shouldReadDatabaseDefaultAsCurrentUtcInstantWhenDataAberturaIsNotInformed()
      throws Exception {
    long cliente = cliente("Maria Souza");
    long veiculo = veiculo(cliente, "ABC1234", "Gol");
    jdbcTemplate.update(
        "INSERT INTO ordens_servico (cliente_id, veiculo_id, status) VALUES (?, ?, 'ABERTA')",
        cliente,
        veiculo);

    String json = listar("").andReturn().getResponse().getContentAsString();

    Instant lida = Instant.parse(JsonPath.read(json, "$.itens[0].dataAbertura"));
    assertThat(Duration.between(lida, Instant.now()).abs()).isLessThan(Duration.ofMinutes(1));
  }

  /** ADR-037: busca por curinga e texto literal, tambem na placa. */
  @Test
  void shouldTreatWildcardsAsLiteralTextWhenTermHasSpecialCharacters() throws Exception {
    long cliente = cliente("Maria Souza");
    os(cliente, veiculo(cliente, "ABC1234", "Gol"), "ABERTA", "2026-11-01 10:00:00");

    for (String termo : new String[] {"%", "_", "' OR '1'='1", "-"}) {
      listar(termo).andExpect(jsonPath("$.totalItens").value(0));
    }
    long outro = cliente("Desconto 100% Silva");
    os(outro, veiculo(outro, "DEF5678", "Uno"), "ABERTA", "2026-11-02 10:00:00");
    assertThat(nomes(listar("%"))).containsExactly("Desconto 100% Silva");
  }

  /** q em branco equivale a sem busca; q acima de 100 caracteres da 400. */
  @Test
  void shouldIgnoreBlankTermAndRejectTermLongerThan100Characters() throws Exception {
    long cliente = cliente("Maria Souza");
    os(cliente, veiculo(cliente, "ABC1234", "Gol"), "ABERTA", "2026-11-01 10:00:00");

    listar("   ").andExpect(jsonPath("$.totalItens").value(1));
    mockMvc
        .perform(get(URL).param("q", "x".repeat(101)).with(jwt()))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.mensagem").value("Parametro invalido: q"));
  }

  /** Pagina alem do fim: 200, lista vazia e total real. */
  @Test
  void shouldReturnEmptyItemsWithRealTotalWhenPageIsBeyondTheEnd() throws Exception {
    long cliente = cliente("Maria Souza");
    os(cliente, veiculo(cliente, "ABC1234", "Gol"), "ABERTA", "2026-11-01 10:00:00");

    mockMvc
        .perform(get(URL).param("page", "2147483647").param("size", "100").with(jwt()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens").isEmpty())
        .andExpect(jsonPath("$.totalItens").value(1));
  }

  private long comandos(Statistics estatisticas, String size) throws Exception {
    estatisticas.clear();
    mockMvc
        .perform(get(URL).param("page", "0").param("size", size).with(jwt()))
        .andExpect(status().isOk());
    return estatisticas.getPrepareStatementCount();
  }

  private ResultActions listar(String q) throws Exception {
    return mockMvc.perform(get(URL).param("q", q).with(jwt()));
  }

  private List<String> nomes(ResultActions acao) throws Exception {
    String json = acao.andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    return JsonPath.read(json, "$.itens[*].cliente.nome");
  }

  private List<Integer> ids(ResultActions acao) throws Exception {
    String json = acao.andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    return JsonPath.read(json, "$.itens[*].id");
  }

  private List<String> mensagensDeLog() {
    return logs.list.stream().map(ILoggingEvent::getFormattedMessage).toList();
  }

  private long cliente(String nome) {
    jdbcTemplate.update("INSERT INTO clientes (nome) VALUES (?)", nome);
    return jdbcTemplate.queryForObject("SELECT MAX(id) FROM clientes", Long.class);
  }

  private long veiculo(long clienteId, String placa, String modelo) {
    jdbcTemplate.update(
        "INSERT INTO veiculos (cliente_id, placa, modelo, marca) VALUES (?, ?, ?, 'Marca')",
        clienteId,
        placa,
        modelo);
    return jdbcTemplate.queryForObject("SELECT MAX(id) FROM veiculos", Long.class);
  }

  private long os(long clienteId, long veiculoId, String status, String dataAbertura) {
    jdbcTemplate.update(
        "INSERT INTO ordens_servico (cliente_id, veiculo_id, status, data_abertura) "
            + "VALUES (?, ?, ?, ?)",
        clienteId,
        veiculoId,
        status,
        dataAbertura);
    return jdbcTemplate.queryForObject("SELECT MAX(id) FROM ordens_servico", Long.class);
  }
}

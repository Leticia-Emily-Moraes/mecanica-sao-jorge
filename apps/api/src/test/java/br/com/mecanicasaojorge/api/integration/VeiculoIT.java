package br.com.mecanicasaojorge.api.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.jdbc.UncategorizedSQLException;
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
 * Quatro rotas de veiculo de ponta a ponta contra MySQL real, com V1 a V7 aplicadas pelo Flyway e
 * {@code ddl-auto: validate} (F04, US-VEI-01 a 05; ADR-022 a 025). Placas e nomes sao ficticios.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@Testcontainers
class VeiculoIT {

  private static final String PLACA = "ABC1D23";
  private static final String PLACA_ANTIGA = "ABC1234";

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
  private long clienteId;
  private long outroClienteId;

  @BeforeEach
  void setUp() {
    jdbcTemplate.update("DELETE FROM veiculos");
    jdbcTemplate.update("DELETE FROM clientes");
    clienteId = inserirCliente("Ana Exemplo");
    outroClienteId = inserirCliente("Bia Exemplo");
    rootLogger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
    logs = new ListAppender<>();
    logs.start();
    rootLogger.addAppender(logs);
  }

  @AfterEach
  void tearDown() {
    rootLogger.detachAppender(logs);
  }

  // US-VEI-01: criacao (criterios 1 a 3)

  @Test
  void shouldReturn201LinkedToClientWhenPlateIsInOldFormat() throws Exception {
    MvcResult r =
        criar(clienteId, corpo(PLACA_ANTIGA))
            .andExpect(status().isCreated())
            .andExpect(header().string("Cache-Control", containsString("no-store")))
            .andExpect(jsonPath("$.clienteId").value(clienteId))
            .andExpect(jsonPath("$.placa").value(PLACA_ANTIGA))
            .andExpect(jsonPath("$.quilometragem").doesNotExist())
            .andReturn();

    assertThat(r.getResponse().getHeader("Location")).isEqualTo("/api/v1/veiculos/" + idDe(r));
    assertThat(totalVeiculos()).isEqualTo(1);
  }

  @Test
  void shouldReturn201WhenPlateIsMercosul() throws Exception {
    criar(clienteId, corpo(PLACA))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.placa").value(PLACA))
        .andExpect(jsonPath("$.clienteId").value(clienteId));
  }

  @ParameterizedTest
  @ValueSource(strings = {"abc-1d23", " ABC1D23 ", "abc 1d23", "aBc1D23"})
  void shouldStoreNormalizedPlateWhenPlateIsTypedWithMaskOrLowerCase(String digitada)
      throws Exception {
    MvcResult r = criar(clienteId, corpo(digitada)).andExpect(status().isCreated()).andReturn();

    assertThat(placaNoBanco(idDe(r))).isEqualTo(PLACA);
  }

  // criterios 4 e 5

  @ParameterizedTest
  @ValueSource(
      strings = {
        "AB12345",
        "ABCD123",
        "ABC12D3",
        "ABC123",
        "ÍBC1D23",
        "ABC1D23\\t",
        "AAAAAAAAAAAAAAAAAAAAAAAAA"
      })
  void shouldReturn400OnPlateFieldAndStoreNothingWhenPlateFormatIsInvalid(String placa)
      throws Exception {
    criar(clienteId, corpo(placa))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.erros[0].campo").value("placa"))
        .andExpect(jsonPath("$.erros[0].chave").value("veiculo.form.placa.erro"))
        .andExpect(content().string(not(containsString(placa))));

    assertThat(totalVeiculos()).isZero();
  }

  @Test
  void shouldReturn400WithUnicodeLookalikePlateAndStoreNothing() throws Exception {
    for (String placa : new String[] {(char) 0x131 + "bc1d23", "ABC" + (char) 0x661 + "D23"}) {
      criar(clienteId, corpo(placa))
          .andExpect(status().isBadRequest())
          .andExpect(jsonPath("$.erros[0].campo").value("placa"));
    }

    assertThat(totalVeiculos()).isZero();
  }

  @Test
  void shouldReturn400OnPlateFieldWhenPlateIsBlankOrAbsent() throws Exception {
    for (String corpo :
        new String[] {
          corpo(""), corpo("   "), "{\"marca\":\"Fiat\",\"modelo\":\"Uno\",\"ano\":2015}"
        }) {
      criar(clienteId, corpo)
          .andExpect(status().isBadRequest())
          .andExpect(jsonPath("$.erros[0].campo").value("placa"))
          .andExpect(jsonPath("$.erros[0].chave").value("veiculo.form.placa.obrigatoria"));
    }

    assertThat(totalVeiculos()).isZero();
  }

  // criterio 6

  @Test
  void shouldReturn409WithoutFullPlateWhenPlateIsRepeatedInAnyCase() throws Exception {
    criar(clienteId, corpo(PLACA)).andExpect(status().isCreated());
    logs.list.clear();

    MvcResult r =
        criar(outroClienteId, corpo("abc1d23"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.mensagem").value("Placa ja cadastrada"))
            .andExpect(jsonPath("$.erros[0].campo").value("placa"))
            .andExpect(jsonPath("$.erros[0].chave").value("veiculo.form.placa.duplicada"))
            .andReturn();

    assertThat(r.getResponse().getContentAsString()).doesNotContain(PLACA, "abc1d23", "\"id\"");
    assertThat(totalVeiculos()).isEqualTo(1);
    assertThat(logs.list)
        .noneMatch(e -> e.getLevel().isGreaterOrEqual(Level.ERROR))
        .noneMatch(e -> e.getFormattedMessage().contains(PLACA));
    assertThat(mensagens())
        .containsExactly(
            "veiculos.criar.placaDuplicada clienteId="
                + outroClienteId
                + " usuarioId=3 "
                + "placa=****D23");
  }

  // criterios 7 e 8

  @Test
  void shouldReturn400WithOneErrorPerFieldWhenBrandModelAndYearAreBlank() throws Exception {
    criar(clienteId, "{\"placa\":\"ABC1D23\",\"marca\":\" \",\"modelo\":\"\"}")
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.erros.length()").value(3))
        .andExpect(
            jsonPath("$.erros[?(@.campo=='marca')].chave").value("veiculo.form.marca.obrigatoria"))
        .andExpect(
            jsonPath("$.erros[?(@.campo=='modelo')].chave")
                .value("veiculo.form.modelo.obrigatorio"))
        .andExpect(
            jsonPath("$.erros[?(@.campo=='ano')].chave").value("veiculo.form.ano.obrigatorio"));

    assertThat(totalVeiculos()).isZero();
  }

  @Test
  void shouldRejectYearOutsideRangeAndAcceptNextYear() throws Exception {
    int proximoAno = java.time.Year.now().getValue() + 1;

    criar(clienteId, corpo(PLACA, 1899)).andExpect(status().isBadRequest());
    criar(clienteId, corpo(PLACA, proximoAno + 1))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.erros[0].campo").value("ano"))
        .andExpect(jsonPath("$.erros[0].chave").value("veiculo.form.ano.faixa"));
    assertThat(totalVeiculos()).isZero();

    criar(clienteId, corpo(PLACA, 1900)).andExpect(status().isCreated());
    criar(clienteId, corpo(PLACA_ANTIGA, proximoAno)).andExpect(status().isCreated());
  }

  // criterio 9

  @Test
  void shouldReturn404AndStoreNothingWhenClientDoesNotExist() throws Exception {
    criar(999999L, corpo(PLACA))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.mensagem").value("Cliente nao encontrado"));

    assertThat(totalVeiculos()).isZero();
  }

  // criterio 10

  @Test
  void shouldCreateExactlyOneWhenTenRequestsWithSamePlateRunConcurrently() throws Exception {
    ExecutorService pool = Executors.newFixedThreadPool(10);
    try {
      List<Callable<Integer>> tarefas = new ArrayList<>();
      for (int i = 0; i < 10; i++) {
        tarefas.add(() -> criar(clienteId, corpo(PLACA)).andReturn().getResponse().getStatus());
      }
      List<Integer> codigos = new ArrayList<>();
      for (Future<Integer> f : pool.invokeAll(tarefas)) {
        codigos.add(f.get());
      }

      assertThat(codigos.stream().filter(c -> c == 201).count()).isEqualTo(1);
      assertThat(codigos.stream().filter(c -> c == 409).count()).isEqualTo(9);
      assertThat(totalVeiculos()).isEqualTo(1);
      assertThat(logs.list)
          .noneMatch(e -> e.getLevel().isGreaterOrEqual(Level.ERROR))
          .noneMatch(e -> e.getFormattedMessage().contains(PLACA));
    } finally {
      pool.shutdownNow();
    }
  }

  // criterio 11

  @Test
  void shouldReturn401AndChangeNothingOnAllFourRoutesWhenTokenIsMissingOrMalformed()
      throws Exception {
    long id = inserirVeiculo(clienteId, PLACA);
    String[] autorizacoes = {null, "Bearer abc.def.ghi"};

    for (String autorizacao : autorizacoes) {
      for (var requisicao :
          List.of(
              post("/api/v1/clientes/" + clienteId + "/veiculos").content(corpo(PLACA_ANTIGA)),
              put("/api/v1/veiculos/" + id).content(corpo(PLACA_ANTIGA)),
              get("/api/v1/veiculos/" + id),
              get("/api/v1/clientes/" + clienteId + "/veiculos"))) {
        requisicao.contentType(MediaType.APPLICATION_JSON);
        if (autorizacao != null) {
          requisicao.header("Authorization", autorizacao);
        }
        mockMvc.perform(requisicao).andExpect(status().isUnauthorized());
      }
    }

    assertThat(totalVeiculos()).isEqualTo(1);
    assertThat(placaNoBanco(id)).isEqualTo(PLACA);
  }

  // V2: atribuicao em massa no POST

  @Test
  void shouldCreateNewVehicleInPathClientWhenBodyCarriesIdAndOtherOwner() throws Exception {
    long existente = inserirVeiculo(outroClienteId, PLACA_ANTIGA);

    MvcResult r =
        criar(
                clienteId,
                "{\"id\":"
                    + existente
                    + ",\"clienteId\":"
                    + outroClienteId
                    + ",\"cliente\":{\"id\":"
                    + outroClienteId
                    + "},\"quilometragem\":9,"
                    + "\"placa\":\"ABC1D23\",\"marca\":\"Fiat\",\"modelo\":\"Uno\",\"ano\":2015}")
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.clienteId").value(clienteId))
            .andReturn();

    assertThat(idDe(r)).isNotEqualTo(existente);
    assertThat(totalVeiculos()).isEqualTo(2);
    assertThat(placaNoBanco(existente)).isEqualTo(PLACA_ANTIGA);
    assertThat(clienteDoVeiculo(existente)).isEqualTo(outroClienteId);
    assertThat(quilometragem(idDe(r))).isNull();
  }

  // US-VEI-02: edicao (criterios 12 a 18)

  @Test
  void shouldReturn200WithUpdatedDataWhenEditingBrandModelYearAndColor() throws Exception {
    long id = inserirVeiculo(clienteId, PLACA);

    mockMvc
        .perform(
            put("/api/v1/veiculos/" + id)
                .with(jwt().jwt(j -> j.subject("3")))
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"placa\":\"ABC1D23\",\"marca\":\"VW\",\"modelo\":\"Gol\",\"ano\":2020,"
                        + "\"cor\":\"Azul\"}"))
        .andExpect(status().isOk())
        .andExpect(header().string("Cache-Control", containsString("no-store")))
        .andExpect(jsonPath("$.marca").value("VW"))
        .andExpect(jsonPath("$.modelo").value("Gol"))
        .andExpect(jsonPath("$.ano").value(2020))
        .andExpect(jsonPath("$.cor").value("Azul"));
  }

  @Test
  void shouldAcceptPlateChangeBetweenOldAndMercosulFormatsAndKeepSamePlate() throws Exception {
    long id = inserirVeiculo(clienteId, PLACA_ANTIGA);

    editar(id, corpo(PLACA)).andExpect(status().isOk()).andExpect(jsonPath("$.placa").value(PLACA));
    assertThat(placaNoBanco(id)).isEqualTo(PLACA);

    editar(id, corpo(PLACA_ANTIGA)).andExpect(status().isOk());
    assertThat(placaNoBanco(id)).isEqualTo(PLACA_ANTIGA);

    logs.list.clear();
    editar(id, corpo("abc-1234").replace("Uno", "Palio")).andExpect(status().isOk());
    assertThat(mensagens())
        .containsExactly(
            "veiculos.editar veiculoId="
                + id
                + " usuarioId=3 placa=****234 "
                + "placaAlterada=false");
  }

  @Test
  void shouldReturn409AndKeepOriginalPlateWhenPlateBelongsToAnotherVehicle() throws Exception {
    long primeiro = inserirVeiculo(clienteId, PLACA_ANTIGA);
    inserirVeiculo(outroClienteId, PLACA);
    logs.list.clear();

    editar(primeiro, corpo("abc1d23"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.mensagem").value("Placa ja cadastrada"));

    assertThat(placaNoBanco(primeiro)).isEqualTo(PLACA_ANTIGA);
    assertThat(logs.list)
        .noneMatch(e -> e.getLevel().isGreaterOrEqual(Level.ERROR))
        .noneMatch(e -> e.getFormattedMessage().contains(PLACA));
    assertThat(mensagens())
        .containsExactly(
            "veiculos.editar.placaDuplicada veiculoId=" + primeiro + " usuarioId=3 placa=****D23");
  }

  @Test
  void shouldReturn400AndKeepRecordUnchangedWhenEditBodyIsInvalid() throws Exception {
    long id = inserirVeiculo(clienteId, PLACA);

    editar(id, "{\"placa\":\"AB12345\",\"marca\":\"\",\"modelo\":\"Uno\"}")
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.erros.length()").value(3));

    assertThat(placaNoBanco(id)).isEqualTo(PLACA);
    assertThat(
            jdbcTemplate.queryForObject(
                "SELECT marca FROM veiculos WHERE id = ?", String.class, id))
        .isEqualTo("Fiat");
  }

  @Test
  void shouldKeepOwnerAndMileageWhenEditBodyCarriesOtherOwnerIdAndMileage() throws Exception {
    long id = inserirVeiculo(clienteId, PLACA);
    long outro = inserirVeiculo(outroClienteId, PLACA_ANTIGA);
    jdbcTemplate.update("UPDATE veiculos SET quilometragem = 55000 WHERE id = ?", id);

    editar(
            id,
            "{\"clienteId\":"
                + outroClienteId
                + ",\"cliente\":{\"id\":"
                + outroClienteId
                + "},\"id\":"
                + outro
                + ",\"quilometragem\":1,\"placa\":\"ABC1D23\","
                + "\"marca\":\"Fiat\",\"modelo\":\"Palio\",\"ano\":2015}")
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.clienteId").value(clienteId))
        .andExpect(jsonPath("$.id").value(id));

    assertThat(clienteDoVeiculo(id)).isEqualTo(clienteId);
    assertThat(quilometragem(id)).isEqualTo(55000);
    assertThat(placaNoBanco(outro)).isEqualTo(PLACA_ANTIGA);
    assertThat(clienteDoVeiculo(outro)).isEqualTo(outroClienteId);
    assertThat(totalVeiculos()).isEqualTo(2);
  }

  @Test
  void shouldReturn404WhenEditingMissingVehicle() throws Exception {
    editar(999999L, corpo(PLACA))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.mensagem").value("Veiculo nao encontrado"));
  }

  // US-VEI-03: detalhe (criterios 19 e 20)

  @Test
  void shouldReturnDetailWithOwnerAndEmptyHistoryWhenVehicleHasNoOrders() throws Exception {
    long id = inserirVeiculo(clienteId, PLACA);

    mockMvc
        .perform(get("/api/v1/veiculos/" + id).with(jwt().jwt(j -> j.subject("3"))))
        .andExpect(status().isOk())
        .andExpect(header().string("Cache-Control", containsString("no-store")))
        .andExpect(jsonPath("$.placa").value(PLACA))
        .andExpect(jsonPath("$.clienteId").value(clienteId))
        .andExpect(jsonPath("$.clienteNome").value("Ana Exemplo"))
        .andExpect(jsonPath("$.historicoOs").isArray())
        .andExpect(jsonPath("$.historicoOs.length()").value(0));
  }

  @Test
  void shouldReturn404WhenDetailingMissingVehicle() throws Exception {
    mockMvc
        .perform(get("/api/v1/veiculos/999999").with(jwt()))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.mensagem").value("Veiculo nao encontrado"));
  }

  // US-VEI-04: lista do cliente (criterios 21 a 23)

  @Test
  void shouldListClientVehiclesOrderedByPlateWithoutPagination() throws Exception {
    inserirVeiculo(clienteId, "BCD2E34");
    inserirVeiculo(clienteId, PLACA_ANTIGA);
    inserirVeiculo(clienteId, PLACA);
    inserirVeiculo(outroClienteId, "ZZZ9Z99");

    mockMvc
        .perform(get("/api/v1/clientes/" + clienteId + "/veiculos").with(jwt()))
        .andExpect(status().isOk())
        .andExpect(header().string("Cache-Control", containsString("no-store")))
        .andExpect(jsonPath("$.length()").value(3))
        .andExpect(jsonPath("$[0].placa").value(PLACA_ANTIGA))
        .andExpect(jsonPath("$[1].placa").value(PLACA))
        .andExpect(jsonPath("$[2].placa").value("BCD2E34"))
        .andExpect(jsonPath("$[0].marca").value("Fiat"))
        .andExpect(jsonPath("$[0].modelo").value("Uno"));
  }

  @Test
  void shouldReturnEmptyListWhenClientHasNoVehiclesAnd404WhenClientIsMissing() throws Exception {
    mockMvc
        .perform(get("/api/v1/clientes/" + clienteId + "/veiculos").with(jwt()))
        .andExpect(status().isOk())
        .andExpect(content().json("[]"));
    mockMvc
        .perform(get("/api/v1/clientes/999999/veiculos").with(jwt()))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.mensagem").value("Cliente nao encontrado"));
  }

  // US-VEI-05: log mascarado (criterio 24)

  @Test
  void shouldLogOnlyMaskedPlateOnCreateEditDetailListAndConflict() throws Exception {
    MvcResult criado = criar(clienteId, corpo(PLACA)).andExpect(status().isCreated()).andReturn();
    long id = idDe(criado);
    editar(id, corpo(PLACA).replace("Uno", "Palio")).andExpect(status().isOk());
    mockMvc.perform(get("/api/v1/veiculos/" + id).with(jwt())).andExpect(status().isOk());
    mockMvc
        .perform(get("/api/v1/clientes/" + clienteId + "/veiculos").with(jwt()))
        .andExpect(status().isOk());
    criar(outroClienteId, corpo(PLACA)).andExpect(status().isConflict());
    criar(clienteId, corpo("AB12345")).andExpect(status().isBadRequest());

    assertThat(mensagens())
        .anyMatch(m -> m.startsWith("veiculos.criar veiculoId=") && m.endsWith("placa=****D23"))
        .anyMatch(m -> m.startsWith("veiculos.editar ") && m.contains("placa=****D23"))
        .anyMatch(m -> m.startsWith("veiculos.detalhar ") && m.endsWith("placa=****D23"))
        .anyMatch(m -> m.startsWith("veiculos.listarPorCliente "))
        .anyMatch(m -> m.startsWith("veiculos.criar.placaDuplicada "));
    assertThat(logs.list)
        .noneMatch(e -> e.getFormattedMessage().contains(PLACA))
        .noneMatch(e -> e.getFormattedMessage().contains("Ana"))
        .noneMatch(e -> e.getFormattedMessage().contains("Fiat"))
        .noneMatch(e -> e.getFormattedMessage().contains("AB12345"));
    imprimir("log de veiculos (criar, editar, detalhar, lista, 409, 400):", mensagens());
  }

  // criterios 25 e 26: mais de um erro de uma vez, so chaves

  @Test
  void shouldReturnEveryInvalidFieldWithKeyAndNeverRepeatSentValues() throws Exception {
    MvcResult r =
        criar(
                clienteId,
                "{\"placa\":\"XX-valor-secreto\",\"marca\":\""
                    + "m".repeat(101)
                    + "\",\"modelo\":\"\",\"ano\":1800,\"cor\":\""
                    + "c".repeat(41)
                    + "\"}")
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.erros.length()").value(5))
            .andReturn();

    String corpo = r.getResponse().getContentAsString();
    assertThat(corpo).doesNotContain("secreto", "1800", "mmmm", "cccc");
    assertThat(corpo)
        .contains(
            "veiculo.form.placa.erro",
            "veiculo.form.marca.tamanho",
            "veiculo.form.modelo.obrigatorio",
            "veiculo.form.ano.faixa",
            "veiculo.form.cor.tamanho");
  }

  @Test
  void shouldReturn400WithoutStoringWhenBodyIsMalformedOrYearIsNotNumber() throws Exception {
    criar(clienteId, "{\"placa\":").andExpect(status().isBadRequest());
    criar(clienteId, "{\"placa\":\"ABC1D23\",\"marca\":\"F\",\"modelo\":\"U\",\"ano\":\"abc\"}")
        .andExpect(status().isBadRequest())
        .andExpect(content().string(not(containsString("abc"))));

    assertThat(totalVeiculos()).isZero();
  }

  // V7 no banco

  @Test
  void shouldApplyMigrationsV1ToV7AndRejectDuplicateOrMalformedPlateDirectlyInDatabase() {
    List<String> versoes =
        jdbcTemplate.queryForList(
            "SELECT version FROM flyway_schema_history WHERE success = 1 ORDER BY installed_rank",
            String.class);
    inserirVeiculo(clienteId, PLACA);

    assertThat(versoes).containsExactly("1", "2", "3", "4", "5", "6", "7");
    assertThat(
            jdbcTemplate.queryForList(
                "SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE "
                    + "TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'veiculos'",
                String.class))
        .contains("uk_veiculos_placa", "ck_veiculos_placa_formato");
    for (String placa : new String[] {PLACA, "abc1d23", "ABC-1D2", "ANONIMO", "AB12345"}) {
      assertThatThrownBy(() -> inserirVeiculo(clienteId, placa))
          .isInstanceOfAny(DataIntegrityViolationException.class, UncategorizedSQLException.class)
          .hasMessageMatching(
              "(?s).*(uk_veiculos_placa|ck_veiculos_placa_formato|Duplicate entry).*");
    }
    assertThat(totalVeiculos()).isEqualTo(1);
  }

  @Test
  void shouldAllowAnonymizationMarkerWithVehicleIdForManyVehiclesOfSameClient() {
    long um = inserirVeiculo(clienteId, PLACA);
    long dois = inserirVeiculo(clienteId, PLACA_ANTIGA);

    jdbcTemplate.update(
        "UPDATE veiculos SET placa = CONCAT('ANON', id) WHERE cliente_id = ?", clienteId);

    assertThat(placaNoBanco(um)).isEqualTo("ANON" + um);
    assertThat(placaNoBanco(dois)).isEqualTo("ANON" + dois);
    inserirVeiculo(outroClienteId, PLACA);
  }

  @Test
  void shouldDocumentFourRoutesWithI18nErrorsInOpenApi() throws Exception {
    String docs =
        mockMvc
            .perform(get("/v3/api-docs"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.paths['/api/v1/clientes/{clienteId}/veiculos'].post").exists())
            .andExpect(jsonPath("$.paths['/api/v1/clientes/{clienteId}/veiculos'].get").exists())
            .andExpect(jsonPath("$.paths['/api/v1/veiculos/{id}'].get").exists())
            .andExpect(jsonPath("$.paths['/api/v1/veiculos/{id}'].put").exists())
            .andExpect(
                jsonPath("$.paths['/api/v1/clientes/{clienteId}/veiculos'].post.responses['409']")
                    .exists())
            .andReturn()
            .getResponse()
            .getContentAsString();

    assertThat(docs)
        .contains("veiculo.form.placa.erro", "veiculo.form.placa.duplicada", "historicoOs")
        .doesNotContain("quilometragem");
  }

  private ResultActions criar(long cliente, String corpo) throws Exception {
    return mockMvc.perform(
        post("/api/v1/clientes/" + cliente + "/veiculos")
            .with(jwt().jwt(j -> j.subject("3")))
            .contentType(MediaType.APPLICATION_JSON)
            .content(corpo));
  }

  private ResultActions editar(long id, String corpo) throws Exception {
    return mockMvc.perform(
        put("/api/v1/veiculos/" + id)
            .with(jwt().jwt(j -> j.subject("3")))
            .contentType(MediaType.APPLICATION_JSON)
            .content(corpo));
  }

  private static String corpo(String placa) {
    return corpo(placa, 2015);
  }

  private static String corpo(String placa, int ano) {
    return "{\"placa\":\""
        + placa
        + "\",\"marca\":\"Fiat\",\"modelo\":\"Uno\",\"ano\":"
        + ano
        + ",\"cor\":\"Prata\"}";
  }

  private long inserirCliente(String nome) {
    jdbcTemplate.update("INSERT INTO clientes (nome) VALUES (?)", nome);
    return jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
  }

  private long inserirVeiculo(long cliente, String placa) {
    jdbcTemplate.update(
        "INSERT INTO veiculos (cliente_id, placa, modelo, marca, ano) VALUES (?, ?, 'Uno', 'Fiat',"
            + " 2015)",
        cliente,
        placa);
    return jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
  }

  private long totalVeiculos() {
    return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM veiculos", Long.class);
  }

  private String placaNoBanco(long id) {
    return jdbcTemplate.queryForObject("SELECT placa FROM veiculos WHERE id = ?", String.class, id);
  }

  private long clienteDoVeiculo(long id) {
    return jdbcTemplate.queryForObject(
        "SELECT cliente_id FROM veiculos WHERE id = ?", Long.class, id);
  }

  private Integer quilometragem(long id) {
    return jdbcTemplate.queryForObject(
        "SELECT quilometragem FROM veiculos WHERE id = ?", Integer.class, id);
  }

  private List<String> mensagens() {
    return logs.list.stream()
        .map(ILoggingEvent::getFormattedMessage)
        .filter(m -> m.startsWith("veiculos."))
        .toList();
  }

  private static long idDe(MvcResult resultado) throws Exception {
    Matcher m =
        Pattern.compile("\"id\":(\\d+)").matcher(resultado.getResponse().getContentAsString());
    assertThat(m.find()).isTrue();
    return Long.parseLong(m.group(1));
  }

  private static void imprimir(String titulo, List<String> linhas) {
    System.out.println("== " + titulo);
    linhas.forEach(System.out::println);
  }
}

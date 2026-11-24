package br.com.mecanicasaojorge.api.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doThrow;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.mecanicasaojorge.api.service.PecaService;
import com.jayway.jsonpath.JsonPath;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import javax.crypto.spec.SecretKeySpec;
import org.assertj.core.api.ListAssert;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * GET /api/v1/pecas de ponta a ponta contra MySQL real (Testcontainers, todas as migrations do
 * zero): busca por nome e codigo, curingas literais, paginacao, estoqueBaixo, contrato sem custo,
 * 400, 401 e 500 (F17; ADR-034, ADR-035 e ADR-036).
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@Testcontainers
class PecaListagemIT {

  private static final String URL = "/api/v1/pecas";

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

  @MockitoSpyBean private PecaService pecaService;

  @BeforeEach
  void limparPecas() {
    jdbcTemplate.update("DELETE FROM pecas");
  }

  @Test
  void shouldFixCollationOnNameAndCodeWhenMigrationsRanFromScratch() {
    assertThat(
            jdbcTemplate.queryForList(
                "SELECT COLLATION_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = "
                    + "DATABASE() AND TABLE_NAME = 'pecas' AND COLUMN_NAME IN ('nome', 'codigo')",
                String.class))
        .containsOnly("utf8mb4_0900_ai_ci")
        .hasSize(2);
  }

  /** US-CAT-14. */
  @Test
  void shouldFindByNameOrCodeIgnoringCaseWhenTermMatches() throws Exception {
    inserir("Filtro de óleo", "FO-100", 10, 5);
    inserir("Pastilha de freio", "PF-200", 10, 5);

    nomes("filtro").containsExactly("Filtro de óleo");
    nomes("FILTRO").containsExactly("Filtro de óleo");
    nomes("pf-2").containsExactly("Pastilha de freio");
    nomes("OLEO").containsExactly("Filtro de óleo");
  }

  /** US-CAT-14a e 14b. */
  @Test
  void shouldReturnEmptyPageWith200WhenThereIsNoPartOrNoMatch() throws Exception {
    listar("")
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens").isEmpty())
        .andExpect(jsonPath("$.totalItens").value(0));

    inserir("Filtro de óleo", "FO-100", 10, 5);
    listar("zzzz")
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens").isEmpty())
        .andExpect(jsonPath("$.totalItens").value(0));
  }

  /** US-CAT-14c. */
  @Test
  void shouldPaginateWith20ItemsOrderedByNameWhenThereAre25Parts() throws Exception {
    for (int i = 25; i >= 1; i--) {
      inserir("Peca %02d".formatted(i), "P-%02d".formatted(i), 10, 5);
    }

    mockMvc
        .perform(get(URL).with(jwt()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens.length()").value(20))
        .andExpect(jsonPath("$.itens[0].nome").value("Peca 01"))
        .andExpect(jsonPath("$.itens[19].nome").value("Peca 20"))
        .andExpect(jsonPath("$.totalItens").value(25))
        .andExpect(jsonPath("$.totalPaginas").value(2));
    mockMvc
        .perform(get(URL).param("page", "1").with(jwt()))
        .andExpect(jsonPath("$.itens.length()").value(5))
        .andExpect(jsonPath("$.itens[0].nome").value("Peca 21"));
  }

  @Test
  void shouldBreakNameTiesByIdWhenNamesAreEqual() throws Exception {
    inserir("Igual", "A-1", 10, 5);
    inserir("igual", "A-2", 10, 5);
    inserir("IGUAL", "A-3", 10, 5);

    String json =
        listar("").andReturn().getResponse().getContentAsString();
    assertThat(JsonPath.<List<String>>read(json, "$.itens[*].codigo"))
        .containsExactly("A-1", "A-2", "A-3");
  }

  /** US-CAT-14d. */
  @Test
  void shouldReturnEmptyItemsWithRealTotalWhenPageIsBeyondTheEnd() throws Exception {
    for (int i = 1; i <= 25; i++) {
      inserir("Peca %02d".formatted(i), "P-%02d".formatted(i), 10, 5);
    }

    mockMvc
        .perform(get(URL).param("page", "9").with(jwt()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens").isEmpty())
        .andExpect(jsonPath("$.totalItens").value(25));
    mockMvc
        .perform(get(URL).param("page", "2147483647").param("size", "100").with(jwt()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.itens").isEmpty())
        .andExpect(jsonPath("$.totalItens").value(25));
  }

  /** US-CAT-14e. */
  @Test
  void shouldReturnBadRequestWhenParametersAreInvalid() throws Exception {
    for (String[] par :
        new String[][] {
          {"size", "0"}, {"size", "101"}, {"page", "-1"}, {"q", "x".repeat(101)}
        }) {
      mockMvc
          .perform(get(URL).param(par[0], par[1]).with(jwt()))
          .andExpect(status().isBadRequest())
          .andExpect(jsonPath("$.status").value(400))
          .andExpect(jsonPath("$.timestamp").exists())
          .andExpect(jsonPath("$.erro").exists())
          .andExpect(jsonPath("$.path").value(URL))
          .andExpect(jsonPath("$.mensagem").value("Parametro invalido: " + par[0]));
    }
  }

  /** US-CAT-14e, DV4 do ADR-040: tipo errado, estouro de int e termo de 101 espacos. */
  @Test
  void shouldReturnBadRequestWhenParametersHaveWrongTypeOrOverflowOrOnlyBlanks() throws Exception {
    for (String[] par :
        new String[][] {
          {"size", "abc"}, {"page", "abc"}, {"page", "2147483648"}, {"q", " ".repeat(101)}
        }) {
      String corpo =
          mockMvc
              .perform(get(URL).param(par[0], par[1]).with(jwt()))
              .andExpect(status().isBadRequest())
              .andExpect(jsonPath("$.status").value(400))
              .andExpect(jsonPath("$.timestamp").exists())
              .andExpect(jsonPath("$.erro").exists())
              .andExpect(jsonPath("$.path").value(URL))
              .andExpect(jsonPath("$.mensagem").value("Parametro invalido: " + par[0]))
              .andReturn()
              .getResponse()
              .getContentAsString();
      assertThat(corpo).doesNotContain("2147483648", "abc", "NumberFormat");
    }
  }

  /** US-CAT-14f: curinga e texto literal. */
  @Test
  void shouldTreatWildcardsAsLiteralTextWhenTermHasSpecialCharacters() throws Exception {
    inserir("Filtro de óleo", "FO-100", 10, 5);
    inserir("Pastilha de freio", "PF-200", 10, 5);

    nomes("%").isEmpty();
    nomes("_").isEmpty();
    nomes("' OR '1'='1").isEmpty();

    inserir("Desconto 100% peças", "DESC-1", 10, 5);
    inserir("Peca_3D", "P_3D", 10, 5);
    nomes("%").containsExactly("Desconto 100% peças");
    nomes("_").containsExactly("Peca_3D");
    assertThat(jdbcTemplate.queryForObject("SELECT COUNT(*) FROM pecas", Integer.class))
        .isEqualTo(4);
  }

  /** US-CAT-14g. */
  @Test
  void shouldReturnSameAsUnfilteredListWhenTermIsBlank() throws Exception {
    inserir("Filtro de óleo", "FO-100", 10, 5);
    inserir("Pastilha de freio", "PF-200", 10, 5);

    nomes("").containsExactly("Filtro de óleo", "Pastilha de freio");
    nomes("   ").containsExactly("Filtro de óleo", "Pastilha de freio");
    nomes("  filtro  ").containsExactly("Filtro de óleo");
  }

  /** US-CAT-15, 15a e 16. */
  @Test
  void shouldComputeLowStockFlagWhenListing() throws Exception {
    inserir("A igual ao minimo", "A-1", 5, 5);
    inserir("B abaixo do minimo", "B-1", 2, 5);
    inserir("C zero e zero", "C-1", 0, 0);
    inserir("D acima do minimo", "D-1", 6, 5);

    String json = listar("").andReturn().getResponse().getContentAsString();
    assertThat(JsonPath.<List<Boolean>>read(json, "$.itens[*].estoqueBaixo"))
        .containsExactly(true, true, true, false);
  }

  /** US-CAT-17e. */
  @Test
  void shouldReturnOnlyContractFieldsWithoutCostWhenListing() throws Exception {
    jdbcTemplate.update(
        "INSERT INTO pecas (nome, codigo, custo, preco_venda, quantidade_estoque, "
            + "estoque_minimo, ativo) VALUES ('Filtro de óleo', 'FO-100', 12.34, 25.00, 6, 5, TRUE)");

    String json = listar("").andReturn().getResponse().getContentAsString();

    assertThat(JsonPath.<java.util.Map<String, Object>>read(json, "$.itens[0]").keySet())
        .containsExactlyInAnyOrder(
            "id",
            "nome",
            "codigo",
            "precoVenda",
            "quantidadeEstoque",
            "estoqueMinimo",
            "estoqueBaixo");
    assertThat(json).doesNotContain("custo", "12.34", "ativo");
    listar("")
        .andExpect(jsonPath("$.itens[0].precoVenda").value(25.0))
        .andExpect(jsonPath("$.itens[0].quantidadeEstoque").value(6))
        .andExpect(jsonPath("$.itens[0].estoqueMinimo").value(5));
  }

  @Test
  void shouldListPartEvenWhenItIsMarkedInactive() throws Exception {
    jdbcTemplate.update(
        "INSERT INTO pecas (nome, codigo, custo, preco_venda, quantidade_estoque, "
            + "estoque_minimo, ativo) VALUES ('Inativa', 'IN-1', 1.00, 2.00, 1, 0, FALSE)");

    nomes("").containsExactly("Inativa");
  }

  /** US-CAT-17b. */
  @Test
  void shouldReturnUnauthorizedWhenThereIsNoToken() throws Exception {
    inserir("Filtro de óleo", "FO-100", 10, 5);

    mockMvc
        .perform(get(URL))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.itens").doesNotExist());
  }

  /** US-CAT-17b: token malformado, assinado com outra chave ou expirado. */
  @Test
  void shouldReturnUnauthorizedInStandardFormatWhenTokenIsInvalid() throws Exception {
    inserir("Filtro de óleo", "FO-100", 10, 5);
    Instant agora = Instant.now();
    String assinadoComOutraChave =
        emitirToken("outra-chave-secreta-com-32-bytes-ou-mais-xyz", agora.plusSeconds(600));
    String expirado =
        emitirToken("it-test-secret-nao-usar-em-producao-0123456789", agora.minusSeconds(900));

    for (String token : new String[] {"lixo", "a.b.c", assinadoComOutraChave, expirado}) {
      String corpo =
          mockMvc
              .perform(get(URL).header("Authorization", "Bearer " + token))
              .andExpect(status().isUnauthorized())
              .andExpect(jsonPath("$.status").value(401))
              .andExpect(jsonPath("$.timestamp").exists())
              .andExpect(jsonPath("$.erro").exists())
              .andExpect(jsonPath("$.mensagem").value("Nao autenticado"))
              .andExpect(jsonPath("$.path").value(URL))
              .andExpect(jsonPath("$.itens").doesNotExist())
              .andReturn()
              .getResponse()
              .getContentAsString();
      assertThat(corpo).doesNotContain("Filtro", "FO-100", "Jwt", "Nimbus");
    }
  }

  /** US-CAT-17. */
  @Test
  void shouldReturnInternalErrorWithoutLeakingDataWhenDatabaseFails() throws Exception {
    doThrow(new DataAccessResourceFailureException("Communications link failure select * from"))
        .when(pecaService)
        .listar(any(), anyInt(), anyInt(), any());

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
  }

  private static String emitirToken(String segredo, Instant expiraEm) {
    SecretKeySpec chave = new SecretKeySpec(segredo.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    JwtClaimsSet claims =
        JwtClaimsSet.builder()
            .subject("1")
            .issuedAt(expiraEm.minusSeconds(1800))
            .expiresAt(expiraEm)
            .build();
    return new NimbusJwtEncoder(new ImmutableSecret<>(chave))
        .encode(
            JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
        .getTokenValue();
  }

  private ListAssert<String> nomes(String q) throws Exception {
    String json = listar(q).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    return assertThat(JsonPath.<List<String>>read(json, "$.itens[*].nome"));
  }

  private ResultActions listar(String q) throws Exception {
    return mockMvc.perform(get(URL).param("q", q).with(jwt()));
  }

  private void inserir(String nome, String codigo, int quantidade, int minimo) {
    jdbcTemplate.update(
        "INSERT INTO pecas (nome, codigo, custo, preco_venda, quantidade_estoque, "
            + "estoque_minimo, ativo) VALUES (?, ?, 10.00, 25.00, ?, ?, TRUE)",
        nome,
        codigo,
        quantidade,
        minimo);
  }
}

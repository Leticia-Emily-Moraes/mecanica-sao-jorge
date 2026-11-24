package br.com.mecanicasaojorge.api.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Prova do fator F1 do ADR-017: com o servidor em {@code latin1}, a V3 leva as colunas buscadas
 * para {@code utf8mb4_0900_ai_ci} e a busca continua ignorando acento ({@code muller} acha {@code
 * Müller}), sem depender do padrao implicito do servidor.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@Testcontainers
class ClienteCollationLatin1IT {

  @Container
  static final MySQLContainer<?> MYSQL =
      new MySQLContainer<>("mysql:8.4")
          .withDatabaseName("mecanica_sao_jorge_latin1_it")
          .withUsername("mecanica_it")
          .withPassword("mecanica_it_password")
          .withCommand("--character-set-server=latin1", "--collation-server=latin1_swedish_ci");

  @DynamicPropertySource
  static void datasourceProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", MYSQL::getJdbcUrl);
    registry.add("spring.datasource.username", MYSQL::getUsername);
    registry.add("spring.datasource.password", MYSQL::getPassword);
    registry.add("jwt.secret", () -> "it-test-secret-nao-usar-em-producao-0123456789");
  }

  @Autowired private MockMvc mockMvc;
  @Autowired private JdbcTemplate jdbcTemplate;

  @Test
  void shouldRunServerInLatin1WhenContainerIsStartedWithLatin1Defaults() {
    assertThat(jdbcTemplate.queryForObject("SELECT @@character_set_server", String.class))
        .isEqualTo("latin1");
  }

  @Test
  void shouldFixCollationOfSearchedColumnsWhenServerDefaultIsLatin1() {
    List<String> collations =
        jdbcTemplate.queryForList(
            "SELECT COLLATION_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() "
                + "AND TABLE_NAME = 'clientes' AND COLUMN_NAME IN ('nome','telefone','email')",
            String.class);

    assertThat(collations).hasSize(3).containsOnly("utf8mb4_0900_ai_ci");
  }

  @Test
  void shouldFindMullerWhenSearchingMullerInLatin1Server() throws Exception {
    jdbcTemplate.update("INSERT INTO clientes (nome) VALUES (?)", "Müller 😀");

    mockMvc
        .perform(get("/api/v1/clientes").param("q", "muller").with(jwt()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.totalItens").value(1))
        .andExpect(jsonPath("$.itens[0].nome").value("Müller 😀"));
  }
}

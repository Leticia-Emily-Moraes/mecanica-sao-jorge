package br.com.mecanicasaojorge.api.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Prova a V10 (ADR-036) com linha ja existente: Flyway ate a V9, insere pecas, migra ate o fim.
 * Sem contexto Spring, so Flyway e MySQL real.
 */
@Testcontainers
class PecaNomeMigrationIT {

  private static final Path V10 =
      Path.of("src/main/resources/db/migration/V10__adicionar_nome_em_pecas.sql");

  @Container
  static final MySQLContainer<?> MYSQL =
      new MySQLContainer<>("mysql:8.4")
          .withDatabaseName("mecanica_sao_jorge_it")
          .withUsername("mecanica_it")
          .withPassword("mecanica_it_password");

  @Test
  void shouldGiveProvisionalNameAndFixCollationKeepingGeneratedSubtotalWhenV10Runs()
      throws Exception {
    DriverManagerDataSource dataSource =
        new DriverManagerDataSource(MYSQL.getJdbcUrl(), MYSQL.getUsername(), MYSQL.getPassword());
    JdbcTemplate jdbc = new JdbcTemplate(dataSource);
    Flyway.configure()
        .dataSource(dataSource)
        .locations("classpath:db/migration")
        .target("9")
        .load()
        .migrate();
    List<String> expressoesAntes = expressoesSubtotal(jdbc);
    jdbc.update(
        "INSERT INTO pecas (codigo, custo, preco_venda, quantidade_estoque, estoque_minimo, "
            + "ativo) VALUES ('FO-100', 10.00, 25.00, 5, 5, TRUE)");
    jdbc.update(
        "INSERT INTO pecas (codigo, custo, preco_venda, quantidade_estoque, estoque_minimo, "
            + "ativo) VALUES ('PF-200', 20.00, 45.00, 6, 5, TRUE)");
    List<Long> ids = jdbc.queryForList("SELECT id FROM pecas ORDER BY id", Long.class);

    Flyway.configure()
        .dataSource(dataSource)
        .locations("classpath:db/migration")
        .load()
        .migrate();

    assertThat(jdbc.queryForList("SELECT nome FROM pecas ORDER BY id", String.class))
        .containsExactly("Peca sem nome #" + ids.get(0), "Peca sem nome #" + ids.get(1));
    assertThat(
            jdbc.queryForMap(
                "SELECT COLUMN_TYPE AS tipo, IS_NULLABLE AS nulo, COLLATION_NAME AS colacao "
                    + "FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() "
                    + "AND TABLE_NAME = 'pecas' AND COLUMN_NAME = 'nome'"))
        .containsEntry("tipo", "varchar(150)")
        .containsEntry("nulo", "NO")
        .containsEntry("colacao", "utf8mb4_0900_ai_ci");
    assertThat(
            jdbc.queryForObject(
                "SELECT COLLATION_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = "
                    + "DATABASE() AND TABLE_NAME = 'pecas' AND COLUMN_NAME = 'codigo'",
                String.class))
        .isEqualTo("utf8mb4_0900_ai_ci");
    assertThat(
            jdbc.queryForObject(
                "SELECT COUNT(*) FROM information_schema.CHECK_CONSTRAINTS WHERE "
                    + "CONSTRAINT_SCHEMA = DATABASE() AND CONSTRAINT_NAME = "
                    + "'ck_pecas_nome_preenchido'",
                Integer.class))
        .isEqualTo(1);
    assertThat(expressoesSubtotal(jdbc)).isEqualTo(expressoesAntes).hasSize(2);
    assertThatThrownBy(
            () ->
                jdbc.update(
                    "INSERT INTO pecas (nome, codigo, custo, preco_venda) "
                        + "VALUES ('   ', 'X-1', 1.00, 2.00)"))
        .hasMessageContaining("ck_pecas_nome_preenchido");
    assertThatThrownBy(
            () ->
                jdbc.update(
                    "INSERT INTO pecas (nome, codigo, custo, preco_venda) "
                        + "VALUES ('Outro', 'fo-100', 1.00, 2.00)"))
        .hasMessageContaining("uq_pecas_codigo");
    // So as instrucoes contam: o comentario normativo do ADR-036 cita a tabela da OS.
    assertThat(Files.readAllLines(V10))
        .filteredOn(linha -> !linha.startsWith("--"))
        .noneMatch(linha -> linha.contains("ordens_servico"));
  }

  private static List<String> expressoesSubtotal(JdbcTemplate jdbc) {
    return jdbc.queryForList(
        "SELECT CONCAT(TABLE_NAME, ':', GENERATION_EXPRESSION) FROM information_schema.COLUMNS "
            + "WHERE TABLE_SCHEMA = DATABASE() AND COLUMN_NAME = 'subtotal' "
            + "AND TABLE_NAME IN ('ordens_servico_servicos', 'ordens_servico_pecas') "
            + "ORDER BY TABLE_NAME",
        String.class);
  }
}

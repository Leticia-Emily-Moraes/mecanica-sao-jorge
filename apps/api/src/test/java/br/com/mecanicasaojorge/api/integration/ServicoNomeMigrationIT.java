package br.com.mecanicasaojorge.api.integration;

import static org.assertj.core.api.Assertions.assertThat;

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
 * Prova a V9 (ADR-033) com linha ja existente: Flyway ate a versao anterior, insere um servico,
 * migra ate o fim. Sem contexto Spring, so Flyway e MySQL real.
 */
@Testcontainers
class ServicoNomeMigrationIT {

  private static final Path V9 =
      Path.of("src/main/resources/db/migration/V9__adicionar_nome_em_servicos.sql");

  @Container
  static final MySQLContainer<?> MYSQL =
      new MySQLContainer<>("mysql:8.4")
          .withDatabaseName("mecanica_sao_jorge_it")
          .withUsername("mecanica_it")
          .withPassword("mecanica_it_password");

  @Test
  void shouldGiveProvisionalNameToExistingRowsAndKeepGeneratedSubtotalWhenV9Runs()
      throws Exception {
    DriverManagerDataSource dataSource =
        new DriverManagerDataSource(MYSQL.getJdbcUrl(), MYSQL.getUsername(), MYSQL.getPassword());
    JdbcTemplate jdbc = new JdbcTemplate(dataSource);
    Flyway.configure()
        .dataSource(dataSource)
        .locations("classpath:db/migration")
        .target("4")
        .load()
        .migrate();
    List<String> expressoesAntes = expressoesSubtotal(jdbc);
    jdbc.update("INSERT INTO servicos (valor_padrao_mao_obra, ativo) VALUES (80.00, TRUE)");
    jdbc.update("INSERT INTO servicos (valor_padrao_mao_obra, ativo) VALUES (30.00, FALSE)");
    List<Long> ids = jdbc.queryForList("SELECT id FROM servicos ORDER BY id", Long.class);

    Flyway.configure().dataSource(dataSource).locations("classpath:db/migration").load().migrate();

    assertThat(jdbc.queryForList("SELECT nome FROM servicos ORDER BY id", String.class))
        .containsExactly("Servico sem nome #" + ids.get(0), "Servico sem nome #" + ids.get(1));
    assertThat(
            jdbc.queryForMap(
                "SELECT COLUMN_TYPE AS tipo, IS_NULLABLE AS nulo, COLLATION_NAME AS colacao "
                    + "FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() "
                    + "AND TABLE_NAME = 'servicos' AND COLUMN_NAME = 'nome'"))
        .containsEntry("tipo", "varchar(150)")
        .containsEntry("nulo", "NO")
        .containsEntry("colacao", "utf8mb4_0900_ai_ci");
    assertThat(
            jdbc.queryForObject(
                "SELECT COUNT(*) FROM information_schema.CHECK_CONSTRAINTS WHERE "
                    + "CONSTRAINT_SCHEMA = DATABASE() AND CONSTRAINT_NAME = "
                    + "'ck_servicos_nome_preenchido'",
                Integer.class))
        .isEqualTo(1);
    assertThat(expressoesSubtotal(jdbc)).isEqualTo(expressoesAntes).hasSize(2);
    // So as instrucoes contam: o comentario normativo do ADR-033 cita a tabela da OS.
    assertThat(Files.readAllLines(V9))
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

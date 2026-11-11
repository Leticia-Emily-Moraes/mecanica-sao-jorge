package br.com.mecanicasaojorge.api.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Sobe um MySQL real via Testcontainers, deixa o Spring Boot aplicar todas as migrations do Flyway
 * do zero (ADR-010) e valida o schema resultante: as 12 tabelas de domínio da V1+V2 existem (nada
 * de tabela de template genérico), e as constraints de integridade da V1 realmente restringem dados
 * inválidos.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@Testcontainers
class FlywayMigrationIT {

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
    // jwt.secret nao tem default (ADR-004/ADR-009): o contexto completo da aplicacao (AuthService/
    // JwtConfig) so sobe com um segredo valido de 32+ bytes, mesmo este IT testando so o Flyway.
    registry.add("jwt.secret", () -> "it-test-secret-nao-usar-em-producao-0123456789");
  }

  @Autowired private JdbcTemplate jdbcTemplate;

  @Test
  void shouldCreateAllDomainTablesWhenAllMigrationsRunFromScratch() {
    List<String> tabelas =
        jdbcTemplate.queryForList(
            "SELECT table_name FROM information_schema.tables "
                + "WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE'",
            String.class);

    assertThat(tabelas)
        .containsExactlyInAnyOrder(
            "usuarios",
            "clientes",
            "veiculos",
            "servicos",
            "pecas",
            "ordens_servico",
            "ordens_servico_servicos",
            "ordens_servico_pecas",
            "movimentacoes_estoque",
            "parcelas",
            "pagamentos",
            "financeiro",
            "flyway_schema_history");
  }

  @Test
  void shouldRejectDuplicateEmailWhenUniqueConstraintIsViolated() {
    inserirUsuario("Ana Paula", "ana.paula@mecanicasaojorge.com.br", "hash-ana", "ADMIN");

    assertThatThrownBy(
            () ->
                inserirUsuario(
                    "Ana Paula Duplicada",
                    "ana.paula@mecanicasaojorge.com.br",
                    "hash-ana-2",
                    "FUNCIONARIO"))
        .isInstanceOf(DataIntegrityViolationException.class);
  }

  @Test
  void shouldRejectUnknownPerfilWhenCheckConstraintIsViolated() {
    // MySQL reporta violacao de CHECK CONSTRAINT com o codigo de erro 3819/SQLState HY000, que o
    // tradutor de excecoes do Spring nao reconhece como DataIntegrityViolationException
    // especificamente — ele cai no supertipo DataAccessException. O banco recusa o dado do mesmo
    // jeito; so o tipo de excecao Java e mais generico.
    assertThatThrownBy(
            () ->
                inserirUsuario(
                    "Bruno Costa", "bruno.costa@mecanicasaojorge.com.br", "hash-bruno", "GERENTE"))
        .isInstanceOf(DataAccessException.class)
        .hasMessageContaining("ck_usuarios_perfil");
  }

  private void inserirUsuario(String nome, String email, String senhaHash, String perfil) {
    jdbcTemplate.update(
        "INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES (?, ?, ?, ?)",
        nome,
        email,
        senhaHash,
        perfil);
  }
}

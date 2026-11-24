package br.com.mecanicasaojorge.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuracao de JWT (ADR-004). O tamanho minimo do segredo e validado no boot por {@code
 * JwtConfig}; aqui so fica garantido que o valor nunca sai em texto claro por {@link #toString()}.
 */
@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(String secret, int expirationMinutes) {

  private static final String MASCARA = "***";

  /**
   * O {@code toString} gerado pelo record incluiria o segredo; qualquer log, mensagem de erro ou
   * dump de configuracao que imprimisse este objeto vazaria a chave HS256 (ADR-009).
   */
  @Override
  public String toString() {
    return "JwtProperties[secret=" + MASCARA + ", expirationMinutes=" + expirationMinutes + "]";
  }
}

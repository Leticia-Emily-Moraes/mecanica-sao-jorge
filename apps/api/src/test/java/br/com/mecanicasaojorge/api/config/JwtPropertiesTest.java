package br.com.mecanicasaojorge.api.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class JwtPropertiesTest {

  private static final String SEGREDO_FICTICIO = "segredo-ficticio-de-teste-com-mais-de-32-bytes";

  @Test
  void toStringNaoExpoeOSegredo() {
    JwtProperties propriedades = new JwtProperties(SEGREDO_FICTICIO, 10080);

    String texto = propriedades.toString();

    assertThat(texto).doesNotContain(SEGREDO_FICTICIO).contains("secret=***");
    assertThat(texto).contains("expirationMinutes=10080");
  }

  @Test
  void accessorContinuaDevolvendoOSegredoParaOJwtConfig() {
    JwtProperties propriedades = new JwtProperties(SEGREDO_FICTICIO, 10080);

    assertThat(propriedades.secret()).isEqualTo(SEGREDO_FICTICIO);
  }
}

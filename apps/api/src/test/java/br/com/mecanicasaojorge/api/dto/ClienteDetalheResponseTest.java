package br.com.mecanicasaojorge.api.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ClienteDetalheResponseTest {

  @Test
  void shouldPrintOnlyIdWhenConvertedToString() {
    ClienteDetalheResponse resposta =
        new ClienteDetalheResponse(
            7L, "Ana Exemplo", "12345678900", "11912345678", "ana@example.com", "Rua Modelo, 100");

    assertThat(resposta.toString())
        .isEqualTo("ClienteDetalheResponse[id=7]")
        .doesNotContain("12345678900", "Rua Modelo", "Ana", "11912345678", "ana@example.com");
  }
}

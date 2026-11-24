package br.com.mecanicasaojorge.api.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ClienteListResponseTest {

  @Test
  void shouldPrintOnlyIdWhenConvertedToString() {
    ClienteListResponse item =
        new ClienteListResponse(7L, "Ana Exemplo", "11912345678", "ana@example.com");

    assertThat(item.toString())
        .isEqualTo("ClienteListResponse[id=7]")
        .doesNotContain("Ana", "11912345678", "5678", "ana@example.com");
  }
}

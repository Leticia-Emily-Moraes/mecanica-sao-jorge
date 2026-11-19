package br.com.mecanicasaojorge.api.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class AparoUnicodeTest {

  @ParameterizedTest
  @ValueSource(
      strings = {" a@b.com", "a@b.com ", " a@b.com ", " \t a@b.com \n"})
  void shouldRemoveWhitespaceAndUnicodeSpacesFromTheEdges(String valor) {
    assertThat(AparoUnicode.aparar(valor)).isEqualTo("a@b.com");
  }

  @Test
  void shouldKeepInnerSpacesAndReturnNullForNull() {
    assertThat(AparoUnicode.aparar("a b")).isEqualTo("a b");
    assertThat(AparoUnicode.aparar(null)).isNull();
  }

  @Test
  void shouldReturnEmptyWhenOnlyUnicodeSpaces() {
    assertThat(AparoUnicode.aparar("   ")).isEmpty();
  }

  @Test
  void shouldTurnEmailMadeOnlyOfNbspIntoNullInRequest() {
    ClienteRequest request =
        new ClienteRequest("Ana", "12345678900", "11988887777", " ", null);
    assertThat(request.email()).isNull();
  }
}

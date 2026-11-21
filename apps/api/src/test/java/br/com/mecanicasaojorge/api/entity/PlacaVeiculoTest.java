package br.com.mecanicasaojorge.api.entity;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.regex.Pattern;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

/** Normalizacao e formato da placa (ADR-022, achado V4). Todas as placas sao ficticias. */
class PlacaVeiculoTest {

  private static final Pattern FORMATO = Pattern.compile(PlacaVeiculo.REGEX);

  @ParameterizedTest
  @CsvSource({
    "ABC1234,ABC1234",
    "ABC1D23,ABC1D23",
    "abc-1d23,ABC1D23",
    "'  ABC1D23 ',ABC1D23",
    "a b c - 1 2 3 4,ABC1234",
    "abc1234,ABC1234"
  })
  void shouldNormalizeToUpperCaseWithoutHyphenNorSpaceWhenPlateIsTyped(
      String digitada, String esperada) {
    assertThat(PlacaVeiculo.normalizar(digitada)).isEqualTo(esperada);
  }

  @ParameterizedTest
  @ValueSource(strings = {"ABC1234", "ABC1D23", "XYZ9A99", "AAA0000"})
  void shouldMatchFormatWhenPlateIsOldOrMercosul(String placa) {
    assertThat(FORMATO.matcher(placa).matches()).isTrue();
  }

  @ParameterizedTest
  @ValueSource(
      strings = {
        "AB12345",
        "ABCD123",
        "ABC12D3",
        "ABC123",
        "ABC12345",
        "AB1D234",
        "ABC1D2E",
        "ABC1D2",
        "ANON42",
        "ABC1D23\n"
      })
  void shouldRejectFormatWhenPlateIsNeitherOldNorMercosul(String placa) {
    assertThat(FORMATO.matcher(PlacaVeiculo.normalizar(placa)).matches()).isFalse();
  }

  @Test
  void shouldNotUppercaseNonAsciiLettersWhenNormalizing() {
    // U+0131 (i sem ponto) viraria "I" com toUpperCase no JDK 21: a placa nao foi digitada assim.
    String comLetraTurca = (char) 0x131 + "bc1d23";

    assertThat(PlacaVeiculo.normalizar(comLetraTurca)).isEqualTo((char) 0x131 + "BC1D23");
    assertThat(FORMATO.matcher(PlacaVeiculo.normalizar(comLetraTurca)).matches()).isFalse();
  }

  @Test
  void shouldRejectFormatWhenPlateHasUnicodeDigitFullWidthLetterTabOrNoBreakSpace() {
    String[] invalidas = {
      "ABC" + (char) 0x661 + "D23",
      "" + (char) 0xFF21 + "BC1D23",
      "ABC1D23\t",
      "ABC" + (char) 0xA0 + "1D23"
    };

    for (String placa : invalidas) {
      assertThat(FORMATO.matcher(PlacaVeiculo.normalizar(placa)).matches()).isFalse();
    }
  }

  @Test
  void shouldKeepRawValueWhenInputHasMoreThan20Characters() {
    String longa = "A B C - 1 D 2 3 " + " ".repeat(10);

    assertThat(PlacaVeiculo.normalizar(longa)).isEqualTo(longa);
    assertThat(PlacaVeiculo.normalizar("a".repeat(21))).isEqualTo("a".repeat(21));
  }

  @Test
  void shouldReturnNullWhenInputIsNull() {
    assertThat(PlacaVeiculo.normalizar(null)).isNull();
  }
}

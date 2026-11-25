package br.com.mecanicasaojorge.api.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class AnoModeloValidatorTest {

  private static AnoModeloValidator comRelogioEm(String instante) {
    return new AnoModeloValidator(Clock.fixed(Instant.parse(instante), ZoneOffset.UTC));
  }

  @ParameterizedTest
  @CsvSource({
    "1899, false",
    "1900, true",
    "2026, true",
    "2027, true",
    "2028, false",
  })
  void shouldAcceptOnlyFrom1900ToCurrentYearPlusOneWhenClockIsInTheMiddleOfTheYear(
      int ano, boolean esperado) {
    var validador = comRelogioEm("2026-06-15T12:00:00Z");

    assertThat(validador.isValid(ano, null)).isEqualTo(esperado);
  }

  @Test
  void shouldRejectNextYearPlusOneWhenClockIsInTheLastSecondOfTheYear() {
    var validador = comRelogioEm("2026-12-31T23:59:59Z");

    assertThat(validador.isValid(2027, null)).isTrue();
    assertThat(validador.isValid(2028, null)).isFalse();
  }

  @Test
  void shouldAcceptOneMoreYearWhenClockPassesToTheFirstSecondOfNewYear() {
    var validador = comRelogioEm("2027-01-01T00:00:00Z");

    assertThat(validador.isValid(2028, null)).isTrue();
    assertThat(validador.isValid(2029, null)).isFalse();
  }

  @Test
  void shouldTreatNullAsValidBecauseRequiredIsCheckedByNotNull() {
    var validador = comRelogioEm("2026-06-15T12:00:00Z");

    assertThat(validador.isValid(null, null)).isTrue();
  }
}

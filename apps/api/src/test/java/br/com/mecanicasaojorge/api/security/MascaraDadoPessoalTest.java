package br.com.mecanicasaojorge.api.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;

/** Tabela da secao 6.2.1 da politica de dados do cliente, linha a linha (valores ficticios). */
class MascaraDadoPessoalTest {

  @ParameterizedTest
  @CsvSource({
    "11987654321,*******4321",
    "'(11) 98765-4321',*******4321",
    "1133334444,******4444",
    "4321,***",
    "ana,***",
    "551198765432,***"
  })
  void shouldMaskPhoneKeepingOnlyLastFourDigits(String entrada, String esperado) {
    assertThat(MascaraDadoPessoal.telefone(entrada)).isEqualTo(esperado);
  }

  @ParameterizedTest
  @NullAndEmptySource
  void shouldReturnFixedMaskWhenPhoneIsNullOrEmpty(String entrada) {
    assertThat(MascaraDadoPessoal.telefone(entrada)).isEqualTo("***");
  }

  @Test
  void shouldReturnFixedMaskWhenPhoneHasNonAsciiDigits() {
    String arabicoIndico = "١".repeat(11);
    assertThat(arabicoIndico).hasSize(11);

    assertThat(MascaraDadoPessoal.telefone(arabicoIndico)).isEqualTo("***");
  }

  @ParameterizedTest
  @CsvSource({
    "12345678909,***.*56.7**-**",
    "123.456.789-09,***.*56.7**-**",
    "1234567890,***.***.***-**",
    "abc,***.***.***-**"
  })
  void shouldMaskCpfKeepingOnlyMiddleDigits(String entrada, String esperado) {
    assertThat(MascaraDadoPessoal.cpf(entrada)).isEqualTo(esperado);
  }

  @Test
  void shouldReturnFullMaskWhenCpfIsNull() {
    assertThat(MascaraDadoPessoal.cpf(null)).isEqualTo("***.***.***-**");
  }
}

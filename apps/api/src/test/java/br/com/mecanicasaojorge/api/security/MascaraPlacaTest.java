package br.com.mecanicasaojorge.api.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;

/** Tabela da secao 6.2.2 da politica de dados do cliente, linha a linha (placas ficticias). */
class MascaraPlacaTest {

  @ParameterizedTest
  @CsvSource({
    "ABC1D23,****D23",
    "ABC1234,****234",
    "abc-1d23,****D23",
    "' ABC1D23 ',****D23",
    "AB12345,*******",
    "ABC12D3,*******",
    "ABCD123,*******",
    "ABC1D234,*******",
    "ANON42,*******"
  })
  void shouldMaskPlateKeepingOnlyLastThreeCharacters(String entrada, String esperado) {
    assertThat(MascaraDadoPessoal.placa(entrada)).isEqualTo(esperado);
  }

  @ParameterizedTest
  @NullAndEmptySource
  void shouldReturnFixedMaskWhenPlateIsNullOrEmpty(String entrada) {
    assertThat(MascaraDadoPessoal.placa(entrada)).isEqualTo("*******");
  }

  @Test
  void shouldReturnFixedMaskWhenPlateHasNonAsciiCharacters() {
    assertThat(MascaraDadoPessoal.placa((char) 0x131 + "BC1D23")).isEqualTo("*******");
    assertThat(MascaraDadoPessoal.placa("ABC" + (char) 0x661 + "D23")).isEqualTo("*******");
    assertThat(MascaraDadoPessoal.placa("" + (char) 0xFF21 + "BC1D23")).isEqualTo("*******");
  }
}

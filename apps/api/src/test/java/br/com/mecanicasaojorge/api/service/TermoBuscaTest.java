package br.com.mecanicasaojorge.api.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.text.Normalizer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

/** Normalizacao e escape do termo de busca (ADR-017, contrato normativo). */
class TermoBuscaTest {

  private static final char ESPACO_NAO_SEPARAVEL = (char) 0xA0;

  @ParameterizedTest
  @NullAndEmptySource
  @ValueSource(strings = {" ", "   ", "\t\n"})
  void shouldHaveNoTermWhenInputIsNullEmptyOrBlank(String bruto) {
    TermoBusca termo = TermoBusca.de(bruto);

    assertThat(termo.semTermo()).isTrue();
    assertThat(termo.padraoTexto()).isNull();
    assertThat(termo.padraoTelefone()).isNull();
    assertThat(termo.tamanho()).isZero();
  }

  @Test
  void shouldWrapTrimmedTermWithWildcardsWhenInputIsPlainText() {
    TermoBusca termo = TermoBusca.de("  José  ");

    assertThat(termo.padraoTexto()).isEqualTo("%José%");
    assertThat(termo.tamanho()).isEqualTo(4);
    assertThat(termo.padraoTelefone()).isNull();
  }

  @Test
  void shouldEscapePercentAndUnderscoreAsLiteralsWhenTermHasWildcards() {
    assertThat(TermoBusca.de("%").padraoTexto()).isEqualTo("%!%%");
    assertThat(TermoBusca.de("_").padraoTexto()).isEqualTo("%!_%");
    assertThat(TermoBusca.de("100%_ok").padraoTexto()).isEqualTo("%100!%!_ok%");
  }

  @Test
  void shouldEscapeTheEscapeCharacterFirstWhenItIsFollowedByPercent() {
    // "!%" deve virar "!!" + "!%", nunca escapar duas vezes
    assertThat(TermoBusca.de("!%").padraoTexto()).isEqualTo("%!!!%%");
    assertThat(TermoBusca.de("uau!").padraoTexto()).isEqualTo("%uau!!%");
  }

  @Test
  void shouldKeepBackslashIntactWhenEscapeCharacterIsExclamation() {
    assertThat(TermoBusca.de("Barra\\Invertida").padraoTexto()).isEqualTo("%Barra\\Invertida%");
  }

  @Test
  void shouldNeverConcatenateQuotesIntoSpecialMeaningWhenTermHasQuote() {
    // aspas passam como texto; quem protege e o parametro ligado, nao o escape
    assertThat(TermoBusca.de("o'brien").padraoTexto()).isEqualTo("%o'brien%");
  }

  @Test
  void shouldKeepOnlyAsciiDigitsForPhoneWhenTermHasMask() {
    TermoBusca termo = TermoBusca.de("(11) 98765-4321");

    assertThat(termo.padraoTelefone()).isEqualTo("%11987654321%");
    assertThat(termo.padraoTexto()).isEqualTo("%(11) 98765-4321%");
  }

  @Test
  void shouldNotQueryPhoneWhenTermHasNoDigit() {
    assertThat(TermoBusca.de("ana").padraoTelefone()).isNull();
    assertThat(TermoBusca.de("%").padraoTelefone()).isNull();
  }

  @Test
  void shouldIgnoreNonAsciiDigitsWhenBuildingPhonePattern() {
    // digitos arabico-indicos (U+0661) nao sao digitos de telefone
    assertThat(TermoBusca.de("١٢٣").padraoTelefone()).isNull();
  }

  /** Tabela normativa do passo 5 do ADR-017 (T2): telefone so com termo numerico. */
  @ParameterizedTest(name = "[{index}] \"{0}\" -> {1}")
  @CsvSource(
      nullValues = "NULL",
      value = {
        "11987654321,%11987654321%",
        "(11) 98765-4321,%11987654321%",
        "11.98765.4321,%11987654321%",
        "+11 98765-4321,%11987654321%",
        "987,%987%",
        "+55 11 98765-4321,%5511987654321%",
        "zeta5@example.org,NULL",
        "rua 7,NULL",
        "5a,NULL",
        "ana,NULL",
        "%,NULL",
        "_,NULL",
        "()-,NULL",
        "+,NULL",
        ".,NULL",
        "٥٥٥,NULL",
        "11/98765,NULL",
        "1!2,NULL",
        "12\\3,NULL",
        "１１９,NULL"
      })
  void shouldQueryPhoneOnlyWhenTermIsNumeric(String bruto, String padraoEsperado) {
    assertThat(TermoBusca.de(bruto).padraoTelefone()).isEqualTo(padraoEsperado);
  }

  @Test
  void shouldTreatNoBreakSpaceAsMaskSymbolWhenTermIsNumeric() {
    TermoBusca termo = TermoBusca.de("11" + ESPACO_NAO_SEPARAVEL + "9876");

    assertThat(termo.padraoTelefone()).isEqualTo("%119876%");
  }

  @Test
  void shouldNotQueryPhoneWhenTermHasTabOrLineBreakInside() {
    assertThat(TermoBusca.de("11\t9876").padraoTelefone()).isNull();
    assertThat(TermoBusca.de("11\n9876").padraoTelefone()).isNull();
  }

  @Test
  void shouldKeepNameAndEmailPatternWhenTermIsNumeric() {
    TermoBusca termo = TermoBusca.de("(11) 987");

    assertThat(termo.padraoTexto()).isEqualTo("%(11) 987%");
  }

  @Test
  void shouldNormalizeToNfcWhenAccentIsDecomposed() {
    String decomposto = Normalizer.normalize("José", Normalizer.Form.NFD);
    assertThat(decomposto).hasSize(5);

    TermoBusca termo = TermoBusca.de(decomposto);

    assertThat(termo.padraoTexto()).isEqualTo("%José%");
    assertThat(termo.tamanho()).isEqualTo(4);
  }

  @Test
  void shouldMeasureTermLengthAfterTrimAndBeforeEscape() {
    assertThat(TermoBusca.de(" 100% ").tamanho()).isEqualTo(4);
  }

  @ParameterizedTest
  @CsvSource({
    "abc-1d23, %ABC1D23%",
    "' ABC 1D23 ', %ABC1D23%",
    "abc-12, %ABC12%",
    "ABC1234, %ABC1234%"
  })
  void shouldNormalizePlateWhenTermHasHyphenSpaceOrLowerCase(String bruto, String esperado) {
    assertThat(TermoBusca.de(bruto).padraoPlaca()).isEqualTo(esperado);
  }

  @ParameterizedTest
  @ValueSource(strings = {"-", "José", "%", "_", "abc!1", "ABCDEFGHIJK", "' OR '1'='1"})
  void shouldHaveNoPlatePatternWhenTermIsNotPlateShaped(String bruto) {
    assertThat(TermoBusca.de(bruto).padraoPlaca()).isNull();
  }

  @Test
  void shouldHaveNoPlatePatternWhenThereIsNoTerm() {
    assertThat(TermoBusca.de(null).padraoPlaca()).isNull();
  }

  @Test
  void shouldNotExposeTermInToString() {
    TermoBusca termo = TermoBusca.de("Maria Souza ABC1234");

    assertThat(termo.toString()).isEqualTo("TermoBusca[tamanho=19]");
    assertThat(termo.toString()).doesNotContain("Maria", "ABC1234");
  }
}

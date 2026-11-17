package br.com.mecanicasaojorge.api.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.text.Normalizer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

/** Normalizacao e escape do termo de busca (ADR-017, contrato normativo). */
class TermoBuscaTest {

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
}

package br.com.mecanicasaojorge.api.dto;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.mecanicasaojorge.api.entity.Veiculo;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;
import org.hibernate.validator.HibernateValidator;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

/** Validacao, normalizacao e privacidade do {@link VeiculoRequest}; relogio fixo em 2026. */
class VeiculoRequestTest {

  private static final Pattern FORMATO_CHAVE =
      Pattern.compile("^veiculo\\.[a-z]+\\.[a-z]+\\.[a-z]+$");

  private static ValidatorFactory fabrica;
  private static Validator validator;

  @BeforeAll
  static void criarValidator() {
    Clock relogio = Clock.fixed(Instant.parse("2026-06-01T12:00:00Z"), ZoneOffset.UTC);
    fabrica =
        Validation.byProvider(HibernateValidator.class)
            .configure()
            .constraintValidatorFactory(new FabricaComRelogio(relogio))
            .buildValidatorFactory();
    validator = fabrica.getValidator();
  }

  @AfterAll
  static void fecharFabrica() {
    fabrica.close();
  }

  @ParameterizedTest
  @ValueSource(strings = {"ABC1234", "ABC1D23", "abc-1d23", " ABC1D23 ", "abc 1234"})
  void shouldAcceptPlateInOldAndMercosulFormatsWithOrWithoutMask(String placa) {
    assertThat(validar(requisicao(placa, "Fiat", "Uno", 2015, "Prata"))).isEmpty();
  }

  @Test
  void shouldNormalizePlateInConstructorBeforeValidating() {
    assertThat(requisicao("abc-1d23", "Fiat", "Uno", 2015, null).placa()).isEqualTo("ABC1D23");
    assertThat(requisicao(" ABC1D23 ", "Fiat", "Uno", 2015, null).placa()).isEqualTo("ABC1D23");
  }

  @ParameterizedTest
  @ValueSource(
      strings = {"AB12345", "ABCD123", "ABC12D3", "ABC123", "ABC1D2345", "ABC\t1D23", "ABC1D23!"})
  void shouldRejectPlateWithPlateErrorKeyWhenFormatIsInvalid(String placa) {
    assertThat(chaves(validar(requisicao(placa, "Fiat", "Uno", 2015, null))))
        .containsExactly("placa:" + VeiculoChaves.PLACA_ERRO);
  }

  @ParameterizedTest
  @ValueSource(strings = {"", "   ", " - "})
  void shouldRejectPlateAsRequiredWhenBlankOrOnlySeparators(String placa) {
    assertThat(chaves(validar(requisicao(placa, "Fiat", "Uno", 2015, null))))
        .containsExactly("placa:" + VeiculoChaves.PLACA_OBRIGATORIA);
  }

  @Test
  void shouldRejectPlateWhenNullOrLongerThan20Characters() {
    assertThat(chaves(validar(requisicao(null, "Fiat", "Uno", 2015, null))))
        .containsExactly("placa:" + VeiculoChaves.PLACA_OBRIGATORIA);
    assertThat(
            chaves(
                validar(requisicao("A B C - 1 D 2 3     ".repeat(2), "Fiat", "Uno", 2015, null))))
        .containsExactly("placa:" + VeiculoChaves.PLACA_ERRO);
  }

  @Test
  void shouldReportOneErrorPerFieldWhenBrandModelAndYearAreMissing() {
    assertThat(chaves(validar(requisicao("ABC1D23", " ", null, null, null))))
        .containsExactlyInAnyOrder(
            "marca:" + VeiculoChaves.MARCA_OBRIGATORIA,
            "modelo:" + VeiculoChaves.MODELO_OBRIGATORIO,
            "ano:" + VeiculoChaves.ANO_OBRIGATORIO);
  }

  @ParameterizedTest
  @CsvSource({"1899,false", "1900,true", "2026,true", "2027,true", "2028,false"})
  void shouldAcceptYearBetween1900AndCurrentYearPlusOne(int ano, boolean valido) {
    List<String> erros = chaves(validar(requisicao("ABC1D23", "Fiat", "Uno", ano, null)));

    if (valido) {
      assertThat(erros).isEmpty();
    } else {
      assertThat(erros).containsExactly("ano:" + VeiculoChaves.ANO_FAIXA);
    }
  }

  @Test
  void shouldTreatColorAsOptionalAndLimitItTo40Characters() {
    assertThat(validar(requisicao("ABC1D23", "Fiat", "Uno", 2015, null))).isEmpty();
    assertThat(requisicao("ABC1D23", "Fiat", "Uno", 2015, "   ").cor()).isNull();
    assertThat(chaves(validar(requisicao("ABC1D23", "Fiat", "Uno", 2015, "a".repeat(41)))))
        .containsExactly("cor:" + VeiculoChaves.COR_TAMANHO);
  }

  @Test
  void shouldLimitBrandAndModelTo100Characters() {
    assertThat(chaves(validar(requisicao("ABC1D23", "a".repeat(101), "b".repeat(101), 2015, null))))
        .containsExactlyInAnyOrder(
            "marca:" + VeiculoChaves.MARCA_TAMANHO, "modelo:" + VeiculoChaves.MODELO_TAMANHO);
  }

  @Test
  void shouldUseOnlyI18nKeysAsMessagesAndNeverEchoRejectedValue() {
    VeiculoRequest invalida = requisicao("XYZ-valor-secreto", "", "", 1800, "c".repeat(50));

    Set<ConstraintViolation<VeiculoRequest>> violacoes = validar(invalida);

    assertThat(violacoes).isNotEmpty();
    assertThat(violacoes)
        .allSatisfy(
            v -> {
              assertThat(v.getMessage()).matches(FORMATO_CHAVE);
              assertThat(v.getMessage()).doesNotContain("secreto", "1800");
            });
  }

  @Test
  void shouldPublishTenDistinctKeysInTheAgreedFormat() {
    assertThat(VeiculoChaves.TODAS).hasSize(10).doesNotHaveDuplicates();
    assertThat(VeiculoChaves.TODAS).allMatch(chave -> FORMATO_CHAVE.matcher(chave).matches());
  }

  @Test
  void shouldNotExposeIdentityOrOwnerFieldsToAvoidMassAssignment() {
    assertThat(VeiculoRequest.class.getRecordComponents())
        .extracting(c -> c.getName())
        .containsExactly("placa", "marca", "modelo", "ano", "cor");
  }

  @Test
  void shouldNotPrintPlateInToStringOfRequestResponsesAndBuilder() {
    String placa = "ABC1D23";

    assertThat(requisicao(placa, "Fiat", "Uno", 2015, "Prata").toString()).doesNotContain(placa);
    assertThat(new VeiculoResponse(1L, 2L, placa, "Fiat", "Uno", 2015, "Prata").toString())
        .doesNotContain(placa, "Fiat");
    assertThat(new VeiculoListResponse(1L, placa, "Fiat", "Uno").toString())
        .doesNotContain(placa, "Fiat");
    assertThat(
            new VeiculoDetalheResponse(
                    1L, 2L, "Ana Exemplo", placa, "Fiat", "Uno", 2015, null, null)
                .toString())
        .doesNotContain(placa, "Ana", "Fiat");
    assertThat(Veiculo.builder().placa(placa).marca("Fiat").toString()).doesNotContain(placa);
  }

  @Test
  void shouldKeepHistoryListNonNullWhenDetailIsBuiltWithoutHistory() {
    VeiculoDetalheResponse detalhe =
        new VeiculoDetalheResponse(1L, 2L, "Ana", "ABC1D23", "Fiat", "Uno", 2015, null, null);

    assertThat(detalhe.historicoOs()).isNotNull().isEmpty();
  }

  private static VeiculoRequest requisicao(
      String placa, String marca, String modelo, Integer ano, String cor) {
    return new VeiculoRequest(placa, marca, modelo, ano, cor);
  }

  private static Set<ConstraintViolation<VeiculoRequest>> validar(VeiculoRequest request) {
    return validator.validate(request);
  }

  private static List<String> chaves(Set<ConstraintViolation<VeiculoRequest>> violacoes) {
    return violacoes.stream()
        .map(v -> v.getPropertyPath() + ":" + v.getMessage())
        .sorted()
        .toList();
  }

  /** Cria {@link AnoModeloValidator} com o relogio fixo; os demais validadores sao os padrao. */
  private static final class FabricaComRelogio
      implements jakarta.validation.ConstraintValidatorFactory {

    private final Clock relogio;

    FabricaComRelogio(Clock relogio) {
      this.relogio = relogio;
    }

    @Override
    public <T extends jakarta.validation.ConstraintValidator<?, ?>> T getInstance(Class<T> tipo) {
      try {
        if (tipo == AnoModeloValidator.class) {
          return tipo.cast(new AnoModeloValidator(relogio));
        }
        return tipo.getDeclaredConstructor().newInstance();
      } catch (ReflectiveOperationException e) {
        throw new IllegalStateException(e);
      }
    }

    @Override
    public void releaseInstance(jakarta.validation.ConstraintValidator<?, ?> instancia) {
      // sem estado a liberar
    }
  }
}

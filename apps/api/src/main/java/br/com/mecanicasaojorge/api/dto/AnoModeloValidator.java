package br.com.mecanicasaojorge.api.dto;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.Clock;
import java.time.Year;

/** Valida a faixa do ano contra o {@link Clock} injetado (testavel com data fixa). */
public class AnoModeloValidator implements ConstraintValidator<AnoModelo, Integer> {

  static final int ANO_MINIMO = 1900;

  private final Clock clock;

  public AnoModeloValidator(Clock clock) {
    this.clock = clock;
  }

  @Override
  public boolean isValid(Integer ano, ConstraintValidatorContext context) {
    return ano == null || (ano >= ANO_MINIMO && ano <= Year.now(clock).getValue() + 1);
  }
}

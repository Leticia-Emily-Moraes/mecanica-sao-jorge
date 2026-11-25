package br.com.mecanicasaojorge.api.dto;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Ano do veiculo entre {@value AnoModeloValidator#ANO_MINIMO} e o ano corrente + 1 (modelo do ano
 * seguinte). {@code null} e valido: a obrigatoriedade e do {@code @NotNull}.
 */
@Documented
@Constraint(validatedBy = AnoModeloValidator.class)
@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface AnoModelo {

  String message() default VeiculoChaves.ANO_FAIXA;

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}

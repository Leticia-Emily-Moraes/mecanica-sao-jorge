package br.com.mecanicasaojorge.api.dto;

import br.com.mecanicasaojorge.api.entity.PlacaVeiculo;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import tools.jackson.databind.annotation.JsonDeserialize;

/**
 * Entrada de criacao e edicao de veiculo (F04, ADR-022 e ADR-024). Tem so placa, marca, modelo, ano
 * e cor: sem {@code id}, {@code clienteId}, {@code cliente} e {@code quilometragem}, entao
 * atribuicao em massa e impossivel (V1 e V2; propriedade desconhecida no JSON e ignorada). A placa
 * e normalizada no construtor, antes do Bean Validation, para a validacao e a unicidade usarem o
 * mesmo valor. Toda mensagem e uma chave i18n ({@link VeiculoChaves}), nunca texto, e nunca repete
 * o valor enviado. O {@link #toString()} nao imprime dado pessoal.
 */
@Schema(description = "Dados para cadastrar ou corrigir um veiculo; o dono nao muda na edicao")
public record VeiculoRequest(
    @Schema(
            description =
                "Padrao antigo (ABC1234) ou Mercosul (ABC1D23); aceita minuscula, espaco e hifen, "
                    + "gravada normalizada. Placa ficticia no exemplo.",
            example = "ABC1D23")
        @NotBlank(message = VeiculoChaves.PLACA_OBRIGATORIA)
        @Pattern(regexp = PlacaVeiculo.REGEX, message = VeiculoChaves.PLACA_ERRO)
        String placa,
    @Schema(description = "Ate 100 caracteres", example = "Fiat")
        @NotBlank(message = VeiculoChaves.MARCA_OBRIGATORIA)
        @Size(max = 100, message = VeiculoChaves.MARCA_TAMANHO)
        String marca,
    @Schema(description = "Ate 100 caracteres", example = "Uno")
        @NotBlank(message = VeiculoChaves.MODELO_OBRIGATORIO)
        @Size(max = 100, message = VeiculoChaves.MODELO_TAMANHO)
        String modelo,
    @Schema(description = "De 1900 ate o ano corrente + 1", example = "2015")
        @NotNull(message = VeiculoChaves.ANO_OBRIGATORIO)
        @AnoModelo
        @JsonDeserialize(using = AnoInteiroDeserializer.class)
        Integer ano,
    @Schema(description = "Opcional, ate 40 caracteres", example = "Prata")
        @Size(max = 40, message = VeiculoChaves.COR_TAMANHO)
        String cor) {

  public VeiculoRequest {
    placa = emBrancoParaNulo(PlacaVeiculo.normalizar(placa));
    marca = aparadoOuNulo(marca);
    modelo = aparadoOuNulo(modelo);
    cor = aparadoOuNulo(cor);
  }

  /** Apara as pontas (ADR-024, regra 6); em branco vira nulo, entao {@code cor} grava NULL. */
  private static String aparadoOuNulo(String valor) {
    return valor == null || valor.isBlank() ? null : valor.strip();
  }

  private static String emBrancoParaNulo(String valor) {
    return valor == null || valor.isBlank() ? null : valor;
  }

  @Override
  public String toString() {
    return "VeiculoRequest";
  }
}

package br.com.mecanicasaojorge.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/** Veiculo resumido para listas de outros recursos: id, placa e modelo (ADR-037). */
@Schema(description = "Veiculo da OS: id, placa e modelo")
public record VeiculoResumo(
    @Schema(example = "12") Long id,
    @Schema(example = "ABC1D23") String placa,
    @Schema(example = "Gol 1.0") String modelo) {

  /** Mostra so o id: a placa e dado pessoal e nao vai a log por {@code toString()}. */
  @Override
  public String toString() {
    return "VeiculoResumo[id=" + id + "]";
  }
}

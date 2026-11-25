package br.com.mecanicasaojorge.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/** Veiculo criado ou editado (201 e 200). O {@code toString()} mostra so o id (V8). */
@Schema(description = "Veiculo cadastrado")
public record VeiculoResponse(
    Long id,
    @Schema(description = "Dono do veiculo; nao muda depois da criacao") Long clienteId,
    @Schema(example = "ABC1D23") String placa,
    @Schema(example = "Fiat") String marca,
    @Schema(example = "Uno") String modelo,
    @Schema(example = "2015") Integer ano,
    @Schema(description = "Null quando nao informada", example = "Prata") String cor) {

  @Override
  public String toString() {
    return "VeiculoResponse(id=" + id + ")";
  }
}

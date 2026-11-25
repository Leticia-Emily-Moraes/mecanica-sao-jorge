package br.com.mecanicasaojorge.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/** Item da lista de veiculos do cliente. O {@code toString()} mostra so o id (V8). */
@Schema(description = "Veiculo na lista do cliente")
public record VeiculoListResponse(
    Long id,
    @Schema(example = "ABC1D23") String placa,
    @Schema(example = "Fiat") String marca,
    @Schema(example = "Uno") String modelo) {

  @Override
  public String toString() {
    return "VeiculoListResponse(id=" + id + ")";
  }
}

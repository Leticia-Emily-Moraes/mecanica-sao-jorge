package br.com.mecanicasaojorge.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

/**
 * Detalhe do veiculo com dados cadastrais e historico de OS. {@code historicoOs} nunca e nulo nem
 * ausente. O {@code toString()} mostra so o id: placa e nome do dono nao saem em log (V8).
 */
@Schema(description = "Detalhe do veiculo")
public record VeiculoDetalheResponse(
    Long id,
    Long clienteId,
    @Schema(description = "Nome do dono, so para exibicao; nunca vai para log", example = "Ana")
        String clienteNome,
    @Schema(example = "ABC1D23") String placa,
    @Schema(example = "Fiat") String marca,
    @Schema(example = "Uno") String modelo,
    @Schema(example = "2015") Integer ano,
    @Schema(description = "Null quando nao informada", example = "Prata") String cor,
    @Schema(description = "Sempre presente; vazio ate existir a feature de OS")
        List<HistoricoOsItem> historicoOs) {

  public VeiculoDetalheResponse {
    historicoOs = historicoOs == null ? List.of() : List.copyOf(historicoOs);
  }

  @Override
  public String toString() {
    return "VeiculoDetalheResponse(id=" + id + ")";
  }
}

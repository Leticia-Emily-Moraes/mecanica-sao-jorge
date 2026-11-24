package br.com.mecanicasaojorge.api.dto;

import br.com.mecanicasaojorge.api.entity.StatusOS;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Item da listagem de ordens de servico (F06a, ADR-037). Sem subtotais, desconto nem dado do
 * cliente alem de id e nome. {@code previsaoEntrega} nula sai como {@code null}, sem omitir o
 * campo.
 */
@Schema(description = "Ordem de servico na listagem")
public record OrdemServicoListResponse(
    @Schema(example = "101") Long id,
    @Schema(example = "ABERTA") StatusOS status,
    @Schema(description = "Instante em UTC (ISO-8601)", example = "2026-11-24T12:30:00Z")
        Instant dataAbertura,
    @Schema(
            description = "Somente dia; null quando nao ha previsao",
            example = "2026-12-01",
            nullable = true)
        LocalDate previsaoEntrega,
    @Schema(example = "0.00") BigDecimal valorTotal,
    ClienteResumo cliente,
    VeiculoResumo veiculo) {

  /** Mostra so o id: cliente e veiculo sao dado pessoal e nao vao a log por {@code toString()}. */
  @Override
  public String toString() {
    return "OrdemServicoListResponse[id=" + id + "]";
  }
}

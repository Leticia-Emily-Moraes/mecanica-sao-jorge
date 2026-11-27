package br.com.mecanicasaojorge.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

/**
 * Item da listagem de servicos (F05a, ADR-032). Catalogo sem dado pessoal. {@code
 * tempoEstimadoHoras} pode ser {@code null}, pois a coluna e opcional.
 */
@Schema(description = "Servico na listagem")
public record ServicoListResponse(
    @Schema(example = "3") Long id,
    @Schema(example = "Troca de Óleo") String nome,
    @Schema(description = "Valor padrao da mao de obra", example = "60.00")
        BigDecimal valorPadraoMaoObra,
    @Schema(description = "Tempo estimado em horas decimais", example = "0.50", nullable = true)
        BigDecimal tempoEstimadoHoras,
    @Schema(example = "true") boolean ativo) {}

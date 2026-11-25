package br.com.mecanicasaojorge.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

/**
 * Item do historico de OS do veiculo (ADR-025). Tipo fixado agora para a lista nao mudar de forma
 * quando a feature de Ordens de Servico a preencher; nesta entrega a lista sai sempre vazia.
 */
@Schema(description = "Ordem de servico do veiculo (lista vazia ate a feature de OS)")
public record HistoricoOsItem(
    Long id,
    @Schema(description = "Status da OS", example = "FINALIZADA") String status,
    @Schema(description = "Valor total da OS", example = "350.00") BigDecimal valorTotal) {}

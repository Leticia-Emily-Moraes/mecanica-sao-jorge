package br.com.mecanicasaojorge.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

/**
 * Item da listagem de pecas (F17, ADR-034). Sem custo e sem a coluna ativo. {@code estoqueBaixo} e
 * calculado no service a cada leitura (ADR-035).
 */
@Schema(description = "Peca na listagem")
public record PecaListResponse(
    @Schema(example = "3") Long id,
    @Schema(example = "Filtro de óleo") String nome,
    @Schema(example = "FO-100") String codigo,
    @Schema(description = "Preco de venda", example = "25.00") BigDecimal precoVenda,
    @Schema(example = "5") int quantidadeEstoque,
    @Schema(example = "5") int estoqueMinimo,
    @Schema(description = "true quando quantidadeEstoque <= estoqueMinimo", example = "true")
        boolean estoqueBaixo) {}

package br.com.mecanicasaojorge.api.dto;

import java.util.List;
import org.springframework.data.domain.Page;

/**
 * Pagina de resultados com JSON proprio, sem expor o formato interno do Spring Data (ADR-017).
 * Reaproveitada pelas proximas listagens com busca.
 *
 * @param itens itens da pagina, vazia (nunca {@code null}) alem do fim
 * @param pagina numero da pagina pedida, base 0
 * @param tamanho {@code size} pedido, nao a quantidade de itens devolvidos
 * @param totalItens total de itens que casam com a busca
 * @param totalPaginas total de paginas (0 quando nao ha itens)
 */
public record PaginaResponse<T>(
    List<T> itens, int pagina, int tamanho, long totalItens, int totalPaginas) {

  public static <T> PaginaResponse<T> de(Page<T> page) {
    return new PaginaResponse<>(
        page.getContent(),
        page.getNumber(),
        page.getSize(),
        page.getTotalElements(),
        page.getTotalPages());
  }
}

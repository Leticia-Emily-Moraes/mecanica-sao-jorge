package br.com.mecanicasaojorge.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Item da listagem de clientes (F03a, ADR-017). Sem CPF, sem endereco e sem campos da entidade
 * (ADR-007). {@code telefone} sai so com digitos, como gravado; {@code telefone} e {@code email}
 * podem ser {@code null}. Exemplos do schema sao ficticios e no formato real (F-4).
 */
@Schema(description = "Cliente na listagem")
public record ClienteListResponse(
    @Schema(example = "7") Long id,
    @Schema(example = "Ana Exemplo") String nome,
    @Schema(description = "Somente digitos, como gravado", example = "11912345678", nullable = true)
        String telefone,
    @Schema(example = "ana@example.com", nullable = true) String email) {

  /** Mostra so o id: nome, telefone e email nao vao a log por {@code toString()} (achado B1). */
  @Override
  public String toString() {
    return "ClienteListResponse[id=" + id + "]";
  }
}

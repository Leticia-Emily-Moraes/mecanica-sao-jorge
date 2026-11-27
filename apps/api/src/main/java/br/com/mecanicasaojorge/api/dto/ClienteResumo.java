package br.com.mecanicasaojorge.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/** Cliente resumido para listas de outros recursos: so id e nome (minimizacao, ADR-037). */
@Schema(description = "Cliente da OS: so id e nome")
public record ClienteResumo(
    @Schema(example = "7") Long id, @Schema(example = "Ana Exemplo") String nome) {

  /** Mostra so o id: o nome e dado pessoal e nao vai a log por {@code toString()}. */
  @Override
  public String toString() {
    return "ClienteResumo[id=" + id + "]";
  }
}

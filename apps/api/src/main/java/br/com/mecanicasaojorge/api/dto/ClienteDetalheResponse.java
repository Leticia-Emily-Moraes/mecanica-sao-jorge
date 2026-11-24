package br.com.mecanicasaojorge.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Detalhe do cliente (F03b, ADR-018). Unica rota que devolve CPF inteiro, so com token valido; a
 * mascara e da tela. {@code cpf}, {@code telefone}, {@code email} e {@code endereco} podem ser
 * {@code null}. O {@link #toString()} mostra so o id, para o CPF e o endereco nao irem a log
 * (politica de dados do cliente, secao 7).
 */
@Schema(description = "Detalhe do cliente")
public record ClienteDetalheResponse(
    @Schema(example = "7") Long id,
    @Schema(example = "Ana Exemplo") String nome,
    @Schema(description = "11 digitos, sem mascara", example = "12345678900", nullable = true)
        String cpf,
    @Schema(description = "Somente digitos, como gravado", example = "11912345678", nullable = true)
        String telefone,
    @Schema(example = "ana@example.com", nullable = true) String email,
    @Schema(example = "Rua Modelo, 100 - Jardim Exemplo", nullable = true) String endereco) {

  @Override
  public String toString() {
    return "ClienteDetalheResponse[id=" + id + "]";
  }
}

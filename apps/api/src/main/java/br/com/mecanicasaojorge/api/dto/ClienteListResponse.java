package br.com.mecanicasaojorge.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Item da listagem de clientes (F03a, ADR-017). Sem CPF, sem endereco e sem campos da entidade
 * (ADR-007). {@code telefone} sai so com digitos, como gravado; {@code telefone} e {@code email}
 * podem ser {@code null}.
 */
@Schema(description = "Cliente na listagem")
public record ClienteListResponse(Long id, String nome, String telefone, String email) {}

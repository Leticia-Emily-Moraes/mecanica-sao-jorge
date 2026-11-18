package br.com.mecanicasaojorge.api.exception;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Erro de um campo (ADR-023): nome da propriedade do DTO e chave de mensagem i18n. Nunca leva o
 * valor rejeitado. {@code chave} e nula quando a mensagem do campo e texto fixo e nao uma chave.
 */
@Schema(description = "Erro de validacao de um campo")
public record ErroCampo(
    @Schema(description = "Nome do campo do corpo da requisicao", example = "placa") String campo,
    @Schema(description = "Chave i18n da mensagem", example = "veiculo.form.placa.erro")
        String chave) {}

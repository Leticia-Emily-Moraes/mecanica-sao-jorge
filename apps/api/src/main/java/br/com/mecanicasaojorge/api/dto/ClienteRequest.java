package br.com.mecanicasaojorge.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Entrada de criacao de cliente (F03c, ADR-021); a edicao (F10) reaproveita o tipo. Nao tem {@code
 * id}: atribuicao em massa e impossivel. Branco vira {@code null} no construtor, antes do Bean
 * Validation; a normalizacao (so digitos, strip) fica no mapper, depois da validacao. Toda mensagem
 * comeca pelo nome do campo e nunca repete o valor enviado. O {@link #toString()} nao imprime dado
 * pessoal (politica de dados do cliente, secao 7).
 */
@Schema(description = "Dados para cadastrar um cliente")
public record ClienteRequest(
    @Schema(description = "Ate 120 caracteres", example = "Ana Exemplo")
        @NotBlank(message = "nome e obrigatorio")
        @Size(max = 120, message = "nome deve ter no maximo 120 caracteres")
        String nome,
    @Schema(
            description = "11 digitos, com ou sem mascara; gravado so com digitos",
            example = "123.456.789-00")
        @NotBlank(message = "cpf e obrigatorio")
        @Pattern(regexp = CPF_REGEX, message = "cpf deve ter 11 digitos")
        String cpf,
    @Schema(
            description = "DDD + numero, 10 ou 11 digitos, com ou sem mascara",
            example = "(11) 91234-5678")
        @NotBlank(message = "telefone e obrigatorio")
        @Pattern(regexp = TELEFONE_REGEX, message = "telefone deve ter 10 ou 11 digitos")
        String telefone,
    @Schema(description = "Opcional, ate 120 caracteres", example = "ana@example.com")
        @Size(max = 120, message = "email deve ter no maximo 120 caracteres")
        @Email(message = "email invalido")
        String email,
    @Schema(description = "Opcional, texto livre ate 255 caracteres", example = "Rua Modelo, 100")
        @Size(max = 255, message = "endereco deve ter no maximo 255 caracteres")
        String endereco) {

  /** 11 digitos ASCII; separadores aceitos: ponto, hifen e espaco. */
  public static final String CPF_REGEX = "^(?:[ .\\-]*[0-9]){11}[ .\\-]*$";

  /** 10 ou 11 digitos ASCII; separadores aceitos: parenteses, ponto, hifen e espaco. */
  public static final String TELEFONE_REGEX = "^(?:[ ().\\-]*[0-9]){10,11}[ ().\\-]*$";

  public ClienteRequest {
    nome = emBrancoParaNulo(nome);
    cpf = emBrancoParaNulo(cpf);
    telefone = emBrancoParaNulo(telefone);
    // Espaco nas pontas do email e ruido de digitacao, nao formato invalido: aparar antes do @Email
    // deixa o 409 de email repetido valer igual com ou sem espaco (F03d, US-CLI-31).
    email = emBrancoParaNulo(AparoUnicode.aparar(email));
    endereco = emBrancoParaNulo(endereco);
  }

  private static String emBrancoParaNulo(String valor) {
    return valor == null || valor.isBlank() ? null : valor;
  }

  @Override
  public String toString() {
    return "ClienteRequest";
  }
}

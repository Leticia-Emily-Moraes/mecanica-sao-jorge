package br.com.mecanicasaojorge.api.mapper;

import br.com.mecanicasaojorge.api.dto.ClienteDetalheResponse;
import br.com.mecanicasaojorge.api.dto.ClienteListResponse;
import br.com.mecanicasaojorge.api.dto.ClienteRequest;
import br.com.mecanicasaojorge.api.entity.Cliente;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

/** Mapeia {@link Cliente} para os DTOs de saida e {@link ClienteRequest} para a entidade. */
@Mapper(componentModel = "spring")
public interface ClienteMapper {

  ClienteListResponse toListResponse(Cliente cliente);

  /** Unico mapeamento que leva CPF e endereco (ADR-018). */
  ClienteDetalheResponse toDetalheResponse(Cliente cliente);

  /**
   * Normaliza depois da validacao (ADR-021): CPF e telefone so com digitos, demais campos com
   * strip. Campo de destino nao mapeado quebra a compilacao; {@code id} e {@code createdAt} nunca
   * vem da entrada.
   */
  @BeanMapping(unmappedTargetPolicy = ReportingPolicy.ERROR)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "nome", qualifiedByName = "aparado")
  @Mapping(target = "cpf", qualifiedByName = "somenteDigitos")
  @Mapping(target = "telefone", qualifiedByName = "somenteDigitos")
  @Mapping(target = "email", qualifiedByName = "emailNormalizado")
  @Mapping(target = "endereco", qualifiedByName = "aparado")
  Cliente toEntity(ClienteRequest request);

  /**
   * Edicao (F03d, ADR-021 e ADR-026): copia os campos editaveis sobre a entidade carregada, com a
   * mesma normalizacao do {@link #toEntity}. Nunca cria entidade nova: {@code id} e {@code
   * createdAt} ficam como estao.
   */
  @BeanMapping(unmappedTargetPolicy = ReportingPolicy.ERROR)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "nome", qualifiedByName = "aparado")
  @Mapping(target = "cpf", qualifiedByName = "somenteDigitos")
  @Mapping(target = "telefone", qualifiedByName = "somenteDigitos")
  @Mapping(target = "email", qualifiedByName = "emailNormalizado")
  @Mapping(target = "endereco", qualifiedByName = "aparado")
  void atualizar(ClienteRequest request, @MappingTarget Cliente cliente);

  /**
   * Strip e minusculas so para {@code A} a {@code Z} ASCII (ADR-026, regra 5). {@code toLowerCase}
   * e proibido: troca o sinal Kelvin (U+212A) por {@code k} e transforma U+0130 em dois caracteres.
   */
  @Named("emailNormalizado")
  default String emailNormalizado(String valor) {
    if (valor == null) {
      return null;
    }
    StringBuilder normalizado = new StringBuilder(valor.strip());
    for (int i = 0; i < normalizado.length(); i++) {
      char atual = normalizado.charAt(i);
      if (atual >= 'A' && atual <= 'Z') {
        normalizado.setCharAt(i, (char) (atual + ('a' - 'A')));
      }
    }
    return normalizado.toString();
  }

  /**
   * Remove so os separadores aceitos pela validacao, nunca "tudo que nao e digito": uma letra que
   * escapasse da validacao ficaria no valor e o CHECK do banco a recusaria (falha fechada).
   */
  @Named("somenteDigitos")
  default String somenteDigitos(String valor) {
    return valor == null ? null : valor.replaceAll("[ ().\\-]", "");
  }

  @Named("aparado")
  default String aparado(String valor) {
    return valor == null ? null : valor.strip();
  }
}

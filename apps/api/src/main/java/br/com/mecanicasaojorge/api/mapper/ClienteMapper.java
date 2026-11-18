package br.com.mecanicasaojorge.api.mapper;

import br.com.mecanicasaojorge.api.dto.ClienteDetalheResponse;
import br.com.mecanicasaojorge.api.dto.ClienteListResponse;
import br.com.mecanicasaojorge.api.dto.ClienteRequest;
import br.com.mecanicasaojorge.api.entity.Cliente;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
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
  @Mapping(target = "email", qualifiedByName = "aparado")
  @Mapping(target = "endereco", qualifiedByName = "aparado")
  Cliente toEntity(ClienteRequest request);

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

package br.com.mecanicasaojorge.api.mapper;

import br.com.mecanicasaojorge.api.dto.ClienteDetalheResponse;
import br.com.mecanicasaojorge.api.dto.ClienteListResponse;
import br.com.mecanicasaojorge.api.entity.Cliente;
import org.mapstruct.Mapper;

/** Mapeia {@link Cliente} para o DTO de listagem, sem CPF nem campos internos (ADR-007). */
@Mapper(componentModel = "spring")
public interface ClienteMapper {

  ClienteListResponse toListResponse(Cliente cliente);

  /** Unico mapeamento que leva CPF e endereco (ADR-018). */
  ClienteDetalheResponse toDetalheResponse(Cliente cliente);
}

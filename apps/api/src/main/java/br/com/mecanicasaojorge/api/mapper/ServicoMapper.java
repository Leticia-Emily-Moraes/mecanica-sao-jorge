package br.com.mecanicasaojorge.api.mapper;

import br.com.mecanicasaojorge.api.dto.ServicoListResponse;
import br.com.mecanicasaojorge.api.entity.Servico;
import org.mapstruct.Mapper;

/** Mapeia {@link Servico} para o DTO de listagem (ADR-007). */
@Mapper(componentModel = "spring")
public interface ServicoMapper {

  ServicoListResponse toListResponse(Servico servico);
}

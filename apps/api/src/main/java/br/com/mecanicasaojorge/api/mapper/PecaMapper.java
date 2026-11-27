package br.com.mecanicasaojorge.api.mapper;

import br.com.mecanicasaojorge.api.dto.PecaListResponse;
import br.com.mecanicasaojorge.api.entity.Peca;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

/** Mapeia {@link Peca} para o DTO de listagem, sem custo (ADR-007, ADR-034). */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface PecaMapper {

  /** {@code estoqueBaixo} chega ja calculado pelo service (ADR-035). */
  PecaListResponse toListResponse(Peca peca, boolean estoqueBaixo);
}

package br.com.mecanicasaojorge.api.mapper;

import br.com.mecanicasaojorge.api.dto.ClienteResumo;
import br.com.mecanicasaojorge.api.dto.OrdemServicoListResponse;
import br.com.mecanicasaojorge.api.dto.VeiculoResumo;
import br.com.mecanicasaojorge.api.entity.Cliente;
import br.com.mecanicasaojorge.api.entity.OrdemServico;
import br.com.mecanicasaojorge.api.entity.Veiculo;
import java.time.Instant;
import java.time.OffsetDateTime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

/** Mapeia {@link OrdemServico} para o DTO de listagem (ADR-007, ADR-037, ADR-039). */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface OrdemServicoMapper {

  @Mapping(source = "dataPrevisaoEntrega", target = "previsaoEntrega")
  OrdemServicoListResponse toListResponse(OrdemServico ordem);

  ClienteResumo toClienteResumo(Cliente cliente);

  VeiculoResumo toVeiculoResumo(Veiculo veiculo);

  /** {@code TIMESTAMP} da entidade vira instante em UTC na API (ADR-039, regra 3). */
  default Instant toInstant(OffsetDateTime data) {
    return data == null ? null : data.toInstant();
  }
}

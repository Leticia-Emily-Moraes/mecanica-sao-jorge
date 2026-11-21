package br.com.mecanicasaojorge.api.mapper;

import br.com.mecanicasaojorge.api.dto.VeiculoDetalheResponse;
import br.com.mecanicasaojorge.api.dto.VeiculoListResponse;
import br.com.mecanicasaojorge.api.dto.VeiculoRequest;
import br.com.mecanicasaojorge.api.dto.VeiculoResponse;
import br.com.mecanicasaojorge.api.entity.Veiculo;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

/**
 * Mapeia {@link Veiculo} para os DTOs de saida e {@link VeiculoRequest} para a entidade. A placa ja
 * chega normalizada do request. {@code id}, {@code cliente} e {@code quilometragem} nunca vem da
 * entrada (V1 e V2); campo de destino nao mapeado quebra a compilacao.
 */
@Mapper(componentModel = "spring")
public interface VeiculoMapper {

  @Mapping(target = "clienteId", source = "cliente.id")
  VeiculoResponse toResponse(Veiculo veiculo);

  VeiculoListResponse toListResponse(Veiculo veiculo);

  /** Historico de OS vazio ate a feature de OS (ADR-025). */
  @Mapping(target = "clienteId", source = "cliente.id")
  @Mapping(target = "clienteNome", source = "cliente.nome")
  @Mapping(target = "historicoOs", expression = "java(java.util.List.of())")
  VeiculoDetalheResponse toDetalheResponse(Veiculo veiculo);

  @BeanMapping(unmappedTargetPolicy = ReportingPolicy.ERROR)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "cliente", ignore = true)
  @Mapping(target = "quilometragem", ignore = true)
  Veiculo toEntity(VeiculoRequest request);

  /** Edicao: copia sobre a entidade carregada, nunca monta entidade nova com id (V1). */
  @BeanMapping(unmappedTargetPolicy = ReportingPolicy.ERROR)
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "cliente", ignore = true)
  @Mapping(target = "quilometragem", ignore = true)
  void atualizar(VeiculoRequest request, @MappingTarget Veiculo veiculo);
}

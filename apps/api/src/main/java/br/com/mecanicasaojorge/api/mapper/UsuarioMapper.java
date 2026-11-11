package br.com.mecanicasaojorge.api.mapper;

import br.com.mecanicasaojorge.api.dto.UsuarioResumo;
import br.com.mecanicasaojorge.api.entity.Usuario;
import org.mapstruct.Mapper;

/** Mapeia {@link Usuario} para o DTO publico, sem {@code senhaHash} (ADR-007). */
@Mapper(componentModel = "spring")
public interface UsuarioMapper {

  UsuarioResumo toResumo(Usuario usuario);
}

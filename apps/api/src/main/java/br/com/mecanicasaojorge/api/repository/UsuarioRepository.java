package br.com.mecanicasaojorge.api.repository;

import br.com.mecanicasaojorge.api.entity.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

  Optional<Usuario> findByEmail(String email);
}

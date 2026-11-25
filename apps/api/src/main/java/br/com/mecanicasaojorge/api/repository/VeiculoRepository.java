package br.com.mecanicasaojorge.api.repository;

import br.com.mecanicasaojorge.api.entity.Veiculo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {

  /** Veiculos do cliente por placa; sem paginacao (poucos por cliente). */
  List<Veiculo> findByClienteIdOrderByPlacaAscIdAsc(Long clienteId);
}

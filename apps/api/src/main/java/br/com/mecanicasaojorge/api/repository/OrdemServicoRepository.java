package br.com.mecanicasaojorge.api.repository;

import br.com.mecanicasaojorge.api.entity.OrdemServico;
import br.com.mecanicasaojorge.api.entity.StatusOS;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/** Acesso as ordens de servico. Lista conforme o ADR-037. */
public interface OrdemServicoRepository extends JpaRepository<OrdemServico, Long> {

  /**
   * Filtro unico da pagina e da contagem, para os dois nunca divergirem. Todo {@code like} tem
   * {@code escape '!'} (ADR-017). Nome do cliente: caixa e acento pela collation de {@code
   * clientes} (V3). Placa: padrao ja em maiusculas, sem hifen.
   */
  String FILTRO =
      """
       where (:status is null or o.status = :status)
         and (:texto is null
              or c.nome like :texto escape '!'
              or (:placa is not null and v.placa like :placa escape '!'))
      """;

  /**
   * Pagina de OS com cliente e veiculo na mesma consulta (sem N+1). So associacao a um ({@code
   * ManyToOne}) pode ter {@code join fetch} com paginacao; nunca coleta colecao aqui.
   *
   * @param status filtro exato, ou {@code null} para todos
   * @param texto padrao {@code like} do nome, ou {@code null} para nao buscar
   * @param placa padrao {@code like} da placa, ou {@code null} quando o termo nao e placa
   */
  @Query(
      value = "select o from OrdemServico o join fetch o.cliente c join fetch o.veiculo v" + FILTRO,
      countQuery = "select count(o) from OrdemServico o join o.cliente c join o.veiculo v" + FILTRO)
  Page<OrdemServico> buscar(
      @Param("status") StatusOS status,
      @Param("texto") String texto,
      @Param("placa") String placa,
      Pageable pageable);
}

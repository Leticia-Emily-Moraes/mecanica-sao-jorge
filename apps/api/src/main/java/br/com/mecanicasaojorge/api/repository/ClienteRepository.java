package br.com.mecanicasaojorge.api.repository;

import br.com.mecanicasaojorge.api.entity.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/** Acesso a clientes. Busca textual conforme o ADR-017. */
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

  /**
   * Busca por trecho em nome, email e (quando informado) telefone. Os padroes chegam prontos do
   * service, com {@code %} nas pontas e {@code !} como escape; toda clausula {@code like} traz
   * {@code escape '!'} (ADR-017). Sem {@code lower()}/{@code upper()}: a insensibilidade a acento e
   * caixa vem so da collation das colunas (V3).
   *
   * @param texto padrao para nome e email
   * @param telefone padrao so de digitos, ou {@code null} para nao consultar telefone
   */
  @Query(
      """
      select c from Cliente c
      where c.nome like :texto escape '!'
         or c.email like :texto escape '!'
         or (:telefone is not null and c.telefone like :telefone escape '!')
      """)
  Page<Cliente> buscar(
      @Param("texto") String texto, @Param("telefone") String telefone, Pageable pageable);
}

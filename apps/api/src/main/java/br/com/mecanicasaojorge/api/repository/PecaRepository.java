package br.com.mecanicasaojorge.api.repository;

import br.com.mecanicasaojorge.api.entity.Peca;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/** Acesso ao catalogo de pecas. Busca textual conforme o ADR-017 e o ADR-034. */
public interface PecaRepository extends JpaRepository<Peca, Long> {

  /**
   * Busca por trecho de nome ou codigo. O padrao chega pronto do service, com {@code %} nas pontas
   * e {@code !} como escape. Sem {@code lower()}: a insensibilidade a caixa e acento vem da
   * collation das colunas (V10). Nao filtra por {@code ativo}.
   *
   * @param texto padrao {@code like}, ou {@code null} para nao filtrar
   */
  @Query(
      """
      select p from Peca p
      where (:texto is null
             or p.nome like :texto escape '!'
             or p.codigo like :texto escape '!')
      """)
  Page<Peca> buscar(@Param("texto") String texto, Pageable pageable);
}

package br.com.mecanicasaojorge.api.repository;

import br.com.mecanicasaojorge.api.entity.Servico;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/** Acesso ao catalogo de servicos. Busca textual conforme o ADR-017 e o ADR-032. */
public interface ServicoRepository extends JpaRepository<Servico, Long> {

  /**
   * Busca por trecho de nome, com filtro opcional de ativo, numa consulta so para todos os casos.
   * O padrao chega pronto do service, com {@code %} nas pontas e {@code !} como escape. Sem {@code
   * lower()}/{@code upper()}: a insensibilidade a acento e caixa vem da collation da coluna (V9).
   *
   * @param texto padrao {@code like} para o nome, ou {@code null} para nao filtrar por nome
   * @param ativo {@code true} so ativos, {@code false} so inativos, {@code null} todos
   */
  @Query(
      """
      select s from Servico s
      where (:texto is null or s.nome like :texto escape '!')
        and (:ativo is null or s.ativo = :ativo)
      """)
  Page<Servico> buscar(
      @Param("texto") String texto, @Param("ativo") Boolean ativo, Pageable pageable);
}

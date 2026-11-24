package br.com.mecanicasaojorge.api.service;

import br.com.mecanicasaojorge.api.dto.PaginaResponse;
import br.com.mecanicasaojorge.api.dto.PecaListResponse;
import br.com.mecanicasaojorge.api.entity.Peca;
import br.com.mecanicasaojorge.api.mapper.PecaMapper;
import br.com.mecanicasaojorge.api.repository.PecaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Regras de negocio do catalogo de pecas: lista com busca e alerta de estoque (F17). */
@Service
public class PecaService {

  private static final Logger LOG = LoggerFactory.getLogger(PecaService.class);

  private static final Sort ORDEM_PADRAO = Sort.by(Sort.Order.asc("nome"), Sort.Order.asc("id"));

  private final PecaRepository pecaRepository;
  private final PecaMapper pecaMapper;

  public PecaService(PecaRepository pecaRepository, PecaMapper pecaMapper) {
    this.pecaRepository = pecaRepository;
    this.pecaMapper = pecaMapper;
  }

  /**
   * Lista pecas ordenadas por nome e id, com busca opcional por trecho de nome ou codigo. Os
   * limites de {@code page} e {@code size} sao validados no controller. O termo nunca vai para o
   * log.
   *
   * @param q termo bruto; ausente, vazio ou em branco lista sem filtro
   * @param usuarioId identificador de quem listou, so para rastreio no log
   */
  @Transactional(readOnly = true)
  public PaginaResponse<PecaListResponse> listar(String q, int page, int size, String usuarioId) {
    TermoBusca termo = TermoBusca.de(q);
    Page<Peca> resultado =
        Paginacao.paginar(
            page,
            size,
            ORDEM_PADRAO,
            pageable -> pecaRepository.buscar(termo.padraoTexto(), pageable));

    LOG.info(
        "pecas.listar qLen={} page={} size={} total={} usuarioId={}",
        termo.tamanho(),
        page,
        size,
        resultado.getTotalElements(),
        usuarioId);
    return PaginaResponse.de(resultado.map(this::paraResposta));
  }

  private PecaListResponse paraResposta(Peca peca) {
    return pecaMapper.toListResponse(
        peca, EstoqueMinimo.atingido(peca.getQuantidadeEstoque(), peca.getEstoqueMinimo()));
  }
}

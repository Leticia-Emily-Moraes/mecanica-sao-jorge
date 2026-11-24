package br.com.mecanicasaojorge.api.service;

import br.com.mecanicasaojorge.api.dto.PaginaResponse;
import br.com.mecanicasaojorge.api.dto.ServicoListResponse;
import br.com.mecanicasaojorge.api.entity.Servico;
import br.com.mecanicasaojorge.api.mapper.ServicoMapper;
import br.com.mecanicasaojorge.api.repository.ServicoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Regras de negocio do catalogo de servicos: lista com busca (F05a). */
@Service
public class ServicoService {

  private static final Logger LOG = LoggerFactory.getLogger(ServicoService.class);

  private static final Sort ORDEM_PADRAO = Sort.by(Sort.Order.asc("nome"), Sort.Order.asc("id"));

  private final ServicoRepository servicoRepository;
  private final ServicoMapper servicoMapper;

  public ServicoService(ServicoRepository servicoRepository, ServicoMapper servicoMapper) {
    this.servicoRepository = servicoRepository;
    this.servicoMapper = servicoMapper;
  }

  /**
   * Lista servicos ordenados por nome e id, com busca opcional por trecho de nome. Os limites de
   * {@code page} e {@code size} sao validados no controller. O termo buscado nunca vai para o log.
   *
   * @param q termo bruto; ausente, vazio ou em branco lista sem filtro
   * @param ativo {@code true} so ativos, {@code false} so inativos, {@code null} todos
   * @param usuarioId identificador de quem listou, so para rastreio no log
   */
  @Transactional(readOnly = true)
  public PaginaResponse<ServicoListResponse> listar(
      String q, Boolean ativo, int page, int size, String usuarioId) {
    TermoBusca termo = TermoBusca.de(q);
    Page<Servico> resultado =
        Paginacao.paginar(
            page,
            size,
            ORDEM_PADRAO,
            pageable -> servicoRepository.buscar(termo.padraoTexto(), ativo, pageable));

    LOG.info(
        "servicos.listar qLen={} ativo={} page={} size={} total={} usuarioId={}",
        termo.tamanho(),
        ativo,
        page,
        size,
        resultado.getTotalElements(),
        usuarioId);
    return PaginaResponse.de(resultado.map(servicoMapper::toListResponse));
  }
}

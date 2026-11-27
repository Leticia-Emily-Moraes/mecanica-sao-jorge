package br.com.mecanicasaojorge.api.service;

import br.com.mecanicasaojorge.api.dto.OrdemServicoListResponse;
import br.com.mecanicasaojorge.api.dto.PaginaResponse;
import br.com.mecanicasaojorge.api.entity.OrdemServico;
import br.com.mecanicasaojorge.api.entity.StatusOS;
import br.com.mecanicasaojorge.api.mapper.OrdemServicoMapper;
import br.com.mecanicasaojorge.api.repository.OrdemServicoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Regras de negocio das ordens de servico: lista com filtro de status e busca (F06a). */
@Service
public class OrdemServicoService {

  private static final Logger LOG = LoggerFactory.getLogger(OrdemServicoService.class);

  private static final Sort ORDEM_PADRAO =
      Sort.by(Sort.Order.desc("dataAbertura"), Sort.Order.desc("id"));

  private final OrdemServicoRepository ordemServicoRepository;
  private final OrdemServicoMapper ordemServicoMapper;

  public OrdemServicoService(
      OrdemServicoRepository ordemServicoRepository, OrdemServicoMapper ordemServicoMapper) {
    this.ordemServicoRepository = ordemServicoRepository;
    this.ordemServicoMapper = ordemServicoMapper;
  }

  /**
   * Lista OS da mais recente para a mais antiga (desempate por id), com filtro opcional de status e
   * busca por trecho do nome do cliente ou da placa. Os limites de {@code page} e {@code size} sao
   * validados no controller. O termo nunca vai para o log.
   *
   * @param status filtro exato; {@code null} lista todos os status
   * @param q termo bruto; ausente, vazio ou em branco lista sem busca
   * @param usuarioId identificador de quem listou, so para rastreio no log
   */
  @Transactional(readOnly = true)
  public PaginaResponse<OrdemServicoListResponse> listar(
      StatusOS status, String q, int page, int size, String usuarioId) {
    TermoBusca termo = TermoBusca.de(q);
    Page<OrdemServico> resultado =
        Paginacao.paginar(
            page,
            size,
            ORDEM_PADRAO,
            pageable ->
                ordemServicoRepository.buscar(
                    status, termo.padraoTexto(), termo.padraoPlaca(), pageable));

    LOG.info(
        "ordens-servico.listar qLen={} status={} page={} size={} total={} usuarioId={}",
        termo.tamanho(),
        status,
        page,
        size,
        resultado.getTotalElements(),
        usuarioId);
    return PaginaResponse.de(resultado.map(ordemServicoMapper::toListResponse));
  }
}

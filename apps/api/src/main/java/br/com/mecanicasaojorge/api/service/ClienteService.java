package br.com.mecanicasaojorge.api.service;

import br.com.mecanicasaojorge.api.dto.ClienteListResponse;
import br.com.mecanicasaojorge.api.dto.PaginaResponse;
import br.com.mecanicasaojorge.api.entity.Cliente;
import br.com.mecanicasaojorge.api.mapper.ClienteMapper;
import br.com.mecanicasaojorge.api.repository.ClienteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Regras de negocio de clientes. Esta fatia (F03a) so lista com busca. */
@Service
public class ClienteService {

  private static final Logger LOG = LoggerFactory.getLogger(ClienteService.class);

  private static final Sort ORDEM_PADRAO = Sort.by(Sort.Order.asc("nome"), Sort.Order.asc("id"));

  private final ClienteRepository clienteRepository;
  private final ClienteMapper clienteMapper;

  public ClienteService(ClienteRepository clienteRepository, ClienteMapper clienteMapper) {
    this.clienteRepository = clienteRepository;
    this.clienteMapper = clienteMapper;
  }

  /**
   * Lista clientes ordenados por nome e id, com busca opcional por trecho de nome, email ou
   * telefone (so digitos). Os limites de {@code page} e {@code size} sao validados no controller. O
   * termo buscado nunca vai para o log (politica de dados do cliente, secao 6.3).
   *
   * @param q termo bruto; ausente, vazio ou em branco lista sem filtro
   * @param usuarioId identificador de quem listou, so para rastreio no log
   */
  @Transactional(readOnly = true)
  public PaginaResponse<ClienteListResponse> listar(
      String q, int page, int size, String usuarioId) {
    TermoBusca termo = TermoBusca.de(q);
    Pageable pageable = PageRequest.of(page, size, ORDEM_PADRAO);

    Page<Cliente> resultado =
        termo.semTermo()
            ? clienteRepository.findAll(pageable)
            : clienteRepository.buscar(termo.padraoTexto(), termo.padraoTelefone(), pageable);

    LOG.info(
        "clientes.listar qLen={} page={} size={} total={} usuarioId={}",
        termo.tamanho(),
        page,
        size,
        resultado.getTotalElements(),
        usuarioId);
    return PaginaResponse.de(resultado.map(clienteMapper::toListResponse));
  }
}

package br.com.mecanicasaojorge.api.service;

import br.com.mecanicasaojorge.api.dto.ClienteDetalheResponse;
import br.com.mecanicasaojorge.api.dto.ClienteListResponse;
import br.com.mecanicasaojorge.api.dto.PaginaResponse;
import br.com.mecanicasaojorge.api.entity.Cliente;
import br.com.mecanicasaojorge.api.exception.ClienteNaoEncontradoException;
import br.com.mecanicasaojorge.api.mapper.ClienteMapper;
import br.com.mecanicasaojorge.api.repository.ClienteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Regras de negocio de clientes: lista com busca (F03a) e detalhe (F03b). */
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
   * Lista clientes ordenados por nome e id, com busca opcional por trecho de nome e email e, com
   * termo numerico, de telefone (so digitos). Os limites de {@code page} e {@code size} sao
   * validados no controller. O termo buscado nunca vai para o log (politica de dados do cliente,
   * secao 6.3).
   *
   * @param q termo bruto; ausente, vazio ou em branco lista sem filtro
   * @param usuarioId identificador de quem listou, so para rastreio no log
   */
  @Transactional(readOnly = true)
  public PaginaResponse<ClienteListResponse> listar(
      String q, int page, int size, String usuarioId) {
    TermoBusca termo = TermoBusca.de(q);
    Page<Cliente> resultado =
        Paginacao.paginar(page, size, ORDEM_PADRAO, pageable -> consultar(termo, pageable));

    LOG.info(
        "clientes.listar qLen={} page={} size={} total={} usuarioId={}",
        termo.tamanho(),
        page,
        size,
        resultado.getTotalElements(),
        usuarioId);
    return PaginaResponse.de(resultado.map(clienteMapper::toListResponse));
  }

  /**
   * Detalhe de um cliente (F03b). Loga so {@code clienteId} e {@code usuarioId} (politica de dados
   * do cliente, secao 6.4): nunca nome, CPF, telefone, email, endereco, DTO ou entidade.
   *
   * @throws ClienteNaoEncontradoException quando nao existe cliente com o id (404, ADR-019)
   */
  @Transactional(readOnly = true)
  public ClienteDetalheResponse detalhar(Long id, String usuarioId) {
    Cliente cliente =
        clienteRepository
            .findById(id)
            .orElseThrow(
                () -> {
                  LOG.info(
                      "clientes.detalhar.naoEncontrado clienteId={} usuarioId={}", id, usuarioId);
                  return new ClienteNaoEncontradoException();
                });
    LOG.info("clientes.detalhar clienteId={} usuarioId={}", id, usuarioId);
    return clienteMapper.toDetalheResponse(cliente);
  }

  private Page<Cliente> consultar(TermoBusca termo, Pageable pageable) {
    return termo.semTermo()
        ? clienteRepository.findAll(pageable)
        : clienteRepository.buscar(termo.padraoTexto(), termo.padraoTelefone(), pageable);
  }
}

package br.com.mecanicasaojorge.api.service;

import br.com.mecanicasaojorge.api.dto.ClienteListResponse;
import br.com.mecanicasaojorge.api.dto.PaginaResponse;
import br.com.mecanicasaojorge.api.entity.Cliente;
import br.com.mecanicasaojorge.api.mapper.ClienteMapper;
import br.com.mecanicasaojorge.api.repository.ClienteRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
        offsetExcedeInteiro(page, size)
            ? paginaVaziaComTotal(termo, page, size)
            : consultar(termo, PageRequest.of(page, size, ORDEM_PADRAO));

    LOG.info(
        "clientes.listar qLen={} page={} size={} total={} usuarioId={}",
        termo.tamanho(),
        page,
        size,
        resultado.getTotalElements(),
        usuarioId);
    return PaginaResponse.de(resultado.map(clienteMapper::toListResponse));
  }

  private Page<Cliente> consultar(TermoBusca termo, Pageable pageable) {
    return termo.semTermo()
        ? clienteRepository.findAll(pageable)
        : clienteRepository.buscar(termo.padraoTexto(), termo.padraoTelefone(), pageable);
  }

  /**
   * O Spring Data lanca excecao quando {@code page * size} passa de {@link Integer#MAX_VALUE}
   * (offset convertido para int). Alem desse ponto nao existe item, entao o service nao busca
   * itens: pega so o total, com uma pagina de 1 item, e devolve a pagina pedida vazia (ADR-017,
   * O3).
   */
  private static boolean offsetExcedeInteiro(int page, int size) {
    return (long) page * size > Integer.MAX_VALUE;
  }

  private Page<Cliente> paginaVaziaComTotal(TermoBusca termo, int page, int size) {
    long total = consultar(termo, PageRequest.of(0, 1, ORDEM_PADRAO)).getTotalElements();
    return new PageImpl<>(List.of(), PageRequest.of(page, size, ORDEM_PADRAO), total);
  }
}

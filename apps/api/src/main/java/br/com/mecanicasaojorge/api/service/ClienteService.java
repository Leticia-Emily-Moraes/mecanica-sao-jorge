package br.com.mecanicasaojorge.api.service;

import br.com.mecanicasaojorge.api.dto.ClienteDetalheResponse;
import br.com.mecanicasaojorge.api.dto.ClienteListResponse;
import br.com.mecanicasaojorge.api.dto.ClienteRequest;
import br.com.mecanicasaojorge.api.dto.PaginaResponse;
import br.com.mecanicasaojorge.api.entity.Cliente;
import br.com.mecanicasaojorge.api.exception.ClienteNaoEncontradoException;
import br.com.mecanicasaojorge.api.exception.CpfJaCadastradoException;
import br.com.mecanicasaojorge.api.exception.EmailJaCadastradoException;
import br.com.mecanicasaojorge.api.mapper.ClienteMapper;
import br.com.mecanicasaojorge.api.repository.ClienteRepository;
import java.util.List;
import java.util.Locale;
import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Regras de negocio de clientes: lista com busca (F03a) e detalhe (F03b). */
@Service
public class ClienteService {

  private static final Logger LOG = LoggerFactory.getLogger(ClienteService.class);

  private static final String INDICE_CPF = "uk_clientes_cpf";
  private static final String INDICE_EMAIL = "uk_clientes_email";

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

  /**
   * Cria um cliente (F03c). CPF e telefone chegam validados e sao gravados so com digitos (mapper).
   * CPF repetido vira {@link CpfJaCadastradoException} (409, ADR-020). Loga so {@code clienteId} e
   * {@code usuarioId}; nunca CPF, telefone, email, nome ou endereco, nem mascarados (politica de
   * dados do cliente, secao 6.5).
   */
  @Transactional
  public ClienteDetalheResponse criar(ClienteRequest request, String usuarioId) {
    Cliente salvo = gravar(clienteMapper.toEntity(request));
    LOG.info("clientes.criar clienteId={} usuarioId={}", salvo.getId(), usuarioId);
    return clienteMapper.toDetalheResponse(salvo);
  }

  /**
   * Edita um cliente (F03d, ADR-021 e ADR-026): substitui todos os campos editaveis do cliente do
   * caminho. Carrega a entidade e copia os campos sobre ela, nunca monta entidade nova. CPF e email
   * de outro cliente viram 409 pelo indice unico, sem consulta previa. Loga so {@code clienteId},
   * {@code usuarioId} e, no conflito, o nome do campo; nunca valor, nem mascarado (politica de
   * dados do cliente, secao 6.7).
   *
   * @throws ClienteNaoEncontradoException quando nao existe cliente com o id (404, ADR-019)
   */
  @Transactional
  public ClienteDetalheResponse atualizar(Long id, ClienteRequest request, String usuarioId) {
    Cliente cliente =
        clienteRepository
            .findById(id)
            .orElseThrow(
                () -> {
                  LOG.info(
                      "clientes.editar.naoEncontrado clienteId={} usuarioId={}", id, usuarioId);
                  return new ClienteNaoEncontradoException();
                });
    clienteMapper.atualizar(request, cliente);
    Cliente salvo;
    try {
      salvo = gravar(cliente);
    } catch (CpfJaCadastradoException ex) {
      logarConflito(id, usuarioId, "cpf");
      throw ex;
    } catch (EmailJaCadastradoException ex) {
      logarConflito(id, usuarioId, "email");
      throw ex;
    }
    LOG.info("clientes.editar clienteId={} usuarioId={}", id, usuarioId);
    return clienteMapper.toDetalheResponse(salvo);
  }

  private static void logarConflito(Long id, String usuarioId, String campo) {
    LOG.info("clientes.editar.conflito clienteId={} usuarioId={} campo={}", id, usuarioId, campo);
  }

  /**
   * Unico ponto de gravacao (ADR-020, regra 3; ADR-026, regra 3). O flush forca o erro do indice a
   * estourar aqui dentro; a causa nunca e propagada, porque o MySQL escreve o valor na mensagem.
   */
  private Cliente gravar(Cliente cliente) {
    try {
      return clienteRepository.saveAndFlush(cliente);
    } catch (DataIntegrityViolationException ex) {
      String indice = nomeDoIndiceViolado(ex);
      if (indice.endsWith(INDICE_CPF)) {
        throw new CpfJaCadastradoException();
      }
      if (indice.endsWith(INDICE_EMAIL)) {
        throw new EmailJaCadastradoException();
      }
      throw ex;
    }
  }

  /** Nome da restricao violada em minusculas, ou vazio quando a causa nao e uma restricao. */
  private static String nomeDoIndiceViolado(Throwable erro) {
    for (Throwable atual = erro; atual != null; atual = atual.getCause()) {
      if (atual instanceof ConstraintViolationException violacao) {
        String nome = violacao.getConstraintName();
        return nome == null ? "" : nome.toLowerCase(Locale.ROOT);
      }
    }
    return "";
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

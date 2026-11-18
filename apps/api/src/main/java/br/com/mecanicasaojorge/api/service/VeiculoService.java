package br.com.mecanicasaojorge.api.service;

import br.com.mecanicasaojorge.api.dto.VeiculoDetalheResponse;
import br.com.mecanicasaojorge.api.dto.VeiculoListResponse;
import br.com.mecanicasaojorge.api.dto.VeiculoRequest;
import br.com.mecanicasaojorge.api.dto.VeiculoResponse;
import br.com.mecanicasaojorge.api.entity.Cliente;
import br.com.mecanicasaojorge.api.entity.Veiculo;
import br.com.mecanicasaojorge.api.exception.ClienteNaoEncontradoException;
import br.com.mecanicasaojorge.api.exception.PlacaJaCadastradaException;
import br.com.mecanicasaojorge.api.exception.VeiculoNaoEncontradoException;
import br.com.mecanicasaojorge.api.mapper.VeiculoMapper;
import br.com.mecanicasaojorge.api.repository.ClienteRepository;
import br.com.mecanicasaojorge.api.repository.VeiculoRepository;
import br.com.mecanicasaojorge.api.security.MascaraDadoPessoal;
import java.util.List;
import java.util.Locale;
import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Regras de negocio de veiculos (F04). Logs seguem a secao 6.6 da politica de dados: so ids, {@code
 * usuarioId} e a placa mascarada ({@link MascaraDadoPessoal#placa}); nunca marca, modelo, ano, cor,
 * nome do dono, DTO, entidade ou {@code getMessage()} de excecao de persistencia.
 */
@Service
public class VeiculoService {

  private static final Logger LOG = LoggerFactory.getLogger(VeiculoService.class);

  private static final String INDICE_PLACA = "uk_veiculos_placa";

  private final VeiculoRepository veiculoRepository;
  private final ClienteRepository clienteRepository;
  private final VeiculoMapper veiculoMapper;

  public VeiculoService(
      VeiculoRepository veiculoRepository,
      ClienteRepository clienteRepository,
      VeiculoMapper veiculoMapper) {
    this.veiculoRepository = veiculoRepository;
    this.clienteRepository = clienteRepository;
    this.veiculoMapper = veiculoMapper;
  }

  /**
   * Cria o veiculo no cliente do caminho; o dono nunca vem do corpo.
   *
   * @throws ClienteNaoEncontradoException cliente inexistente (404)
   * @throws PlacaJaCadastradaException placa repetida, inclusive na corrida (409)
   */
  @Transactional
  public VeiculoResponse criar(Long clienteId, VeiculoRequest request, String usuarioId) {
    Cliente cliente = buscarCliente(clienteId, "veiculos.criar", usuarioId);
    Veiculo novo = veiculoMapper.toEntity(request);
    novo.setCliente(cliente);
    try {
      Veiculo salvo = gravar(novo);
      LOG.info(
          "veiculos.criar veiculoId={} clienteId={} usuarioId={} placa={}",
          salvo.getId(),
          clienteId,
          usuarioId,
          MascaraDadoPessoal.placa(salvo.getPlaca()));
      return veiculoMapper.toResponse(salvo);
    } catch (PlacaJaCadastradaException ex) {
      LOG.info(
          "veiculos.criar.placaDuplicada clienteId={} usuarioId={} placa={}",
          clienteId,
          usuarioId,
          MascaraDadoPessoal.placa(request.placa()));
      throw ex;
    }
  }

  /**
   * Edita marca, modelo, ano, cor e placa sobre a entidade carregada: o dono e a quilometragem
   * ficam como estao.
   *
   * @throws VeiculoNaoEncontradoException veiculo inexistente (404)
   * @throws PlacaJaCadastradaException placa de outro veiculo (409)
   */
  @Transactional
  public VeiculoResponse editar(Long id, VeiculoRequest request, String usuarioId) {
    Veiculo veiculo =
        veiculoRepository
            .findById(id)
            .orElseThrow(
                () -> {
                  LOG.info(
                      "veiculos.editar.naoEncontrado veiculoId={} usuarioId={}", id, usuarioId);
                  return new VeiculoNaoEncontradoException();
                });
    boolean placaAlterada = !request.placa().equals(veiculo.getPlaca());
    veiculoMapper.atualizar(request, veiculo);
    try {
      Veiculo salvo = gravar(veiculo);
      LOG.info(
          "veiculos.editar veiculoId={} usuarioId={} placa={} placaAlterada={}",
          id,
          usuarioId,
          MascaraDadoPessoal.placa(salvo.getPlaca()),
          placaAlterada);
      return veiculoMapper.toResponse(salvo);
    } catch (PlacaJaCadastradaException ex) {
      LOG.info(
          "veiculos.editar.placaDuplicada veiculoId={} usuarioId={} placa={}",
          id,
          usuarioId,
          MascaraDadoPessoal.placa(request.placa()));
      throw ex;
    }
  }

  /**
   * Detalhe com historico de OS vazio (ADR-025): esta entrega nao consulta ordens de servico.
   *
   * @throws VeiculoNaoEncontradoException veiculo inexistente (404)
   */
  @Transactional(readOnly = true)
  public VeiculoDetalheResponse detalhar(Long id, String usuarioId) {
    Veiculo veiculo =
        veiculoRepository
            .findById(id)
            .orElseThrow(
                () -> {
                  LOG.info(
                      "veiculos.detalhar.naoEncontrado veiculoId={} usuarioId={}", id, usuarioId);
                  return new VeiculoNaoEncontradoException();
                });
    LOG.info(
        "veiculos.detalhar veiculoId={} usuarioId={} placa={}",
        id,
        usuarioId,
        MascaraDadoPessoal.placa(veiculo.getPlaca()));
    return veiculoMapper.toDetalheResponse(veiculo);
  }

  /**
   * Veiculos do cliente ordenados por placa. A lista nao loga placa (varias numa linha so).
   *
   * @throws ClienteNaoEncontradoException cliente inexistente (404)
   */
  @Transactional(readOnly = true)
  public List<VeiculoListResponse> listarPorCliente(Long clienteId, String usuarioId) {
    if (!clienteRepository.existsById(clienteId)) {
      LOG.info(
          "veiculos.listarPorCliente.clienteNaoEncontrado clienteId={} usuarioId={}",
          clienteId,
          usuarioId);
      throw new ClienteNaoEncontradoException();
    }
    List<VeiculoListResponse> veiculos =
        veiculoRepository.findByClienteIdOrderByPlacaAscIdAsc(clienteId).stream()
            .map(veiculoMapper::toListResponse)
            .toList();
    LOG.info(
        "veiculos.listarPorCliente clienteId={} total={} usuarioId={}",
        clienteId,
        veiculos.size(),
        usuarioId);
    return veiculos;
  }

  private Cliente buscarCliente(Long clienteId, String operacao, String usuarioId) {
    return clienteRepository
        .findById(clienteId)
        .orElseThrow(
            () -> {
              LOG.info(
                  "{}.clienteNaoEncontrado clienteId={} usuarioId={}",
                  operacao,
                  clienteId,
                  usuarioId);
              return new ClienteNaoEncontradoException();
            });
  }

  /**
   * Unico ponto de gravacao (ADR-022). O flush forca o erro do indice a estourar aqui dentro; a
   * causa nunca e propagada, porque o MySQL escreve a placa inteira na mensagem.
   */
  private Veiculo gravar(Veiculo veiculo) {
    try {
      return veiculoRepository.saveAndFlush(veiculo);
    } catch (DataIntegrityViolationException ex) {
      if (violaIndiceDePlaca(ex)) {
        throw new PlacaJaCadastradaException();
      }
      throw ex;
    }
  }

  private static boolean violaIndiceDePlaca(Throwable erro) {
    for (Throwable atual = erro; atual != null; atual = atual.getCause()) {
      if (atual instanceof ConstraintViolationException violacao) {
        String nome = violacao.getConstraintName();
        return nome != null && nome.toLowerCase(Locale.ROOT).endsWith(INDICE_PLACA);
      }
    }
    return false;
  }
}

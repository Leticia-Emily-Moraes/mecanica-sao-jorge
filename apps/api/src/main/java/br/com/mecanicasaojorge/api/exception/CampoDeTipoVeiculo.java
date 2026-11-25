package br.com.mecanicasaojorge.api.exception;

import br.com.mecanicasaojorge.api.dto.VeiculoChaves;
import br.com.mecanicasaojorge.api.dto.VeiculoRequest;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import tools.jackson.databind.DatabindException;

/**
 * Identifica, so pelo caminho da excecao do Jackson, o campo de {@link VeiculoRequest} que falhou
 * por tipo (ADR-028). O campo e a chave do mapa fixo, nunca o nome lido do caminho; mensagem, valor
 * e localizacao da excecao nao sao lidos.
 */
final class CampoDeTipoVeiculo {

  private static final Map<Class<?>, Map<String, String>> CHAVE_POR_CAMPO =
      Map.of(VeiculoRequest.class, Map.of("ano", VeiculoChaves.ANO_TIPO));

  private CampoDeTipoVeiculo() {}

  static Optional<ErroCampo> identificar(Throwable erro) {
    for (Throwable atual = erro; atual != null; atual = atual.getCause()) {
      if (atual instanceof DatabindException databind) {
        return deCaminho(databind.getPath());
      }
    }
    return Optional.empty();
  }

  private static Optional<ErroCampo> deCaminho(List<DatabindException.Reference> caminho) {
    if (caminho.size() != 1) {
      return Optional.empty();
    }
    DatabindException.Reference referencia = caminho.get(0);
    Class<?> raiz = classeDe(referencia.from());
    Map<String, String> campos = raiz == null ? null : CHAVE_POR_CAMPO.get(raiz);
    String nome = referencia.getPropertyName();
    if (campos == null || nome == null || !campos.containsKey(nome)) {
      return Optional.empty();
    }
    return Optional.of(new ErroCampo(nome, campos.get(nome)));
  }

  private static Class<?> classeDe(Object origem) {
    if (origem instanceof Class<?> classe) {
      return classe;
    }
    return origem == null ? null : origem.getClass();
  }
}

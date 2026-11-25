package br.com.mecanicasaojorge.api.entity;

/**
 * Regra de placa de veiculo (politica de dados do cliente, secao 7, achado V4): normaliza sem
 * {@code toUpperCase} (no JDK 21, {@code "ıbc1d23".toUpperCase()} vira {@code IBC1D23}) e define o
 * formato aceito. Antigo: {@code ABC1234}. Mercosul: {@code ABC1D23}.
 */
public final class PlacaVeiculo {

  /** Padrao antigo e Mercosul, so ASCII, sobre a placa ja normalizada. */
  public static final String REGEX = "^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$";

  /** Entrada bruta acima disso nao e normalizada e falha na validacao de formato. */
  public static final int TAMANHO_MAXIMO_BRUTO = 20;

  private static final int DIFERENCA_CAIXA = 'a' - 'A';

  private PlacaVeiculo() {}

  /**
   * Remove so espaco e hifen ASCII e passa {@code a} a {@code z} para maiuscula. Qualquer outro
   * caractere (tab, espaco nao separavel, letra Unicode) fica no valor e reprova o {@link #REGEX}.
   * Entrada com mais de {@link #TAMANHO_MAXIMO_BRUTO} caracteres volta intacta, para reprovar.
   * Aceita {@code null}; nunca lanca excecao.
   */
  public static String normalizar(String bruta) {
    if (bruta == null || bruta.length() > TAMANHO_MAXIMO_BRUTO) {
      return bruta;
    }
    StringBuilder normalizada = new StringBuilder(bruta.length());
    for (int i = 0; i < bruta.length(); i++) {
      char c = bruta.charAt(i);
      if (c == ' ' || c == '-') {
        continue;
      }
      normalizada.append(c >= 'a' && c <= 'z' ? (char) (c - DIFERENCA_CAIXA) : c);
    }
    return normalizada.toString();
  }
}

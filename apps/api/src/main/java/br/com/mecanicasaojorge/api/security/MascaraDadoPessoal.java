package br.com.mecanicasaojorge.api.security;

import br.com.mecanicasaojorge.api.entity.PlacaVeiculo;
import java.util.regex.Pattern;

/**
 * Mascara de dado pessoal para log (politica de dados do cliente, secao 6.2.1). Utilitario unico:
 * nunca lanca excecao, nunca escreve em log, e so considera digitos ASCII de 0 a 9.
 */
public final class MascaraDadoPessoal {

  private static final String TELEFONE_INVALIDO = "***";
  private static final String CPF_INVALIDO = "***.***.***-**";
  private static final int TELEFONE_MIN = 10;
  private static final int TELEFONE_MAX = 11;
  private static final int TELEFONE_VISIVEIS = 4;
  private static final int CPF_DIGITOS = 11;
  private static final String PLACA_INVALIDA = "*******";
  private static final int PLACA_VISIVEIS = 3;
  private static final Pattern PLACA_PADRAO = Pattern.compile(PlacaVeiculo.REGEX);

  private MascaraDadoPessoal() {}

  /**
   * Telefone com 10 ou 11 digitos mostra so os 4 ultimos; qualquer outra entrada vira {@code ***}.
   */
  public static String telefone(String valor) {
    String digitos = somenteDigitos(valor);
    if (digitos.length() < TELEFONE_MIN || digitos.length() > TELEFONE_MAX) {
      return TELEFONE_INVALIDO;
    }
    int ocultos = digitos.length() - TELEFONE_VISIVEIS;
    return "*".repeat(ocultos) + digitos.substring(ocultos);
  }

  /** CPF com 11 digitos mostra so o 5o, 6o e 7o; qualquer outra entrada vira a mascara cheia. */
  public static String cpf(String valor) {
    String digitos = somenteDigitos(valor);
    if (digitos.length() != CPF_DIGITOS) {
      return CPF_INVALIDO;
    }
    return "***.*" + digitos.substring(4, 6) + "." + digitos.charAt(6) + "**-**";
  }

  /**
   * Placa (politica 6.2.2): normaliza como a entrada ({@link PlacaVeiculo#normalizar}) e, se casar
   * com o formato antigo ou Mercosul, mostra {@code ****} mais os 3 ultimos caracteres. Qualquer
   * outro caso (null, invalida, marcador {@code ANON<id>}) vira {@code *******}.
   */
  public static String placa(String valor) {
    String normalizada = PlacaVeiculo.normalizar(valor);
    if (normalizada == null || !PLACA_PADRAO.matcher(normalizada).matches()) {
      return PLACA_INVALIDA;
    }
    return "****" + normalizada.substring(normalizada.length() - PLACA_VISIVEIS);
  }

  private static String somenteDigitos(String valor) {
    if (valor == null) {
      return "";
    }
    StringBuilder digitos = new StringBuilder(valor.length());
    for (int i = 0; i < valor.length(); i++) {
      char c = valor.charAt(i);
      if (c >= '0' && c <= '9') {
        digitos.append(c);
      }
    }
    return digitos.toString();
  }
}

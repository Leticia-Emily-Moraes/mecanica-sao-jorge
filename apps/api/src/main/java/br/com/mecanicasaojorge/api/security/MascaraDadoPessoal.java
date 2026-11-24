package br.com.mecanicasaojorge.api.security;

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

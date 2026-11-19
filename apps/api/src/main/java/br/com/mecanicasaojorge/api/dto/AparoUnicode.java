package br.com.mecanicasaojorge.api.dto;

/**
 * Aparo de espacos nas pontas que cobre tambem os espacos Unicode que {@link String#strip()}
 * deixa passar (NBSP U+00A0, U+2007 e U+202F). Usado no email, onde o valor aparado e a chave de
 * unicidade (F03d, achado A1): sem isso, "ana@x.com" e "ana@x.com " seriam clientes
 * diferentes.
 */
public final class AparoUnicode {

  private AparoUnicode() {}

  /** Remove das pontas todo espaco ou separador de espaco; {@code null} continua {@code null}. */
  public static String aparar(String valor) {
    if (valor == null) {
      return null;
    }
    int inicio = 0;
    int fim = valor.length();
    while (inicio < fim && ehEspaco(valor.charAt(inicio))) {
      inicio++;
    }
    while (fim > inicio && ehEspaco(valor.charAt(fim - 1))) {
      fim--;
    }
    return valor.substring(inicio, fim);
  }

  private static boolean ehEspaco(char c) {
    return Character.isWhitespace(c) || Character.isSpaceChar(c);
  }
}

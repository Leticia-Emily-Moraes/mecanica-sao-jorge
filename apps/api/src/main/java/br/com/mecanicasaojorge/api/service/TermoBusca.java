package br.com.mecanicasaojorge.api.service;

import java.text.Normalizer;

/**
 * Termo de busca normalizado (ADR-017): texto literal, sem curinga. Funcao pura.
 *
 * @param padraoTexto padrao {@code like} para nome e email, com {@code !} como escape, ou {@code
 *     null} quando nao ha termo
 * @param padraoTelefone padrao {@code like} so com digitos, ou {@code null} quando o termo nao tem
 *     digito
 * @param tamanho tamanho do termo depois de {@code strip} e NFC, antes do escape (campo {@code
 *     qLen} do log)
 */
record TermoBusca(String padraoTexto, String padraoTelefone, int tamanho) {

  private static final char ESCAPE = '!';
  private static final TermoBusca SEM_TERMO = new TermoBusca(null, null, 0);

  static TermoBusca de(String bruto) {
    if (bruto == null) {
      return SEM_TERMO;
    }
    String termo = Normalizer.normalize(bruto.strip(), Normalizer.Form.NFC);
    if (termo.isEmpty()) {
      return SEM_TERMO;
    }
    return new TermoBusca(envolver(escapar(termo)), padraoTelefone(termo), termo.length());
  }

  boolean semTermo() {
    return padraoTexto == null;
  }

  /** Ordem importa: o proprio escape vem primeiro para nao ser escapado duas vezes. */
  private static String escapar(String termo) {
    return termo
        .replace(String.valueOf(ESCAPE), "" + ESCAPE + ESCAPE)
        .replace("%", ESCAPE + "%")
        .replace("_", ESCAPE + "_");
  }

  private static String padraoTelefone(String termo) {
    StringBuilder digitos = new StringBuilder();
    for (int i = 0; i < termo.length(); i++) {
      char c = termo.charAt(i);
      if (c >= '0' && c <= '9') {
        digitos.append(c);
      }
    }
    return digitos.isEmpty() ? null : envolver(digitos.toString());
  }

  private static String envolver(String conteudo) {
    return "%" + conteudo + "%";
  }
}

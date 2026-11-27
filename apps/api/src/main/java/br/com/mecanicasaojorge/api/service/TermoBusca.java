package br.com.mecanicasaojorge.api.service;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Termo de busca normalizado (ADR-017): texto literal, sem curinga. Funcao pura.
 *
 * @param padraoTexto padrao {@code like} para nome e email, com {@code !} como escape, ou {@code
 *     null} quando nao ha termo
 * @param padraoTelefone padrao {@code like} so com digitos, ou {@code null} quando o termo nao e
 *     numerico (so digitos ASCII e simbolos de mascara, com ao menos um digito)
 * @param padraoPlaca padrao {@code like} para placa: sem hifen nem espaco, em maiusculas, so {@code
 *     [A-Z0-9]} (ate 10); {@code null} quando o termo nao tem forma de placa (ADR-037)
 * @param tamanho tamanho do termo depois de {@code strip} e NFC, antes do escape (campo {@code
 *     qLen} do log)
 */
record TermoBusca(String padraoTexto, String padraoTelefone, String padraoPlaca, int tamanho) {

  private static final char ESCAPE = '!';
  private static final Pattern FORMATO_PLACA = Pattern.compile("[A-Z0-9]{1,10}");
  private static final char ESPACO_NAO_SEPARAVEL = (char) 0xA0;

  /** Mascara de telefone aceita: parenteses, hifen, ponto, mais, espaco e espaco nao separavel. */
  private static final String SIMBOLOS_MASCARA = "()-.+ " + ESPACO_NAO_SEPARAVEL;

  private static final TermoBusca SEM_TERMO = new TermoBusca(null, null, null, 0);

  static TermoBusca de(String bruto) {
    if (bruto == null) {
      return SEM_TERMO;
    }
    String termo = Normalizer.normalize(bruto.strip(), Normalizer.Form.NFC);
    if (termo.isEmpty()) {
      return SEM_TERMO;
    }
    return new TermoBusca(
        envolver(escapar(termo)), padraoTelefone(termo), padraoPlaca(termo), termo.length());
  }

  /** Mostra so o tamanho: o termo pode ser nome de pessoa e nao pode ir a log (ADR-037). */
  @Override
  public String toString() {
    return "TermoBusca[tamanho=" + tamanho + "]";
  }

  /**
   * Placa e comparada sem hifen e espaco, em maiusculas. So {@code [A-Z0-9]} passa, entao o padrao
   * nunca tem curinga e dispensa escape; qualquer outro caractere torna o padrao {@code null}.
   */
  private static String padraoPlaca(String termo) {
    String candidata = termo.replace("-", "").replaceAll("\\s", "").toUpperCase(Locale.ROOT);
    return FORMATO_PLACA.matcher(candidata).matches() ? envolver(candidata) : null;
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

  /**
   * Telefone so e consultado com termo numerico (ADR-017, T2): todo caractere e digito ASCII ou
   * simbolo de mascara, com pelo menos um digito. Qualquer outro caractere (letra, {@code @},
   * {@code %}, digito nao ASCII...) torna o termo nao numerico e o padrao fica {@code null}.
   */
  private static String padraoTelefone(String termo) {
    StringBuilder digitos = new StringBuilder();
    for (int i = 0; i < termo.length(); i++) {
      char c = termo.charAt(i);
      if (c >= '0' && c <= '9') {
        digitos.append(c);
      } else if (SIMBOLOS_MASCARA.indexOf(c) < 0) {
        return null;
      }
    }
    return digitos.isEmpty() ? null : envolver(digitos.toString());
  }

  private static String envolver(String conteudo) {
    return "%" + conteudo + "%";
  }
}

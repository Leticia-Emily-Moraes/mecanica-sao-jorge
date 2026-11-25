package br.com.mecanicasaojorge.api.dto;

import java.util.List;

/**
 * Catalogo de chaves i18n de erro de veiculo (formato {@code veiculo.<componente>.<texto>}). As
 * mensagens das anotacoes de {@link VeiculoRequest} sao estas chaves, nunca texto; o app (F35)
 * traduz. Sem {@code {}} nem {@code ${}}: nao ha interpolacao de Expression Language.
 */
public final class VeiculoChaves {

  public static final String PLACA_OBRIGATORIA = "veiculo.form.placa.obrigatoria";
  public static final String PLACA_ERRO = "veiculo.form.placa.erro";
  public static final String PLACA_DUPLICADA = "veiculo.form.placa.duplicada";
  public static final String MARCA_OBRIGATORIA = "veiculo.form.marca.obrigatoria";
  public static final String MARCA_TAMANHO = "veiculo.form.marca.tamanho";
  public static final String MODELO_OBRIGATORIO = "veiculo.form.modelo.obrigatorio";
  public static final String MODELO_TAMANHO = "veiculo.form.modelo.tamanho";
  public static final String ANO_OBRIGATORIO = "veiculo.form.ano.obrigatorio";
  public static final String ANO_FAIXA = "veiculo.form.ano.faixa";
  public static final String ANO_TIPO = "veiculo.form.ano.tipo";
  public static final String COR_TAMANHO = "veiculo.form.cor.tamanho";

  /** Todas as chaves publicadas, na ordem do catalogo. */
  public static final List<String> TODAS =
      List.of(
          PLACA_OBRIGATORIA,
          PLACA_ERRO,
          PLACA_DUPLICADA,
          MARCA_OBRIGATORIA,
          MARCA_TAMANHO,
          MODELO_OBRIGATORIO,
          MODELO_TAMANHO,
          ANO_OBRIGATORIO,
          ANO_FAIXA,
          ANO_TIPO,
          COR_TAMANHO);

  private VeiculoChaves() {}
}

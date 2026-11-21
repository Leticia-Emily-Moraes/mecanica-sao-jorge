package br.com.mecanicasaojorge.api.exception;

import br.com.mecanicasaojorge.api.dto.VeiculoChaves;

/** Placa ja pertence a outro veiculo (indice {@code uk_veiculos_placa}, ADR-022). */
public class PlacaJaCadastradaException extends ConflitoException {

  public static final String MENSAGEM = "Placa ja cadastrada";

  public PlacaJaCadastradaException() {
    super(MENSAGEM, new ErroCampo("placa", VeiculoChaves.PLACA_DUPLICADA));
  }
}

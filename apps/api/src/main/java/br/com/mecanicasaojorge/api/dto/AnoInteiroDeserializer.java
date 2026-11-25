package br.com.mecanicasaojorge.api.dto;

import tools.jackson.core.JsonParser;
import tools.jackson.core.JsonToken;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.ValueDeserializer;

/**
 * Aceita no campo {@code ano} do veiculo so numero inteiro JSON que cabe em {@code int} (ADR-028).
 * Decimal ({@code 2015.9}, {@code 2015.0}), texto, booleano, objeto, array e inteiro grande demais
 * viram {@code MismatchedInputException} com o caminho preenchido; o texto recebido nunca entra na
 * mensagem. Ligado so ao componente {@code ano}: o {@code ObjectMapper} global nao muda.
 */
public final class AnoInteiroDeserializer extends ValueDeserializer<Integer> {

  @Override
  public Integer deserialize(JsonParser parser, DeserializationContext contexto) {
    if (parser.currentToken() == JsonToken.VALUE_NUMBER_INT
        && parser.getNumberType() == JsonParser.NumberType.INT) {
      return parser.getIntValue();
    }
    return (Integer) contexto.handleUnexpectedToken(Integer.class, parser);
  }
}

/** Só id numérico positivo, sem zero à esquerda, até 16 dígitos (ADR-029, D2). */
const ID_PATTERN = /^[1-9][0-9]{0,15}$/;

export type ParametroDeRota = string | ReadonlyArray<string> | undefined;

/**
 * Lê o id de um parâmetro de rota. Qualquer outra coisa (texto, vazio, negativo,
 * decimal, repetido, grande demais) devolve `null`, que a tela trata como "não
 * encontrado" sem chamar a API. A rota nunca carrega dado pessoal, só este id.
 */
export function lerIdDaRota(parametro: ParametroDeRota): number | null {
  if (typeof parametro !== 'string' || !ID_PATTERN.test(parametro)) {
    return null;
  }
  const id = Number(parametro);
  return Number.isSafeInteger(id) ? id : null;
}

/** Avisos de sucesso que uma tela pode receber pela rota (lista fechada, ADR-029 D2). */
export type AvisoDeSucesso = 'criado' | 'editado' | 'veiculoCriado';

const AVISOS_VALIDOS: ReadonlyArray<AvisoDeSucesso> = ['criado', 'editado', 'veiculoCriado'];

/**
 * Lê o parâmetro `aviso`. Valor fora da lista vira `null`: nada que venha de um
 * link externo chega à tela como texto, só escolhe uma mensagem já escrita no app.
 */
export function lerAviso(parametro: ParametroDeRota): AvisoDeSucesso | null {
  if (typeof parametro !== 'string') {
    return null;
  }
  return AVISOS_VALIDOS.find((aviso) => aviso === parametro) ?? null;
}

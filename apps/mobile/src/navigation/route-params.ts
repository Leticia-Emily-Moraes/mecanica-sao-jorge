/** Só id numérico positivo, sem zero à esquerda, até 16 dígitos (ADR-029, D2). */
const ID_PATTERN = /^[1-9][0-9]{0,15}$/;

export type ParametroDeRota = string | readonly string[] | undefined;

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

const AVISOS_VALIDOS: readonly AvisoDeSucesso[] = ['criado', 'editado', 'veiculoCriado'];

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

const AVISO_ID_PATTERN = /^[0-9]{1,16}$/;

/**
 * Identifica uma navegação com aviso: o mesmo texto de sucesso pode voltar à
 * mesma tela mais de uma vez, e só o identificador diferencia a nova do aviso
 * antigo que a pessoa já dispensou. Só dígitos; qualquer outra coisa vira `null`.
 */
export function lerAvisoId(parametro: ParametroDeRota): string | null {
  return typeof parametro === 'string' && AVISO_ID_PATTERN.test(parametro) ? parametro : null;
}

/** Parâmetros de rota que levam um aviso de sucesso à tela de destino (só valores fixos). */
export function parametrosDeAviso(aviso: AvisoDeSucesso): {
  readonly aviso: AvisoDeSucesso;
  readonly avisoId: string;
} {
  return { aviso, avisoId: String(Date.now()) };
}

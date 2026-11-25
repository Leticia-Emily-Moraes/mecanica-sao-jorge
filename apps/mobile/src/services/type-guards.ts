/** Guardas de tipo pequenas, compartilhadas pelas guardas de resposta da API. */

export function isRecord(valor: unknown): valor is Readonly<Record<string, unknown>> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

export function isId(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isInteger(valor) && valor > 0;
}

export function isTextoOuNulo(valor: unknown): valor is string | null {
  return valor === null || typeof valor === 'string';
}

export function isInteiroOuNulo(valor: unknown): valor is number | null {
  return valor === null || (typeof valor === 'number' && Number.isInteger(valor));
}

export function isListaDe<T>(
  valor: unknown,
  guarda: (item: unknown) => item is T,
): valor is ReadonlyArray<T> {
  return Array.isArray(valor) && valor.every(guarda);
}

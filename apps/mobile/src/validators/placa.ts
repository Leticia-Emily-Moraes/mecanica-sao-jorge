const TAMANHO_PLACA = 7;
const PLACA_ANTIGA = /^[A-Z]{3}[0-9]{4}$/;
const PLACA_MERCOSUL = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

/** Maiúsculas, só letras e números, no máximo 7 caracteres: o que o campo guarda. */
export function normalizarPlaca(valor: string): string {
  return valor
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, TAMANHO_PLACA);
}

/** Placa no padrão antigo (ABC1234) ou Mercosul (ABC1D23), sem hífen nem espaço. */
export function isPlacaValida(valor: string): boolean {
  const placa = normalizarPlaca(valor);
  return PLACA_ANTIGA.test(placa) || PLACA_MERCOSUL.test(placa);
}

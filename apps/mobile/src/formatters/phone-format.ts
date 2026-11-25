import { apenasDigitos } from './digits';

const MAX_PHONE_DIGITS = 11;

/**
 * Telefone brasileiro com DDD, formatado conforme se digita: `(11) 90000-0001`
 * (celular) ou `(11) 3000-0001` (fixo). Texto sem algarismo devolve vazio.
 * Não valida: o formato incompleto também sai formatado.
 */
export function formatarTelefone(valor: string): string {
  const digitos = apenasDigitos(valor).slice(0, MAX_PHONE_DIGITS);
  if (digitos.length === 0) {
    return '';
  }
  const ddd = digitos.slice(0, 2);
  const resto = digitos.slice(2);
  if (digitos.length <= 2) {
    return `(${ddd}`;
  }
  const corte = digitos.length > 10 ? 5 : 4;
  const inicio = resto.slice(0, corte);
  const fim = resto.slice(corte);
  return fim.length > 0 ? `(${ddd}) ${inicio}-${fim}` : `(${ddd}) ${inicio}`;
}

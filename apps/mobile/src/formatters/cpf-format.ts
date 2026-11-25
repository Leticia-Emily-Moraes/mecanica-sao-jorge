import { apenasDigitos } from './digits';

const MAX_CPF_DIGITS = 11;

/**
 * CPF com pontuação conforme se digita: `529.982.247-25`. Corta em 11
 * algarismos e devolve vazio para texto sem algarismo. Não valida.
 */
export function formatarCpf(valor: string): string {
  const digitos = apenasDigitos(valor).slice(0, MAX_CPF_DIGITS);
  const partes = [digitos.slice(0, 3), digitos.slice(3, 6), digitos.slice(6, 9)];
  const final = digitos.slice(9);
  const corpo = partes.filter((parte) => parte !== '').join('.');
  return final === '' ? corpo : `${corpo}-${final}`;
}

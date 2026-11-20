import { apenasDigitos } from './digits';

const CPF_LENGTH = 11;

/** Posições (base 0) dos três dígitos que a máscara da D-C deixa à mostra. */
const VISIBLE_START = 4;
const VISIBLE_END = 7;

function lerCpfCompleto(valor: string | null | undefined): string | null {
  if (typeof valor !== 'string') {
    return null;
  }
  const digitos = apenasDigitos(valor);
  return digitos.length === CPF_LENGTH ? digitos : null;
}

/**
 * CPF para exibição no detalhe, no padrão da D-C: `***.*56.7**-**` (mostra só
 * o 5º, 6º e 7º dígitos). Devolve `null` quando o valor é nulo, vazio ou não
 * tem exatamente 11 dígitos: a tela mostra "Não informado" e o valor cru nunca
 * chega ao texto (critério 28).
 */
export function mascararCpf(valor: string | null | undefined): string | null {
  const digitos = lerCpfCompleto(valor);
  if (digitos === null) {
    return null;
  }
  const visiveis = digitos.slice(VISIBLE_START, VISIBLE_END);
  return `***.*${visiveis.slice(0, 2)}.${visiveis.slice(2)}**-**`;
}

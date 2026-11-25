import { apenasDigitos } from '@/formatters/digits';

const CPF_LENGTH = 11;

function digitoVerificador(base: string): number {
  const pesoInicial = base.length + 1;
  const soma = base
    .split('')
    .reduce((total, digito, indice) => total + Number(digito) * (pesoInicial - indice), 0);
  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

/**
 * CPF válido: 11 algarismos (pontuação é ignorada), não todos iguais e com os
 * dois dígitos verificadores corretos. Só confere o formato; não prova que o
 * CPF existe nem que é da pessoa.
 */
export function isCpfValido(valor: string): boolean {
  const digitos = apenasDigitos(valor);
  if (digitos.length !== CPF_LENGTH || /^(\d)\1{10}$/.test(digitos)) {
    return false;
  }
  const primeiro = digitoVerificador(digitos.slice(0, 9));
  const segundo = digitoVerificador(digitos.slice(0, 10));
  return primeiro === Number(digitos[9]) && segundo === Number(digitos[10]);
}

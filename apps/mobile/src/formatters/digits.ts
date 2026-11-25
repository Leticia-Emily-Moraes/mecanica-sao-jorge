/** Só os algarismos de um texto; apoio dos formatadores de CPF e telefone. */
export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

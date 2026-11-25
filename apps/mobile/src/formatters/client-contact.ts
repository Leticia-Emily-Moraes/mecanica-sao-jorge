import { formatarTelefone } from './phone-format';

interface ContatoDoCliente {
  readonly telefone: string | null;
  readonly email: string | null;
}

/**
 * Contato que a linha da lista mostra (L7): o telefone formatado; sem ele, o
 * e-mail; sem nenhum dos dois, `null` e a tela escreve "Sem contato cadastrado".
 */
export function contatoDoCliente(cliente: ContatoDoCliente): string | null {
  const telefone = cliente.telefone === null ? '' : formatarTelefone(cliente.telefone);
  if (telefone !== '') {
    return telefone;
  }
  const email = cliente.email?.trim() ?? '';
  return email === '' ? null : email;
}

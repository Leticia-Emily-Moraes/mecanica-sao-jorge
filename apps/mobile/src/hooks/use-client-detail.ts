import { obterCliente } from '@/services/clients-service';
import type { ClienteDetalhe } from '@/services/clients-types';

import { useRefreshOnFocus } from './use-refresh-on-focus';
import { type Resource, useResource } from './use-resource';

/**
 * Detalhe de um cliente. `id` nulo (parâmetro de rota inválido) é "não
 * encontrado" sem chamada à API. O CPF fica só neste estado, na memória da tela.
 */
export function useClientDetail(id: number | null): Resource<ClienteDetalhe> {
  const recurso = useResource<ClienteDetalhe>(id, obterCliente);
  useRefreshOnFocus(recurso.atualizar);
  return recurso;
}

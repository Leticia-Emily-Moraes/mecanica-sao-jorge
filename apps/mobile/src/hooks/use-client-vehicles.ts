import { listarVeiculosDoCliente } from '@/services/vehicles-service';
import type { VeiculoResumo } from '@/services/vehicles-types';

import { useRefreshOnFocus } from './use-refresh-on-focus';
import { type Resource, useResource } from './use-resource';

/**
 * Veículos do cliente, lidos à parte do detalhe: erro aqui não derruba o
 * cliente e vice-versa (ADR-030, D6). Lista vazia é sucesso, não erro.
 */
export function useClientVehicles(
  clienteId: number | null,
): Resource<ReadonlyArray<VeiculoResumo>> {
  const recurso = useResource<ReadonlyArray<VeiculoResumo>>(clienteId, listarVeiculosDoCliente);
  useRefreshOnFocus(recurso.atualizar);
  return recurso;
}

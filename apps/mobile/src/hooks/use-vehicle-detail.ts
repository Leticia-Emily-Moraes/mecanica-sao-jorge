import { obterVeiculo } from '@/services/vehicles-service';
import type { VeiculoDetalhe } from '@/services/vehicles-types';

import { useRefreshOnFocus } from './use-refresh-on-focus';
import { type Resource, useResource } from './use-resource';

/**
 * Detalhe de um veículo com o histórico de OS. `id` nulo (parâmetro de rota
 * inválido) é "não encontrado" sem chamada à API. Recarrega ao voltar ao foco,
 * para mostrar o que a edição acabou de salvar.
 */
export function useVehicleDetail(id: number | null): Resource<VeiculoDetalhe> {
  const recurso = useResource<VeiculoDetalhe>(id, obterVeiculo);
  useRefreshOnFocus(recurso.atualizar);
  return recurso;
}

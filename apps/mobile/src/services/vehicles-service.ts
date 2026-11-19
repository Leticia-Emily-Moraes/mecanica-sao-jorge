import { chamarApi } from './api-request';
import {
  isListaDeVeiculos,
  isVeiculoDetalhe,
  type VeiculoDetalhe,
  type VeiculoResumo,
} from './vehicles-types';

/** `GET /clientes/{clienteId}/veiculos`: lista simples, sem paginação (ADR-030, D4). */
export function listarVeiculosDoCliente(
  clienteId: number,
  token: string,
  signal: AbortSignal,
): Promise<ReadonlyArray<VeiculoResumo>> {
  return chamarApi({
    caminho: `/clientes/${encodeURIComponent(String(clienteId))}/veiculos`,
    token,
    signal,
    guarda: isListaDeVeiculos,
  });
}

/** `GET /veiculos/{id}`: o detalhe traz `historicoOs`, vazio até a F06. */
export function obterVeiculo(
  id: number,
  token: string,
  signal: AbortSignal,
): Promise<VeiculoDetalhe> {
  return chamarApi({
    caminho: `/veiculos/${encodeURIComponent(String(id))}`,
    token,
    signal,
    guarda: isVeiculoDetalhe,
  });
}

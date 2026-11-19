import { chamarApi, comParametros } from './api-request';
import {
  type ClienteDetalhe,
  type ClienteResumo,
  isClienteDetalhe,
  isPaginaDeClientes,
  type Pagina,
} from './clients-types';

/** Tamanho de página pedido à API (o padrão dela; ADR-030, D4). */
export const TAMANHO_PAGINA_CLIENTES = 20;

export interface BuscaDeClientes {
  /** Termo já aparado; vazio ou `undefined` não vai para a URL. */
  readonly q?: string;
  readonly page: number;
}

/** `GET /clientes`: uma página, com ou sem termo de busca. */
export function listarClientes(
  busca: BuscaDeClientes,
  token: string,
  signal: AbortSignal,
): Promise<Pagina<ClienteResumo>> {
  const termo = busca.q?.trim();
  return chamarApi({
    caminho: comParametros('/clientes', {
      q: termo === undefined || termo === '' ? undefined : termo,
      page: busca.page,
      size: TAMANHO_PAGINA_CLIENTES,
    }),
    token,
    signal,
    guarda: isPaginaDeClientes,
  });
}

/** `GET /clientes/{id}`: o id vem validado da rota, nunca digitado. */
export function obterCliente(
  id: number,
  token: string,
  signal: AbortSignal,
): Promise<ClienteDetalhe> {
  return chamarApi({
    caminho: `/clientes/${encodeURIComponent(String(id))}`,
    token,
    signal,
    guarda: isClienteDetalhe,
  });
}

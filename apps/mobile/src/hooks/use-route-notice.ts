import { useCallback, useState } from 'react';

import type { AvisoDeSucesso } from '@/navigation/route-params';

import { useAutoDismiss } from './use-auto-dismiss';

export interface RouteNotice {
  /** Aviso a mostrar agora; `null` quando não há ou já foi dispensado. */
  readonly aviso: AvisoDeSucesso | null;
  readonly dispensar: () => void;
}

/**
 * Aviso de sucesso que chega pela rota. Some sozinho depois de alguns segundos
 * ou quando a pessoa o fecha. O `avisoId` separa uma navegação nova do aviso
 * antigo já dispensado, que continua na rota.
 */
export function useRouteNotice(aviso: AvisoDeSucesso | null, avisoId: string | null): RouteNotice {
  const chave = aviso !== null && avisoId !== null ? `${aviso}:${avisoId}` : null;
  const [dispensada, setDispensada] = useState<string | null>(null);
  const visivel = chave !== null && dispensada !== chave;

  const dispensar = useCallback((): void => setDispensada(chave), [chave]);
  useAutoDismiss(visivel, dispensar);

  return { aviso: visivel ? aviso : null, dispensar };
}

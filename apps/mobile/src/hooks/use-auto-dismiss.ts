import { useEffect, useRef } from 'react';

import { NOTICE_DURATION_MS } from '@/config/notice';

/**
 * Chama `aoExpirar` depois de `duracaoMs` enquanto `ativo` for verdadeiro. Sair
 * de `ativo` ou desmontar cancela a espera, então um aviso dispensado à mão não
 * dispara de novo. `aoExpirar` pode mudar de identidade sem reiniciar a contagem.
 */
export function useAutoDismiss(
  ativo: boolean,
  aoExpirar: () => void,
  duracaoMs: number = NOTICE_DURATION_MS,
): void {
  const aoExpirarRef = useRef(aoExpirar);
  aoExpirarRef.current = aoExpirar;

  useEffect(() => {
    if (!ativo) {
      return undefined;
    }
    const temporizador = setTimeout(() => aoExpirarRef.current(), duracaoMs);
    return () => clearTimeout(temporizador);
  }, [ativo, duracaoMs]);
}

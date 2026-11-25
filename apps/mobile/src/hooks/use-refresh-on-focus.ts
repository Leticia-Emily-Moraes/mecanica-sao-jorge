import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

/**
 * Chama `atualizar` cada vez que a tela volta ao foco, menos na primeira: essa
 * já é a carga inicial (ADR-029, D4). `atualizar` deve ter identidade estável.
 */
export function useRefreshOnFocus(atualizar: () => void): void {
  const primeiraVez = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (primeiraVez.current) {
        primeiraVez.current = false;
        return;
      }
      atualizar();
    }, [atualizar]),
  );
}

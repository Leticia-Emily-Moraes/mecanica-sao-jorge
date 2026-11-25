import { useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Pede ao leitor de tela que fale `mensagem` quando ela muda e não é nula, sem
 * mexer no foco (resultado de busca, por exemplo). A mensagem já chega pronta:
 * o hook não conhece texto da interface.
 */
export function useAnnounce(mensagem: string | null): void {
  useEffect(() => {
    if (mensagem !== null) {
      AccessibilityInfo.announceForAccessibility(mensagem);
    }
  }, [mensagem]);
}

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { AccessibilityInfo, findNodeHandle } from 'react-native';
import type { View } from 'react-native';

/**
 * Devolve o foco do leitor de tela ao controle que abriu o popup quando ele
 * fecha (US-POP-02). Anexe o `ref` retornado ao botão que dispara o popup.
 * Se o controle já foi desmontado (ex.: logout navega para outra tela), não
 * faz nada.
 */
export function useRestoreFocusOnClose(visible: boolean): RefObject<View | null> {
  const triggerRef = useRef<View | null>(null);
  const wasVisibleRef = useRef(visible);

  useEffect(() => {
    if (wasVisibleRef.current && !visible) {
      const handle = findNodeHandle(triggerRef.current);
      if (typeof handle === 'number') {
        AccessibilityInfo.setAccessibilityFocus(handle);
      }
    }
    wasVisibleRef.current = visible;
  }, [visible]);

  return triggerRef;
}

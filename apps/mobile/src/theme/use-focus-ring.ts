import { useCallback, useState } from 'react';
import type { ViewStyle } from 'react-native';

import { color, focusRingInset, focusRingOffset, focusRingWidth } from './tokens';

export interface FocusRing {
  readonly focusRingStyle: ViewStyle;
  readonly focused: boolean;
  onFocus(): void;
  onBlur(): void;
}

/**
 * Anel de foco duplo (borda petro + halo branco) para qualquer controle
 * focável. O espaço da borda/halo é sempre reservado (padding fixo) para o
 * layout não pular ao ganhar/perder foco — só a cor muda, de transparente
 * para petro/branco. A margem negativa devolve esse espaço ao layout: a borda
 * visível do controle fica alinhada com o conteúdo ao redor, como no Figma.
 */
export function useFocusRing(): FocusRing {
  const [focused, setFocused] = useState(false);

  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => setFocused(false), []);

  const focusRingStyle: ViewStyle = {
    borderWidth: focusRingWidth,
    borderColor: focused ? color.focus.ring : 'transparent',
    padding: focusRingOffset,
    margin: -focusRingInset,
    backgroundColor: focused ? color.focus.ringOffset : 'transparent',
  };

  return { focusRingStyle, focused, onFocus, onBlur };
}

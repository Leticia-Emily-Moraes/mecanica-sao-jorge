import { useCallback, useState } from 'react';
import type { ViewStyle } from 'react-native';

import { color, focusRingOffset, focusRingWidth } from './tokens';

export interface FocusRing {
  readonly focusRingStyle: ViewStyle;
  readonly focused: boolean;
  onFocus(): void;
  onBlur(): void;
}

export interface FocusRingOptions {
  /** Controle sobre a barra petro: anel branco de 2 px, sem halo (T1). */
  readonly onBrand?: boolean;
}

/**
 * Anel de foco duplo (borda petro + halo branco) para qualquer controle
 * focável. O espaço da borda/halo é sempre reservado (padding fixo) para o
 * layout não pular ao ganhar/perder foco — só a cor muda, de transparente
 * para petro/branco. Sobre a barra petro (`onBrand`) o anel é branco e o
 * respiro de 2 px fica transparente, mostrando a própria barra.
 */
export function useFocusRing({ onBrand = false }: FocusRingOptions = {}): FocusRing {
  const [focused, setFocused] = useState(false);

  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => setFocused(false), []);

  const focusRingStyle: ViewStyle = {
    borderWidth: focusRingWidth,
    borderColor: focused ? (onBrand ? color.focus.ringOnBrand : color.focus.ring) : 'transparent',
    padding: focusRingOffset,
    backgroundColor: focused && !onBrand ? color.focus.ringOffset : 'transparent',
  };

  return { focusRingStyle, focused, onFocus, onBlur };
}

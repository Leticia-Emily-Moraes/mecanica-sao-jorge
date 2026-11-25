import type { ReactElement, ReactNode } from 'react';
import { ScrollView } from 'react-native';

import { gapStyle, styles } from './detail-scroll.styles';

export type DetailScrollGap = 'compact' | 'regular';

export interface DetailScrollProps {
  readonly children: ReactNode;
  /** Espaço entre os blocos: `compact` (12, detalhe do cliente) ou `regular` (16, detalhe do veículo). */
  readonly gap?: DetailScrollGap;
}

/** Rolagem do conteúdo de uma tela de detalhe (F35): respiro em cima e embaixo e espaço fixo entre blocos. */
export function DetailScroll({ children, gap = 'regular' }: DetailScrollProps): ReactElement {
  return (
    <ScrollView
      contentContainerStyle={[styles.content, gapStyle(gap)]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

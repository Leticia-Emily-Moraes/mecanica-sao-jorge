import type { ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { color, spacing } from '@/theme/tokens';

export interface ScreenContainerProps {
  readonly children: ReactNode;
  /** Centraliza o conteúdo na vertical (ex.: Login). */
  readonly centered?: boolean;
}

/** Contêiner de tela: preenche a área, aplica o respiro padrão e o fundo da identidade. */
export function ScreenContainer({
  children,
  centered = false,
}: ScreenContainerProps): ReactElement {
  return <View style={[styles.container, centered && styles.centered]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: color.surface.default,
  },
  centered: {
    justifyContent: 'center',
  },
});

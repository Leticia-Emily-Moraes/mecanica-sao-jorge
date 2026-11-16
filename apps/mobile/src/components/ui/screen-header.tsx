import type { ReactElement } from 'react';
import { StyleSheet, Text } from 'react-native';

import { color, spacing, typography } from '@/theme/tokens';

export type ScreenHeaderAlign = 'start' | 'center';

export interface ScreenHeaderProps {
  readonly title: string;
  readonly align?: ScreenHeaderAlign;
}

/** Título de tela. Anunciado como cabeçalho pelo leitor de tela. */
export function ScreenHeader({ title, align = 'start' }: ScreenHeaderProps): ReactElement {
  return (
    <Text accessibilityRole="header" style={[styles.title, align === 'center' && styles.center]}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    color: color.text.primary,
    marginBottom: spacing.lg,
  },
  center: {
    textAlign: 'center',
  },
});

import type { ReactElement } from 'react';
import { StyleSheet, Text } from 'react-native';

import { color, typography } from '@/theme/tokens';

export interface SectionTitleProps {
  readonly text: string;
}

/**
 * Título de seção ("Veículos (2)"): cabeçalho para o leitor de tela. A caixa
 * alta é só visual; o texto lido é o da prop, sem mudança.
 */
export function SectionTitle({ text }: SectionTitleProps): ReactElement {
  return (
    <Text accessibilityRole="header" style={styles.title}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: typography.sectionTitle.fontFamily,
    fontSize: typography.sectionTitle.fontSize,
    color: color.text.primary,
    textTransform: 'uppercase',
  },
});

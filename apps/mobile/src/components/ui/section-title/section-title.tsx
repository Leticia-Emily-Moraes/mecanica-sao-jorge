import type { ReactElement } from 'react';
import { Text } from 'react-native';

import { styles } from './section-title.styles';

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

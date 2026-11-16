import type { ReactElement } from 'react';
import { StyleSheet, Text } from 'react-native';

import { color, spacing } from '@/theme/tokens';

export interface InlineAlertProps {
  readonly message: string;
}

/**
 * Aviso de erro dentro do formulário (a tela continua utilizável). Sempre
 * com texto — nunca só cor — e anunciado como alerta ao leitor de tela.
 */
export function InlineAlert({ message }: InlineAlertProps): ReactElement {
  return (
    <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.message}>
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  message: {
    color: color.text.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});

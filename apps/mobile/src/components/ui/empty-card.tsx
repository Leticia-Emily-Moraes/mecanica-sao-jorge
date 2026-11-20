import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { borderWidth, color, radius, spacing, typography } from '@/theme/tokens';

export interface EmptyCardProps {
  readonly title: string;
  readonly message: string;
}

/**
 * Vazio dentro de uma seção ("Nenhum veículo cadastrado", "Nenhuma OS neste
 * veículo"): a tela continua visível em volta. É lido de uma vez, título e mensagem.
 */
export function EmptyCard({ title, message }: EmptyCardProps): ReactElement {
  return (
    <View
      testID="empty-card"
      accessible
      accessibilityLabel={`${title}. ${message}`}
      style={styles.card}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
    padding: spacing.md,
    borderWidth: borderWidth.hairline,
    borderColor: color.border.divider,
    borderRadius: radius.sm,
    backgroundColor: color.surface.default,
  },
  title: {
    fontFamily: typography.cardTitle.fontFamily,
    fontSize: typography.cardTitle.fontSize,
    color: color.text.primary,
  },
  message: {
    fontFamily: typography.subtitle.fontFamily,
    fontSize: typography.subtitle.fontSize,
    color: color.text.secondary,
  },
});

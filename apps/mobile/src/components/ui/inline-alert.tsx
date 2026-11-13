import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { borderWidth, color, glyph, radius, spacing, typography } from '@/theme/tokens';

export interface InlineAlertProps {
  readonly message: string;
}

/**
 * Faixa de erro dentro do formulário (a tela continua utilizável; Figma
 * 29:60). Sempre com ícone e texto — nunca só cor — e anunciada como alerta
 * ao leitor de tela. O ícone é decorativo.
 */
export function InlineAlert({ message }: InlineAlertProps): ReactElement {
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessible
      style={styles.banner}
    >
      <Text accessibilityElementsHidden importantForAccessibility="no" style={styles.icon}>
        {glyph.alert}
      </Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: color.surface.errorTint,
    borderWidth: borderWidth.field,
    borderColor: color.text.error,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm + spacing.xs,
    paddingHorizontal: spacing.md - spacing.xs,
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: typography.labelSmall.fontSize,
    color: color.text.error,
  },
  message: {
    flex: 1,
    fontSize: typography.labelSmall.fontSize,
    fontWeight: typography.labelSmall.fontWeight,
    color: color.text.error,
  },
});

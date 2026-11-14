import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AlertIcon } from '@/components/ui/alert-icon';
import { borderWidth, color, layout, radius, spacing, typography } from '@/theme/tokens';

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
      <AlertIcon size={typography.labelSmall.fontSize} />
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
    minHeight: layout.inlineAlertMinHeight,
    paddingVertical: spacing.sm + spacing.xs,
    paddingHorizontal: spacing.md - spacing.xs,
    marginBottom: spacing.md,
  },
  message: {
    flex: 1,
    fontSize: typography.labelSmall.fontSize,
    fontWeight: typography.labelSmall.fontWeight,
    color: color.text.error,
  },
});

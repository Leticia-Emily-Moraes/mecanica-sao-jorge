import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, minTouchTarget, radius, spacing, typography } from '@/theme/tokens';
import { useFocusRing } from '@/theme/use-focus-ring';

export interface InlineActionButtonProps {
  /** Texto visível ("Mostrar"). */
  readonly label: string;
  /**
   * Nome acessível quando precisa ser mais completo que o texto visível
   * ("Mostrar senha"). Deve conter o texto visível (WCAG 2.5.3).
   */
  readonly accessibilityLabel?: string;
  readonly onPress: () => void;
  readonly disabled?: boolean;
}

/**
 * Ação textual discreta dentro de outro controle (ex.: mostrar/ocultar senha
 * no campo). Sem fundo, com alvo de toque mínimo e anel de foco.
 */
export function InlineActionButton({
  label,
  accessibilityLabel,
  onPress,
  disabled = false,
}: InlineActionButtonProps): ReactElement {
  const { focusRingStyle, onFocus, onBlur } = useFocusRing();

  return (
    <View style={[styles.ringWrapper, focusRingStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        onPress={onPress}
        hitSlop={TOUCH_SLOP}
        style={styles.button}
      >
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </View>
  );
}

/**
 * Visualmente discreto (cabe nos 46 do campo); a área de toque chega a 48 por
 * `hitSlop` (ADR-014, regra 15).
 */
const TOUCH_SLOP = {
  top: minTouchTarget / 2,
  bottom: minTouchTarget / 2,
  left: spacing.sm,
  right: spacing.sm,
};

const styles = StyleSheet.create({
  ringWrapper: {
    borderRadius: radius.sm,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  label: {
    fontFamily: typography.fieldLabel.fontFamily,
    fontSize: typography.fieldLabel.fontSize,
    color: color.text.secondary,
  },
});

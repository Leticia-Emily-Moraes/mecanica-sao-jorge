import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, minTouchTarget, radius, spacing, typography } from '@/theme/tokens';
import { useFocusRing } from '@/theme/use-focus-ring';

export interface InlineActionButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly disabled?: boolean;
}

/**
 * Ação textual discreta dentro de outro controle (ex.: mostrar/ocultar senha
 * no campo). Sem fundo, com alvo de toque mínimo e anel de foco.
 */
export function InlineActionButton({
  label,
  onPress,
  disabled = false,
}: InlineActionButtonProps): ReactElement {
  const { focusRingStyle, onFocus, onBlur } = useFocusRing();

  return (
    <View style={[styles.ringWrapper, focusRingStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        onPress={onPress}
        style={styles.button}
      >
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  ringWrapper: {
    borderRadius: radius.sm,
  },
  button: {
    minHeight: minTouchTarget,
    minWidth: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  label: {
    fontSize: typography.caption.fontSize,
    color: color.text.secondary,
  },
});

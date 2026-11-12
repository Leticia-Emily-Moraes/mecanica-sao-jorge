import { Ionicons } from '@expo/vector-icons';
import type { ReactElement } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { t } from '@/i18n/strings';
import { color, minTouchTarget, spacing } from '@/theme/tokens';
import { useFocusRing } from '@/theme/use-focus-ring';

export interface CloseButtonProps {
  readonly onPress: () => void;
}

/**
 * Botão de fechar (X) reutilizável, padrão F38 para todo popup/modal do app.
 * Posiciona-se no canto superior direito do cartão que o envolve.
 */
export function CloseButton({ onPress }: CloseButtonProps): ReactElement {
  const { focusRingStyle, onFocus, onBlur } = useFocusRing();

  return (
    <View style={[styles.ringWrapper, focusRingStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('comum.botaoFechar.rotulo')}
        onFocus={onFocus}
        onBlur={onBlur}
        onPress={onPress}
        style={styles.pressable}
        hitSlop={{ top: spacing.sm, bottom: spacing.sm, left: spacing.sm, right: spacing.sm }}
      >
        <Ionicons name="close" size={22} color={color.text.secondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  ringWrapper: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    borderRadius: minTouchTarget / 2,
    zIndex: 1,
  },
  pressable: {
    minHeight: minTouchTarget - spacing.md,
    minWidth: minTouchTarget - spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { Ionicons } from '@expo/vector-icons';
import type { ReactElement } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { color, iconSize, minTouchTarget, spacing } from '@/theme/tokens';
import { useFocusRing } from '@/theme/use-focus-ring';

export interface CloseButtonProps {
  /** Nome acessível ("Fechar"); vem da tela, como todo texto de componente base. */
  readonly label: string;
  readonly onPress: () => void;
}

/** Caixa visível do X; a área de toque completa `minTouchTarget` por `hitSlop`. */
export const CLOSE_BUTTON_BOX = minTouchTarget - spacing.md;

/**
 * Botão de fechar (X) reutilizável, padrão F38 para todo popup/modal do app.
 * Posiciona-se no canto superior direito do cartão que o envolve.
 */
export function CloseButton({ label, onPress }: CloseButtonProps): ReactElement {
  const { focusRingStyle, onFocus, onBlur } = useFocusRing();

  return (
    <View style={[styles.ringWrapper, focusRingStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onFocus={onFocus}
        onBlur={onBlur}
        onPress={onPress}
        style={styles.pressable}
        hitSlop={{ top: spacing.sm, bottom: spacing.sm, left: spacing.sm, right: spacing.sm }}
      >
        <Ionicons name="close" size={iconSize.tab} color={color.text.secondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  ringWrapper: {
    position: 'absolute',
    top: spacing.s10,
    right: spacing.s10,
    borderRadius: minTouchTarget / 2,
    zIndex: 1,
  },
  pressable: {
    minHeight: CLOSE_BUTTON_BOX,
    minWidth: CLOSE_BUTTON_BOX,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

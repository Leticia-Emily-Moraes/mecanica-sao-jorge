import { Ionicons } from '@expo/vector-icons';
import type { ReactElement } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { color, iconSize, minTouchTarget, radius, spacing } from '@/theme/tokens';
import { useFocusRing } from '@/theme/use-focus-ring';

export interface PasswordVisibilityToggleProps {
  readonly visible: boolean;
  /** Nome acessível com a senha oculta ("Mostrar senha"). */
  readonly showLabel: string;
  /** Nome acessível com a senha visível ("Ocultar senha"). */
  readonly hideLabel: string;
  readonly onToggle: () => void;
  readonly disabled?: boolean;
}

/**
 * Ícone de olho reutilizável para qualquer campo de senha do app (padrão
 * F38): olho fechado quando oculta, olho aberto quando visível, com nome
 * acessível acompanhando o estado. Não reimplementar este controle em
 * telas futuras (cadastro, troca de senha etc.): reusar este componente.
 */
export function PasswordVisibilityToggle({
  visible,
  showLabel,
  hideLabel,
  onToggle,
  disabled = false,
}: PasswordVisibilityToggleProps): ReactElement {
  const { focusRingStyle, onFocus, onBlur } = useFocusRing();
  const accessibilityLabel = visible ? hideLabel : showLabel;

  return (
    <View style={[styles.ringWrapper, focusRingStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        onPress={onToggle}
        hitSlop={TOUCH_SLOP}
        style={styles.pressable}
      >
        <Ionicons
          name={visible ? 'eye-outline' : 'eye-off-outline'}
          size={ICON_SIZE}
          color={color.text.secondary}
        />
      </Pressable>
    </View>
  );
}

const ICON_SIZE = iconSize.tab;

/**
 * O olho cabe no campo sem esticá-lo; a área de toque chega a `minTouchTarget`
 * por `hitSlop` (ADR-014, regra 15), como no `InlineActionButton`.
 */
const SLOP = Math.max(0, (minTouchTarget - ICON_SIZE - 2 * spacing.xs) / 2);
const TOUCH_SLOP = { top: SLOP, bottom: SLOP, left: SLOP, right: SLOP };

const styles = StyleSheet.create({
  ringWrapper: {
    borderRadius: radius.sm,
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
});

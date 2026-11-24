import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useFocusRing } from '@/theme/use-focus-ring';

import { styles, TOUCH_SLOP } from './inline-action-button.styles';

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

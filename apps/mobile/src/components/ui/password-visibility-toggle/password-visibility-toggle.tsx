import { Ionicons } from '@expo/vector-icons';
import type { ReactElement } from 'react';
import { Pressable, View } from 'react-native';

import { useFocusRing } from '@/theme/use-focus-ring';

import { styles, TOUCH_SLOP, visual } from './password-visibility-toggle.styles';

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
          size={visual.iconSize}
          color={visual.iconColor}
        />
      </Pressable>
    </View>
  );
}

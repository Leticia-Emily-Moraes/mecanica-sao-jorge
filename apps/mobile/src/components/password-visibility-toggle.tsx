import { Ionicons } from '@expo/vector-icons';
import type { ReactElement } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { t } from '@/i18n/strings';
import { color, minTouchTarget } from '@/theme/tokens';
import { useFocusRing } from '@/theme/use-focus-ring';

export interface PasswordVisibilityToggleProps {
  readonly visible: boolean;
  readonly onToggle: () => void;
  readonly disabled?: boolean;
}

/**
 * Ícone de olho reutilizável para qualquer campo de senha do app (padrão
 * F38): olho fechado quando oculta, olho aberto quando visível, com nome
 * acessível acompanhando o estado. Não reimplementar este controle em
 * telas futuras (cadastro, troca de senha etc.) — reusar este componente.
 */
export function PasswordVisibilityToggle({
  visible,
  onToggle,
  disabled = false,
}: PasswordVisibilityToggleProps): ReactElement {
  const { focusRingStyle, onFocus, onBlur } = useFocusRing();
  const accessibilityLabel = visible
    ? t('comum.campoSenha.ocultarSenha')
    : t('comum.campoSenha.mostrarSenha');

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
        style={styles.pressable}
      >
        <Ionicons
          name={visible ? 'eye-outline' : 'eye-off-outline'}
          size={22}
          color={color.text.secondary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  ringWrapper: {
    borderRadius: minTouchTarget / 2,
  },
  pressable: {
    minHeight: minTouchTarget,
    minWidth: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactElement } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { color, iconSize, minTouchTarget, radius } from '@/theme/tokens';
import { useFocusRing } from '@/theme/use-focus-ring';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export interface IconButtonProps {
  readonly icon: IconName;
  /** Nome acessível: o ícone sozinho não diz nada ao leitor de tela. */
  readonly accessibilityLabel: string;
  readonly onPress: () => void;
  readonly disabled?: boolean;
}

/**
 * Ação só com ícone dentro de outro controle (ex.: mostrar/ocultar senha no
 * campo). Sem fundo, com alvo de toque mínimo e anel de foco.
 */
export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  disabled = false,
}: IconButtonProps): ReactElement {
  const { focusRingStyle, onFocus, onBlur } = useFocusRing();

  return (
    <View style={[styles.ringWrapper, focusRingStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        onPress={onPress}
        style={styles.button}
      >
        <Ionicons name={icon} size={iconSize.action} color={color.text.secondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  ringWrapper: {
    borderRadius: radius.sm,
  },
  button: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

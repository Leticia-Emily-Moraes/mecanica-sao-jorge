import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactElement } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { color, iconSize, minTouchTarget, radius, size } from '@/theme/tokens';

export type HeaderIconName = ComponentProps<typeof Ionicons>['name'];

export interface HeaderIconButtonProps {
  readonly icon: HeaderIconName;
  /** Nome acessível: o botão só tem ícone, então o rótulo é obrigatório. */
  readonly accessibilityLabel: string;
  readonly onPress: () => void;
}

/**
 * Botão de ícone do cabeçalho petro (seta de voltar e botão de usuário): 36 × 36
 * visíveis, com área de toque de pelo menos 48 por `hitSlop` (ADR-014, regra 15).
 */
export function HeaderIconButton({
  icon,
  accessibilityLabel,
  onPress,
}: HeaderIconButtonProps): ReactElement {
  const slop = (minTouchTarget - size.iconButton) / 2;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={{ top: slop, bottom: slop, left: slop, right: slop }}
      onPress={onPress}
      style={styles.button}
    >
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Ionicons name={icon} size={iconSize.appBar} color={color.text.onBrand} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: size.iconButton,
    height: size.iconButton,
    borderRadius: radius.sm,
    backgroundColor: color.surface.onBrandControl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

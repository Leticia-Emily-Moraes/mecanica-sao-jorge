import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactElement } from 'react';
import { Pressable, View } from 'react-native';

import { useFocusRing } from '@/theme/use-focus-ring';

import { styles, visual } from './header-icon-button.styles';

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
  const { focusRingStyle, onFocus, onBlur } = useFocusRing({ onBrand: true });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={visual.hitSlop}
      onPress={onPress}
      onFocus={onFocus}
      onBlur={onBlur}
      style={[focusRingStyle, styles.button]}
    >
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Ionicons name={icon} size={visual.iconSize} color={visual.iconColor} />
      </View>
    </Pressable>
  );
}

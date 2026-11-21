import { Ionicons } from '@expo/vector-icons';
import type { ReactElement } from 'react';
import { View } from 'react-native';

import { visual } from './alert-icon.styles';

export interface AlertIconProps {
  readonly size: number;
}

/**
 * Triângulo de alerta cheio dos frames do Figma (29:60 e popups de erro),
 * na cor de erro. Decorativo: o texto ao lado carrega o significado, então o
 * ícone fica fora da árvore de acessibilidade.
 */
export function AlertIcon({ size }: AlertIconProps): ReactElement {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Ionicons name="warning" size={size} color={visual.iconColor} />
    </View>
  );
}

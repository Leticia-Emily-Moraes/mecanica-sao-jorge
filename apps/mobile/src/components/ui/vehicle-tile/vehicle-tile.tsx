import { Ionicons } from '@expo/vector-icons';
import type { ReactElement } from 'react';
import { View } from 'react-native';

import { styles, visual } from './vehicle-tile.styles';

/** Quadrado de 40 com o ícone de carro, no lugar do avatar nas linhas de veículo. Decorativo. */
export function VehicleTile(): ReactElement {
  return (
    <View
      testID="vehicle-tile"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.tile}
    >
      <Ionicons name="car-outline" size={visual.iconSize} color={visual.iconColor} />
    </View>
  );
}

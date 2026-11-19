import { Ionicons } from '@expo/vector-icons';
import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { color, iconSize, radius, size } from '@/theme/tokens';

/** Quadrado de 40 com o ícone de carro, no lugar do avatar nas linhas de veículo. Decorativo. */
export function VehicleTile(): ReactElement {
  return (
    <View
      testID="vehicle-tile"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.tile}
    >
      <Ionicons name="car-outline" size={iconSize.row} color={color.text.onBrand} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: size.avatarSmall,
    height: size.avatarSmall,
    borderRadius: radius.sm,
    backgroundColor: color.surface.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import { styles } from './avatar.styles';

export interface AvatarProps {
  readonly initials: string;
}

/**
 * Círculo de 84 com as iniciais. Decorativo: o nome completo já vem em texto
 * logo abaixo, então o leitor de tela pula o avatar.
 */
export function Avatar({ initials }: AvatarProps): ReactElement {
  return (
    <View
      testID="avatar"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.circle}
    >
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
}

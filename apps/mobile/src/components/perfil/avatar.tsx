import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { color, radius, size, typography } from '@/theme/tokens';

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

const styles = StyleSheet.create({
  circle: {
    width: size.avatar,
    height: size.avatar,
    borderRadius: radius.avatar,
    backgroundColor: color.surface.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: typography.avatarInitials.fontFamily,
    fontSize: typography.avatarInitials.fontSize,
    color: color.text.onBrand,
  },
});

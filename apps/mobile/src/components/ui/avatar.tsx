import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { color, radius, size, typography } from '@/theme/tokens';

export interface AvatarProps {
  readonly initials: string;
  /** `regular` (84) no Perfil e no cartão do detalhe; `small` (40) nas listas. */
  readonly variant?: 'regular' | 'small';
}

/**
 * Círculo com as iniciais (84 ou 40). Decorativo: o nome completo já vem em
 * texto ao lado, então o leitor de tela pula o avatar.
 */
export function Avatar({ initials, variant = 'regular' }: AvatarProps): ReactElement {
  const small = variant === 'small';

  return (
    <View
      testID="avatar"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.circle, small ? styles.circleSmall : styles.circleRegular]}
    >
      <Text style={small ? styles.initialsSmall : styles.initials}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: color.surface.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleRegular: {
    width: size.avatar,
    height: size.avatar,
    borderRadius: radius.avatar,
  },
  circleSmall: {
    width: size.avatarSmall,
    height: size.avatarSmall,
    borderRadius: radius.avatarSmall,
  },
  initials: {
    fontFamily: typography.avatarInitials.fontFamily,
    fontSize: typography.avatarInitials.fontSize,
    color: color.text.onBrand,
  },
  initialsSmall: {
    fontFamily: typography.avatarInitialsSmall.fontFamily,
    fontSize: typography.avatarInitialsSmall.fontSize,
    color: color.text.onBrand,
  },
});

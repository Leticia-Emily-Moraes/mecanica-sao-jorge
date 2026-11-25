import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import { styles } from './avatar.styles';

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

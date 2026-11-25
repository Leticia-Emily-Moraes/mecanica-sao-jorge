import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import { AccessProfileBadge } from '@/components/perfil/access-profile-badge';
import { Avatar } from '@/components/ui/avatar';

import { styles } from './profile-identity.styles';

export interface ProfileIdentityProps {
  readonly initials: string;
  readonly name: string;
  readonly badge: string;
}

/**
 * Bloco de identidade do Perfil (frame `10:3842`): avatar com iniciais, nome
 * como cabeçalho e selo do perfil de acesso, centralizados.
 */
export function ProfileIdentity({ initials, name, badge }: ProfileIdentityProps): ReactElement {
  return (
    <View style={styles.identity}>
      <Avatar initials={initials} />
      <Text accessibilityRole="header" style={styles.name}>
        {name}
      </Text>
      <AccessProfileBadge label={badge} />
    </View>
  );
}

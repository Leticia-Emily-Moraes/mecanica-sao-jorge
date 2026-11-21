import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import { AccessProfileBadge } from '@/components/perfil/access-profile-badge';
import { Avatar } from '@/components/perfil/avatar';

import { styles } from './profile-summary.styles';

export interface ProfileSummaryProps {
  readonly name: string;
  readonly email: string;
  readonly accessProfile: string;
  /** Leitura única do bloco ("Nome: …, E-mail: …"): os rótulos não aparecem na vista. */
  readonly accessibilityLabel: string;
}

/**
 * Bloco de identidade do Perfil (Figma 33:36–33:42): avatar com iniciais ao
 * lado de nome, e-mail e selo do perfil de acesso, com um divisor embaixo.
 * Somente leitura, sem foco interativo.
 */
export function ProfileSummary({
  name,
  email,
  accessProfile,
  accessibilityLabel,
}: ProfileSummaryProps): ReactElement {
  return (
    <View style={styles.container}>
      <View accessible accessibilityLabel={accessibilityLabel} style={styles.row}>
        <Avatar name={name} />
        <View style={styles.details}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <AccessProfileBadge label={accessProfile} />
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
}

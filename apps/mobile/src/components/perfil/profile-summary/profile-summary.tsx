import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AccessProfileBadge } from '@/components/perfil/access-profile-badge';
import { Avatar } from '@/components/perfil/avatar';
import { borderWidth, color, spacing, typography } from '@/theme/tokens';

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

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg + spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  details: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    fontSize: typography.heading.fontSize,
    fontWeight: typography.heading.fontWeight,
    color: color.text.primary,
  },
  email: {
    fontSize: typography.subtitle.fontSize,
    color: color.text.secondary,
  },
  divider: {
    height: borderWidth.hairline,
    backgroundColor: color.border.divider,
  },
});

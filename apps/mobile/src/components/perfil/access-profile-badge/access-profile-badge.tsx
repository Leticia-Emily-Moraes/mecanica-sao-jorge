import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { color, radius, spacing, typography } from '@/theme/tokens';

export interface AccessProfileBadgeProps {
  readonly label: string;
}

/**
 * Selo do perfil de acesso (ADMIN, FUNCIONÁRIO): pílula petro com texto
 * branco, centralizada sob o nome. Não é o badge de status que chega com a
 * primeira lista (F35): se aquele nascer genérico, este deve ser trocado por ele.
 */
export function AccessProfileBadge({ label }: AccessProfileBadgeProps): ReactElement {
  return (
    <View testID="access-profile-badge" style={styles.badge}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'center',
    backgroundColor: color.surface.brand,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.s12,
    paddingVertical: spacing.xs,
  },
  label: {
    fontFamily: typography.badge.fontFamily,
    fontSize: typography.badge.fontSize,
    color: color.text.onBrand,
  },
});

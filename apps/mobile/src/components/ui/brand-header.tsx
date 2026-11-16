import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { color, spacing, typography } from '@/theme/tokens';

export interface BrandHeaderProps {
  readonly title: string;
  readonly subtitle: string;
}

/**
 * Bloco da marca no Login: título em caixa alta e subtítulo, centralizados.
 * O escudo da marca (84 × 96) ainda não entra: o ativo está bloqueado pela
 * dúvida D2 (licença) do ADR-014, regra 7(b), sem substituto improvisado.
 */
export function BrandHeader({ title, subtitle }: BrandHeaderProps): ReactElement {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.s10,
    marginBottom: spacing.s14 + spacing.md,
  },
  title: {
    color: color.text.primary,
    fontFamily: typography.brandTitle.fontFamily,
    fontSize: typography.brandTitle.fontSize,
    letterSpacing: typography.brandTitle.letterSpacing,
    textAlign: 'center',
  },
  subtitle: {
    color: color.text.secondary,
    fontFamily: typography.subtitle.fontFamily,
    fontSize: typography.subtitle.fontSize,
    textAlign: 'center',
  },
});

import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { borderWidth, color, radius, shadow, spacing, typography } from '@/theme/tokens';

export interface InfoRow {
  readonly label: string;
  readonly value: string;
}

export interface InfoCardProps {
  readonly rows: readonly InfoRow[];
}

/**
 * Cartão de leitura do Perfil: linhas com rótulo (Flint) à esquerda e valor
 * (petro) à direita. Cada linha é lida de uma vez ("Usuário: joao.silva").
 */
export function InfoCard({ rows }: InfoCardProps): ReactElement {
  return (
    <View style={styles.card}>
      {rows.map((row) => (
        <View
          key={row.label}
          accessible
          accessibilityLabel={`${row.label}: ${row.value}`}
          style={styles.row}
        >
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface.default,
    borderWidth: borderWidth.hairline,
    borderColor: color.border.divider,
    borderRadius: radius.sm,
    padding: spacing.md - borderWidth.hairline,
    gap: spacing.s10,
    ...shadow.card,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  label: {
    fontFamily: typography.rowLabel.fontFamily,
    fontSize: typography.rowLabel.fontSize,
    color: color.text.secondary,
  },
  value: {
    flexShrink: 1,
    fontFamily: typography.rowValue.fontFamily,
    fontSize: typography.rowValue.fontSize,
    color: color.text.primary,
    textAlign: 'right',
  },
});

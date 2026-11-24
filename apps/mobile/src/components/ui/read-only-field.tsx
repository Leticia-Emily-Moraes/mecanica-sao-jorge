import type { ReactElement, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { color, spacing, typography } from '@/theme/tokens';

export interface ReadOnlyFieldProps {
  readonly label: string;
  readonly value?: string;
  /** Substitui o texto do valor (ex.: selo). */
  readonly children?: ReactNode;
}

/** Par rótulo-valor de leitura: o equivalente de exibição do `TextField`. */
export function ReadOnlyField({ label, value, children }: ReadOnlyFieldProps): ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {children ?? <Text style={styles.value}>{value}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: typography.label.fontFamily,
    fontSize: typography.label.fontSize,
    color: color.text.secondary,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.body.fontSize,
    color: color.text.primary,
  },
});

import { StyleSheet } from 'react-native';

import { color, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: color.text.secondary,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.body.fontSize,
    color: color.text.primary,
  },
});

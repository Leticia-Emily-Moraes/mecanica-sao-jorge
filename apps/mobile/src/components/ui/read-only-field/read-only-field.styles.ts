import { StyleSheet } from 'react-native';

import { color, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
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

import { StyleSheet } from 'react-native';

import { borderWidth, color, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
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
    fontFamily: typography.label.fontFamily,
    fontSize: typography.body.fontSize,
    color: color.text.primary,
  },
  email: {
    fontFamily: typography.subtitle.fontFamily,
    fontSize: typography.subtitle.fontSize,
    color: color.text.secondary,
  },
  divider: {
    height: borderWidth.hairline,
    backgroundColor: color.border.divider,
  },
});

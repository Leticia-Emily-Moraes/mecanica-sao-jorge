import { StyleSheet } from 'react-native';

import { borderWidth, color, radius, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
    padding: spacing.md,
    borderWidth: borderWidth.hairline,
    borderColor: color.border.divider,
    borderRadius: radius.sm,
    backgroundColor: color.surface.default,
  },
  title: {
    fontFamily: typography.cardTitle.fontFamily,
    fontSize: typography.cardTitle.fontSize,
    color: color.text.primary,
  },
  message: {
    fontFamily: typography.subtitle.fontFamily,
    fontSize: typography.subtitle.fontSize,
    color: color.text.secondary,
  },
});

import { StyleSheet } from 'react-native';

import { borderWidth, color, radius, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  section: {
    gap: spacing.s12,
  },
  card: {
    gap: spacing.xs,
    padding: spacing.s12,
    backgroundColor: color.surface.default,
    borderWidth: borderWidth.hairline,
    borderColor: color.border.divider,
    borderRadius: radius.sm,
  },
  title: {
    fontFamily: typography.cardTitle.fontFamily,
    fontSize: typography.cardTitle.fontSize,
    color: color.text.primary,
  },
  value: {
    fontFamily: typography.subtitle.fontFamily,
    fontSize: typography.subtitle.fontSize,
    color: color.text.secondary,
  },
});

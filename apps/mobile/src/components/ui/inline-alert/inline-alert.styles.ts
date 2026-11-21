import { StyleSheet } from 'react-native';

import { borderWidth, color, layout, radius, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: color.surface.errorTint,
    borderWidth: borderWidth.field,
    borderColor: color.text.error,
    borderRadius: radius.sm,
    minHeight: layout.inlineAlertMinHeight,
    paddingVertical: spacing.sm + spacing.xs,
    paddingHorizontal: spacing.md - spacing.xs,
    marginBottom: spacing.md,
  },
  message: {
    flex: 1,
    fontSize: typography.labelSmall.fontSize,
    fontWeight: typography.labelSmall.fontWeight,
    color: color.text.error,
  },
});

export const visual = {
  alertIconSize: typography.labelSmall.fontSize,
} as const;

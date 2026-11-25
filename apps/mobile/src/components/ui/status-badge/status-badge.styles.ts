import { StyleSheet } from 'react-native';

import { borderWidth, color, radius, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.s10,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: borderWidth.hairline,
  },
  label: {
    fontFamily: typography.badge.fontFamily,
    fontSize: typography.badge.fontSize,
  },
  labelFilled: {
    color: color.text.onBrand,
  },
  labelNeutral: {
    color: color.text.primary,
  },
});

export const toneStyle = StyleSheet.create({
  inProgress: {
    backgroundColor: color.status.inProgress,
    borderColor: color.status.inProgress,
  },
  success: {
    backgroundColor: color.feedback.success,
    borderColor: color.feedback.success,
  },
  neutral: {
    backgroundColor: color.surface.default,
    borderColor: color.border.default,
  },
});

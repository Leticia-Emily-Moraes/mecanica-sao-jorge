import { StyleSheet } from 'react-native';

import { borderWidth, color, radius, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.s10,
    padding: spacing.s12 + borderWidth.hairline,
    borderWidth: borderWidth.hairline,
    borderColor: color.border.errorBanner,
    borderRadius: radius.sm,
    backgroundColor: color.surface.errorTint,
    marginBottom: spacing.md,
  },
  message: {
    flex: 1,
    color: color.text.errorOnBanner,
    fontFamily: typography.banner.fontFamily,
    fontSize: typography.banner.fontSize,
    lineHeight: typography.banner.lineHeight,
  },
});

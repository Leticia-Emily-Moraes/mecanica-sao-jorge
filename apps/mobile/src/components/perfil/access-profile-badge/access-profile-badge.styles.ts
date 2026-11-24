import { StyleSheet } from 'react-native';

import { color, radius, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  badge: {
    alignSelf: 'center',
    backgroundColor: color.surface.brand,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.s12,
    paddingVertical: spacing.xs,
  },
  label: {
    fontFamily: typography.badge.fontFamily,
    fontSize: typography.badge.fontSize,
    color: color.text.onBrand,
  },
});

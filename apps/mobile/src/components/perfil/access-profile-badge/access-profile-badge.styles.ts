import { StyleSheet } from 'react-native';

import { color, radius, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: color.surface.brand,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: typography.micro.fontSize,
    fontWeight: typography.micro.fontWeight,
    color: color.text.onBrand,
  },
});

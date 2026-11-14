import { StyleSheet, type ViewStyle } from 'react-native';

import { color, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  band: {
    backgroundColor: color.surface.brand,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: typography.header.fontSize,
    fontWeight: typography.header.fontWeight,
    color: color.text.onBrand,
  },
  subtitle: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: typography.subtitle.fontWeight,
    color: color.text.onBrand,
    marginTop: spacing.xs,
  },
});

export function topInset(top: number): ViewStyle {
  return { paddingTop: top };
}

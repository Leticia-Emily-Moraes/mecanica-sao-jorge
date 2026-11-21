import { StyleSheet, type ViewStyle } from 'react-native';

import { color, spacing } from '@/theme/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.surface.default,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
});

export type TopSpacing = 'default' | 'form';

export function topSpacingStyle(variant: TopSpacing): ViewStyle {
  return { paddingTop: variant === 'form' ? spacing.formTop : spacing.lg };
}

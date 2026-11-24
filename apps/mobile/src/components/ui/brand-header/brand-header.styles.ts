import { StyleSheet } from 'react-native';

import { color, size, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.s10,
    marginBottom: spacing.s14 + spacing.md,
  },
  shield: {
    width: size.brandShieldWidth,
    height: size.brandShieldHeight,
  },
  title: {
    color: color.text.primary,
    fontFamily: typography.brandTitle.fontFamily,
    fontSize: typography.brandTitle.fontSize,
    letterSpacing: typography.brandTitle.letterSpacing,
    textAlign: 'center',
  },
  subtitle: {
    color: color.text.secondary,
    fontFamily: typography.subtitle.fontFamily,
    fontSize: typography.subtitle.fontSize,
    textAlign: 'center',
  },
});

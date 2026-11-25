import { StyleSheet } from 'react-native';

import { color, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: spacing.sm,
  },
  separator: {
    height: spacing.s12,
  },
  footer: {
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  footerText: {
    fontFamily: typography.label.fontFamily,
    fontSize: typography.label.fontSize,
    color: color.text.secondary,
    textAlign: 'center',
  },
  newAction: {
    paddingVertical: spacing.md,
  },
});

export const visual = {
  spinner: color.text.primary,
} as const;

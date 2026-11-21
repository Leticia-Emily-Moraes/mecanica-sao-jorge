import { StyleSheet } from 'react-native';

import { color, iconSize, layout, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: color.text.primary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  emptyMessage: {
    fontSize: typography.body.fontSize,
    color: color.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  emptyAction: {
    width: '100%',
    maxWidth: layout.dialogMaxWidth,
    marginTop: spacing.lg,
  },
});

export const visual = {
  spinnerColor: color.text.primary,
  emptyIconSize: iconSize.empty,
  emptyIconColor: color.text.secondary,
} as const;

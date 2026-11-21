import { StyleSheet } from 'react-native';

import { color, iconSize, layout, radius, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: color.surface.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: layout.dialogMaxWidth,
    backgroundColor: color.surface.default,
    borderRadius: radius.md,
    padding: spacing.card,
    alignItems: 'center',
  },
  icon: {
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: color.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: typography.subtitle.fontSize,
    color: color.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  actions: {
    width: '100%',
  },
  secondarySpacing: {
    marginTop: spacing.sm,
  },
});

export const visual = {
  alertIconSize: iconSize.alert,
} as const;

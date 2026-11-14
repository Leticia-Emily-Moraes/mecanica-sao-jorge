import { StyleSheet } from 'react-native';

import { color, layout, radius, spacing, typography } from '@/theme/tokens';

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
  },
  title: {
    fontSize: typography.heading.fontSize,
    fontWeight: typography.heading.fontWeight,
    color: color.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: typography.subtitle.fontWeight,
    color: color.text.secondary,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    marginTop: spacing.card,
  },
  actionSpacing: {
    marginBottom: spacing.xs,
  },
});

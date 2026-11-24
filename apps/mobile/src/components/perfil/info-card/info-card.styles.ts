import { StyleSheet } from 'react-native';

import { borderWidth, color, radius, shadow, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface.default,
    borderWidth: borderWidth.hairline,
    borderColor: color.border.divider,
    borderRadius: radius.sm,
    padding: spacing.md - borderWidth.hairline,
    gap: spacing.s10,
    ...shadow.card,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  label: {
    fontFamily: typography.rowLabel.fontFamily,
    fontSize: typography.rowLabel.fontSize,
    color: color.text.secondary,
  },
  value: {
    flexShrink: 1,
    fontFamily: typography.rowValue.fontFamily,
    fontSize: typography.rowValue.fontSize,
    color: color.text.primary,
    textAlign: 'right',
  },
});

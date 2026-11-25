import { StyleSheet } from 'react-native';

import { color, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  privacy: {
    marginBottom: spacing.md,
    color: color.text.secondary,
    fontFamily: typography.subtitle.fontFamily,
    fontSize: typography.subtitle.fontSize,
    lineHeight: typography.dialogMessage.lineHeight,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.s10,
  },
  action: {
    flex: 1,
  },
});

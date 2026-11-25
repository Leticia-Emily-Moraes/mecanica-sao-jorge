import { StyleSheet } from 'react-native';

import { color, fontFamily, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  owner: {
    marginBottom: spacing.s12,
    fontFamily: typography.subtitle.fontFamily,
    fontSize: typography.subtitle.fontSize,
  },
  ownerLabel: {
    color: color.text.secondary,
  },
  ownerName: {
    color: color.text.primary,
    fontFamily: fontFamily.bodySemiBold,
  },
  pair: {
    flexDirection: 'row',
    gap: spacing.s10,
  },
  half: {
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.s10,
  },
  action: {
    flex: 1,
  },
});

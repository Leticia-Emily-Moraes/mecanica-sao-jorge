import { StyleSheet } from 'react-native';

import { color, iconSize, minTouchTarget, size, spacing } from '@/theme/tokens';

export const visual = {
  hitSlop: { top: spacing.sm, bottom: spacing.sm, left: spacing.sm, right: spacing.sm },
  iconSize: iconSize.tab,
  iconColor: color.text.secondary,
} as const;

export const styles = StyleSheet.create({
  ringWrapper: {
    position: 'absolute',
    top: spacing.s10,
    right: spacing.s10,
    borderRadius: minTouchTarget / 2,
    zIndex: 1,
  },
  pressable: {
    minHeight: size.closeButton,
    minWidth: size.closeButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

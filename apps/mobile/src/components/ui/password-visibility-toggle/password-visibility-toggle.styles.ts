import { StyleSheet } from 'react-native';

import { color, iconSize, minTouchTarget, radius, spacing } from '@/theme/tokens';

export const visual = {
  iconSize: iconSize.tab,
  iconColor: color.text.secondary,
} as const;

/**
 * O olho cabe no campo sem esticá-lo; a área de toque chega a `minTouchTarget`
 * por `hitSlop` (ADR-014, regra 15), como no `InlineActionButton`.
 */
const SLOP = Math.max(0, (minTouchTarget - visual.iconSize - 2 * spacing.xs) / 2);
export const TOUCH_SLOP = { top: SLOP, bottom: SLOP, left: SLOP, right: SLOP };

export const styles = StyleSheet.create({
  ringWrapper: {
    borderRadius: radius.sm,
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
});

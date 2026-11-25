import { StyleSheet } from 'react-native';

import { color, minTouchTarget, radius, spacing, typography } from '@/theme/tokens';

/**
 * Visualmente discreto (cabe nos 46 do campo); a área de toque chega a 48 por
 * `hitSlop` (ADR-014, regra 15).
 */
export const TOUCH_SLOP = {
  top: minTouchTarget / 2,
  bottom: minTouchTarget / 2,
  left: spacing.sm,
  right: spacing.sm,
};

export const styles = StyleSheet.create({
  ringWrapper: {
    borderRadius: radius.sm,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  label: {
    fontFamily: typography.fieldLabel.fontFamily,
    fontSize: typography.fieldLabel.fontSize,
    color: color.text.secondary,
  },
});

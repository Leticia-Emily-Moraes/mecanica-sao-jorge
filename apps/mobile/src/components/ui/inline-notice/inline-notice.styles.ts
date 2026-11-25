import { StyleSheet } from 'react-native';

import { color, iconSize, minTouchTarget, radius, size, spacing, typography } from '@/theme/tokens';

/** O botão mede só o ícone: o `hitSlop` completa os dois lados até `minTouchTarget`. */
const DISMISS_SLOP_SIDE = (minTouchTarget - iconSize.appBar) / 2;

export const DISMISS_SLOP = {
  top: DISMISS_SLOP_SIDE,
  bottom: DISMISS_SLOP_SIDE,
  left: DISMISS_SLOP_SIDE,
  right: DISMISS_SLOP_SIDE,
};

export const styles = StyleSheet.create({
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    minHeight: size.notice,
    paddingHorizontal: spacing.s14,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: color.feedback.success,
  },
  message: {
    flex: 1,
    fontFamily: typography.label.fontFamily,
    fontSize: typography.label.fontSize,
    color: color.text.onBrand,
  },
  dismiss: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const visual = {
  iconSize: iconSize.appBar,
  iconColor: color.text.onBrand,
} as const;

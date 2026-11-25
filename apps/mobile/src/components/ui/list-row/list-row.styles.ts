import { StyleSheet } from 'react-native';

import {
  borderWidth,
  color,
  focusRingOffset,
  focusRingRadius,
  focusRingWidth,
  iconSize,
  minTouchTarget,
  opacity,
  radius,
  size,
  spacing,
  typography,
} from '@/theme/tokens';

export const styles = StyleSheet.create({
  ring: {
    borderRadius: focusRingRadius,
    margin: -(focusRingWidth + focusRingOffset),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    minHeight: Math.max(size.listRow, minTouchTarget),
    paddingHorizontal: spacing.s12,
    paddingVertical: spacing.s10,
    backgroundColor: color.surface.default,
    borderWidth: borderWidth.hairline,
    borderColor: color.border.divider,
    borderRadius: radius.sm,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  leading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontFamily: typography.cardTitle.fontFamily,
    fontSize: typography.cardTitle.fontSize,
    color: color.text.primary,
  },
  subtitle: {
    fontFamily: typography.subtitle.fontFamily,
    fontSize: typography.subtitle.fontSize,
    color: color.text.secondary,
  },
});

export const visual = {
  chevronSize: iconSize.chevron,
  chevronColor: color.text.secondary,
} as const;

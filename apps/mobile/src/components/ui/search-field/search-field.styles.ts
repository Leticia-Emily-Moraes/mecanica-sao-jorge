import { StyleSheet } from 'react-native';

import {
  borderWidth,
  color,
  iconSize,
  minTouchTarget,
  radius,
  size,
  spacing,
  typography,
} from '@/theme/tokens';

export const CLEAR_SLOP = {
  top: (minTouchTarget - size.field) / 2,
  bottom: (minTouchTarget - size.field) / 2,
  left: spacing.sm,
  right: spacing.sm,
};

export const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: size.field,
    borderRadius: radius.sm,
    backgroundColor: color.surface.default,
  },
  boxIdle: {
    borderWidth: borderWidth.hairline,
    borderColor: color.border.default,
    paddingHorizontal: spacing.s14 + borderWidth.field - borderWidth.hairline,
  },
  boxFocused: {
    borderWidth: borderWidth.field,
    borderColor: color.border.focusField,
    paddingHorizontal: spacing.s14,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    fontFamily: typography.input.fontFamily,
    fontSize: typography.input.fontSize,
    color: color.text.primary,
  },
  clear: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const visual = {
  iconSize: iconSize.search,
  iconColor: color.text.secondary,
  placeholder: color.text.placeholder,
} as const;

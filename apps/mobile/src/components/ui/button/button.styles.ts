import { StyleSheet } from 'react-native';

import {
  borderWidth,
  color,
  focusRingRadius,
  layout,
  minTouchTarget,
  opacity,
  radius,
  spacing,
  typography,
} from '@/theme/tokens';

export const styles = StyleSheet.create({
  ringWrapper: {
    borderRadius: focusRingRadius,
  },
  button: {
    minHeight: minTouchTarget,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  page: {
    minHeight: layout.pageButtonHeight,
  },
  primary: {
    backgroundColor: color.action.primaryBackground,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: borderWidth.emphasis,
    borderColor: color.border.default,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  disabled: {
    opacity: opacity.disabled,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
  },
  labelPrimary: {
    color: color.text.onPrimaryAction,
  },
  labelSecondary: {
    color: color.text.primary,
  },
});

export const visual = {
  spinnerOnPrimary: color.text.onPrimaryAction,
  spinnerOnSecondary: color.text.primary,
} as const;

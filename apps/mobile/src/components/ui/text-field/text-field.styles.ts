import { StyleSheet } from 'react-native';

import {
  borderWidth,
  color,
  minTouchTarget,
  radius,
  size,
  spacing,
  typography,
} from '@/theme/tokens';

const FIELD_PADDING = spacing.s14;

/** Completa a área de toque até `minTouchTarget` sem mudar a altura visível de 46 (ADR-014, regra 15). */
export const TOUCH_SLOP = {
  top: (minTouchTarget - size.field) / 2,
  bottom: (minTouchTarget - size.field) / 2,
};

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: typography.fieldLabel.fontFamily,
    fontSize: typography.fieldLabel.fontSize,
    color: color.text.secondary,
    marginBottom: spacing.s6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: size.field,
    borderRadius: radius.sm,
    backgroundColor: color.surface.default,
  },
  // 1 px em repouso, 2 px com foco ou erro: o padding compensa a diferença
  // de borda e o conteúdo não se mexe.
  inputRowIdle: {
    borderWidth: borderWidth.hairline,
    borderColor: color.border.default,
    paddingHorizontal: FIELD_PADDING + borderWidth.field - borderWidth.hairline,
  },
  inputRowHighlighted: {
    borderWidth: borderWidth.field,
    borderColor: color.border.focusField,
    paddingHorizontal: FIELD_PADDING,
  },
  inputRowDisabled: {
    backgroundColor: color.surface.skeleton,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    fontFamily: typography.input.fontFamily,
    fontSize: typography.input.fontSize,
    color: color.text.primary,
  },
  error: {
    marginTop: spacing.xs,
    fontFamily: typography.caption.fontFamily,
    fontSize: typography.caption.fontSize,
    color: color.text.error,
  },
});

export const visual = {
  placeholder: color.text.placeholder,
} as const;

import { StyleSheet } from 'react-native';

import {
  borderWidth,
  color,
  focusRingRadius,
  minTouchTarget,
  radius,
  spacing,
  typography,
} from '@/theme/tokens';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.field,
  },
  label: {
    fontSize: typography.labelSmall.fontSize,
    fontWeight: typography.labelSmall.fontWeight,
    color: color.text.secondary,
    marginBottom: spacing.xs,
    // O halo do anel de foco (4 pt) passa de 4 pt do campo: o rótulo fica por cima, sem corte.
    zIndex: 1,
  },
  ringWrapper: {
    borderRadius: focusRingRadius,
  },
  // Altura externa de 48 com a borda dentro (Figma 29:7); o Yoga conta a borda na altura.
  inputRow: {
    minHeight: minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: borderWidth.field,
    borderColor: color.border.default,
    borderRadius: radius.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    backgroundColor: color.surface.default,
  },
  inputRowError: {
    borderWidth: borderWidth.emphasis,
    borderColor: color.text.error,
  },
  inputRowDisabled: {
    backgroundColor: color.surface.skeleton,
    borderColor: color.border.skeleton,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    fontSize: typography.field.fontSize,
    color: color.text.secondary,
  },
  // Ação de 48 dentro do campo de 48: a margem negativa tira as duas bordas da conta
  // e o alvo de toque continua inteiro (a borda é transparente ao toque).
  accessory: {
    marginVertical: -borderWidth.emphasis,
  },
  error: {
    marginTop: spacing.xs,
    fontSize: typography.caption.fontSize,
    color: color.text.error,
  },
});

export const visual = {
  placeholderColor: color.text.placeholder,
} as const;

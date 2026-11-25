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

/**
 * Folga que completa a área de toque até `minTouchTarget` (ADR-014, regra 15).
 * Com o botão de 50 já acima de 48 a folga é zero, nunca negativa.
 */
const TOUCH_SLOP_Y = Math.max(0, (minTouchTarget - size.button) / 2);

export const TOUCH_SLOP = { top: TOUCH_SLOP_Y, bottom: TOUCH_SLOP_Y };

export const styles = StyleSheet.create({
  // A moldura do anel de foco (borda + respiro) é reservada em volta do botão;
  // a margem negativa a devolve para fora do layout, então o botão visível mede
  // a largura e a altura do frame e o anel só aparece sobre o espaço vizinho.
  ringWrapper: {
    borderRadius: focusRingRadius,
    margin: -(focusRingWidth + focusRingOffset),
  },
  button: {
    height: size.button,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: color.action.primaryBackground,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: borderWidth.hairline,
    borderColor: color.text.primary,
  },
  outlineAccent: {
    backgroundColor: 'transparent',
    borderWidth: borderWidth.hairline,
    borderColor: color.border.divider,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  disabled: {
    opacity: opacity.disabled,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s6,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s6,
  },
  // Caixa de 16 do indicador (L2 `82:2137`); o indicador do sistema se centra nela.
  loadingSlot: {
    width: size.loadingIndicator,
    height: size.loadingIndicator,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: typography.button.fontFamily,
    fontSize: typography.button.fontSize,
  },
  labelPrimary: {
    color: color.text.onPrimaryAction,
  },
  labelSecondary: {
    color: color.text.primary,
  },
  labelOutlineAccent: {
    color: color.text.error,
  },
});

export const variantStyle = {
  primary: styles.primary,
  secondary: styles.secondary,
  outlineAccent: styles.outlineAccent,
} as const;

export const iconColorByVariant = {
  primary: color.text.onPrimaryAction,
  secondary: color.text.primary,
  outlineAccent: color.text.error,
} as const;

export const labelColorByVariant = {
  primary: styles.labelPrimary,
  secondary: styles.labelSecondary,
  outlineAccent: styles.labelOutlineAccent,
} as const;

export const visual = {
  spinnerOnPrimary: color.text.onPrimaryAction,
  spinnerOnOther: color.text.primary,
  iconSize: iconSize.button,
} as const;

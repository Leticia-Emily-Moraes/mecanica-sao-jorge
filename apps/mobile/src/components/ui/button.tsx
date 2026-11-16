import type { ReactElement } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  borderWidth,
  color,
  focusRingRadius,
  minTouchTarget,
  opacity,
  radius,
  size,
  spacing,
  typography,
} from '@/theme/tokens';
import { useFocusRing } from '@/theme/use-focus-ring';

/**
 * `primary`: ação principal (Crail). `secondary`: contorno petro (Cancelar).
 * `outlineAccent`: contorno Westar com texto Crail ("Sair da conta").
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outlineAccent';

export interface ButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly variant?: ButtonVariant;
  readonly loading?: boolean;
  readonly loadingLabel?: string;
  readonly disabled?: boolean;
  readonly accessibilityLabel?: string;
}

/**
 * Folga que completa a área de toque até `minTouchTarget` (ADR-014, regra 15).
 * Com o botão de 50 já acima de 48 a folga é zero, nunca negativa.
 */
const TOUCH_SLOP_Y = Math.max(0, (minTouchTarget - size.button) / 2);
const TOUCH_SLOP = { top: TOUCH_SLOP_Y, bottom: TOUCH_SLOP_Y };

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  loadingLabel,
  disabled = false,
  accessibilityLabel,
}: ButtonProps): ReactElement {
  const { focusRingStyle, onFocus, onBlur } = useFocusRing();
  const isDisabled = disabled || loading;
  const labelStyle = [styles.label, labelColorByVariant[variant]];

  return (
    <View style={[styles.ringWrapper, focusRingStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        hitSlop={TOUCH_SLOP}
        onFocus={onFocus}
        onBlur={onBlur}
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          variantStyle[variant],
          isDisabled && styles.disabled,
          pressed && !isDisabled && styles.pressed,
        ]}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator
              color={variant === 'primary' ? color.text.onPrimaryAction : color.text.primary}
            />
            <Text style={labelStyle}>{loadingLabel ?? label}</Text>
          </View>
        ) : (
          <Text style={labelStyle}>{label}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  ringWrapper: {
    borderRadius: focusRingRadius,
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
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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

const variantStyle = {
  primary: styles.primary,
  secondary: styles.secondary,
  outlineAccent: styles.outlineAccent,
} as const;

const labelColorByVariant = {
  primary: styles.labelPrimary,
  secondary: styles.labelSecondary,
  outlineAccent: styles.labelOutlineAccent,
} as const;

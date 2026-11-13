import type { ReactElement } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

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
import { useFocusRing } from '@/theme/use-focus-ring';

export type ButtonVariant = 'primary' | 'secondary';

/** `page`: ação principal da tela (52, Figma 29:16); `default`: demais usos (48). */
export type ButtonSize = 'default' | 'page';

export interface ButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly loading?: boolean;
  readonly loadingLabel?: string;
  readonly disabled?: boolean;
  readonly accessibilityLabel?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'default',
  loading = false,
  loadingLabel,
  disabled = false,
  accessibilityLabel,
}: ButtonProps): ReactElement {
  const { focusRingStyle, onFocus, onBlur } = useFocusRing();
  const isDisabled = disabled || loading;

  return (
    <View style={[styles.ringWrapper, focusRingStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        onFocus={onFocus}
        onBlur={onBlur}
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          size === 'page' && styles.page,
          variant === 'primary' ? styles.primary : styles.secondary,
          // Carregando mantém a cor cheia (Figma 29:20): a 50 % o rótulo cairia a 2,18:1.
          disabled && !loading && styles.disabled,
          pressed && !isDisabled && styles.pressed,
        ]}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator
              color={variant === 'primary' ? color.text.onPrimaryAction : color.text.primary}
            />
            <Text
              style={[
                styles.label,
                variant === 'primary' ? styles.labelPrimary : styles.labelSecondary,
              ]}
            >
              {loadingLabel ?? label}
            </Text>
          </View>
        ) : (
          <Text
            style={[
              styles.label,
              variant === 'primary' ? styles.labelPrimary : styles.labelSecondary,
            ]}
          >
            {label}
          </Text>
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

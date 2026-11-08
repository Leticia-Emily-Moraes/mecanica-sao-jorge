import type { ReactElement } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { color, minTouchTarget, radius, spacing, typography } from '@/theme/tokens';
import { useFocusRing } from '@/theme/use-focus-ring';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly variant?: ButtonVariant;
  readonly loading?: boolean;
  readonly loadingLabel?: string;
  readonly disabled?: boolean;
  readonly accessibilityLabel?: string;
}

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
          variant === 'primary' ? styles.primary : styles.secondary,
          isDisabled && styles.disabled,
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
    borderRadius: radius.md + 4,
  },
  button: {
    minHeight: minTouchTarget,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: color.action.primaryBackground,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: color.border.default,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
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

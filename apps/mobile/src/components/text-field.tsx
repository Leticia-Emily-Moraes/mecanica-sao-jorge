import { forwardRef, type ReactElement, type ReactNode } from 'react';
import type { KeyboardTypeOptions, TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { color, radius, spacing, typography } from '@/theme/tokens';
import { useFocusRing } from '@/theme/use-focus-ring';

export interface TextFieldProps {
  readonly label: string;
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  readonly errorMessage?: string;
  readonly secureTextEntry?: boolean;
  readonly editable?: boolean;
  readonly keyboardType?: KeyboardTypeOptions;
  readonly autoCapitalize?: TextInputProps['autoCapitalize'];
  readonly textContentType?: TextInputProps['textContentType'];
  readonly rightAccessory?: ReactNode;
  readonly accessibilityLabel?: string;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  {
    label,
    value,
    onChangeText,
    errorMessage,
    secureTextEntry,
    editable = true,
    keyboardType,
    autoCapitalize,
    textContentType,
    rightAccessory,
    accessibilityLabel,
  },
  ref,
): ReactElement {
  const { focusRingStyle, onFocus, onBlur } = useFocusRing();
  const inputAccessibilityLabel =
    accessibilityLabel ?? (errorMessage ? `${label}, ${errorMessage}` : label);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.ringWrapper, focusRingStyle]}>
        <View style={[styles.inputRow, !editable && styles.inputRowDisabled]}>
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            editable={editable}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            textContentType={textContentType}
            accessibilityLabel={inputAccessibilityLabel}
            accessibilityState={{ disabled: !editable }}
            style={styles.input}
          />
          {rightAccessory}
        </View>
      </View>
      {errorMessage ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: color.text.secondary,
    marginBottom: spacing.xs,
  },
  ringWrapper: {
    borderRadius: radius.md + 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color.border.default,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: color.surface.default,
  },
  inputRowDisabled: {
    backgroundColor: color.surface.skeleton,
  },
  input: {
    flex: 1,
    minHeight: 48,
    fontSize: typography.body.fontSize,
    color: color.text.primary,
  },
  error: {
    marginTop: spacing.xs,
    fontSize: typography.caption.fontSize,
    color: color.text.error,
  },
});

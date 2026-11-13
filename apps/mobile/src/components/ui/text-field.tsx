import { forwardRef, type ReactElement, type ReactNode } from 'react';
import type { KeyboardTypeOptions, TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import {
  borderWidth,
  color,
  focusRingRadius,
  minTouchTarget,
  radius,
  spacing,
  typography,
} from '@/theme/tokens';
import { useFocusRing } from '@/theme/use-focus-ring';

export interface TextFieldProps {
  readonly label: string;
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  readonly errorMessage?: string;
  readonly placeholder?: string;
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
    placeholder,
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
        <View
          testID="text-field-row"
          style={[
            styles.inputRow,
            errorMessage ? styles.inputRowError : null,
            !editable && styles.inputRowDisabled,
          ]}
        >
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            editable={editable}
            placeholder={placeholder}
            placeholderTextColor={color.text.placeholder}
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
    marginBottom: spacing.field,
  },
  label: {
    fontSize: typography.labelSmall.fontSize,
    fontWeight: typography.labelSmall.fontWeight,
    color: color.text.secondary,
    marginBottom: spacing.xs,
  },
  ringWrapper: {
    borderRadius: focusRingRadius,
  },
  inputRow: {
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
    minHeight: minTouchTarget,
    fontSize: typography.field.fontSize,
    color: color.text.primary,
  },
  error: {
    marginTop: spacing.xs,
    fontSize: typography.caption.fontSize,
    color: color.text.error,
  },
});

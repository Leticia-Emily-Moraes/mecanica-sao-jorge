import { forwardRef, type ReactElement, type ReactNode } from 'react';
import type { KeyboardTypeOptions, TextInputProps } from 'react-native';
import { Text, TextInput, View } from 'react-native';

import { useFocusRing } from '@/theme/use-focus-ring';

import { styles, visual } from './text-field.styles';

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
            placeholderTextColor={visual.placeholderColor}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            textContentType={textContentType}
            accessibilityLabel={inputAccessibilityLabel}
            accessibilityState={{ disabled: !editable }}
            style={styles.input}
          />
          {rightAccessory ? (
            <View testID="text-field-accessory" style={styles.accessory}>
              {rightAccessory}
            </View>
          ) : null}
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

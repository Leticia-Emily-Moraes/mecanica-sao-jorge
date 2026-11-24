import { forwardRef, type ReactElement, type ReactNode } from 'react';
import type { KeyboardTypeOptions, TextInputProps } from 'react-native';
import { Text, TextInput, View } from 'react-native';

import { useFocusRing } from '@/theme/use-focus-ring';

import { styles, TOUCH_SLOP, visual } from './text-field.styles';

export interface TextFieldProps {
  readonly label: string;
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  readonly placeholder?: string;
  readonly errorMessage?: string;
  /** Borda de erro sem mensagem própria (ex.: credencial inválida marca os dois campos). */
  readonly invalid?: boolean;
  readonly secureTextEntry?: boolean;
  readonly editable?: boolean;
  readonly keyboardType?: KeyboardTypeOptions;
  readonly autoCapitalize?: TextInputProps['autoCapitalize'];
  readonly textContentType?: TextInputProps['textContentType'];
  readonly rightAccessory?: ReactNode;
  readonly accessibilityLabel?: string;
}

/**
 * Campo de texto: rótulo acima, caixa de 46 com raio 8. Foco e erro trocam a
 * borda de 1 px por 2 px Crail; o espaço das duas larguras é sempre reservado
 * para o layout não pular.
 */
export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  {
    label,
    value,
    onChangeText,
    placeholder,
    errorMessage,
    invalid = false,
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
  const { focused, onFocus, onBlur } = useFocusRing();
  const hasError = invalid || Boolean(errorMessage);
  const highlighted = focused || hasError;
  const inputAccessibilityLabel =
    accessibilityLabel ?? (errorMessage ? `${label}, ${errorMessage}` : label);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        testID="text-field-box"
        style={[
          styles.inputRow,
          highlighted ? styles.inputRowHighlighted : styles.inputRowIdle,
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
          placeholderTextColor={visual.placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          textContentType={textContentType}
          accessibilityLabel={inputAccessibilityLabel}
          accessibilityState={{ disabled: !editable }}
          hitSlop={TOUCH_SLOP}
          style={styles.input}
        />
        {rightAccessory}
      </View>
      {errorMessage ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
});

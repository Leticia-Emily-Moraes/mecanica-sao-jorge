import { forwardRef, type ReactElement, type ReactNode } from 'react';
import type { KeyboardTypeOptions, TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import {
  borderWidth,
  color,
  minTouchTarget,
  radius,
  size,
  spacing,
  typography,
} from '@/theme/tokens';
import { useFocusRing } from '@/theme/use-focus-ring';

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
          placeholderTextColor={color.text.placeholder}
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

const FIELD_PADDING = spacing.s14;

/** Completa a área de toque até `minTouchTarget` sem mudar a altura visível de 46 (ADR-014, regra 15). */
const TOUCH_SLOP = {
  top: (minTouchTarget - size.field) / 2,
  bottom: (minTouchTarget - size.field) / 2,
};

const styles = StyleSheet.create({
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

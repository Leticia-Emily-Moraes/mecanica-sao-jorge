import { Ionicons } from '@expo/vector-icons';
import type { ReactElement } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import {
  borderWidth,
  color,
  iconSize,
  minTouchTarget,
  radius,
  size,
  spacing,
  typography,
} from '@/theme/tokens';
import { useFocusRing } from '@/theme/use-focus-ring';

export interface SearchFieldProps {
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  /** Tecla de busca do teclado. */
  readonly onSubmit: () => void;
  readonly onClear: () => void;
  readonly placeholder: string;
  /** Nome acessível do campo (o placeholder some quando há texto). */
  readonly label: string;
  /** Nome acessível do botão de limpar. */
  readonly clearLabel: string;
  readonly maxLength: number;
}

/**
 * Campo de busca de 46: lupa, texto e, quando há texto, botão de limpar de 48 de
 * toque. Região de busca para o leitor de tela; foco e borda como o `TextField`.
 */
export function SearchField({
  value,
  onChangeText,
  onSubmit,
  onClear,
  placeholder,
  label,
  clearLabel,
  maxLength,
}: SearchFieldProps): ReactElement {
  const { focused, onFocus, onBlur } = useFocusRing();

  return (
    <View
      testID="search-field"
      accessibilityRole="search"
      style={[styles.box, focused ? styles.boxFocused : styles.boxIdle]}
    >
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Ionicons name="search-outline" size={iconSize.search} color={color.text.secondary} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={color.text.placeholder}
        accessibilityLabel={label}
        maxLength={maxLength}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={clearLabel}
          hitSlop={CLEAR_SLOP}
          onPress={onClear}
          style={styles.clear}
        >
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <Ionicons name="close-circle" size={iconSize.search} color={color.text.secondary} />
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

const CLEAR_SLOP = {
  top: (minTouchTarget - size.field) / 2,
  bottom: (minTouchTarget - size.field) / 2,
  left: spacing.sm,
  right: spacing.sm,
};

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: size.field,
    borderRadius: radius.sm,
    backgroundColor: color.surface.default,
  },
  boxIdle: {
    borderWidth: borderWidth.hairline,
    borderColor: color.border.default,
    paddingHorizontal: spacing.s14 + borderWidth.field - borderWidth.hairline,
  },
  boxFocused: {
    borderWidth: borderWidth.field,
    borderColor: color.border.focusField,
    paddingHorizontal: spacing.s14,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    fontFamily: typography.input.fontFamily,
    fontSize: typography.input.fontSize,
    color: color.text.primary,
  },
  clear: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

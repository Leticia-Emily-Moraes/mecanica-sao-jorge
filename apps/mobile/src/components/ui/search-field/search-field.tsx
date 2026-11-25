import { Ionicons } from '@expo/vector-icons';
import type { ReactElement } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { useFocusRing } from '@/theme/use-focus-ring';

import { CLEAR_SLOP, styles, visual } from './search-field.styles';

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
        <Ionicons name="search-outline" size={visual.iconSize} color={visual.iconColor} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={visual.placeholder}
        accessibilityLabel={label}
        maxLength={maxLength}
        returnKeyType="search"
        autoCapitalize="none"
        autoComplete="off"
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
            <Ionicons name="close-circle" size={visual.iconSize} color={visual.iconColor} />
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

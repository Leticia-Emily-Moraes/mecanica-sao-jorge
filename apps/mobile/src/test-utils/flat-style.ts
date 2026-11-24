import type { TextStyle, ViewStyle } from 'react-native';

/**
 * Tipo para achatar com `StyleSheet.flatten(no.props.style as TestStyle)` nos
 * testes de componente: o estilo real de um nó pode ser de `View` ou de `Text`.
 */
export type TestStyle = ViewStyle & TextStyle;

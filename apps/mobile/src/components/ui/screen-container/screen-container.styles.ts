import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';

import { color, spacing } from '@/theme/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.surface.background,
  },
  centered: {
    justifyContent: 'center',
  },
});

export type HorizontalPadding = 'default' | 'form';

/** Margem lateral da tela: 16 do Figma, ou 28 no Login (16 da tela + 12 do formulário). */
export function horizontalPaddingStyle(variant: HorizontalPadding): ViewStyle {
  return { paddingHorizontal: variant === 'form' ? spacing.md + spacing.s12 : spacing.md };
}

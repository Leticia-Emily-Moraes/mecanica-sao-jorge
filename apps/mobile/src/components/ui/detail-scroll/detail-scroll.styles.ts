import { StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';

import { spacing } from '@/theme/tokens';

export const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
});

/** 12 entre os blocos do detalhe do cliente, 16 no detalhe do veículo. */
export function gapStyle(gap: 'compact' | 'regular'): ViewStyle {
  return { gap: gap === 'compact' ? spacing.s12 : spacing.md };
}

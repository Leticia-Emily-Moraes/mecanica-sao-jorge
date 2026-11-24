import { StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';

import { spacing } from '@/theme/tokens';

export const styles = StyleSheet.create({
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

/** 20 de respiro acima da área segura de baixo. */
export function footerInset(bottom: number): ViewStyle {
  return { paddingBottom: spacing.s20 + bottom };
}

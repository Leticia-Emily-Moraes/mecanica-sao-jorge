import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';

import { color, size, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: color.surface.brand,
  },
  bar: {
    height: size.appBar,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    paddingLeft: spacing.md,
    paddingRight: spacing.s12,
  },
  /** No frame do Perfil a seta fica a 10 da borda e a 10 do título. */
  barWithBack: {
    gap: spacing.s10,
    paddingLeft: spacing.s10,
  },
  title: {
    flex: 1,
    color: color.text.onBrand,
    fontFamily: typography.appBarTitle.fontFamily,
    fontSize: typography.appBarTitle.fontSize,
    letterSpacing: typography.appBarTitle.letterSpacing,
  },
});

export function topInset(top: number): ViewStyle {
  return { paddingTop: top };
}

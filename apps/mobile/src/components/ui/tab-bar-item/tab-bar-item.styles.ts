import type { TextStyle } from 'react-native';
import { StyleSheet } from 'react-native';

import {
  color,
  focusRingOffset,
  iconSize,
  opacity,
  radius,
  spacing,
  typography,
} from '@/theme/tokens';

export const styles = StyleSheet.create({
  // Célula de 90 × 62 (frame `20:1102`): o anel fica 2 de folga por dentro dela.
  cell: {
    flex: 1,
    padding: focusRingOffset,
  },
  ring: {
    flex: 1,
    borderRadius: radius.tabFocus,
  },
  pressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  unavailable: {
    opacity: opacity.unavailable,
  },
  label: {
    fontFamily: typography.tabLabel.fontFamily,
    fontSize: typography.tabLabel.fontSize,
  },
  labelSelected: {
    fontFamily: typography.tabLabelSelected.fontFamily,
  },
  labelIdle: {
    fontFamily: typography.tabLabel.fontFamily,
  },
});

export const visual = {
  iconSize: iconSize.tab,
  toneSelected: color.text.tabSelected,
  toneIdle: color.text.onBrandMuted,
} as const;

/** Cor do rótulo igual à do ícone (selecionado ou não). */
export function toneStyle(tone: string): TextStyle {
  return { color: tone };
}

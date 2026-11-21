import { StyleSheet } from 'react-native';

import {
  color,
  focusRingWidth,
  iconSize,
  layout,
  opacity,
  radius,
  spacing,
  typography,
} from '@/theme/tokens';

export const styles = StyleSheet.create({
  cell: {
    flex: 1,
    minHeight: layout.tabItemHeight,
    borderRadius: radius.md,
    borderWidth: focusRingWidth,
    borderColor: 'transparent',
  },
  cellFocused: {
    borderColor: color.focus.ringOnBrand,
  },
  pressable: {
    flex: 1,
    alignItems: 'center',
    // Do topo: rótulos de uma e de duas linhas mantêm o ícone na mesma altura.
    justifyContent: 'flex-start',
    paddingTop: spacing.xs,
    gap: spacing.xs,
  },
  iconSlot: {
    width: layout.tabPillWidth,
    height: layout.tabPillHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  pill: {
    backgroundColor: color.action.primaryBackground,
  },
  unavailable: {
    opacity: opacity.unavailable,
  },
  label: {
    fontSize: typography.tab.fontSize,
    fontWeight: typography.tab.fontWeight,
    color: color.text.onBrand,
    textAlign: 'center',
  },
  labelSelected: {
    fontSize: typography.tabSelected.fontSize,
    fontWeight: typography.tabSelected.fontWeight,
  },
});

export const visual = {
  iconSize: iconSize.tab,
  iconColor: color.text.onBrand,
} as const;

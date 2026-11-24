import { StyleSheet } from 'react-native';

import { color, iconSize, minTouchTarget, radius, size } from '@/theme/tokens';

export const styles = StyleSheet.create({
  button: {
    width: size.iconButton,
    height: size.iconButton,
    borderRadius: radius.sm,
    backgroundColor: color.surface.onBrandControl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const SLOP = (minTouchTarget - size.iconButton) / 2;

export const visual = {
  hitSlop: { top: SLOP, bottom: SLOP, left: SLOP, right: SLOP },
  iconSize: iconSize.appBar,
  iconColor: color.text.onBrand,
} as const;

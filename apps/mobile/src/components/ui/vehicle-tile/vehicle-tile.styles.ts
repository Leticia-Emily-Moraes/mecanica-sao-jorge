import { StyleSheet } from 'react-native';

import { color, iconSize, radius, size } from '@/theme/tokens';

export const styles = StyleSheet.create({
  tile: {
    width: size.avatarSmall,
    height: size.avatarSmall,
    borderRadius: radius.sm,
    backgroundColor: color.surface.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const visual = {
  iconSize: iconSize.row,
  iconColor: color.text.onBrand,
} as const;

import { StyleSheet } from 'react-native';

import { color, layout, radius, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  circle: {
    width: layout.avatarSize,
    height: layout.avatarSize,
    borderRadius: radius.pill,
    backgroundColor: color.surface.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: typography.header.fontSize,
    fontWeight: typography.header.fontWeight,
    color: color.text.onBrand,
  },
});

import { StyleSheet } from 'react-native';

import { color, radius, size, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  circle: {
    width: size.avatar,
    height: size.avatar,
    borderRadius: radius.avatar,
    backgroundColor: color.surface.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: typography.avatarInitials.fontFamily,
    fontSize: typography.avatarInitials.fontSize,
    color: color.text.onBrand,
  },
});

import { StyleSheet } from 'react-native';

import { color, radius, size, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  circle: {
    backgroundColor: color.surface.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleRegular: {
    width: size.avatar,
    height: size.avatar,
    borderRadius: radius.avatar,
  },
  circleSmall: {
    width: size.avatarSmall,
    height: size.avatarSmall,
    borderRadius: radius.avatarSmall,
  },
  initials: {
    fontFamily: typography.avatarInitials.fontFamily,
    fontSize: typography.avatarInitials.fontSize,
    color: color.text.onBrand,
  },
  initialsSmall: {
    fontFamily: typography.avatarInitialsSmall.fontFamily,
    fontSize: typography.avatarInitialsSmall.fontSize,
    color: color.text.onBrand,
  },
});

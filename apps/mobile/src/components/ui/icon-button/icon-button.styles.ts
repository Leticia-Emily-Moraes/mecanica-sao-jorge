import { StyleSheet } from 'react-native';

import { color, focusRingRadius, iconSize, minTouchTarget } from '@/theme/tokens';

export const styles = StyleSheet.create({
  ringWrapper: {
    borderRadius: focusRingRadius,
  },
  button: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const visual = {
  iconSize: iconSize.action,
  iconColor: color.text.secondary,
} as const;

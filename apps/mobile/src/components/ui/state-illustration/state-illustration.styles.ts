import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';

import { color, iconSize, layout, size, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  iconCircle: {
    width: size.stateIcon,
    height: size.stateIcon,
    borderRadius: size.stateIcon / 2,
    backgroundColor: color.surface.neutral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: typography.stateTitle.fontFamily,
    fontSize: typography.stateTitle.fontSize,
    color: color.text.primary,
    textAlign: 'center',
  },
  message: {
    maxWidth: layout.stateMessageMaxWidth,
    fontFamily: typography.dialogMessage.fontFamily,
    fontSize: typography.dialogMessage.fontSize,
    lineHeight: typography.dialogMessage.lineHeight,
    color: color.text.secondary,
    textAlign: 'center',
  },
});

export const visual = {
  iconSize: iconSize.alert,
  iconColor: color.icon.state,
} as const;

export function gapAbove(gap: number): ViewStyle {
  return { marginTop: gap };
}

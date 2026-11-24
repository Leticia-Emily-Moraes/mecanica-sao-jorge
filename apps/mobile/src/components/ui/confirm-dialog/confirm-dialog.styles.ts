import { StyleSheet } from 'react-native';

import { color, layout, radius, shadow, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: color.surface.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.s22,
  },
  card: {
    width: '100%',
    maxWidth: layout.dialogMaxWidth,
    backgroundColor: color.surface.default,
    borderRadius: radius.dialog,
    padding: spacing.s20,
    gap: spacing.s14,
    ...shadow.dialog,
  },
  title: {
    fontFamily: typography.dialogTitle.fontFamily,
    fontSize: typography.dialogTitle.fontSize,
    color: color.text.primary,
  },
  message: {
    fontFamily: typography.dialogMessage.fontFamily,
    fontSize: typography.dialogMessage.fontSize,
    lineHeight: typography.dialogMessage.lineHeight,
    color: color.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.s10,
  },
  action: {
    flex: 1,
  },
});

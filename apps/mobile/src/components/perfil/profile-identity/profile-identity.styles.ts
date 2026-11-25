import { StyleSheet } from 'react-native';

import { color, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  identity: {
    alignItems: 'center',
    gap: spacing.sm,
    // Medido no frame 10:3842: 36 entre a barra e o avatar, 20 entre o selo e o cartão.
    paddingTop: spacing.md + spacing.s20,
    paddingBottom: spacing.s20,
  },
  name: {
    color: color.text.primary,
    fontFamily: typography.title.fontFamily,
    fontSize: typography.title.fontSize,
    textAlign: 'center',
  },
});

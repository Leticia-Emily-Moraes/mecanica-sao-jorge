import { StyleSheet } from 'react-native';

import { color, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  title: {
    fontFamily: typography.sectionTitle.fontFamily,
    fontSize: typography.sectionTitle.fontSize,
    color: color.text.primary,
    textTransform: 'uppercase',
  },
});

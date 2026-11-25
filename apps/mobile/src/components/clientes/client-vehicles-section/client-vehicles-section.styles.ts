import { StyleSheet } from 'react-native';

import { color, spacing, typography } from '@/theme/tokens';

/** A seção fica 4 abaixo do espaço comum do detalhe: 16 entre o cartão do cliente e os veículos. */
export const styles = StyleSheet.create({
  section: {
    marginTop: spacing.xs,
    gap: spacing.s12,
  },
  loading: {
    marginTop: spacing.xs,
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  loadingText: {
    fontFamily: typography.rowLabel.fontFamily,
    fontSize: typography.rowLabel.fontSize,
    color: color.text.secondary,
  },
});

export const visual = {
  spinner: color.text.primary,
} as const;

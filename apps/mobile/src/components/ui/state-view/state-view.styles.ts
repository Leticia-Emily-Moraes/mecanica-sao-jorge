import { StyleSheet } from 'react-native';

import { color, layout, spacing, typography } from '@/theme/tokens';

export const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: typography.rowLabel.fontFamily,
    fontSize: typography.rowLabel.fontSize,
    color: color.text.secondary,
    textAlign: 'center',
    marginTop: spacing.s12,
  },
  emptyAction: {
    width: '100%',
    maxWidth: layout.dialogMaxWidth,
    marginTop: spacing.lg,
  },
});

export const visual = {
  spinner: color.text.primary,
  /** Espaços do Início I1 entre círculo, título e mensagem. */
  titleGap: spacing.md,
  messageGap: spacing.s10,
} as const;

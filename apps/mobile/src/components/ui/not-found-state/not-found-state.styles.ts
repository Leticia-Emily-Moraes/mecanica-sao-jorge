import { StyleSheet } from 'react-native';

import { layout, spacing } from '@/theme/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.s12,
    paddingBottom: spacing.md,
  },
  illustration: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    width: '100%',
    maxWidth: layout.stateActionsMaxWidth,
  },
});

export const visual = {
  titleGap: spacing.md,
  messageGap: spacing.s10,
} as const;

import { StyleSheet } from 'react-native';

import { layout, spacing } from '@/theme/tokens';

export const styles = StyleSheet.create({
  // Frame P2 (83:759): coluna com gap 12 e 16 de margem na base; a ilustração
  // centra na área acima e os botões ficam ancorados embaixo.
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
    gap: spacing.s12,
  },
});

/** Espaços do P2 entre círculo, título e mensagem. */
export const visual = {
  titleGap: spacing.md,
  messageGap: spacing.s10,
} as const;

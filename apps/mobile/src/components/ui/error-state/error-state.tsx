import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { StateIllustration } from '@/components/ui/state-illustration';
import { layout, spacing } from '@/theme/tokens';

export interface ErrorStateProps {
  readonly title: string;
  readonly message: string;
  readonly retryLabel: string;
  readonly onRetry: () => void;
  readonly secondaryLabel?: string;
  readonly onSecondaryPress?: () => void;
}

/**
 * Erro de tela cheia (P2): sem cabeçalho nem tab bar, ícone de sem conexão em
 * círculo, título, mensagem e, ancoradas na base, a ação principal cheia e, se
 * houver, a secundária de contorno. Substitui o popup antigo: a tela não tem conteúdo
 * útil por baixo quando a sessão não carrega.
 */
export function ErrorState({
  title,
  message,
  retryLabel,
  onRetry,
  secondaryLabel,
  onSecondaryPress,
}: ErrorStateProps): ReactElement {
  return (
    <View
      testID="error-state"
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
      style={styles.container}
    >
      <View testID="error-state-illustration" style={styles.illustration}>
        <StateIllustration
          icon="cloud-offline-outline"
          title={title}
          message={message}
          titleGap={spacing.md}
          messageGap={spacing.s10}
          titleIsHeader
        />
      </View>
      <View testID="error-state-actions" style={styles.actions}>
        <View>
          <Button label={retryLabel} onPress={onRetry} variant="primary" />
        </View>
        {secondaryLabel && onSecondaryPress ? (
          <View>
            <Button label={secondaryLabel} onPress={onSecondaryPress} variant="secondary" />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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

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
 * círculo, título, mensagem, ação principal cheia e, se houver, ação
 * secundária de contorno. Substitui o popup antigo: a tela não tem conteúdo
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
    <View accessibilityRole="alert" accessibilityLiveRegion="assertive" style={styles.container}>
      <StateIllustration
        icon="cloud-offline-outline"
        title={title}
        message={message}
        titleGap={spacing.lg}
        messageGap={spacing.sm}
        titleIsHeader
      />
      <View style={styles.actions}>
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    width: '100%',
    maxWidth: layout.stateActionsMaxWidth,
    gap: spacing.s10,
    marginTop: spacing.lg,
  },
});

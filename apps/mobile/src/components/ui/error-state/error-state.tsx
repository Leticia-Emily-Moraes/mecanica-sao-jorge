import type { ReactElement } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { StateIllustration } from '@/components/ui/state-illustration';

import { styles, visual } from './error-state.styles';

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
          titleGap={visual.titleGap}
          messageGap={visual.messageGap}
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

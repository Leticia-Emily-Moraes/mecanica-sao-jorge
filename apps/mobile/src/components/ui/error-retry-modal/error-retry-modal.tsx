import type { ReactElement } from 'react';
import { Modal, Text, View } from 'react-native';

import { AlertIcon } from '@/components/ui/alert-icon';
import { Button } from '@/components/ui/button';
import { styles, visual } from './error-retry-modal.styles';

export interface ErrorRetryModalProps {
  readonly visible: boolean;
  readonly title: string;
  readonly message: string;
  readonly retryLabel: string;
  readonly onRetry: () => void;
  readonly secondaryLabel?: string;
  readonly onSecondaryPress?: () => void;
}

/**
 * Popup sobre o conteúdo de fundo (não substitui a tela), mesmo padrão
 * corrigido no wireframe F24 e reaproveitado no protótipo F25 — ícone de
 * alerta (triângulo cheio), título, mensagem e ação de retry.
 */
export function ErrorRetryModal({
  visible,
  title,
  message,
  retryLabel,
  onRetry,
  secondaryLabel,
  onSecondaryPress,
}: ErrorRetryModalProps): ReactElement {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRetry}>
      <View style={styles.overlay}>
        <View
          style={styles.card}
          accessibilityViewIsModal
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive"
        >
          <View style={styles.icon}>
            <AlertIcon size={visual.alertIconSize} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Button label={retryLabel} onPress={onRetry} variant="primary" />
            {secondaryLabel && onSecondaryPress ? (
              <View style={styles.secondarySpacing}>
                <Button label={secondaryLabel} onPress={onSecondaryPress} variant="secondary" />
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

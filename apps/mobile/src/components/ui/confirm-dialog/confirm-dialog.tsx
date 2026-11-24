import type { ReactElement } from 'react';
import { Modal, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { CloseButton } from '@/components/ui/close-button';

import { styles } from './confirm-dialog.styles';

export interface ConfirmDialogProps {
  readonly visible: boolean;
  readonly title: string;
  readonly message?: string;
  readonly cancelLabel: string;
  readonly confirmLabel: string;
  /** Nome acessível do X de fechar (padrão F38). */
  readonly closeLabel: string;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
}

/**
 * Diálogo de confirmação (US-PRF-FRONT-02/03) — nenhuma ação é destrutiva de
 * dado. Título à esquerda, mensagem e as duas ações lado a lado: Cancelar
 * (contorno petro) e Sair (Crail), como no frame `10:3886`. O X de fechar
 * (padrão F38) é fechamento adicional equivalente ao Cancelar.
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  cancelLabel,
  confirmLabel,
  closeLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps): ReactElement {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View
          style={styles.card}
          accessibilityViewIsModal
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive"
        >
          <CloseButton label={closeLabel} onPress={onCancel} />
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.actions}>
            <View style={styles.action}>
              <Button label={cancelLabel} onPress={onCancel} variant="secondary" />
            </View>
            <View style={styles.action}>
              <Button label={confirmLabel} onPress={onConfirm} variant="primary" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

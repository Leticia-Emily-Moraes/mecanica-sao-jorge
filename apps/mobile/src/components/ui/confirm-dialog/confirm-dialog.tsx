import type { ReactElement } from 'react';
import { Modal, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';

import { styles } from './confirm-dialog.styles';

export interface ConfirmDialogProps {
  readonly visible: boolean;
  readonly title: string;
  /** Texto de apoio sob o título (Figma 33:64). */
  readonly message?: string;
  readonly cancelLabel: string;
  readonly confirmLabel: string;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
}

/** Diálogo de confirmação (US-PRF-FRONT-02/03) — nenhuma ação é destrutiva de dado. */
export function ConfirmDialog({
  visible,
  title,
  message,
  cancelLabel,
  confirmLabel,
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
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.actions}>
            <View style={styles.actionSpacing}>
              <Button label={cancelLabel} onPress={onCancel} variant="secondary" />
            </View>
            <Button label={confirmLabel} onPress={onConfirm} variant="primary" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

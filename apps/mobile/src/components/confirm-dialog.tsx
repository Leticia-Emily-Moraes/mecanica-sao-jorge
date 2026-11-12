import type { ReactElement } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { CloseButton } from '@/components/close-button';
import { color, radius, spacing, typography } from '@/theme/tokens';

export interface ConfirmDialogProps {
  readonly visible: boolean;
  readonly title: string;
  readonly cancelLabel: string;
  readonly confirmLabel: string;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
}

/**
 * Diálogo de confirmação (US-PRF-FRONT-02/03) — nenhuma ação é destrutiva de
 * dado. O X de fechar (padrão F38) é fechamento adicional equivalente ao
 * Cancelar; Cancelar/Confirmar permanecem intactos.
 */
export function ConfirmDialog({
  visible,
  title,
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
          <CloseButton onPress={onCancel} />
          <Text style={styles.title}>{title}</Text>
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: color.surface.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: color.surface.default,
    borderRadius: radius.lg,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: color.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  actions: {
    width: '100%',
  },
  actionSpacing: {
    marginBottom: spacing.sm,
  },
});

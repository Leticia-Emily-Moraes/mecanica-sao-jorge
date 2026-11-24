import type { ReactElement } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { CLOSE_BUTTON_BOX, CloseButton } from '@/components/ui/close-button';
import { color, layout, radius, shadow, spacing, typography } from '@/theme/tokens';

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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: color.surface.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.s22,
  },
  card: {
    width: '100%',
    maxWidth: layout.dialogMaxWidth,
    backgroundColor: color.surface.default,
    borderRadius: radius.dialog,
    padding: spacing.s20,
    gap: spacing.s14,
    ...shadow.dialog,
  },
  title: {
    // Reserva a faixa do X para o título nunca passar por baixo dele.
    paddingRight: CLOSE_BUTTON_BOX,
    fontFamily: typography.dialogTitle.fontFamily,
    fontSize: typography.dialogTitle.fontSize,
    color: color.text.primary,
  },
  message: {
    fontFamily: typography.dialogMessage.fontFamily,
    fontSize: typography.dialogMessage.fontSize,
    lineHeight: typography.dialogMessage.lineHeight,
    color: color.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.s10,
  },
  action: {
    flex: 1,
  },
});

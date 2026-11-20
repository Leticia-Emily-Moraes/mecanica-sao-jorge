import type { ReactElement } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { color, layout, radius, shadow, spacing, typography } from '@/theme/tokens';

export interface ConfirmDialogProps {
  readonly visible: boolean;
  readonly title: string;
  readonly message?: string;
  readonly cancelLabel: string;
  readonly confirmLabel: string;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
  /**
   * Botões um sobre o outro, o seguro primeiro e em destaque (Cancelar vira o
   * primário) e o que descarta em contorno, como no frame X1 da F35. Sem isso,
   * o desenho lado a lado do diálogo de sair.
   */
  readonly stacked?: boolean;
}

/**
 * Diálogo de confirmação (US-PRF-FRONT-02/03) — nenhuma ação é destrutiva de
 * dado. Título à esquerda, mensagem e as duas ações lado a lado: Cancelar
 * (contorno petro) e Sair (Crail), como no frame `10:3886`.
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  stacked = false,
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
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={stacked ? styles.actionsStacked : styles.actions}>
            <View style={stacked ? undefined : styles.action}>
              <Button
                label={cancelLabel}
                onPress={onCancel}
                variant={stacked ? 'primary' : 'secondary'}
              />
            </View>
            <View style={stacked ? undefined : styles.action}>
              <Button
                label={confirmLabel}
                onPress={onConfirm}
                variant={stacked ? 'secondary' : 'primary'}
              />
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
  actionsStacked: {
    gap: spacing.s10,
  },
  action: {
    flex: 1,
  },
});

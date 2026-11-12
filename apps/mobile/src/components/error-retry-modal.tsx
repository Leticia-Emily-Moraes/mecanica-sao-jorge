import type { ReactElement } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { CloseButton } from '@/components/close-button';
import { color, radius, spacing, typography } from '@/theme/tokens';

export interface ErrorRetryModalProps {
  readonly visible: boolean;
  readonly title: string;
  readonly message: string;
  readonly retryLabel: string;
  readonly onRetry: () => void;
  readonly onClose?: () => void;
  readonly secondaryLabel?: string;
  readonly onSecondaryPress?: () => void;
}

/**
 * Popup sobre o conteúdo de fundo (não substitui a tela), mesmo padrão
 * corrigido no wireframe F24 e reaproveitado no protótipo F25 — ícone de
 * alerta ⚠ (dingbat, não emoji colorido), título, mensagem, ação de retry e,
 * quando `onClose` é informado, o X de fechar (padrão F38) como fechamento
 * adicional sem tentar de novo. `onClose` é opcional porque o popup de erro
 * de inicialização de sessão (app/index.tsx) não tem uma ação de "fechar"
 * válida sem decisão de produto própria — fora do escopo desta feature.
 */
export function ErrorRetryModal({
  visible,
  title,
  message,
  retryLabel,
  onRetry,
  onClose,
  secondaryLabel,
  onSecondaryPress,
}: ErrorRetryModalProps): ReactElement {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose ?? onRetry}>
      <View style={styles.overlay}>
        <View
          style={styles.card}
          accessibilityViewIsModal
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive"
        >
          {onClose ? <CloseButton onPress={onClose} /> : null}
          <Text accessibilityElementsHidden importantForAccessibility="no" style={styles.icon}>
            ⚠
          </Text>
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
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    color: color.text.error,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: color.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: typography.body.fontSize,
    color: color.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  actions: {
    width: '100%',
  },
  secondarySpacing: {
    marginTop: spacing.sm,
  },
});

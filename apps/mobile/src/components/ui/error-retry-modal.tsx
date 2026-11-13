import type { ReactElement } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { color, glyph, iconSize, layout, radius, spacing, typography } from '@/theme/tokens';

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
 * alerta ⚠ (dingbat, não emoji colorido), título, mensagem e ação de retry.
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
          <Text accessibilityElementsHidden importantForAccessibility="no" style={styles.icon}>
            {glyph.alert}
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
    maxWidth: layout.dialogMaxWidth,
    backgroundColor: color.surface.default,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  icon: {
    fontSize: iconSize.alert,
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

import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { AccessibilityInfo, Pressable, StyleSheet, Text, View } from 'react-native';

import { color, iconSize, minTouchTarget, radius, size, spacing, typography } from '@/theme/tokens';

export interface InlineNoticeProps {
  readonly message: string;
  /** Sem estes dois, o aviso não tem botão de fechar. */
  readonly onDismiss?: () => void;
  readonly dismissLabel?: string;
}

/**
 * Aviso de sucesso (faixa verde de 44): ícone, mensagem e, se houver, fechar.
 * É anunciado ao aparecer (região viva no Android, anúncio explícito no iOS) sem
 * roubar o foco. O verde mais o ícone e o texto: o sentido não depende da cor.
 */
export function InlineNotice({
  message,
  onDismiss,
  dismissLabel,
}: InlineNoticeProps): ReactElement {
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(message);
  }, [message]);

  return (
    <View
      testID="inline-notice"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={styles.notice}
    >
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Ionicons
          name="checkmark-circle-outline"
          size={iconSize.appBar}
          color={color.text.onBrand}
        />
      </View>
      <Text style={styles.message}>{message}</Text>
      {onDismiss && dismissLabel ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={dismissLabel}
          hitSlop={DISMISS_SLOP}
          onPress={onDismiss}
          style={styles.dismiss}
        >
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <Ionicons name="close" size={iconSize.appBar} color={color.text.onBrand} />
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

/** O botão mede só o ícone: o `hitSlop` completa os dois lados até `minTouchTarget`. */
const DISMISS_SLOP_SIDE = (minTouchTarget - iconSize.appBar) / 2;
const DISMISS_SLOP = {
  top: DISMISS_SLOP_SIDE,
  bottom: DISMISS_SLOP_SIDE,
  left: DISMISS_SLOP_SIDE,
  right: DISMISS_SLOP_SIDE,
};

const styles = StyleSheet.create({
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    minHeight: size.notice,
    paddingHorizontal: spacing.s14,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: color.feedback.success,
  },
  message: {
    flex: 1,
    fontFamily: typography.label.fontFamily,
    fontSize: typography.label.fontSize,
    color: color.text.onBrand,
  },
  dismiss: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

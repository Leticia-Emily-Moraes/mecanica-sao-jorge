import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { AccessibilityInfo, Pressable, Text, View } from 'react-native';

import { DISMISS_SLOP, styles, visual } from './inline-notice.styles';

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
        <Ionicons name="checkmark-circle-outline" size={visual.iconSize} color={visual.iconColor} />
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
            <Ionicons name="close" size={visual.iconSize} color={visual.iconColor} />
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

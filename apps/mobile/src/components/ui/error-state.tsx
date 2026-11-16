import { Ionicons } from '@expo/vector-icons';
import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { color, iconSize, layout, radius, size, spacing, typography } from '@/theme/tokens';

export interface ErrorStateProps {
  readonly title: string;
  readonly message: string;
  readonly retryLabel: string;
  readonly onRetry: () => void;
  readonly secondaryLabel?: string;
  readonly onSecondaryPress?: () => void;
}

/**
 * Medida do círculo do ícone: reaproveita os 84 do avatar. O diâmetro e o
 * ícone do frame P2 (`83:754`) ainda não foram medidos no arquivo.
 */
const ICON_CIRCLE = size.avatar;

/**
 * Erro de tela cheia (P2): sem cabeçalho nem tab bar, ícone de sem conexão em
 * círculo, título, mensagem, ação principal cheia e, se houver, ação
 * secundária de contorno. Substitui o popup antigo: a tela não tem conteúdo
 * útil por baixo quando a sessão não carrega.
 */
export function ErrorState({
  title,
  message,
  retryLabel,
  onRetry,
  secondaryLabel,
  onSecondaryPress,
}: ErrorStateProps): ReactElement {
  return (
    <View accessibilityRole="alert" accessibilityLiveRegion="assertive" style={styles.container}>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.iconCircle}
      >
        <Ionicons
          name="cloud-offline-outline"
          size={iconSize.empty}
          color={color.text.errorOnBanner}
        />
      </View>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.actions}>
        <View>
          <Button label={retryLabel} onPress={onRetry} variant="primary" />
        </View>
        {secondaryLabel && onSecondaryPress ? (
          <View>
            <Button label={secondaryLabel} onPress={onSecondaryPress} variant="secondary" />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: ICON_CIRCLE,
    height: ICON_CIRCLE,
    borderRadius: radius.avatar,
    backgroundColor: color.surface.errorTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: typography.title.fontFamily,
    fontSize: typography.title.fontSize,
    color: color.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: color.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  actions: {
    width: '100%',
    maxWidth: layout.dialogMaxWidth,
    gap: spacing.s10,
  },
});

import { Ionicons } from '@expo/vector-icons';
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { AccessibilityInfo, ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ErrorState, type ErrorStateProps as ErrorViewProps } from '@/components/ui/error-state';
import { color, iconSize, layout, spacing, typography } from '@/theme/tokens';

export interface LoadingStateProps {
  readonly state: 'loading';
  readonly loadingLabel: string;
}

interface EmptyStateBaseProps {
  readonly state: 'empty';
  readonly title: string;
  readonly message?: string;
}

/** `actionLabel` e `onAction` andam juntos: ou os dois, ou nenhum. */
export type EmptyStateProps = EmptyStateBaseProps &
  (
    | { readonly actionLabel: string; readonly onAction: () => void }
    | { readonly actionLabel?: undefined; readonly onAction?: undefined }
  );

export type ErrorStateProps = ErrorViewProps & { readonly state: 'error' };

export type StateViewProps = LoadingStateProps | EmptyStateProps | ErrorStateProps;

/**
 * Estados de tela sem conteúdo: carregando, vazio e erro. Todo texto chega
 * por prop (o componente não conhece i18n). Carregando mostra o texto visível
 * sob o indicador (P1) e o erro ocupa a tela inteira (P2).
 */
export function StateView(props: StateViewProps): ReactElement {
  switch (props.state) {
    case 'loading':
      return <LoadingState loadingLabel={props.loadingLabel} />;
    case 'empty':
      return <EmptyState {...props} />;
    case 'error':
      return <ErrorState {...props} />;
  }
}

function LoadingState({ loadingLabel }: { loadingLabel: string }): ReactElement {
  // Região viva cobre o Android; o iOS só anuncia por chamada explícita.
  // O foco do leitor não se move: é um anúncio, não um diálogo.
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(loadingLabel);
  }, [loadingLabel]);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={loadingLabel}
      accessibilityLiveRegion="polite"
      accessibilityState={{ busy: true }}
      style={styles.centered}
    >
      <ActivityIndicator size="large" color={color.text.primary} />
      <Text style={styles.loadingText}>{loadingLabel}</Text>
    </View>
  );
}

function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps): ReactElement {
  return (
    <View style={styles.centered}>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Ionicons name="file-tray-outline" size={iconSize.empty} color={color.text.secondary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {message ? <Text style={styles.emptyMessage}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <View style={styles.emptyAction}>
          <Button label={actionLabel} onPress={onAction} variant="primary" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: typography.rowLabel.fontFamily,
    fontSize: typography.rowLabel.fontSize,
    color: color.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  emptyTitle: {
    fontFamily: typography.label.fontFamily,
    fontSize: typography.label.fontSize,
    color: color.text.primary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  emptyMessage: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: color.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  emptyAction: {
    width: '100%',
    maxWidth: layout.dialogMaxWidth,
    marginTop: spacing.lg,
  },
});

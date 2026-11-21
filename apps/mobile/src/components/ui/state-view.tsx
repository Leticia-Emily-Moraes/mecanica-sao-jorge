import { Ionicons } from '@expo/vector-icons';
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { AccessibilityInfo, ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ErrorRetryModal, type ErrorRetryModalProps } from '@/components/ui/error-retry-modal';
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

export type ErrorStateProps = ErrorRetryModalProps & { readonly state: 'error' };

export type StateViewProps = LoadingStateProps | EmptyStateProps | ErrorStateProps;

/**
 * Estados de tela sem conteúdo: carregando, vazio e erro. Todo texto chega
 * por prop (o componente não conhece i18n). O erro é o popup sobre o
 * conteúdo de fundo, como aprovado na F24/F25/F30.
 */
export function StateView(props: StateViewProps): ReactElement {
  switch (props.state) {
    case 'loading':
      return <LoadingState loadingLabel={props.loadingLabel} />;
    case 'empty':
      return <EmptyState {...props} />;
    case 'error':
      return <ErrorRetryModal {...props} />;
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
  emptyTitle: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: color.text.primary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  emptyMessage: {
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

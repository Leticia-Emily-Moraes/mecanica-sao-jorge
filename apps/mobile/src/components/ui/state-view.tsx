import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { AccessibilityInfo, ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ErrorState, type ErrorStateProps as ErrorViewProps } from '@/components/ui/error-state';
import { StateIllustration } from '@/components/ui/state-illustration';
import { color, layout, spacing, typography } from '@/theme/tokens';

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
    <View testID="state-view-empty" style={styles.centered}>
      <StateIllustration
        icon="document-text-outline"
        title={title}
        message={message}
        titleGap={spacing.md}
        messageGap={spacing.s10}
      />
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
    marginTop: spacing.s12,
  },
  emptyAction: {
    width: '100%',
    maxWidth: layout.dialogMaxWidth,
    marginTop: spacing.lg,
  },
});

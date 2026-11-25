import type { ReactElement } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { StateIllustration, type StateIconName } from '@/components/ui/state-illustration';

import { styles, visual } from './not-found-state.styles';

export interface NotFoundStateProps {
  readonly title: string;
  readonly message: string;
  readonly actionLabel: string;
  readonly onAction: () => void;
  readonly icon?: StateIconName;
}

/**
 * Registro que não existe (mais): título, mensagem e uma única saída, "voltar".
 * Sem "Tentar novamente", porque repetir uma chamada que deu 404 não resolve.
 */
export function NotFoundState({
  title,
  message,
  actionLabel,
  onAction,
  icon = 'search-outline',
}: NotFoundStateProps): ReactElement {
  return (
    <View testID="not-found-state" style={styles.container}>
      <View style={styles.illustration}>
        <StateIllustration
          icon={icon}
          title={title}
          message={message}
          titleGap={visual.titleGap}
          messageGap={visual.messageGap}
          titleIsHeader
        />
      </View>
      <View style={styles.actions}>
        <Button label={actionLabel} onPress={onAction} variant="primary" />
      </View>
    </View>
  );
}

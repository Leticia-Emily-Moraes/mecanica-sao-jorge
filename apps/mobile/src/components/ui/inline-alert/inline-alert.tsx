import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import { AlertIcon } from '@/components/ui/alert-icon';
import { styles, visual } from './inline-alert.styles';

export interface InlineAlertProps {
  readonly message: string;
}

/**
 * Faixa de erro dentro do formulário (a tela continua utilizável; Figma
 * 29:60). Sempre com ícone e texto — nunca só cor — e anunciada como alerta
 * ao leitor de tela. O ícone é decorativo.
 */
export function InlineAlert({ message }: InlineAlertProps): ReactElement {
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessible
      style={styles.banner}
    >
      <AlertIcon size={visual.alertIconSize} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

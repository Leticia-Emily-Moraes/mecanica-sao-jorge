import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import { AlertIcon } from '@/components/ui/alert-icon';

import { styles } from './inline-alert.styles';

export interface InlineAlertProps {
  readonly message: string;
}

/**
 * Faixa de erro dentro do formulário (a tela continua utilizável): fundo Pot
 * Pourri, contorno Rose Fog, ícone de alerta e texto El Salva. Sempre com
 * texto — nunca só cor — e anunciada como alerta ao leitor de tela. A altura
 * vem da margem e do texto (sem altura fixa): 1 linha ≈ 48, 2 linhas = 67.
 */
export function InlineAlert({ message }: InlineAlertProps): ReactElement {
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessible
      accessibilityLabel={message}
      style={styles.container}
    >
      <AlertIcon />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

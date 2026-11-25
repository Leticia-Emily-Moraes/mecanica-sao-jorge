import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import { styles } from './empty-card.styles';

export interface EmptyCardProps {
  readonly title: string;
  readonly message: string;
}

/**
 * Vazio dentro de uma seção ("Nenhum veículo cadastrado", "Nenhuma OS neste
 * veículo"): a tela continua visível em volta. É lido de uma vez, título e mensagem.
 */
export function EmptyCard({ title, message }: EmptyCardProps): ReactElement {
  return (
    <View
      testID="empty-card"
      accessible
      accessibilityLabel={`${title}. ${message}`}
      style={styles.card}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

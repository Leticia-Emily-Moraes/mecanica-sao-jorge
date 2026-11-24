import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import { styles } from './info-card.styles';

export interface InfoRow {
  readonly label: string;
  readonly value: string;
}

export interface InfoCardProps {
  readonly rows: readonly InfoRow[];
}

/**
 * Cartão de leitura do Perfil: linhas com rótulo (Flint) à esquerda e valor
 * (petro) à direita. Cada linha é lida de uma vez ("Usuário: joao.silva").
 */
export function InfoCard({ rows }: InfoCardProps): ReactElement {
  return (
    <View style={styles.card}>
      {rows.map((row) => (
        <View
          key={row.label}
          accessible
          accessibilityLabel={`${row.label}: ${row.value}`}
          style={styles.row}
        >
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

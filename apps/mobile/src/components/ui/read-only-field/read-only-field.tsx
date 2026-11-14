import type { ReactElement, ReactNode } from 'react';
import { Text, View } from 'react-native';

import { styles } from './read-only-field.styles';

export interface ReadOnlyFieldProps {
  readonly label: string;
  readonly value?: string;
  /** Substitui o texto do valor (ex.: selo). */
  readonly children?: ReactNode;
}

/** Par rótulo-valor de leitura: o equivalente de exibição do `TextField`. */
export function ReadOnlyField({ label, value, children }: ReadOnlyFieldProps): ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {children ?? <Text style={styles.value}>{value}</Text>}
    </View>
  );
}

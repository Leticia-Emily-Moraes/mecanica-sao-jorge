import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import { styles } from './access-profile-badge.styles';

export interface AccessProfileBadgeProps {
  readonly label: string;
}

/**
 * Selo do perfil de acesso (ADMIN, FUNCIONARIO): pílula petro com texto
 * branco (Figma 33:40). Não é o badge de status que chega com a primeira
 * lista (F35): se aquele nascer genérico, este deve ser trocado por ele.
 */
export function AccessProfileBadge({ label }: AccessProfileBadgeProps): ReactElement {
  return (
    <View style={styles.badge}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

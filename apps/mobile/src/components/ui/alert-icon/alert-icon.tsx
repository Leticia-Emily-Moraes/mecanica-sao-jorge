import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import { styles, visual } from './alert-icon.styles';

/**
 * Ícone de alerta da faixa de erro: círculo com "!" em El Salva, desenhado em
 * código (estilo da referência, sem ativo exportado). Decorativo: a faixa já
 * se anuncia como alerta com o texto, então o ícone fica fora da árvore de
 * acessibilidade.
 */
export function AlertIcon(): ReactElement {
  return (
    <View
      testID="alert-icon"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.circle}
    >
      <Text style={styles.mark}>{visual.mark}</Text>
    </View>
  );
}

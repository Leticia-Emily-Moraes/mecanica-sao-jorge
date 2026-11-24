import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { color, fontFamily, glyph, iconSize } from '@/theme/tokens';

/** Contorno do círculo do ícone de alerta (R-02 reconferido contra o Figma: círculo, não triângulo). */
const RING_WIDTH = 1.5;
/** Proporção do ponto de exclamação dentro do círculo. */
const MARK_RATIO = 0.65;

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
      <Text style={styles.mark}>{glyph.alertMark}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: iconSize.banner,
    height: iconSize.banner,
    borderRadius: iconSize.banner / 2,
    borderWidth: RING_WIDTH,
    borderColor: color.text.errorOnBanner,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    color: color.text.errorOnBanner,
    fontFamily: fontFamily.bodySemiBold,
    fontSize: iconSize.banner * MARK_RATIO,
    lineHeight: iconSize.banner * MARK_RATIO + 2,
    includeFontPadding: false,
    textAlign: 'center',
  },
});

import { StyleSheet } from 'react-native';

import { color, fontFamily, glyph, iconSize } from '@/theme/tokens';

/** Contorno do círculo do ícone de alerta (R-02 reconferido contra o Figma: círculo, não triângulo). */
export const RING_WIDTH = 1.5;

/** Proporção do ponto de exclamação dentro do círculo. */
export const MARK_RATIO = 0.65;

export const styles = StyleSheet.create({
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

export const visual = {
  mark: glyph.alertMark,
} as const;

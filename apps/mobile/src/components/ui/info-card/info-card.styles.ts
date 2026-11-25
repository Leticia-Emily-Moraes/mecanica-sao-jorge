import { StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';

import { borderWidth, color, radius, shadow, spacing, typography } from '@/theme/tokens';

/** Sombra do cartão: raio 1 no Perfil, raio 2 nos detalhes de cliente e veículo. */
export function elevationStyle(elevation: 'card' | 'detail'): ViewStyle {
  return shadow[elevation];
}

export const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface.default,
    borderWidth: borderWidth.hairline,
    borderColor: color.border.divider,
    borderRadius: radius.sm,
    padding: spacing.md - borderWidth.hairline,
    gap: spacing.s10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    marginBottom: spacing.xs,
  },
  headerTexts: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontFamily: typography.detailName.fontFamily,
    fontSize: typography.detailName.fontSize,
    color: color.text.primary,
  },
  subtitle: {
    fontFamily: typography.subtitle.fontFamily,
    fontSize: typography.subtitle.fontSize,
    color: color.text.secondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  label: {
    fontFamily: typography.rowLabel.fontFamily,
    fontSize: typography.rowLabel.fontSize,
    color: color.text.secondary,
  },
  value: {
    flexShrink: 1,
    fontFamily: typography.rowValue.fontFamily,
    fontSize: typography.rowValue.fontSize,
    color: color.text.primary,
    textAlign: 'right',
  },
  valueMuted: {
    fontFamily: typography.rowLabel.fontFamily,
    color: color.text.secondary,
  },
});

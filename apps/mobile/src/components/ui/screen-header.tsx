import { useContext, type ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import { color, spacing, typography } from '@/theme/tokens';

export interface ScreenHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
}

/**
 * Faixa de cabeçalho da tela (Figma 29:80, 33:34): fundo petro, título à
 * esquerda e subtítulo opcional. Ocupa a área sob a barra de status. O título
 * é anunciado como cabeçalho pelo leitor de tela.
 */
export function ScreenHeader({ title, subtitle }: ScreenHeaderProps): ReactElement {
  // Contexto lido direto: sem provedor (testes isolados) o inset é zero.
  const insets = useContext(SafeAreaInsetsContext);

  return (
    <View style={[styles.band, { paddingTop: insets?.top ?? 0 }]}>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    backgroundColor: color.surface.brand,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: typography.header.fontSize,
    fontWeight: typography.header.fontWeight,
    color: color.text.onBrand,
  },
  subtitle: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: typography.subtitle.fontWeight,
    color: color.text.onBrand,
    marginTop: spacing.xs,
  },
});

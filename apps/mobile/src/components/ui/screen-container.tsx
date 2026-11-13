import type { ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { color, spacing } from '@/theme/tokens';

export interface ScreenContainerProps {
  readonly children: ReactNode;
  /** Faixa de cabeçalho, desenhada de ponta a ponta acima do conteúdo. */
  readonly header?: ReactNode;
  /** Ação fixa no rodapé da área de conteúdo (ex.: Sair no Perfil, Figma 33:33). */
  readonly footer?: ReactNode;
  /** Respiro entre a faixa e o conteúdo; o padrão é 24 (Figma 33:33, 29:56). */
  readonly topSpacing?: number;
}

/**
 * Contêiner de tela: fundo da identidade, cabeçalho opcional de ponta a ponta,
 * o conteúdo com o respiro padrão (Figma 29:79: 16 nas laterais, 24 sob a
 * faixa) e um rodapé opcional fixo embaixo.
 */
export function ScreenContainer({
  children,
  header,
  footer,
  topSpacing = spacing.lg,
}: ScreenContainerProps): ReactElement {
  return (
    <View style={styles.container}>
      {header}
      <View style={[styles.body, { paddingTop: topSpacing }]}>{children}</View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.surface.default,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
});

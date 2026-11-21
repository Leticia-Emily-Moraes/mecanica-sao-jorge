import type { ReactElement, ReactNode } from 'react';
import { View } from 'react-native';

import { styles, topSpacingStyle, type TopSpacing } from './screen-container.styles';

export interface ScreenContainerProps {
  readonly children: ReactNode;
  /** Faixa de cabeçalho, desenhada de ponta a ponta acima do conteúdo. */
  readonly header?: ReactNode;
  /** Ação fixa no rodapé da área de conteúdo (ex.: Sair no Perfil, Figma 33:33). */
  readonly footer?: ReactNode;
  /**
   * Respiro entre a faixa e o conteúdo: `default` = 24 (Figma 33:33, 29:56);
   * `form` = 30, para o formulário sem faixa de erro (Figma 29:79).
   */
  readonly topSpacing?: TopSpacing;
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
  topSpacing = 'default',
}: ScreenContainerProps): ReactElement {
  return (
    <View style={styles.container}>
      {header}
      <View style={[styles.body, topSpacingStyle(topSpacing)]}>{children}</View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

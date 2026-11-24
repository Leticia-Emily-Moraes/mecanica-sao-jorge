import { StatusBar } from 'expo-status-bar';
import type { ReactElement, ReactNode } from 'react';
import { View } from 'react-native';

import { horizontalPaddingStyle, styles } from './screen-container.styles';
import type { HorizontalPadding } from './screen-container.styles';

export interface ScreenContainerProps {
  readonly children: ReactNode;
  /** Centraliza o conteúdo na vertical (ex.: Login). */
  readonly centered?: boolean;
  /** Margem lateral: `default` = 16 do Figma; `form` = 28 do Login (16 + 12). */
  readonly horizontalPadding?: HorizontalPadding;
  /**
   * Estilo dos ícones da barra de status sobre o fundo da tela. `dark` sobre o
   * fundo claro (Login); telas com cabeçalho petro deixam o cabeçalho definir.
   */
  readonly statusBarStyle?: 'dark';
}

/** Contêiner de tela: preenche a área, aplica o fundo Pampas e a margem lateral da identidade. */
export function ScreenContainer({
  children,
  centered = false,
  horizontalPadding = 'default',
  statusBarStyle,
}: ScreenContainerProps): ReactElement {
  return (
    <View
      style={[
        styles.container,
        horizontalPaddingStyle(horizontalPadding),
        centered && styles.centered,
      ]}
    >
      {statusBarStyle ? <StatusBar style={statusBarStyle} /> : null}
      {children}
    </View>
  );
}

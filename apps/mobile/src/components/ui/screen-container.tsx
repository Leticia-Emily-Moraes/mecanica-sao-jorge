import { StatusBar } from 'expo-status-bar';
import type { ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { color, layout, spacing } from '@/theme/tokens';

export interface ScreenContainerProps {
  readonly children: ReactNode;
  /** Centraliza o conteúdo na vertical (ex.: Login). */
  readonly centered?: boolean;
  /** Margem lateral; o padrão do Figma é 16. O Login usa 28 (16 + 12). */
  readonly horizontalPadding?: number;
  /**
   * Estilo dos ícones da barra de status sobre o fundo da tela. `dark` sobre o
   * fundo claro (Login); telas com cabeçalho petro deixam o cabeçalho definir.
   */
  readonly statusBarStyle?: 'dark';
  /**
   * Limita o conteúdo a uma coluna centrada em telas largas (768 e 1280), em vez
   * de esticar cartões e campos por toda a largura. No celular não muda nada.
   */
  readonly constrained?: boolean;
}

/** Contêiner de tela: preenche a área, aplica o fundo Pampas e a margem lateral da identidade. */
export function ScreenContainer({
  children,
  centered = false,
  horizontalPadding = spacing.md,
  statusBarStyle,
  constrained = false,
}: ScreenContainerProps): ReactElement {
  return (
    <View
      style={[
        styles.container,
        { paddingHorizontal: horizontalPadding },
        centered && styles.centered,
        constrained && styles.constrained,
      ]}
    >
      {statusBarStyle ? <StatusBar style={statusBarStyle} /> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.surface.background,
  },
  centered: {
    justifyContent: 'center',
  },
  constrained: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
});

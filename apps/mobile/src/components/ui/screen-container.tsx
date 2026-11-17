import { StatusBar } from 'expo-status-bar';
import type { ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { color, spacing } from '@/theme/tokens';

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
}

/** Contêiner de tela: preenche a área, aplica o fundo Pampas e a margem lateral da identidade. */
export function ScreenContainer({
  children,
  centered = false,
  horizontalPadding = spacing.md,
  statusBarStyle,
}: ScreenContainerProps): ReactElement {
  return (
    <View
      style={[
        styles.container,
        { paddingHorizontal: horizontalPadding },
        centered && styles.centered,
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
});

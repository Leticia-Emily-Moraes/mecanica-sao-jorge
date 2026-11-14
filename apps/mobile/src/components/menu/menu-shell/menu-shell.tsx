import type { ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { MenuTabBar } from '@/components/menu/menu-tab-bar';
import { color } from '@/theme/tokens';

export interface MenuShellProps {
  /** Conteúdo da aba ativa (a rota filha). */
  readonly children: ReactNode;
}

/** Casca do menu principal: área de conteúdo acima e a tab bar fixa embaixo. */
export function MenuShell({ children }: MenuShellProps): ReactElement {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <MenuTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.surface.default,
  },
  content: {
    flex: 1,
  },
});

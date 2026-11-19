import type { ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { MenuTabBar } from '@/components/menu/menu-tab-bar';
import type { MenuTabKey } from '@/components/menu/menu-tab-bar';
import { color } from '@/theme/tokens';

export interface MenuShellProps {
  /** Conteúdo da aba ativa (a rota filha). */
  readonly children: ReactNode;
  readonly selectedTab?: MenuTabKey | null;
  readonly onSelectTab?: (key: MenuTabKey) => void;
}

/** Casca do menu principal: área de conteúdo acima e a tab bar fixa embaixo. */
export function MenuShell({ children, selectedTab, onSelectTab }: MenuShellProps): ReactElement {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <MenuTabBar selectedKey={selectedTab} onSelect={onSelectTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.surface.background,
  },
  content: {
    flex: 1,
  },
});

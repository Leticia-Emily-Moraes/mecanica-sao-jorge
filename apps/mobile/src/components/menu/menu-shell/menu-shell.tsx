import type { ReactElement, ReactNode } from 'react';
import { View } from 'react-native';

import { MenuTabBar } from '@/components/menu/menu-tab-bar';
import type { MenuTabKey } from '@/navigation/menu-tab-key';

import { styles } from './menu-shell.styles';

export interface MenuShellProps {
  /** Conteúdo da aba ativa (a rota filha). */
  readonly children: ReactNode;
  readonly selectedTab?: MenuTabKey | null;
  readonly onSelectTab?: (key: MenuTabKey) => void;
  /** Falso em detalhe e formulários, que não têm barra inferior no desenho. */
  readonly showTabBar?: boolean;
}

/** Casca do menu principal: área de conteúdo acima e a tab bar fixa embaixo. */
export function MenuShell({
  children,
  selectedTab,
  onSelectTab,
  showTabBar = true,
}: MenuShellProps): ReactElement {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      {showTabBar ? <MenuTabBar selectedKey={selectedTab} onSelect={onSelectTab} /> : null}
    </View>
  );
}

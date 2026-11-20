import { usePathname, useRouter } from 'expo-router';

import type { MenuTabKey } from '@/navigation/menu-tab-key';

export interface MenuTabs {
  readonly selectedTab: MenuTabKey | null;
  /** A barra inferior só aparece nas telas de lista; detalhe e formulários ficam sem ela. */
  readonly showTabBar: boolean;
  readonly selectTab: (key: MenuTabKey) => void;
}

/** Aba escolhida a partir do caminho; só Clientes tem rota por enquanto. */
export function tabDoCaminho(caminho: string): MenuTabKey | null {
  return caminho === '/clientes' || caminho.startsWith('/clientes/') ? 'clientes' : null;
}

/** Telas raiz do menu (spec F35 §3): `/inicio` e a lista `/clientes`. */
export function mostrarTabBar(caminho: string): boolean {
  return caminho === '/inicio' || caminho === '/clientes';
}

/** Liga a tab bar à navegação: qual aba está ativa e para onde cada toque leva. */
export function useMenuTabs(): MenuTabs {
  const pathname = usePathname();
  const router = useRouter();

  return {
    selectedTab: tabDoCaminho(pathname),
    showTabBar: mostrarTabBar(pathname),
    selectTab: (key) => {
      if (key === 'clientes') {
        router.navigate('/clientes');
      }
    },
  };
}

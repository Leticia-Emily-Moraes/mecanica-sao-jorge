import { usePathname, useRouter } from 'expo-router';

import type { MenuTabKey } from '@/components/menu/menu-tab-bar';

export interface MenuTabs {
  readonly selectedTab: MenuTabKey | null;
  readonly selectTab: (key: MenuTabKey) => void;
}

/** Aba escolhida a partir do caminho; só Clientes tem rota por enquanto. */
export function tabDoCaminho(caminho: string): MenuTabKey | null {
  return caminho === '/clientes' || caminho.startsWith('/clientes/') ? 'clientes' : null;
}

/** Liga a tab bar à navegação: qual aba está ativa e para onde cada toque leva. */
export function useMenuTabs(): MenuTabs {
  const pathname = usePathname();
  const router = useRouter();

  return {
    selectedTab: tabDoCaminho(pathname),
    selectTab: (key) => {
      if (key === 'clientes') {
        router.navigate('/clientes');
      }
    },
  };
}

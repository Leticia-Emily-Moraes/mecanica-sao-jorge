import type { ReactElement } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarItem } from '@/components/ui/tab-bar-item';
import type { TabBarIconName } from '@/components/ui/tab-bar-item';
import { t } from '@/i18n/strings';

import { bottomInset, styles } from './menu-tab-bar.styles';

interface TabBarEntry {
  readonly key: string;
  readonly icon: TabBarIconName;
  readonly label: string;
  readonly accessibilityLabel: string;
  readonly selected: boolean;
}

/**
 * Único item navegável na Sprint 01 (US-MENU-02); os outros 4 são o
 * placeholder visual já aprovado na F34, desabilitados e sem navegação.
 */
const ENTRIES: readonly TabBarEntry[] = [
  {
    key: 'perfil',
    icon: 'person',
    label: t('menu.tabbar.perfil.rotulo'),
    accessibilityLabel: t('menu.tabbar.perfil.selecionado'),
    selected: true,
  },
  {
    key: 'clientesVeiculos',
    icon: 'car-outline',
    label: t('menu.tabbar.clientesVeiculos.rotulo'),
    accessibilityLabel: t('menu.tabbar.clientesVeiculos.indisponivel'),
    selected: false,
  },
  {
    key: 'catalogo',
    icon: 'list-outline',
    label: t('menu.tabbar.catalogo.rotulo'),
    accessibilityLabel: t('menu.tabbar.catalogo.indisponivel'),
    selected: false,
  },
  {
    key: 'ordensServico',
    icon: 'construct-outline',
    label: t('menu.tabbar.ordensServico.rotulo'),
    accessibilityLabel: t('menu.tabbar.ordensServico.indisponivel'),
    selected: false,
  },
  {
    key: 'financeiro',
    icon: 'cash-outline',
    label: t('menu.tabbar.financeiro.rotulo'),
    accessibilityLabel: t('menu.tabbar.financeiro.indisponivel'),
    selected: false,
  },
];

export function MenuTabBar(): ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, bottomInset(insets.bottom)]}>
      <View accessibilityRole="tablist" style={styles.bar}>
        {ENTRIES.map((entry) => (
          <TabBarItem
            key={entry.key}
            icon={entry.icon}
            label={entry.label}
            accessibilityLabel={entry.accessibilityLabel}
            selected={entry.selected}
            unavailable={!entry.selected}
          />
        ))}
      </View>
    </View>
  );
}

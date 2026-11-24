import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarItem } from '@/components/ui/tab-bar-item';
import type { TabBarIconName } from '@/components/ui/tab-bar-item';
import { t } from '@/i18n/strings';
import { color, layout, size } from '@/theme/tokens';

interface TabBarEntry {
  readonly key: string;
  readonly icon: TabBarIconName;
  readonly label: string;
  readonly accessibilityLabel: string;
}

/**
 * Os 4 itens do Figma, na ordem dele (Ordens, Clientes, Catálogo, Financeiro).
 * Nenhum módulo está programado ainda, então todos ficam desabilitados e sem
 * navegação (F41, P-01 do PRD, opção A). Os ícones são Ionicons parecidos com
 * os do arquivo (P-10 da planilha F41: a diferença de desenho segue aberta).
 */
const ENTRIES: readonly TabBarEntry[] = [
  {
    key: 'ordens',
    icon: 'document-text-outline',
    label: t('menu.tabbar.ordens.rotulo'),
    accessibilityLabel: t('menu.tabbar.ordens.indisponivel'),
  },
  {
    key: 'clientes',
    icon: 'people-outline',
    label: t('menu.tabbar.clientes.rotulo'),
    accessibilityLabel: t('menu.tabbar.clientes.indisponivel'),
  },
  {
    key: 'catalogo',
    icon: 'cube-outline',
    label: t('menu.tabbar.catalogo.rotulo'),
    accessibilityLabel: t('menu.tabbar.catalogo.indisponivel'),
  },
  {
    key: 'financeiro',
    icon: 'card-outline',
    label: t('menu.tabbar.financeiro.rotulo'),
    accessibilityLabel: t('menu.tabbar.financeiro.indisponivel'),
  },
];

export function MenuTabBar(): ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <View testID="menu-tab-bar" accessibilityRole="tablist" style={styles.bar}>
        {ENTRIES.map((entry) => (
          <TabBarItem
            key={entry.key}
            icon={entry.icon}
            label={entry.label}
            accessibilityLabel={entry.accessibilityLabel}
            selected={false}
            unavailable
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: color.surface.brand,
    alignItems: 'center',
  },
  // Altura explícita de 62 (frame `20:1102`): sem ela o Yoga mede a barra só pela
  // moldura do anel de foco das células e a tab bar sai cortada na base da tela.
  bar: {
    flexDirection: 'row',
    height: size.tabBar,
    width: '100%',
    maxWidth: layout.tabBarMaxWidth,
  },
});

import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarItem } from '@/components/ui/tab-bar-item';
import type { TabBarIconName } from '@/components/ui/tab-bar-item';
import { t } from '@/i18n/strings';
import { color, layout, size } from '@/theme/tokens';

export type MenuTabKey = 'ordens' | 'clientes' | 'catalogo' | 'financeiro';

interface TabBarEntry {
  readonly key: MenuTabKey;
  readonly icon: TabBarIconName;
  readonly label: string;
  readonly accessibilityLabel: string;
  /** Módulo já programado: o item navega. Os demais seguem indisponíveis. */
  readonly available: boolean;
}

/**
 * Os 4 itens do Figma, na ordem dele (Ordens, Clientes, Catálogo, Financeiro).
 * Só Clientes tem módulo (F35); os outros três seguem desabilitados e sem
 * navegação (F41, P-01 do PRD, opção A). Os ícones são Ionicons parecidos com
 * os do arquivo (P-10 da planilha F41: a diferença de desenho segue aberta).
 */
const ENTRIES: readonly TabBarEntry[] = [
  {
    key: 'ordens',
    icon: 'document-text-outline',
    label: t('menu.tabbar.ordens.rotulo'),
    accessibilityLabel: t('menu.tabbar.ordens.indisponivel'),
    available: false,
  },
  {
    key: 'clientes',
    icon: 'people-outline',
    label: t('menu.tabbar.clientes.rotulo'),
    accessibilityLabel: t('menu.tabbar.clientes.acessivel'),
    available: true,
  },
  {
    key: 'catalogo',
    icon: 'cube-outline',
    label: t('menu.tabbar.catalogo.rotulo'),
    accessibilityLabel: t('menu.tabbar.catalogo.indisponivel'),
    available: false,
  },
  {
    key: 'financeiro',
    icon: 'card-outline',
    label: t('menu.tabbar.financeiro.rotulo'),
    accessibilityLabel: t('menu.tabbar.financeiro.indisponivel'),
    available: false,
  },
];

export interface MenuTabBarProps {
  /** Aba da rota atual; `null` quando a rota não pertence a nenhuma aba. */
  readonly selectedKey?: MenuTabKey | null;
  readonly onSelect?: (key: MenuTabKey) => void;
}

export function MenuTabBar({ selectedKey = null, onSelect }: MenuTabBarProps): ReactElement {
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
            selected={entry.available && entry.key === selectedKey}
            unavailable={!entry.available}
            onPress={entry.available ? () => onSelect?.(entry.key) : undefined}
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

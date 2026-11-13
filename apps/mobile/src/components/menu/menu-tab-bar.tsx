import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { t } from '@/i18n/strings';
import {
  color,
  iconSize,
  layout,
  minTouchTarget,
  opacity,
  radius,
  spacing,
  typography,
} from '@/theme/tokens';
import { useFocusRing } from '@/theme/use-focus-ring';

type NomeIcone = ComponentProps<typeof Ionicons>['name'];

interface ItemTabBar {
  readonly chave: string;
  readonly icone: NomeIcone;
  readonly rotuloVisivel: string;
  readonly rotuloAcessivel: string;
  readonly selecionado: boolean;
}

/**
 * Único item navegável na Sprint 01 (US-MENU-02); os outros 4 são o
 * placeholder visual já aprovado na F34, desabilitados e sem navegação.
 */
const ITENS: readonly ItemTabBar[] = [
  {
    chave: 'perfil',
    icone: 'person',
    rotuloVisivel: t('menu.tabbar.perfil.rotulo'),
    rotuloAcessivel: t('menu.tabbar.perfil.selecionado'),
    selecionado: true,
  },
  {
    chave: 'clientesVeiculos',
    icone: 'car-outline',
    rotuloVisivel: t('menu.tabbar.clientesVeiculos.rotulo'),
    rotuloAcessivel: t('menu.tabbar.clientesVeiculos.indisponivel'),
    selecionado: false,
  },
  {
    chave: 'catalogo',
    icone: 'list-outline',
    rotuloVisivel: t('menu.tabbar.catalogo.rotulo'),
    rotuloAcessivel: t('menu.tabbar.catalogo.indisponivel'),
    selecionado: false,
  },
  {
    chave: 'ordensServico',
    icone: 'construct-outline',
    rotuloVisivel: t('menu.tabbar.ordensServico.rotulo'),
    rotuloAcessivel: t('menu.tabbar.ordensServico.indisponivel'),
    selecionado: false,
  },
  {
    chave: 'financeiro',
    icone: 'cash-outline',
    rotuloVisivel: t('menu.tabbar.financeiro.rotulo'),
    rotuloAcessivel: t('menu.tabbar.financeiro.indisponivel'),
    selecionado: false,
  },
];

export function MenuTabBar(): ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <View accessibilityRole="tablist" style={styles.barra}>
        {ITENS.map((item) => (
          <MenuTabItem key={item.chave} item={item} />
        ))}
      </View>
    </View>
  );
}

function MenuTabItem({ item }: { item: ItemTabBar }): ReactElement {
  const { focusRingStyle, onFocus, onBlur } = useFocusRing();

  return (
    <View style={[styles.celula, focusRingStyle]}>
      <Pressable
        accessibilityRole="tab"
        accessibilityLabel={item.rotuloAcessivel}
        accessibilityState={{ selected: item.selecionado, disabled: !item.selecionado }}
        disabled={!item.selecionado}
        onFocus={onFocus}
        onBlur={onBlur}
        style={styles.pressable}
      >
        <View style={[styles.conteudo, item.selecionado && styles.pill]}>
          <Ionicons
            name={item.icone}
            size={iconSize.tab}
            color={item.selecionado ? color.text.onPrimaryAction : color.text.onBrand}
            style={!item.selecionado && styles.opacidadeIndisponivel}
          />
          <Text
            style={[
              styles.rotulo,
              item.selecionado ? styles.rotuloSelecionado : styles.rotuloIndisponivel,
            ]}
            numberOfLines={1}
          >
            {item.rotuloVisivel}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: color.surface.brand,
    alignItems: 'center',
  },
  barra: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: layout.tabBarMaxWidth,
  },
  celula: {
    flex: 1,
    borderRadius: radius.md,
  },
  pressable: {
    flex: 1,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  conteudo: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  pill: {
    backgroundColor: color.action.primaryBackground,
  },
  opacidadeIndisponivel: {
    opacity: opacity.unavailable,
  },
  rotulo: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.label.fontWeight,
  },
  rotuloSelecionado: {
    color: color.text.onPrimaryAction,
  },
  rotuloIndisponivel: {
    color: color.text.onBrand,
    opacity: opacity.unavailable,
  },
});

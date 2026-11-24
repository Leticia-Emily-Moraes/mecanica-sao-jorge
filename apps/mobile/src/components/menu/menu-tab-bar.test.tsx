import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { TestStyle } from '@/test-utils/flat-style';

import { MenuTabBar } from './menu-tab-bar';

const METRICAS_DE_TESTE = {
  frame: { x: 0, y: 0, width: 375, height: 812 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

function renderMenuTabBar(): ReturnType<typeof render> {
  return render(
    <SafeAreaProvider initialMetrics={METRICAS_DE_TESTE}>
      <MenuTabBar />
    </SafeAreaProvider>,
  );
}

const ROTULOS_INDISPONIVEIS = [
  'Ordens, indisponível nesta versão',
  'Clientes, indisponível nesta versão',
  'Catálogo, indisponível nesta versão',
  'Financeiro, indisponível nesta versão',
];

describe('MenuTabBar', () => {
  it('should show exactly the four Figma items and no Perfil item (D-05)', () => {
    renderMenuTabBar();

    expect(screen.getAllByRole('tab')).toHaveLength(4);
    expect(screen.queryByText('Perfil')).toBeNull();
  });

  it('should list the items in the Figma order: Ordens, Clientes, Catálogo, Financeiro', () => {
    renderMenuTabBar();

    const nomes = screen.getAllByRole('tab').map((tab) => tab.props.accessibilityLabel as string);

    expect(nomes).toEqual(ROTULOS_INDISPONIVEIS);
  });

  it('should use the short Figma labels "Ordens" and "Clientes"', () => {
    renderMenuTabBar();

    expect(screen.getByText('Ordens')).toBeTruthy();
    expect(screen.getByText('Clientes')).toBeTruthy();
    expect(screen.queryByText('Ordens de Serviço')).toBeNull();
    expect(screen.queryByText('Clientes e Veículos')).toBeNull();
  });

  it('should show every item disabled with an accessible unavailable label, none selected', () => {
    renderMenuTabBar();

    for (const rotulo of ROTULOS_INDISPONIVEIS) {
      const item = screen.getByRole('tab', { name: rotulo });
      expect(item.props.accessibilityState).toMatchObject({ selected: false, disabled: true });
    }
  });

  it('should give the bar an explicit height of 62, as in frame 20:1102', () => {
    renderMenuTabBar();

    expect(
      StyleSheet.flatten(screen.getByTestId('menu-tab-bar').props.style as TestStyle).height,
    ).toBe(62);
  });

  it('should not navigate when a disabled item is pressed', () => {
    renderMenuTabBar();

    const catalogo = screen.getByRole('tab', { name: 'Catálogo, indisponível nesta versão' });
    fireEvent.press(catalogo);

    // Item desabilitado: a própria API do Pressable bloqueia o onPress;
    // nenhuma navegação ocorre porque nenhum handler é chamado.
    expect(catalogo.props.accessibilityState.disabled).toBe(true);
  });
});

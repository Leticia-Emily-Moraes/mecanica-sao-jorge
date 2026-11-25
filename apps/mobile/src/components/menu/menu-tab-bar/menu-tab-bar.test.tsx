import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { TestStyle } from '@/test-utils/flat-style';

import { MenuTabBar } from './menu-tab-bar';
import type { MenuTabBarProps } from './menu-tab-bar';

const METRICAS_DE_TESTE = {
  frame: { x: 0, y: 0, width: 375, height: 812 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

function renderMenuTabBar(props: MenuTabBarProps = {}): ReturnType<typeof render> {
  return render(
    <SafeAreaProvider initialMetrics={METRICAS_DE_TESTE}>
      <MenuTabBar {...props} />
    </SafeAreaProvider>,
  );
}

const ROTULOS = [
  'Ordens, indisponível nesta versão',
  'Clientes',
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

    expect(nomes).toEqual(ROTULOS);
  });

  it('should use the short Figma labels "Ordens" and "Clientes"', () => {
    renderMenuTabBar();

    expect(screen.getByText('Ordens')).toBeTruthy();
    expect(screen.getByText('Clientes')).toBeTruthy();
    expect(screen.queryByText('Ordens de Serviço')).toBeNull();
    expect(screen.queryByText('Clientes e Veículos')).toBeNull();
  });

  it('should enable only Clientes and keep the other three disabled', () => {
    renderMenuTabBar();

    expect(screen.getByRole('tab', { name: 'Clientes' }).props.accessibilityState).toMatchObject({
      disabled: false,
    });
    for (const rotulo of ROTULOS.filter((nome) => nome !== 'Clientes')) {
      const item = screen.getByRole('tab', { name: rotulo });
      expect(item.props.accessibilityState).toMatchObject({ selected: false, disabled: true });
    }
  });

  it('should select no item when the route belongs to no tab', () => {
    renderMenuTabBar({ selectedKey: null });

    expect(screen.queryByRole('tab', { selected: true })).toBeNull();
  });

  it('should mark Clientes as selected when it is the current tab', () => {
    renderMenuTabBar({ selectedKey: 'clientes' });

    expect(screen.getByRole('tab', { selected: true, name: 'Clientes' })).toBeTruthy();
  });

  it('should never mark a disabled tab as selected', () => {
    renderMenuTabBar({ selectedKey: 'ordens' });

    expect(screen.queryByRole('tab', { selected: true })).toBeNull();
  });

  it('should call onSelect with clientes when Clientes is pressed', () => {
    const onSelect = jest.fn();
    renderMenuTabBar({ onSelect });

    fireEvent.press(screen.getByRole('tab', { name: 'Clientes' }));

    expect(onSelect).toHaveBeenCalledWith('clientes');
  });

  it('should not call onSelect when a disabled item is pressed', () => {
    const onSelect = jest.fn();
    renderMenuTabBar({ onSelect });

    fireEvent.press(screen.getByRole('tab', { name: 'Catálogo, indisponível nesta versão' }));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('should give the bar an explicit height of 62, as in frame 20:1102', () => {
    renderMenuTabBar();

    expect(
      StyleSheet.flatten(screen.getByTestId('menu-tab-bar').props.style as TestStyle).height,
    ).toBe(62);
  });
});

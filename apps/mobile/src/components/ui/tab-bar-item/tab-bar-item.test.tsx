import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet, type ViewStyle } from 'react-native';

import type { TreeNode } from '@/test-utils/render-tree';
import { color, layout } from '@/theme/tokens';

import { TabBarItem } from './tab-bar-item';

/** Estilo da célula (View que envolve o Pressable), onde o anel é desenhado. */
function cellStyle(): ViewStyle {
  let cell: TreeNode | null = screen.getByRole('tab').parent;
  while (cell && StyleSheet.flatten(cell.props.style as ViewStyle)?.borderWidth === undefined) {
    cell = cell.parent;
  }
  return StyleSheet.flatten(cell?.props.style as ViewStyle);
}

describe('TabBarItem', () => {
  it('should expose the tab role with the accessible label and the selected state', () => {
    render(
      <TabBarItem
        icon="person"
        label="Perfil"
        accessibilityLabel="Perfil, aba selecionada"
        selected
      />,
    );

    const tab = screen.getByRole('tab', { name: 'Perfil, aba selecionada' });

    expect(tab.props.accessibilityState).toMatchObject({ selected: true, disabled: false });
    expect(screen.getByText('Perfil')).toBeTruthy();
  });

  it('should report disabled and not call onPress when unavailable', () => {
    const onPress = jest.fn();
    render(
      <TabBarItem
        icon="list-outline"
        label="Catálogo"
        accessibilityLabel="Catálogo, indisponível nesta versão"
        selected={false}
        unavailable
        onPress={onPress}
      />,
    );

    const tab = screen.getByRole('tab', { name: 'Catálogo, indisponível nesta versão' });
    fireEvent.press(tab);

    expect(tab.props.accessibilityState).toMatchObject({ selected: false, disabled: true });
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should call onPress when available and pressed', () => {
    const onPress = jest.fn();
    render(
      <TabBarItem
        icon="person"
        label="Perfil"
        accessibilityLabel="Perfil"
        selected={false}
        onPress={onPress}
      />,
    );

    fireEvent.press(screen.getByRole('tab', { name: 'Perfil' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should draw a white ring only while focused (visible over the petro bar, 12,12:1)', () => {
    render(<TabBarItem icon="person" label="Perfil" accessibilityLabel="Perfil" selected />);

    expect(cellStyle().borderColor).toBe('transparent');

    fireEvent(screen.getByRole('tab', { name: 'Perfil' }), 'focus');
    expect(cellStyle().borderColor).toBe(color.focus.ringOnBrand);

    fireEvent(screen.getByRole('tab', { name: 'Perfil' }), 'blur');
    expect(cellStyle().borderColor).toBe('transparent');
  });

  it('should not fill the cell with white when focused, which would hide the white icon and label', () => {
    render(<TabBarItem icon="person" label="Perfil" accessibilityLabel="Perfil" selected />);

    fireEvent(screen.getByRole('tab', { name: 'Perfil' }), 'focus');

    expect(cellStyle().backgroundColor).toBeUndefined();
  });

  it('should draw the pill only behind the icon, not around the label', () => {
    render(<TabBarItem icon="person" label="Perfil" accessibilityLabel="Perfil" selected />);

    const pillHost = screen.getByTestId('tab-pill');
    const pill = StyleSheet.flatten(pillHost.props.style as ViewStyle);

    expect(pill).toMatchObject({
      width: layout.tabPillWidth,
      height: layout.tabPillHeight,
      backgroundColor: color.action.primaryBackground,
    });
  });

  it('should let a long label wrap to two lines instead of truncating it (Figma 39:3)', () => {
    render(
      <TabBarItem
        icon="car-outline"
        label="Clientes e Veículos"
        accessibilityLabel="Clientes e Veículos, indisponível nesta versão"
        selected={false}
        unavailable
      />,
    );

    expect(screen.getByText('Clientes e Veículos').props.numberOfLines).toBe(2);
  });

  it('should show the label in 10 pt, semi bold only when selected', () => {
    const { rerender } = render(
      <TabBarItem icon="person" label="Perfil" accessibilityLabel="Perfil" selected />,
    );
    expect(StyleSheet.flatten(screen.getByText('Perfil').props.style)).toMatchObject({
      fontSize: 10,
      fontWeight: '600',
    });

    rerender(
      <TabBarItem icon="person" label="Perfil" accessibilityLabel="Perfil" selected={false} />,
    );
    expect(StyleSheet.flatten(screen.getByText('Perfil').props.style)).toMatchObject({
      fontSize: 10,
      fontWeight: '400',
    });
  });
});

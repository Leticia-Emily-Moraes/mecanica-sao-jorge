import { fireEvent, render, screen } from '@testing-library/react-native';

import { hasFocusRing } from '@/test-utils/has-focus-ring';

import { TabBarItem } from './tab-bar-item';

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

  it('should draw the focus ring only while focused', () => {
    render(<TabBarItem icon="person" label="Perfil" accessibilityLabel="Perfil" selected />);

    expect(hasFocusRing(screen.getByRole('tab', { name: 'Perfil' }))).toBe(false);

    fireEvent(screen.getByRole('tab', { name: 'Perfil' }), 'focus');
    expect(hasFocusRing(screen.getByRole('tab', { name: 'Perfil' }))).toBe(true);

    fireEvent(screen.getByRole('tab', { name: 'Perfil' }), 'blur');
    expect(hasFocusRing(screen.getByRole('tab', { name: 'Perfil' }))).toBe(false);
  });
});

import { fireEvent, render, screen } from '@testing-library/react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import type { TestStyle } from '@/test-utils/flat-style';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { color, size } from '@/theme/tokens';

import { ScreenHeader, type ScreenHeaderProps } from './screen-header';

const METRICAS_DE_TESTE = {
  frame: { x: 0, y: 0, width: 360, height: 740 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

function renderHeader(props: ScreenHeaderProps): ReturnType<typeof render> {
  return render(
    <SafeAreaProvider initialMetrics={METRICAS_DE_TESTE}>
      <ScreenHeader {...props} />
    </SafeAreaProvider>,
  );
}

describe('ScreenHeader', () => {
  it('should expose the title with the header role', () => {
    renderHeader({ title: 'Perfil' });

    expect(screen.getByRole('header', { name: 'Perfil' })).toBeTruthy();
  });

  it('should draw the petro bar below the status bar inset, with white title text', () => {
    renderHeader({ title: 'Perfil' });

    expect(
      StyleSheet.flatten(screen.getByTestId('screen-header').props.style as TestStyle),
    ).toMatchObject({
      backgroundColor: color.surface.brand,
      paddingTop: 44,
    });
    expect(StyleSheet.flatten(screen.getByRole('header').props.style as TestStyle).color).toBe(
      color.text.onBrand,
    );
  });

  it('should keep light status bar icons because the area behind them is petro (A-01)', () => {
    renderHeader({ title: 'Perfil' });

    expect(screen.UNSAFE_getByType(StatusBar).props.style).toBe('light');
  });

  it('should show no buttons when neither back nor user is given', () => {
    renderHeader({ title: 'Início' });

    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('should show the back button with its accessible name and call its handler', () => {
    const onPress = jest.fn();
    renderHeader({ title: 'Perfil', back: { label: 'Voltar', onPress } });

    fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should show the user button with its accessible name and call its handler', () => {
    const onPress = jest.fn();
    renderHeader({ title: 'Início', user: { label: 'Perfil', onPress } });

    fireEvent.press(screen.getByRole('button', { name: 'Perfil' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should show the icon action with its accessible name and call its handler', () => {
    const onPress = jest.fn();
    renderHeader({
      title: 'Maria Souza',
      back: { label: 'Voltar', onPress: jest.fn() },
      action: { label: 'Editar cliente', icon: 'create-outline', onPress },
    });

    fireEvent.press(screen.getByRole('button', { name: 'Editar cliente' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should show a single trailing button when both user and action are given', () => {
    renderHeader({
      title: 'Maria Souza',
      user: { label: 'Perfil', onPress: jest.fn() },
      action: { label: 'Editar cliente', icon: 'create-outline', onPress: jest.fn() },
    });

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Editar cliente' })).toBeTruthy();
  });

  it('should keep the focus order back button, title, user button', () => {
    renderHeader({
      title: 'Meio',
      back: { label: 'Voltar', onPress: jest.fn() },
      user: { label: 'Perfil', onPress: jest.fn() },
    });

    // A ordem de foco do leitor de tela é a ordem dos nós na árvore.
    const tree = JSON.stringify(screen.toJSON());

    expect(tree.indexOf('"Voltar"')).toBeGreaterThan(-1);
    expect(tree.indexOf('"Voltar"')).toBeLessThan(tree.indexOf('"Meio"'));
    expect(tree.indexOf('"Meio"')).toBeLessThan(tree.indexOf('"Perfil"'));
  });

  it('should keep the bar 56 high', () => {
    renderHeader({ title: 'Perfil' });

    expect(
      StyleSheet.flatten(screen.getByTestId('screen-header-bar').props.style as TestStyle).height,
    ).toBe(size.appBar);
  });
});

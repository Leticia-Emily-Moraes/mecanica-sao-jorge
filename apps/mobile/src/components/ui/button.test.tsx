import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { hasFocusRing } from '@/test-utils/has-focus-ring';
import { layout, minTouchTarget, opacity } from '@/theme/tokens';

import { Button } from './button';

describe('Button', () => {
  it('should expose the button role and the label as accessible name when rendered', () => {
    render(<Button label="Entrar" onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Entrar' })).toBeTruthy();
  });

  it('should prefer accessibilityLabel over the visible label when both are given', () => {
    render(<Button label="Sair" accessibilityLabel="Sair da conta" onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Sair da conta' })).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button label="Entrar" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress and report disabled when disabled', () => {
    const onPress = jest.fn();
    render(<Button label="Entrar" onPress={onPress} disabled />);

    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Entrar', disabled: true })).toBeTruthy();
  });

  it('should show the loading label, report busy and ignore presses when loading', () => {
    const onPress = jest.fn();
    render(<Button label="Entrar" loadingLabel="Entrando..." loading onPress={onPress} />);

    expect(screen.getByText('Entrando...')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Entrar', busy: true })).toBeTruthy();
  });

  it('should keep the full color while loading, so the label stays readable (AA)', () => {
    render(<Button label="Entrar" loadingLabel="Entrando..." loading onPress={jest.fn()} />);

    const style = StyleSheet.flatten(screen.getByRole('button', { name: 'Entrar' }).props.style);

    expect(style.opacity).toBeUndefined();
  });

  it('should dim the button when explicitly disabled', () => {
    render(<Button label="Entrar" onPress={jest.fn()} disabled />);

    const style = StyleSheet.flatten(screen.getByRole('button', { name: 'Entrar' }).props.style);

    expect(style.opacity).toBe(opacity.disabled);
  });

  it('should fall back to the label while loading when no loadingLabel is given', () => {
    render(<Button label="Entrar" loading onPress={jest.fn()} />);

    expect(screen.getByText('Entrar')).toBeTruthy();
  });

  it('should be as tall as the touch target by default', () => {
    render(<Button label="Entrar" onPress={jest.fn()} />);

    const style = StyleSheet.flatten(screen.getByRole('button', { name: 'Entrar' }).props.style);

    expect(style.minHeight).toBe(minTouchTarget);
  });

  it('should use the page button height when size is page', () => {
    render(<Button label="Entrar" size="page" onPress={jest.fn()} />);

    const style = StyleSheet.flatten(screen.getByRole('button', { name: 'Entrar' }).props.style);

    expect(style.minHeight).toBe(layout.pageButtonHeight);
  });

  it('should draw the focus ring only while focused', () => {
    render(<Button label="Entrar" onPress={jest.fn()} />);
    const button = screen.getByRole('button', { name: 'Entrar' });

    expect(hasFocusRing(button)).toBe(false);

    fireEvent(button, 'focus');
    expect(hasFocusRing(screen.getByRole('button', { name: 'Entrar' }))).toBe(true);

    fireEvent(button, 'blur');
    expect(hasFocusRing(screen.getByRole('button', { name: 'Entrar' }))).toBe(false);
  });
});

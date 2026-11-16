import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import type { TestStyle } from '@/test-utils/flat-style';

import { hasFocusRing } from '@/test-utils/has-focus-ring';
import { color } from '@/theme/tokens';

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

  it('should fall back to the label while loading when no loadingLabel is given', () => {
    render(<Button label="Entrar" loading onPress={jest.fn()} />);

    expect(screen.getByText('Entrar')).toBeTruthy();
  });

  it('should draw 50 of height with radius 8 and keep the touch area at 48 or more', () => {
    render(<Button label="Entrar" onPress={jest.fn()} />);

    const style = StyleSheet.flatten(
      screen.getByRole('button', { name: 'Entrar' }).props.style as TestStyle,
    );

    expect(style).toMatchObject({ height: 50, borderRadius: 8 });
    expect(screen.getByRole('button', { name: 'Entrar' }).props.hitSlop).toEqual({
      top: 0,
      bottom: 0,
    });
  });

  it('should paint the primary variant Crail with white text', () => {
    render(<Button label="Entrar" onPress={jest.fn()} />);

    expect(
      StyleSheet.flatten(screen.getByRole('button', { name: 'Entrar' }).props.style as TestStyle),
    ).toMatchObject({ backgroundColor: color.action.primaryBackground });
    expect(StyleSheet.flatten(screen.getByText('Entrar').props.style as TestStyle).color).toBe(
      color.text.onPrimaryAction,
    );
  });

  it('should paint the secondary variant with a petro outline and petro text (Cancelar)', () => {
    render(<Button label="Cancelar" variant="secondary" onPress={jest.fn()} />);

    expect(
      StyleSheet.flatten(screen.getByRole('button', { name: 'Cancelar' }).props.style as TestStyle),
    ).toMatchObject({ borderColor: color.text.primary, borderWidth: 1 });
    expect(StyleSheet.flatten(screen.getByText('Cancelar').props.style as TestStyle).color).toBe(
      color.text.primary,
    );
  });

  it('should paint the outlineAccent variant with a Westar outline and Crail text (Sair da conta)', () => {
    render(<Button label="Sair da conta" variant="outlineAccent" onPress={jest.fn()} />);

    expect(
      StyleSheet.flatten(
        screen.getByRole('button', { name: 'Sair da conta' }).props.style as TestStyle,
      ),
    ).toMatchObject({ borderColor: color.border.divider, borderWidth: 1 });
    expect(
      StyleSheet.flatten(screen.getByText('Sair da conta').props.style as TestStyle).color,
    ).toBe(color.text.error);
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

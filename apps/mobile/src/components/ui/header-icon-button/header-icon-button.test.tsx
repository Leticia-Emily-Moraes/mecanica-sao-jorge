import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { hasFocusRing } from '@/test-utils/has-focus-ring';
import type { TestStyle } from '@/test-utils/flat-style';
import { color } from '@/theme/tokens';

import { HeaderIconButton } from './header-icon-button';

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

describe('HeaderIconButton', () => {
  it('should expose the button role with the given accessible name', () => {
    render(
      <HeaderIconButton icon="person-outline" accessibilityLabel="Perfil" onPress={jest.fn()} />,
    );

    expect(screen.getByRole('button', { name: 'Perfil' })).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    render(<HeaderIconButton icon="chevron-back" accessibilityLabel="Voltar" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should draw 36 x 36 with radius 8 on the translucent white over petro', () => {
    render(
      <HeaderIconButton icon="chevron-back" accessibilityLabel="Voltar" onPress={jest.fn()} />,
    );

    expect(
      StyleSheet.flatten(screen.getByRole('button', { name: 'Voltar' }).props.style as TestStyle),
    ).toMatchObject({
      width: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: color.surface.onBrandControl,
    });
  });

  it('should draw the white focus ring only while focused (F45 N-05, WCAG 2.4.7)', () => {
    render(
      <HeaderIconButton icon="chevron-back" accessibilityLabel="Voltar" onPress={jest.fn()} />,
    );
    const button = screen.getByRole('button', { name: 'Voltar' });

    expect(hasFocusRing(button, color.focus.ringOnBrand)).toBe(false);

    fireEvent(button, 'focus');
    expect(
      hasFocusRing(screen.getByRole('button', { name: 'Voltar' }), color.focus.ringOnBrand),
    ).toBe(true);

    fireEvent(screen.getByRole('button', { name: 'Voltar' }), 'blur');
    expect(
      hasFocusRing(screen.getByRole('button', { name: 'Voltar' }), color.focus.ringOnBrand),
    ).toBe(false);
  });

  it('should keep the 36 x 36 box and the translucent fill while focused', () => {
    render(
      <HeaderIconButton icon="chevron-back" accessibilityLabel="Voltar" onPress={jest.fn()} />,
    );

    fireEvent(screen.getByRole('button', { name: 'Voltar' }), 'focus');

    expect(
      StyleSheet.flatten(screen.getByRole('button', { name: 'Voltar' }).props.style as TestStyle),
    ).toMatchObject({
      width: 36,
      height: 36,
      backgroundColor: color.surface.onBrandControl,
    });
  });

  it('should extend the touch area to 48 by hitSlop without changing the 36 visible size', () => {
    render(
      <HeaderIconButton icon="chevron-back" accessibilityLabel="Voltar" onPress={jest.fn()} />,
    );

    expect(screen.getByRole('button', { name: 'Voltar' }).props.hitSlop).toEqual({
      top: 6,
      bottom: 6,
      left: 6,
      right: 6,
    });
  });
});

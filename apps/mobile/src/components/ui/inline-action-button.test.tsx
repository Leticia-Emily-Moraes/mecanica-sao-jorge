import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import type { TestStyle } from '@/test-utils/flat-style';
import { hasFocusRing } from '@/test-utils/has-focus-ring';
import { color, fontFamily } from '@/theme/tokens';

import { InlineActionButton } from './inline-action-button';

describe('InlineActionButton', () => {
  it('should expose the button role with the label as accessible name', () => {
    render(<InlineActionButton label="Mostrar senha" onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Mostrar senha' })).toBeTruthy();
  });

  it('should show the short label and expose the longer accessible name (WCAG 2.5.3)', () => {
    render(
      <InlineActionButton label="Mostrar" accessibilityLabel="Mostrar senha" onPress={jest.fn()} />,
    );

    const button = screen.getByRole('button', { name: 'Mostrar senha' });

    expect(screen.getByText('Mostrar')).toBeTruthy();
    expect(button.props.accessibilityLabel).toContain('Mostrar');
  });

  it('should draw the label in Inter Medium 13 in Flint, as the Mostrar action of the frames (R-3)', () => {
    render(<InlineActionButton label="Mostrar" onPress={jest.fn()} />);

    expect(StyleSheet.flatten(screen.getByText('Mostrar').props.style as TestStyle)).toMatchObject({
      fontFamily: fontFamily.bodyMedium,
      fontSize: 13,
      color: color.text.secondary,
    });
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    render(<InlineActionButton label="Mostrar senha" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button', { name: 'Mostrar senha' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress and report disabled when disabled', () => {
    const onPress = jest.fn();
    render(<InlineActionButton label="Mostrar senha" onPress={onPress} disabled />);

    fireEvent.press(screen.getByRole('button', { name: 'Mostrar senha', disabled: true }));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('should draw the focus ring only while focused', () => {
    render(<InlineActionButton label="Mostrar senha" onPress={jest.fn()} />);
    const button = screen.getByRole('button', { name: 'Mostrar senha' });

    expect(hasFocusRing(button)).toBe(false);

    fireEvent(button, 'focus');
    expect(hasFocusRing(screen.getByRole('button', { name: 'Mostrar senha' }))).toBe(true);
  });
});

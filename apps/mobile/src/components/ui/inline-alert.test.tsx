import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { borderWidth, color } from '@/theme/tokens';

import { InlineAlert } from './inline-alert';

describe('InlineAlert', () => {
  it('should show the message inside an element with the alert role', () => {
    render(<InlineAlert message="E-mail ou senha incorretos." />);

    expect(screen.getByRole('alert', { name: 'E-mail ou senha incorretos.' })).toBeTruthy();
  });

  it('should be a polite live region so screen readers announce it when it appears', () => {
    render(<InlineAlert message="E-mail ou senha incorretos." />);

    expect(screen.getByRole('alert').props.accessibilityLiveRegion).toBe('polite');
  });

  it('should draw the banner with the error tint fill and error border', () => {
    render(<InlineAlert message="E-mail ou senha incorretos." />);

    const style = StyleSheet.flatten(screen.getByRole('alert').props.style);

    expect(style).toMatchObject({
      backgroundColor: color.surface.errorTint,
      borderColor: color.text.error,
      borderWidth: borderWidth.field,
    });
  });

  it('should hide the decorative warning icon from the screen reader', () => {
    render(<InlineAlert message="E-mail ou senha incorretos." />);

    expect(
      screen.getByText('⚠', { includeHiddenElements: true }).props.accessibilityElementsHidden,
    ).toBe(true);
  });
});

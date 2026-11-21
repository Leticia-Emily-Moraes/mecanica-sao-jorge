import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { borderWidth, color, layout, typography } from '@/theme/tokens';

import { AlertIcon } from '@/components/ui/alert-icon';
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

  it('should draw the filled warning triangle as the decorative icon', () => {
    render(<InlineAlert message="E-mail ou senha incorretos." />);

    expect(screen.UNSAFE_getByType(AlertIcon).props.size).toBe(typography.labelSmall.fontSize);
  });

  it('should be at least 44 tall, as in the approved frame', () => {
    render(<InlineAlert message="E-mail ou senha incorretos." />);

    const style = StyleSheet.flatten(screen.getByRole('alert').props.style);

    expect(style.minHeight).toBe(layout.inlineAlertMinHeight);
    expect(layout.inlineAlertMinHeight).toBe(44);
  });
});

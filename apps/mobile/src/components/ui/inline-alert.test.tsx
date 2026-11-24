import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import type { TestStyle } from '@/test-utils/flat-style';

import { color } from '@/theme/tokens';

import { InlineAlert } from './inline-alert';

const MENSAGEM = 'Usuário ou senha incorretos. Confira os dados e tente novamente.';

describe('InlineAlert', () => {
  it('should show the message with the alert role and the message as accessible name', () => {
    render(<InlineAlert message={MENSAGEM} />);

    expect(screen.getByRole('alert', { name: MENSAGEM })).toBeTruthy();
    expect(screen.getByText(MENSAGEM)).toBeTruthy();
  });

  it('should be a polite live region so screen readers announce it when it appears', () => {
    render(<InlineAlert message={MENSAGEM} />);

    expect(screen.getByRole('alert').props.accessibilityLiveRegion).toBe('polite');
  });

  it('should draw the alert icon hidden from the accessibility tree, next to the text', () => {
    render(<InlineAlert message={MENSAGEM} />);

    const icon = screen.getByTestId('alert-icon', { includeHiddenElements: true });

    expect(icon.props.accessibilityElementsHidden).toBe(true);
    expect(icon.props.importantForAccessibility).toBe('no-hide-descendants');
  });

  it('should use the error tint, the banner border and El Salva text from the Figma', () => {
    render(<InlineAlert message={MENSAGEM} />);

    const box = StyleSheet.flatten(screen.getByRole('alert').props.style as TestStyle);
    const text = StyleSheet.flatten(screen.getByText(MENSAGEM).props.style as TestStyle);

    expect(box).toMatchObject({
      backgroundColor: color.surface.errorTint,
      borderColor: color.border.errorBanner,
      borderRadius: 8,
    });
    expect(text.color).toBe(color.text.errorOnBanner);
  });

  it('should keep the Figma measures: 1 px border, 13 margin, 10 gap, text 14 over 19.6 (V-L15)', () => {
    render(<InlineAlert message={MENSAGEM} />);

    const box = StyleSheet.flatten(screen.getByRole('alert').props.style as TestStyle);
    const text = StyleSheet.flatten(screen.getByText(MENSAGEM).props.style as TestStyle);

    expect(box).toMatchObject({
      borderWidth: 1,
      padding: 13,
      gap: 10,
      flexDirection: 'row',
    });
    expect(text).toMatchObject({ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 19.6 });
  });

  it('should draw the box in the literal Figma colors (Pot Pourri, Rose Fog, El Salva)', () => {
    render(<InlineAlert message={MENSAGEM} />);

    const box = StyleSheet.flatten(screen.getByRole('alert').props.style as TestStyle);
    const text = StyleSheet.flatten(screen.getByText(MENSAGEM).props.style as TestStyle);

    expect(box).toMatchObject({ backgroundColor: '#F6E7E5', borderColor: '#E2B5B0' });
    expect(text.color).toBe('#923631');
  });

  it('should have no fixed height: it grows with the text (R-03)', () => {
    render(<InlineAlert message={MENSAGEM} />);

    const box = StyleSheet.flatten(screen.getByRole('alert').props.style as TestStyle);

    expect(box.height).toBeUndefined();
    expect(box.minHeight).toBeUndefined();
  });
});

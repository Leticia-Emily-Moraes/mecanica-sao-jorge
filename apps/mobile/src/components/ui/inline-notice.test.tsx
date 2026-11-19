import { fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, StyleSheet } from 'react-native';

import type { TestStyle } from '@/test-utils/flat-style';
import { color, size } from '@/theme/tokens';

import { InlineNotice } from './inline-notice';

// Fonte de ícones é a borda externa: o carregamento assíncrono da fonte
// atualiza estado fora do `act` e não faz parte do que se testa aqui.
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

describe('InlineNotice', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should show the message as an alert and a polite live region', () => {
    render(<InlineNotice message="Cliente cadastrado." />);

    const notice = screen.getByTestId('inline-notice');

    expect(screen.getByText('Cliente cadastrado.')).toBeTruthy();
    expect(notice.props.accessibilityRole).toBe('alert');
    expect(notice.props.accessibilityLiveRegion).toBe('polite');
  });

  it('should announce the message once on mount for platforms without live regions', () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    announce.mockClear();

    render(<InlineNotice message="Cliente cadastrado." />);

    expect(announce).toHaveBeenCalledTimes(1);
    expect(announce).toHaveBeenCalledWith('Cliente cadastrado.');
  });

  it('should draw the success band at 44 high with white text', () => {
    render(<InlineNotice message="Cliente cadastrado." />);

    expect(
      StyleSheet.flatten(screen.getByTestId('inline-notice').props.style as TestStyle),
    ).toMatchObject({ minHeight: size.notice, backgroundColor: color.feedback.success });
    expect(
      StyleSheet.flatten(screen.getByText('Cliente cadastrado.').props.style as TestStyle).color,
    ).toBe(color.text.onBrand);
  });

  it('should show no dismiss button when no handler is given', () => {
    render(<InlineNotice message="Cliente cadastrado." />);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('should show the dismiss button with its accessible name and call its handler', () => {
    const onDismiss = jest.fn();
    render(
      <InlineNotice message="Cliente cadastrado." onDismiss={onDismiss} dismissLabel="Dispensar" />,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Dispensar' }));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should extend the dismiss touch area to 48 high', () => {
    render(
      <InlineNotice message="Cliente cadastrado." onDismiss={jest.fn()} dismissLabel="Dispensar" />,
    );

    const slop = screen.getByRole('button', { name: 'Dispensar' }).props.hitSlop as {
      top: number;
      bottom: number;
    };

    expect(size.notice + slop.top + slop.bottom).toBeGreaterThanOrEqual(48);
  });
});

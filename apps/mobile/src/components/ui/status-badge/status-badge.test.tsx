import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import type { TestStyle } from '@/test-utils/flat-style';
import { color } from '@/theme/tokens';

import { StatusBadge } from './status-badge';

function badgeStyle(): TestStyle {
  return StyleSheet.flatten(screen.getByTestId('status-badge').props.style as TestStyle);
}

describe('StatusBadge', () => {
  it('should show the status text, so the meaning never depends on color alone', () => {
    render(<StatusBadge label="EM ANDAMENTO" tone="inProgress" />);

    expect(screen.getByText('EM ANDAMENTO')).toBeTruthy();
  });

  it('should fill the in-progress badge with the in-progress color and white text', () => {
    render(<StatusBadge label="EM ANDAMENTO" tone="inProgress" />);

    expect(badgeStyle().backgroundColor).toBe(color.status.inProgress);
    expect(
      StyleSheet.flatten(screen.getByText('EM ANDAMENTO').props.style as TestStyle).color,
    ).toBe(color.text.onBrand);
  });

  it('should fill the delivered badge with the success color and white text', () => {
    render(<StatusBadge label="ENTREGUE" tone="success" />);

    expect(badgeStyle().backgroundColor).toBe(color.feedback.success);
    expect(StyleSheet.flatten(screen.getByText('ENTREGUE').props.style as TestStyle).color).toBe(
      color.text.onBrand,
    );
  });

  it('should draw the neutral badge as an outline with dark text', () => {
    render(<StatusBadge label="ABERTA" tone="neutral" />);

    expect(badgeStyle()).toMatchObject({
      backgroundColor: color.surface.default,
      borderColor: color.border.default,
    });
    expect(StyleSheet.flatten(screen.getByText('ABERTA').props.style as TestStyle).color).toBe(
      color.text.primary,
    );
  });
});

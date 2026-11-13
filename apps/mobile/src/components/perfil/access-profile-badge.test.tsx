import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { color } from '@/theme/tokens';

import { AccessProfileBadge } from './access-profile-badge';

describe('AccessProfileBadge', () => {
  it('should show the access profile label as readable text', () => {
    render(<AccessProfileBadge label="ADMIN" />);

    expect(screen.getByText('ADMIN')).toBeTruthy();
  });

  it('should draw white text over a petro pill (12,12:1)', () => {
    render(<AccessProfileBadge label="ADMIN" />);

    const text = StyleSheet.flatten(screen.getByText('ADMIN').props.style);

    expect(text.color).toBe(color.text.onBrand);
    expect(color.surface.brand).toBe('#1E3A3F');
  });
});

import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import type { TestStyle } from '@/test-utils/flat-style';

import { color } from '@/theme/tokens';

import { AccessProfileBadge } from './access-profile-badge';

describe('AccessProfileBadge', () => {
  it('should show the access profile label as readable text', () => {
    render(<AccessProfileBadge label="ADMIN" />);

    expect(screen.getByText('ADMIN')).toBeTruthy();
  });

  it('should draw a petro pill with white text, centered under the name', () => {
    render(<AccessProfileBadge label="ADMIN" />);

    const pill = screen.getByTestId('access-profile-badge');

    expect(StyleSheet.flatten(pill.props.style as TestStyle)).toMatchObject({
      backgroundColor: color.surface.brand,
      alignSelf: 'center',
      borderRadius: 999,
    });
    expect(StyleSheet.flatten(screen.getByText('ADMIN').props.style as TestStyle).color).toBe(
      color.text.onBrand,
    );
  });
});

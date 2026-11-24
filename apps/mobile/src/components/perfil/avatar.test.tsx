import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import type { TestStyle } from '@/test-utils/flat-style';

import { color, size } from '@/theme/tokens';

import { Avatar } from './avatar';

describe('Avatar', () => {
  it('should show the initials inside an 84 Spectra circle with white text', () => {
    render(<Avatar initials="JS" />);

    const initials = screen.getByText('JS', { includeHiddenElements: true });
    const circle = screen.getByTestId('avatar', { includeHiddenElements: true });

    expect(StyleSheet.flatten(circle.props.style as TestStyle)).toMatchObject({
      width: size.avatar,
      height: size.avatar,
      borderRadius: size.avatar / 2,
      backgroundColor: color.surface.avatar,
    });
    expect(StyleSheet.flatten(initials.props.style as TestStyle).color).toBe(color.text.onBrand);
  });

  it('should hide the decorative circle from screen readers (the name follows as text)', () => {
    render(<Avatar initials="JS" />);

    expect(screen.queryByText('JS')).toBeNull();
  });
});

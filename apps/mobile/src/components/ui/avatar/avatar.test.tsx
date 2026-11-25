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

  it('should draw the small variant as a 40 circle with the smaller initials', () => {
    render(<Avatar initials="FT" variant="small" />);

    const circle = screen.getByTestId('avatar', { includeHiddenElements: true });
    const initials = screen.getByText('FT', { includeHiddenElements: true });

    expect(StyleSheet.flatten(circle.props.style as TestStyle)).toMatchObject({
      width: 40,
      height: 40,
      borderRadius: 20,
    });
    expect(StyleSheet.flatten(initials.props.style as TestStyle).fontSize).toBe(17);
  });

  it('should hide the decorative circle from screen readers (the name follows as text)', () => {
    render(<Avatar initials="JS" />);

    expect(screen.queryByText('JS')).toBeNull();
  });
});

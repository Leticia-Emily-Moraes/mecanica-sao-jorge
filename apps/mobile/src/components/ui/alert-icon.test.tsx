import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import type { TestStyle } from '@/test-utils/flat-style';

import { color, iconSize } from '@/theme/tokens';

import { AlertIcon } from './alert-icon';

describe('AlertIcon', () => {
  it('should draw a circle (not a triangle) with an exclamation mark', () => {
    render(<AlertIcon />);

    const circle = StyleSheet.flatten(
      screen.getByTestId('alert-icon', { includeHiddenElements: true }).props.style as TestStyle,
    );

    expect(circle.width).toBe(iconSize.banner);
    expect(circle.height).toBe(iconSize.banner);
    expect(circle.borderRadius).toBe(iconSize.banner / 2);
    expect(screen.getByText('!', { includeHiddenElements: true })).toBeTruthy();
  });

  it('should use the El Salva color on the ring and on the mark', () => {
    render(<AlertIcon />);

    const circle = StyleSheet.flatten(
      screen.getByTestId('alert-icon', { includeHiddenElements: true }).props.style as TestStyle,
    );
    const mark = StyleSheet.flatten(
      screen.getByText('!', { includeHiddenElements: true }).props.style as TestStyle,
    );

    expect(circle.borderColor).toBe(color.text.errorOnBanner);
    expect(mark.color).toBe(color.text.errorOnBanner);
  });

  it('should stay out of the accessibility tree because the banner already announces the text', () => {
    render(<AlertIcon />);

    expect(screen.queryByText('!')).toBeNull();
  });
});

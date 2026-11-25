import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import type { TestStyle } from '@/test-utils/flat-style';
import { color, typography } from '@/theme/tokens';

import { SectionTitle } from './section-title';

describe('SectionTitle', () => {
  it('should expose the text as a header, unchanged for the screen reader', () => {
    render(<SectionTitle text="Veículos (2)" />);

    expect(screen.getByRole('header', { name: 'Veículos (2)' })).toBeTruthy();
  });

  it('should draw the text in upper case only visually, in the section title font', () => {
    render(<SectionTitle text="Veículos (2)" />);

    expect(
      StyleSheet.flatten(screen.getByText('Veículos (2)').props.style as TestStyle),
    ).toMatchObject({
      textTransform: 'uppercase',
      color: color.text.primary,
      fontFamily: typography.sectionTitle.fontFamily,
      fontSize: typography.sectionTitle.fontSize,
    });
  });
});

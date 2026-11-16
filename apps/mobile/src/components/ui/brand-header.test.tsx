import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import type { TestStyle } from '@/test-utils/flat-style';

import { color, fontFamily } from '@/theme/tokens';

import { BrandHeader } from './brand-header';

describe('BrandHeader', () => {
  it('should expose the title as a header and show the subtitle', () => {
    render(<BrandHeader title="MECÂNICA SÃO JORGE" subtitle="Gestão da oficina" />);

    expect(screen.getByRole('header', { name: 'MECÂNICA SÃO JORGE' })).toBeTruthy();
    expect(screen.getByText('Gestão da oficina')).toBeTruthy();
  });

  it('should draw the title in Barlow Condensed Bold 30 with 0.6 spacing in petro', () => {
    render(<BrandHeader title="MECÂNICA SÃO JORGE" subtitle="Gestão da oficina" />);

    expect(StyleSheet.flatten(screen.getByRole('header').props.style as TestStyle)).toMatchObject({
      fontFamily: fontFamily.displayBold,
      fontSize: 30,
      letterSpacing: 0.6,
      color: color.text.primary,
      textAlign: 'center',
    });
  });

  it('should draw the subtitle in Inter 13 with the Flint secondary color', () => {
    render(<BrandHeader title="MECÂNICA SÃO JORGE" subtitle="Gestão da oficina" />);

    expect(
      StyleSheet.flatten(screen.getByText('Gestão da oficina').props.style as TestStyle),
    ).toMatchObject({
      fontFamily: fontFamily.body,
      fontSize: 13,
      color: color.text.secondary,
    });
  });
});

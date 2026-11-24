import { statSync } from 'node:fs';
import { join } from 'node:path';

import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import type { TestStyle } from '@/test-utils/flat-style';

import { color, fontFamily } from '@/theme/tokens';

import { BrandHeader } from './brand-header';

type RenderedNode = Exclude<ReturnType<typeof screen.toJSON>, null | unknown[]>;

const renderedRoot = (): RenderedNode => screen.toJSON() as RenderedNode;

// O escudo é decorativo e sai da árvore de acessibilidade: só includeHiddenElements o encontra.
const getShield = () => screen.getByTestId('brand-shield', { includeHiddenElements: true });

describe('BrandHeader', () => {
  it('should expose the title as a header and show the subtitle', () => {
    render(<BrandHeader title="MECÂNICA SÃO JORGE" subtitle="Gestão da oficina" />);

    expect(screen.getByRole('header', { name: 'MECÂNICA SÃO JORGE' })).toBeTruthy();
    expect(screen.getByText('Gestão da oficina')).toBeTruthy();
  });

  it('should draw the shield at 84 x 96 centered, with the 10 gap to the title (frame 10:905)', () => {
    render(<BrandHeader title="MECÂNICA SÃO JORGE" subtitle="Gestão da oficina" />);

    const root = renderedRoot();
    const shield = getShield();

    expect(StyleSheet.flatten(shield.props.style as TestStyle)).toMatchObject({
      width: 84,
      height: 96,
    });
    expect(StyleSheet.flatten(root.props.style as TestStyle)).toMatchObject({
      alignItems: 'center',
      gap: 10,
    });
  });

  it('should place the shield above the title as the first child of the block', () => {
    render(<BrandHeader title="MECÂNICA SÃO JORGE" subtitle="Gestão da oficina" />);

    const children = (renderedRoot().children ?? []) as readonly RenderedNode[];

    expect(children[0]?.props.testID).toBe('brand-shield');
    expect(children[1]?.props.accessibilityRole).toBe('header');
    expect(children[2]?.children).toEqual(['Gestão da oficina']);
  });

  it('should keep the decorative shield out of the accessibility tree, without a label', () => {
    render(<BrandHeader title="MECÂNICA SÃO JORGE" subtitle="Gestão da oficina" />);

    const shield = getShield();

    expect(shield.props.accessible).toBe(false);
    expect(shield.props.importantForAccessibility).toBe('no');
    expect(shield.props.accessibilityElementsHidden).toBe(true);
    expect(shield.props.accessibilityLabel).toBeUndefined();
    expect(screen.queryByTestId('brand-shield')).toBeNull();
  });

  it('should ship the shield in 1x, 2x and 3x PNGs of at most 50 KB each', () => {
    const dir = join(__dirname, '../../../assets/brand');
    const files = ['escudo-login.png', 'escudo-login@2x.png', 'escudo-login@3x.png'];

    files.forEach((file) => {
      expect(statSync(join(dir, file)).size).toBeLessThanOrEqual(50 * 1024);
    });
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

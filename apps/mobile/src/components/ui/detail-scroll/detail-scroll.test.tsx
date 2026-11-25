import { render, screen } from '@testing-library/react-native';
import { ScrollView, StyleSheet, Text } from 'react-native';

import type { TestStyle } from '@/test-utils/flat-style';

import { DetailScroll } from './detail-scroll';

function contentStyle(): Record<string, unknown> {
  const scroll = screen.UNSAFE_getByType(ScrollView);
  return StyleSheet.flatten(scroll.props.contentContainerStyle as TestStyle) as Record<
    string,
    unknown
  >;
}

describe('DetailScroll', () => {
  it('should render the blocks with 16 on top, 24 at the bottom and 16 between them by default', () => {
    render(
      <DetailScroll>
        <Text>Bloco</Text>
      </DetailScroll>,
    );

    expect(screen.getByText('Bloco')).toBeTruthy();
    expect(contentStyle()).toMatchObject({ paddingTop: 16, paddingBottom: 24, gap: 16 });
  });

  it('should use 12 between the blocks when the gap is compact', () => {
    render(
      <DetailScroll gap="compact">
        <Text>Bloco</Text>
      </DetailScroll>,
    );

    expect(contentStyle()).toMatchObject({ gap: 12 });
  });
});

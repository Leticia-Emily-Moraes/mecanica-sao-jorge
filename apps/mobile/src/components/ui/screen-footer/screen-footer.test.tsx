import { render, screen } from '@testing-library/react-native';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { spacing } from '@/theme/tokens';

import { ScreenFooter } from './screen-footer';

const METRICAS = {
  frame: { x: 0, y: 0, width: 360, height: 740 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

describe('ScreenFooter', () => {
  it('should push its content to the bottom with 20 above the safe area', () => {
    render(
      <SafeAreaProvider initialMetrics={METRICAS}>
        <ScreenFooter>
          <Text>ação</Text>
        </ScreenFooter>
      </SafeAreaProvider>,
    );

    const style = StyleSheet.flatten(screen.getByTestId('screen-footer').props.style);

    expect(style).toMatchObject({ flex: 1, justifyContent: 'flex-end' });
    expect(style.paddingBottom).toBe(spacing.s20 + 34);
  });
});

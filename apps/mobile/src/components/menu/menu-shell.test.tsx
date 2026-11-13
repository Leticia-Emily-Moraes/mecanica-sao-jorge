import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MenuShell } from './menu-shell';

const METRICS = {
  frame: { x: 0, y: 0, width: 375, height: 812 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

describe('MenuShell', () => {
  it('should render the active route content together with the five tab bar items', () => {
    render(
      <SafeAreaProvider initialMetrics={METRICS}>
        <MenuShell>
          <Text>conteúdo da aba</Text>
        </MenuShell>
      </SafeAreaProvider>,
    );

    expect(screen.getByText('conteúdo da aba')).toBeTruthy();
    expect(screen.getAllByRole('tab')).toHaveLength(5);
  });
});

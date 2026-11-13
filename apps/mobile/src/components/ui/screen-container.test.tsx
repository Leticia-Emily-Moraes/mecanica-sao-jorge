import { render, screen } from '@testing-library/react-native';
import { StyleSheet, Text } from 'react-native';

import { color, spacing } from '@/theme/tokens';

import { ScreenContainer } from './screen-container';

function rootStyle(): ReturnType<typeof StyleSheet.flatten> {
  const root = screen.toJSON();
  if (!root || Array.isArray(root)) {
    throw new Error('Esperava um único nó raiz');
  }
  return StyleSheet.flatten(root.props.style);
}

describe('ScreenContainer', () => {
  it('should render its children', () => {
    render(
      <ScreenContainer>
        <Text>conteúdo</Text>
      </ScreenContainer>,
    );

    expect(screen.getByText('conteúdo')).toBeTruthy();
  });

  it('should fill the area with the standard padding and surface color', () => {
    render(
      <ScreenContainer>
        <Text>conteúdo</Text>
      </ScreenContainer>,
    );

    expect(rootStyle()).toMatchObject({
      flex: 1,
      padding: spacing.lg,
      backgroundColor: color.surface.default,
    });
  });

  it('should not center vertically by default', () => {
    render(
      <ScreenContainer>
        <Text>conteúdo</Text>
      </ScreenContainer>,
    );

    expect(rootStyle().justifyContent).toBeUndefined();
  });

  it('should center vertically when centered is set', () => {
    render(
      <ScreenContainer centered>
        <Text>conteúdo</Text>
      </ScreenContainer>,
    );

    expect(rootStyle().justifyContent).toBe('center');
  });
});

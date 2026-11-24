import { render, screen } from '@testing-library/react-native';
import { StyleSheet, Text, type ViewStyle } from 'react-native';

import { color, spacing } from '@/theme/tokens';

import { ScreenContainer } from './screen-container';

function rootStyle(): ViewStyle {
  const root = screen.toJSON();
  if (!root || Array.isArray(root)) {
    throw new Error('Esperava um único nó raiz');
  }
  return StyleSheet.flatten(root.props.style as ViewStyle);
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

  it('should fill the area with the Pampas background and the 16 side margin', () => {
    render(
      <ScreenContainer>
        <Text>conteúdo</Text>
      </ScreenContainer>,
    );

    expect(rootStyle()).toMatchObject({
      flex: 1,
      paddingHorizontal: spacing.md,
      backgroundColor: color.surface.background,
    });
  });

  it('should accept a custom side margin (Login uses 28)', () => {
    render(
      <ScreenContainer horizontalPadding={spacing.md + spacing.s12}>
        <Text>conteúdo</Text>
      </ScreenContainer>,
    );

    expect(rootStyle().paddingHorizontal).toBe(28);
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

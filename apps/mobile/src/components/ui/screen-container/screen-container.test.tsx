import { render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';

import { jsonChildren, jsonStyle, type JsonNode } from '@/test-utils/render-tree';
import { color, spacing } from '@/theme/tokens';

import { ScreenContainer } from './screen-container';

function root(): JsonNode {
  return screen.toJSON() as JsonNode;
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

  it('should fill the area with the surface color', () => {
    render(
      <ScreenContainer>
        <Text>conteúdo</Text>
      </ScreenContainer>,
    );

    expect(jsonStyle(root())).toMatchObject({
      flex: 1,
      backgroundColor: color.surface.default,
    });
  });

  it('should pad the content body with the standard spacing', () => {
    render(
      <ScreenContainer>
        <Text>conteúdo</Text>
      </ScreenContainer>,
    );

    expect(jsonStyle(jsonChildren(root())[0])).toMatchObject({
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
    });
  });

  it('should use topSpacing as the space under the header when given', () => {
    render(
      <ScreenContainer topSpacing="form">
        <Text>conteúdo</Text>
      </ScreenContainer>,
    );

    expect(jsonStyle(jsonChildren(root())[0])).toMatchObject({
      paddingTop: spacing.formTop,
      paddingVertical: spacing.lg,
    });
  });

  it('should pin the footer after the body, with the side padding', () => {
    render(
      <ScreenContainer footer={<View testID="rodape" />}>
        <Text>conteúdo</Text>
      </ScreenContainer>,
    );

    const [body, footer] = jsonChildren(root());

    expect(jsonStyle(body).flex).toBe(1);
    expect(jsonStyle(footer).paddingHorizontal).toBe(spacing.md);
    expect(screen.getByTestId('rodape')).toBeTruthy();
  });

  it('should not render a footer wrapper when none is given', () => {
    render(
      <ScreenContainer>
        <Text>conteúdo</Text>
      </ScreenContainer>,
    );

    expect(jsonChildren(root())).toHaveLength(1);
  });

  it('should draw the header before the padded body, outside its padding', () => {
    render(
      <ScreenContainer header={<View testID="faixa" />}>
        <Text>conteúdo</Text>
      </ScreenContainer>,
    );

    const [first, second] = jsonChildren(root());

    expect(first.props.testID).toBe('faixa');
    expect(jsonStyle(first).paddingHorizontal).toBeUndefined();
    expect(jsonStyle(second).paddingHorizontal).toBe(spacing.md);
  });
});

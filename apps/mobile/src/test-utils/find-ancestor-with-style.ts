import type { screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import type { TestStyle } from './flat-style';

type TestNode = ReturnType<typeof screen.getByRole>;

/**
 * Sobe a árvore a partir de um nó e devolve o estilo achatado do primeiro
 * ancestral que declara a propriedade, ou `undefined` se nenhum declara.
 */
export function findAncestorStyle(node: TestNode, property: string): TestStyle | undefined {
  let current: TestNode | null = node.parent;

  while (current) {
    const style = StyleSheet.flatten(current.props.style as TestStyle) as
      Record<string, unknown> | undefined;
    if (style?.[property] !== undefined) {
      return style as TestStyle;
    }
    current = current.parent;
  }

  return undefined;
}

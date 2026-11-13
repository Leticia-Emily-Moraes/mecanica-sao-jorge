import type { screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { color } from '@/theme/tokens';

type TestNode = ReturnType<typeof screen.getByRole>;

/**
 * Sobe a árvore a partir de um controle e diz se algum ancestral desenha o
 * anel de foco (borda petro). O anel só é desenhado com o controle focado:
 * sem foco a borda é transparente.
 */
export function hasFocusRing(node: TestNode): boolean {
  let current: TestNode | null = node;

  while (current) {
    const style = StyleSheet.flatten(current.props.style as never) as
      { borderColor?: string } | undefined;
    if (style?.borderColor === color.focus.ring) {
      return true;
    }
    current = current.parent;
  }

  return false;
}

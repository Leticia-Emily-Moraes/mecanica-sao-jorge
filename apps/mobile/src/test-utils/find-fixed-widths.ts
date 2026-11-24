import type { screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

type RenderedTree = ReturnType<typeof screen.toJSON>;
type RenderedNode = Exclude<RenderedTree, null | unknown[]>;

/**
 * Lista as larguras numéricas fixas (`width`, `minWidth`) declaradas na árvore
 * renderizada. O Jest não mede layout: isto só prova que nenhum estilo prende
 * o contêiner a um número, de modo que ele acompanha a largura de 320 a 430.
 */
export function findFixedWidths(tree: RenderedTree): readonly number[] {
  if (tree === null) {
    return [];
  }

  const nodes = (Array.isArray(tree) ? tree : [tree]) as readonly RenderedNode[];

  return nodes.flatMap((node) => {
    const style = StyleSheet.flatten(node.props.style as never) as
      { width?: unknown; minWidth?: unknown } | undefined;
    const own = [style?.width, style?.minWidth].filter(
      (value): value is number => typeof value === 'number',
    );
    const children = ((node.children ?? []) as readonly (RenderedNode | string)[]).filter(
      (child): child is RenderedNode => typeof child !== 'string',
    );

    return [...own, ...findFixedWidths(children as unknown as RenderedTree)];
  });
}

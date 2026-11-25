import type { screen } from '@testing-library/react-native';
import { StyleSheet, type ViewStyle } from 'react-native';

/** Nó da árvore renderizada (`screen.toJSON()`), sem depender dos tipos do react-test-renderer. */
export type JsonNode = Exclude<NonNullable<ReturnType<typeof screen.toJSON>>, readonly unknown[]>;

/** Instância de nó para subir a árvore (`getByRole(...).parent`). */
export type TreeNode = ReturnType<typeof screen.getByRole>;

/** Estilo achatado de um nó da árvore JSON. */
export function jsonStyle(node: JsonNode | undefined): ViewStyle {
  return StyleSheet.flatten(node?.props.style as ViewStyle) ?? {};
}

/** Filhos diretos (só elementos) de um nó da árvore JSON. */
export function jsonChildren(node: JsonNode): JsonNode[] {
  const children = (node.children ?? []) as readonly (string | JsonNode)[];
  return children.filter((child): child is JsonNode => typeof child !== 'string');
}

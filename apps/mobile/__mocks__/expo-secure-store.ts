/**
 * Mock manual de node_modules — Jest aplica isto automaticamente em todo
 * teste que importe "expo-secure-store", sem precisar de jest.mock() por
 * arquivo. Armazenamento em memória, isolado por chamada a
 * `__limparArmazenamentoDeTeste` (chamar em beforeEach).
 */
const armazenamento = new Map<string, string>();
const opcoesPorChave = new Map<string, unknown>();

/** Espelha a constante do módulo real para o código sob teste e as asserções. */
export const WHEN_UNLOCKED_THIS_DEVICE_ONLY = 'WHEN_UNLOCKED_THIS_DEVICE_ONLY';

export async function getItemAsync(chave: string): Promise<string | null> {
  return armazenamento.has(chave) ? (armazenamento.get(chave) as string) : null;
}

export async function setItemAsync(chave: string, valor: string, opcoes?: unknown): Promise<void> {
  armazenamento.set(chave, valor);
  opcoesPorChave.set(chave, opcoes);
}

export async function deleteItemAsync(chave: string): Promise<void> {
  armazenamento.delete(chave);
  opcoesPorChave.delete(chave);
}

/** Expõe as opções com que uma chave foi gravada, para asserção de AppSec. */
export function __opcoesDaChaveDeTeste(chave: string): unknown {
  return opcoesPorChave.get(chave);
}

export function __limparArmazenamentoDeTeste(): void {
  armazenamento.clear();
  opcoesPorChave.clear();
}

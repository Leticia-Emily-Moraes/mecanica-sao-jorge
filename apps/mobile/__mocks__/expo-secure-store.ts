/**
 * Mock manual de node_modules — Jest aplica isto automaticamente em todo
 * teste que importe "expo-secure-store", sem precisar de jest.mock() por
 * arquivo. Armazenamento em memória, isolado por chamada a
 * `__limparArmazenamentoDeTeste` (chamar em beforeEach).
 */
const armazenamento = new Map<string, string>();

export async function getItemAsync(chave: string): Promise<string | null> {
  return armazenamento.has(chave) ? (armazenamento.get(chave) as string) : null;
}

export async function setItemAsync(chave: string, valor: string): Promise<void> {
  armazenamento.set(chave, valor);
}

export async function deleteItemAsync(chave: string): Promise<void> {
  armazenamento.delete(chave);
}

export function __limparArmazenamentoDeTeste(): void {
  armazenamento.clear();
}

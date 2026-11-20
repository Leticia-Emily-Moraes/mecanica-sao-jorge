import { Stack } from 'expo-router';
import type { ReactElement } from 'react';

/**
 * Pilha própria da aba Clientes (ADR-029): lista, detalhe e formulários guardam
 * histórico, então "Voltar" leva sempre à tela anterior do fluxo. O cabeçalho
 * nativo fica desligado porque cada tela desenha o seu (`ScreenHeader`).
 */
export default function ClientesLayout(): ReactElement {
  return <Stack screenOptions={{ headerShown: false }} />;
}

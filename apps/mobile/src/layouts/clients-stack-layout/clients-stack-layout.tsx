import { Stack } from 'expo-router';
import type { ReactElement } from 'react';

/**
 * Pilha própria da aba Clientes (ADR-029): lista, detalhe e formulários guardam
 * histórico, então "Voltar" leva sempre à tela anterior do fluxo. O cabeçalho
 * nativo fica desligado porque cada tela desenha o seu (`ScreenHeader`). Os
 * formulários desligam o gesto de arrastar para voltar: no iOS ele não passa
 * pela guarda de descarte (`beforeRemove`), e a seta de voltar continua valendo.
 */
export default function ClientesLayout(): ReactElement {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="novo" options={{ gestureEnabled: false }} />
      <Stack.Screen name="[clienteId]/editar" options={{ gestureEnabled: false }} />
      <Stack.Screen name="[clienteId]/veiculos/novo" options={{ gestureEnabled: false }} />
      <Stack.Screen name="veiculos/[veiculoId]/editar" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

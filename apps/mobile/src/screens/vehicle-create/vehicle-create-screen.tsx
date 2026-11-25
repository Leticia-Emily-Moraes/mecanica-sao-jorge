import { useLocalSearchParams, useRouter } from 'expo-router';
import { type ReactElement, useEffect } from 'react';

import { VehicleFormView } from '@/components/veiculos/vehicle-form-view';
import { useDiscardChangesGuard } from '@/hooks/use-discard-changes-guard';
import { useVehicleForm } from '@/hooks/use-vehicle-form';
import { lerIdDaRota, parametrosDeAviso } from '@/navigation/route-params';

/**
 * Novo veículo do cliente (F35, N1–N5). Salvou: volta ao detalhe do cliente, que
 * já está na pilha, levando o aviso "Veículo cadastrado." (ADR-029, D2).
 */
export default function NovoVeiculoScreen(): ReactElement {
  const router = useRouter();
  const parametros = useLocalSearchParams<{ clienteId?: string }>();
  const clienteId = lerIdDaRota(parametros.clienteId);
  const form = useVehicleForm({ modo: 'novo', clienteId });
  const guarda = useDiscardChangesGuard(form.temAlteracao && form.estadoEnvio !== 'salvo');
  const { estadoEnvio, salvo } = form;

  useEffect(() => {
    if (estadoEnvio === 'salvo' && salvo !== null) {
      router.dismissTo({
        pathname: '/clientes/[clienteId]',
        params: { clienteId: String(salvo.clienteId), ...parametrosDeAviso('veiculoCriado') },
      });
    }
  }, [estadoEnvio, salvo, router]);

  function voltar(): void {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/clientes');
    }
  }

  return <VehicleFormView modo="novo" form={form} guarda={guarda} onBack={voltar} />;
}

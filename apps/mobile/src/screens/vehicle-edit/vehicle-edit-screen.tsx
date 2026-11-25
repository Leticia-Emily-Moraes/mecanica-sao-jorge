import { useLocalSearchParams, useRouter } from 'expo-router';
import { type ReactElement, useEffect } from 'react';

import { VehicleFormView } from '@/components/veiculos/vehicle-form-view';
import { useDiscardChangesGuard } from '@/hooks/use-discard-changes-guard';
import { useVehicleForm } from '@/hooks/use-vehicle-form';
import { lerIdDaRota, parametrosDeAviso } from '@/navigation/route-params';

/**
 * Editar veículo (F35, M1–M3). Lê o veículo antes de liberar os campos. Salvou:
 * volta ao detalhe do veículo, que já está na pilha, com o aviso de sucesso
 * (ADR-029, D2). O dono não muda (ADR-024), então o formulário só o mostra.
 */
export default function EditarVeiculoScreen(): ReactElement {
  const router = useRouter();
  const parametros = useLocalSearchParams<{ veiculoId?: string }>();
  const veiculoId = lerIdDaRota(parametros.veiculoId);
  const form = useVehicleForm({ modo: 'editar', veiculoId });
  const guarda = useDiscardChangesGuard(form.temAlteracao && form.estadoEnvio !== 'salvo');
  const { estadoEnvio, salvo } = form;

  useEffect(() => {
    if (estadoEnvio === 'salvo' && salvo !== null) {
      router.dismissTo({
        pathname: '/clientes/veiculos/[veiculoId]',
        params: { veiculoId: String(salvo.id), ...parametrosDeAviso('editado') },
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

  return <VehicleFormView modo="editar" form={form} guarda={guarda} onBack={voltar} />;
}

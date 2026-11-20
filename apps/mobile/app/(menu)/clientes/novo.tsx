import { useRouter } from 'expo-router';
import { type ReactElement, useEffect } from 'react';

import { ClientFormView } from '@/components/clientes/client-form-view';
import { useClientForm } from '@/hooks/use-client-form';
import { useDiscardChangesGuard } from '@/hooks/use-discard-changes-guard';
import { parametrosDeAviso } from '@/navigation/route-params';

/**
 * Novo cliente (F35, C1–C7). Salvou: `replace` para o detalhe com o aviso de
 * sucesso, para o "voltar" do detalhe cair na lista e não no formulário (ADR-029, D2).
 */
export default function NovoClienteScreen(): ReactElement {
  const router = useRouter();
  const form = useClientForm({ modo: 'novo' });
  const guarda = useDiscardChangesGuard(form.temAlteracao && form.estadoEnvio !== 'salvo');
  const { estadoEnvio, clienteSalvoId } = form;

  useEffect(() => {
    if (estadoEnvio === 'salvo' && clienteSalvoId !== null) {
      router.replace({
        pathname: '/clientes/[clienteId]',
        params: { clienteId: String(clienteSalvoId), ...parametrosDeAviso('criado') },
      });
    }
  }, [estadoEnvio, clienteSalvoId, router]);

  function voltar(): void {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/clientes');
    }
  }

  return <ClientFormView modo="novo" form={form} guarda={guarda} onBack={voltar} />;
}

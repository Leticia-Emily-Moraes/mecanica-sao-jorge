import { useLocalSearchParams, useRouter } from 'expo-router';
import { type ReactElement, useEffect } from 'react';

import { ClientFormView } from '@/components/clientes/client-form-view';
import { NotFoundState } from '@/components/ui/not-found-state';
import { ScreenContainer } from '@/components/ui/screen-container';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StateView } from '@/components/ui/state-view';
import { useClientForm } from '@/hooks/use-client-form';
import { useDiscardChangesGuard } from '@/hooks/use-discard-changes-guard';
import { t } from '@/i18n/strings';
import { lerIdDaRota, parametrosDeAviso } from '@/navigation/route-params';

/**
 * Editar cliente (F35, E1–E3). Lê o cliente antes de liberar os campos. Salvou:
 * volta ao detalhe que já está na pilha, levando o aviso de sucesso (ADR-029, D2).
 */
export default function EditarClienteScreen(): ReactElement {
  const router = useRouter();
  const parametros = useLocalSearchParams<{ clienteId?: string }>();
  const clienteId = lerIdDaRota(parametros.clienteId);
  const form = useClientForm({ modo: 'editar', clienteId });
  const guarda = useDiscardChangesGuard(form.temAlteracao && form.estadoEnvio !== 'salvo');
  const { estadoEnvio, clienteSalvoId } = form;

  useEffect(() => {
    if (estadoEnvio === 'salvo' && clienteSalvoId !== null) {
      router.dismissTo({
        pathname: '/clientes/[clienteId]',
        params: { clienteId: String(clienteSalvoId), ...parametrosDeAviso('editado') },
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

  const naoEncontrado = form.carga === 'naoEncontrado' || estadoEnvio === 'naoEncontrado';

  if (form.carga === 'pronto' && !naoEncontrado) {
    return <ClientFormView modo="editar" form={form} guarda={guarda} onBack={voltar} />;
  }

  return (
    <>
      <ScreenHeader
        title={t('clientes.formulario.tituloEditar')}
        back={{ label: t('clientes.formulario.voltar.rotulo'), onPress: voltar }}
      />
      <ScreenContainer constrained>
        {form.carga === 'carregando' && !naoEncontrado ? (
          <StateView state="loading" loadingLabel={t('clientes.formulario.carregando')} />
        ) : null}
        {form.carga === 'erroConexao' ? (
          <StateView
            state="error"
            title={t('clientes.detalhe.erro.titulo')}
            message={t('clientes.detalhe.erro.mensagem')}
            retryLabel={t('clientes.detalhe.erro.tentar')}
            onRetry={form.recarregar}
            secondaryLabel={t('clientes.detalhe.erro.voltar')}
            onSecondaryPress={voltar}
          />
        ) : null}
        {naoEncontrado ? (
          <NotFoundState
            title={t('clientes.detalhe.naoEncontrado.titulo')}
            message={t('clientes.detalhe.naoEncontrado.mensagem')}
            actionLabel={t('clientes.detalhe.naoEncontrado.voltar')}
            onAction={() => router.dismissTo('/clientes')}
          />
        ) : null}
      </ScreenContainer>
    </>
  );
}

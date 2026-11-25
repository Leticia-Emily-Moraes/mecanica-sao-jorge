import { useLocalSearchParams, useRouter } from 'expo-router';
import type { ReactElement } from 'react';

import { ClientInfoCard } from '@/components/clientes/client-info-card';
import { ClientVehiclesSection } from '@/components/clientes/client-vehicles-section';
import { DetailScroll } from '@/components/ui/detail-scroll';
import { InlineAlert } from '@/components/ui/inline-alert';
import { InlineNotice } from '@/components/ui/inline-notice';
import { NotFoundState } from '@/components/ui/not-found-state';
import { ScreenContainer } from '@/components/ui/screen-container';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StateView } from '@/components/ui/state-view';
import { useClientDetail } from '@/hooks/use-client-detail';
import { useClientVehicles } from '@/hooks/use-client-vehicles';
import { useRouteNotice } from '@/hooks/use-route-notice';
import { t } from '@/i18n/strings';
import { type AvisoDeSucesso, lerAviso, lerAvisoId, lerIdDaRota } from '@/navigation/route-params';

function textoDoAviso(aviso: AvisoDeSucesso): string {
  switch (aviso) {
    case 'criado':
      return t('clientes.detalhe.sucesso.criado');
    case 'editado':
      return t('clientes.detalhe.sucesso.editado');
    case 'veiculoCriado':
      return t('clientes.detalhe.sucesso.veiculoCriado');
  }
}

/**
 * Detalhe do cliente (F35, D1–D8): dados somente leitura, CPF mascarado e os
 * veículos dele. Só o id vem da rota; o resto é buscado e fica na memória da tela.
 */
export default function ClienteDetalheScreen(): ReactElement {
  const router = useRouter();
  const parametros = useLocalSearchParams<{
    clienteId?: string;
    aviso?: string;
    avisoId?: string;
  }>();
  const clienteId = lerIdDaRota(parametros.clienteId);
  const cliente = useClientDetail(clienteId);
  const veiculos = useClientVehicles(clienteId);
  const notice = useRouteNotice(lerAviso(parametros.aviso), lerAvisoId(parametros.avisoId));

  function voltar(): void {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/clientes');
    }
  }

  function voltarParaLista(): void {
    router.dismissTo('/clientes');
  }

  const estado = cliente.estado;
  const nome = estado.tipo === 'sucesso' ? estado.dados.nome : null;

  return (
    <>
      <ScreenHeader
        title={nome ?? t('clientes.detalhe.titulo')}
        back={{ label: t('clientes.detalhe.voltar.rotulo'), onPress: voltar }}
        action={
          nome === null
            ? undefined
            : {
                icon: 'create-outline',
                label: t('clientes.detalhe.editar.rotuloComNome', { nome }),
                onPress: () => router.push(`/clientes/${clienteId}/editar`),
              }
        }
      />
      <ScreenContainer constrained>
        {estado.tipo === 'carregando' ? (
          <StateView state="loading" loadingLabel={t('clientes.detalhe.carregando')} />
        ) : null}

        {estado.tipo === 'erroConexao' ? (
          <StateView
            state="error"
            title={t('clientes.detalhe.erro.titulo')}
            message={t('clientes.detalhe.erro.mensagem')}
            retryLabel={t('clientes.detalhe.erro.tentar')}
            onRetry={cliente.tentarNovamente}
            secondaryLabel={t('clientes.detalhe.erro.voltar')}
            onSecondaryPress={voltar}
          />
        ) : null}

        {estado.tipo === 'naoEncontrado' ? (
          <NotFoundState
            title={t('clientes.detalhe.naoEncontrado.titulo')}
            message={t('clientes.detalhe.naoEncontrado.mensagem')}
            actionLabel={t('clientes.detalhe.naoEncontrado.voltar')}
            onAction={voltarParaLista}
          />
        ) : null}

        {estado.tipo === 'sucesso' ? (
          <DetailScroll gap="compact">
            {notice.aviso ? (
              <InlineNotice
                message={textoDoAviso(notice.aviso)}
                onDismiss={notice.dispensar}
                dismissLabel={t('comum.aviso.dispensar')}
              />
            ) : null}
            {cliente.falhaAoAtualizar ? (
              <InlineAlert message={t('clientes.detalhe.falhaAtualizar')} />
            ) : null}
            <ClientInfoCard cliente={estado.dados} />
            <ClientVehiclesSection
              estado={veiculos.estado}
              onOpen={(id) => router.push(`/clientes/veiculos/${id}`)}
              onNew={() => router.push(`/clientes/${clienteId}/veiculos/novo`)}
              onRetry={veiculos.tentarNovamente}
            />
          </DetailScroll>
        ) : null}
      </ScreenContainer>
    </>
  );
}

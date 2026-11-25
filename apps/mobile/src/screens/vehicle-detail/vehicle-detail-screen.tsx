import { useLocalSearchParams, useRouter } from 'expo-router';
import type { ReactElement } from 'react';

import { DetailScroll } from '@/components/ui/detail-scroll';
import { InlineAlert } from '@/components/ui/inline-alert';
import { InlineNotice } from '@/components/ui/inline-notice';
import { NotFoundState } from '@/components/ui/not-found-state';
import { ScreenContainer } from '@/components/ui/screen-container';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StateView } from '@/components/ui/state-view';
import { VehicleHistorySection } from '@/components/veiculos/vehicle-history-section';
import { VehicleInfoCard } from '@/components/veiculos/vehicle-info-card';
import { useRouteNotice } from '@/hooks/use-route-notice';
import { useVehicleDetail } from '@/hooks/use-vehicle-detail';
import { t } from '@/i18n/strings';
import { lerAviso, lerAvisoId, lerIdDaRota } from '@/navigation/route-params';

/**
 * Detalhe do veículo (F35, V1–V6): dados somente leitura e o histórico de OS,
 * vazio como estado padrão até a Sprint 04. Só o id vem da rota; o dono vem na
 * resposta (`clienteId`, `clienteNome`), e a URL nunca decide quem é o dono.
 */
export default function VeiculoDetalheScreen(): ReactElement {
  const router = useRouter();
  const parametros = useLocalSearchParams<{
    veiculoId?: string;
    aviso?: string;
    avisoId?: string;
  }>();
  const veiculoId = lerIdDaRota(parametros.veiculoId);
  const veiculo = useVehicleDetail(veiculoId);
  const notice = useRouteNotice(lerAviso(parametros.aviso), lerAvisoId(parametros.avisoId));

  function voltar(): void {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/clientes');
    }
  }

  const estado = veiculo.estado;
  const placa = estado.tipo === 'sucesso' ? estado.dados.placa : null;

  return (
    <>
      <ScreenHeader
        title={placa ?? t('veiculos.detalhe.titulo')}
        back={{ label: t('veiculos.detalhe.voltar.rotulo'), onPress: voltar }}
        action={
          placa === null
            ? undefined
            : {
                icon: 'create-outline',
                label: t('veiculos.detalhe.editar.rotuloComPlaca', { placa }),
                onPress: () => router.push(`/clientes/veiculos/${veiculoId}/editar`),
              }
        }
      />
      <ScreenContainer constrained>
        {estado.tipo === 'carregando' ? (
          <StateView state="loading" loadingLabel={t('veiculos.detalhe.carregando')} />
        ) : null}

        {estado.tipo === 'erroConexao' ? (
          <StateView
            state="error"
            title={t('veiculos.detalhe.erro.titulo')}
            message={t('veiculos.detalhe.erro.mensagem')}
            retryLabel={t('veiculos.detalhe.erro.tentar')}
            onRetry={veiculo.tentarNovamente}
            secondaryLabel={t('veiculos.detalhe.erro.voltar')}
            onSecondaryPress={voltar}
          />
        ) : null}

        {estado.tipo === 'naoEncontrado' ? (
          <NotFoundState
            title={t('veiculos.detalhe.naoEncontrado.titulo')}
            message={t('veiculos.detalhe.naoEncontrado.mensagem')}
            actionLabel={t('veiculos.detalhe.naoEncontrado.voltar')}
            onAction={voltar}
          />
        ) : null}

        {estado.tipo === 'sucesso' ? (
          <DetailScroll>
            {notice.aviso === 'editado' ? (
              <InlineNotice
                message={t('veiculos.detalhe.sucesso.editado')}
                onDismiss={notice.dispensar}
                dismissLabel={t('comum.aviso.dispensar')}
              />
            ) : null}
            {veiculo.falhaAoAtualizar ? (
              <InlineAlert message={t('veiculos.detalhe.falhaAtualizar')} />
            ) : null}
            <VehicleInfoCard veiculo={estado.dados} />
            <VehicleHistorySection historico={estado.dados.historicoOs} />
          </DetailScroll>
        ) : null}
      </ScreenContainer>
    </>
  );
}

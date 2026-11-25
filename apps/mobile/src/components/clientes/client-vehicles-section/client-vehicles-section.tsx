import type { ReactElement } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { VehicleRow } from '@/components/clientes/vehicle-row';
import { Button } from '@/components/ui/button';
import { EmptyCard } from '@/components/ui/empty-card';
import { InlineAlert } from '@/components/ui/inline-alert';
import { SectionTitle } from '@/components/ui/section-title';
import type { EstadoCarga } from '@/hooks/use-resource';
import { t } from '@/i18n/strings';
import type { VeiculoResumo } from '@/services/vehicles-types';

import { styles, visual } from './client-vehicles-section.styles';

export interface ClientVehiclesSectionProps {
  readonly estado: EstadoCarga<readonly VeiculoResumo[]>;
  readonly onOpen: (veiculoId: number) => void;
  readonly onNew: () => void;
  readonly onRetry: () => void;
}

/**
 * Veículos do cliente no detalhe (D1, D6). Carrega e falha à parte do cliente:
 * erro aqui não derruba os dados dele. Lista vazia é um estado, não um erro, e
 * a ação de cadastrar continua à mão.
 */
export function ClientVehiclesSection({
  estado,
  onOpen,
  onNew,
  onRetry,
}: ClientVehiclesSectionProps): ReactElement {
  if (estado.tipo === 'carregando') {
    const rotulo = t('clientes.detalhe.veiculos.carregando');
    return (
      <View
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={rotulo}
        accessibilityLiveRegion="polite"
        accessibilityState={{ busy: true }}
        style={styles.loading}
      >
        <ActivityIndicator color={visual.spinner} />
        <Text style={styles.loadingText}>{rotulo}</Text>
      </View>
    );
  }

  // 404 da lista com o cliente carregado é tratado como falha da seção (ADR-030, D6).
  if (estado.tipo !== 'sucesso') {
    return (
      <View style={styles.section}>
        <InlineAlert message={t('clientes.detalhe.veiculos.erro')} />
        <Button
          label={t('clientes.detalhe.veiculos.tentar')}
          onPress={onRetry}
          variant="secondary"
        />
      </View>
    );
  }

  const veiculos = estado.dados;
  return (
    <View style={styles.section}>
      <SectionTitle text={t('clientes.detalhe.veiculos.titulo', { quantidade: veiculos.length })} />
      {veiculos.length === 0 ? (
        <EmptyCard
          title={t('clientes.detalhe.veiculos.vazio.titulo')}
          message={t('clientes.detalhe.veiculos.vazio.mensagem')}
        />
      ) : (
        veiculos.map((veiculo) => (
          <VehicleRow key={veiculo.id} veiculo={veiculo} onPress={onOpen} />
        ))
      )}
      <Button label={t('clientes.detalhe.veiculos.novo')} onPress={onNew} variant="secondary" />
    </View>
  );
}

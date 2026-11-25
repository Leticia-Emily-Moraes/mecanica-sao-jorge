import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import { EmptyCard } from '@/components/ui/empty-card';
import { SectionTitle } from '@/components/ui/section-title';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatarMoeda } from '@/formatters/currency';
import { formatarStatusDaOs, tomDoStatusDaOs } from '@/formatters/os-status';
import { t } from '@/i18n/strings';
import type { HistoricoOsItem } from '@/services/vehicles-types';

import { styles } from './vehicle-history-section.styles';

export interface VehicleHistorySectionProps {
  readonly historico: readonly HistoricoOsItem[];
}

function OsCard({ item }: { readonly item: HistoricoOsItem }): ReactElement {
  const status = formatarStatusDaOs(item.status);
  const valor = formatarMoeda(item.valorTotal);
  const titulo = t('veiculos.detalhe.historico.item.titulo', { id: item.id });

  return (
    <View
      testID="os-card"
      accessible
      accessibilityLabel={t('veiculos.detalhe.historico.item.rotulo', {
        id: item.id,
        status,
        valor,
      })}
      style={styles.card}
    >
      <Text style={styles.title}>{titulo}</Text>
      <Text style={styles.value}>{valor}</Text>
      <StatusBadge label={status} tone={tomDoStatusDaOs(item.status)} />
    </View>
  );
}

/**
 * Histórico de OS do veículo (V1, V2). A API ainda devolve só `{id, status,
 * valorTotal}`, e a lista vem vazia até a Sprint 04: o vazio é o estado padrão,
 * não um erro. Cada cartão é lido de uma vez; o status vai por texto, não só por cor.
 */
export function VehicleHistorySection({ historico }: VehicleHistorySectionProps): ReactElement {
  return (
    <View style={styles.section}>
      <SectionTitle
        text={t('veiculos.detalhe.historico.titulo', { quantidade: historico.length })}
      />
      {historico.length === 0 ? (
        <EmptyCard
          title={t('veiculos.detalhe.historico.vazio.titulo')}
          message={t('veiculos.detalhe.historico.vazio.mensagem')}
        />
      ) : (
        historico.map((item) => <OsCard key={item.id} item={item} />)
      )}
    </View>
  );
}

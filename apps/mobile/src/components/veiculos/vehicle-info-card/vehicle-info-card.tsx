import type { ReactElement } from 'react';

import { InfoCard, type InfoRow } from '@/components/ui/info-card';
import { VehicleTile } from '@/components/ui/vehicle-tile';
import { t } from '@/i18n/strings';
import type { VeiculoDetalhe } from '@/services/vehicles-types';

export interface VehicleInfoCardProps {
  readonly veiculo: VeiculoDetalhe;
}

function linha(rotulo: string, valor: string | null): InfoRow {
  const aparado = valor?.trim() ?? '';
  return aparado === ''
    ? { label: rotulo, value: t('veiculos.detalhe.naoInformado'), muted: true }
    : { label: rotulo, value: aparado };
}

/**
 * Dados do veículo, somente leitura (V1): "marca modelo" em destaque, o nome do
 * dono logo abaixo e as linhas Placa, Ano e Cor. Campo ausente mostra "Não informado".
 */
export function VehicleInfoCard({ veiculo }: VehicleInfoCardProps): ReactElement {
  return (
    <InfoCard
      elevation="detail"
      header={{
        leading: <VehicleTile />,
        title: t('veiculos.item.marcaModelo', { marca: veiculo.marca, modelo: veiculo.modelo }),
        subtitle: veiculo.clienteNome,
      }}
      rows={[
        linha(t('veiculos.detalhe.placa'), veiculo.placa),
        linha(t('veiculos.detalhe.ano'), veiculo.ano === null ? null : String(veiculo.ano)),
        linha(t('veiculos.detalhe.cor'), veiculo.cor),
      ]}
    />
  );
}

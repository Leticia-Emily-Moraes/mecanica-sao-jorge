import type { ReactElement } from 'react';

import { ListRow } from '@/components/ui/list-row';
import { VehicleTile } from '@/components/ui/vehicle-tile';
import { t } from '@/i18n/strings';
import type { VeiculoResumo } from '@/services/vehicles-types';

export interface VehicleRowProps {
  readonly veiculo: VeiculoResumo;
  readonly onPress: (id: number) => void;
}

/** Linha de veículo no detalhe do cliente: ícone de carro, placa e "marca modelo". */
export function VehicleRow({ veiculo, onPress }: VehicleRowProps): ReactElement {
  const marcaModelo = t('veiculos.item.marcaModelo', {
    marca: veiculo.marca,
    modelo: veiculo.modelo,
  });

  return (
    <ListRow
      leading={<VehicleTile />}
      title={veiculo.placa}
      subtitle={marcaModelo}
      onPress={() => onPress(veiculo.id)}
      accessibilityLabel={t('veiculos.item.rotulo', {
        placa: veiculo.placa,
        marca: veiculo.marca,
        modelo: veiculo.modelo,
      })}
      accessibilityHint={t('veiculos.item.dica')}
    />
  );
}

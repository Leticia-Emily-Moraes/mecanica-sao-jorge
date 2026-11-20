import { render, screen } from '@testing-library/react-native';

import type { HistoricoOsItem } from '@/services/vehicles-types';

import { VehicleHistorySection } from './vehicle-history-section';

const HISTORICO: readonly HistoricoOsItem[] = [
  { id: 3, status: 'EM_ANDAMENTO', valorTotal: 455 },
  { id: 2, status: 'ENTREGUE', valorTotal: 1200.5 },
  { id: 1, status: 'EM_ANALISE', valorTotal: 0 },
];

describe('VehicleHistorySection', () => {
  it('should show the empty state as the default when there is no service order', () => {
    render(<VehicleHistorySection historico={[]} />);

    expect(screen.getByRole('header', { name: 'Histórico de OS (0)' })).toBeTruthy();
    expect(screen.getByText('Nenhuma OS neste veículo')).toBeTruthy();
    expect(screen.getByText('As ordens de serviço deste veículo vão aparecer aqui.')).toBeTruthy();
    expect(screen.queryAllByTestId('os-card')).toHaveLength(0);
  });

  it('should count the service orders in the section title', () => {
    render(<VehicleHistorySection historico={HISTORICO} />);

    expect(screen.getByRole('header', { name: 'Histórico de OS (3)' })).toBeTruthy();
    expect(screen.queryByText('Nenhuma OS neste veículo')).toBeNull();
    expect(screen.getAllByTestId('os-card')).toHaveLength(3);
  });

  it('should show the number, the total in reais and the status name on each card', () => {
    render(<VehicleHistorySection historico={HISTORICO} />);

    expect(screen.getByText('OS #3')).toBeTruthy();
    expect(screen.getByText('EM ANDAMENTO')).toBeTruthy();
    expect(screen.getByText('OS #2')).toBeTruthy();
    expect(screen.getByText('ENTREGUE')).toBeTruthy();
    expect(screen.getByText('OS #1')).toBeTruthy();
    expect(screen.getByText('EM ANALISE')).toBeTruthy();
    expect(screen.getByText(/455,00/)).toBeTruthy();
    expect(screen.getByText(/1\.200,50/)).toBeTruthy();
  });

  it('should read each card as one phrase with number, status and total', () => {
    render(<VehicleHistorySection historico={[HISTORICO[0]]} />);

    expect(screen.getByLabelText(/^OS #3, EM ANDAMENTO, R\$.*455,00$/)).toBeTruthy();
  });
});

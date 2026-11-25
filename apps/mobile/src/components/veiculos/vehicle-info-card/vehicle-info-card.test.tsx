import { render, screen } from '@testing-library/react-native';

import type { VeiculoDetalhe } from '@/services/vehicles-types';

import { VehicleInfoCard } from './vehicle-info-card';

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

const VEICULO: VeiculoDetalhe = {
  id: 11,
  clienteId: 7,
  clienteNome: 'Teodoro Lemos',
  placa: 'RTK4M81',
  marca: 'Honda',
  modelo: 'Civic',
  ano: 2018,
  cor: 'Preto',
  historicoOs: [],
};

describe('VehicleInfoCard', () => {
  it('should show brand and model as the title with the owner name under it', () => {
    render(<VehicleInfoCard veiculo={VEICULO} />);

    expect(screen.getByRole('header', { name: 'Honda Civic' })).toBeTruthy();
    expect(screen.getByText('Teodoro Lemos')).toBeTruthy();
  });

  it('should show plate, year and color, each read as one phrase', () => {
    render(<VehicleInfoCard veiculo={VEICULO} />);

    expect(screen.getByLabelText('Placa: RTK4M81')).toBeTruthy();
    expect(screen.getByLabelText('Ano: 2018')).toBeTruthy();
    expect(screen.getByLabelText('Cor: Preto')).toBeTruthy();
  });

  it('should show "Não informado" for a missing year and color', () => {
    render(<VehicleInfoCard veiculo={{ ...VEICULO, ano: null, cor: null }} />);

    expect(screen.getByLabelText('Ano: Não informado')).toBeTruthy();
    expect(screen.getByLabelText('Cor: Não informado')).toBeTruthy();
    expect(screen.queryByText(/null/)).toBeNull();
  });

  it('should treat a blank color as missing', () => {
    render(<VehicleInfoCard veiculo={{ ...VEICULO, cor: '   ' }} />);

    expect(screen.getByLabelText('Cor: Não informado')).toBeTruthy();
  });
});

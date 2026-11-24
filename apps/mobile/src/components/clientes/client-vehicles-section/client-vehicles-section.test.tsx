import { fireEvent, render, screen } from '@testing-library/react-native';

import type { EstadoCarga } from '@/hooks/use-resource';
import type { VeiculoResumo } from '@/services/vehicles-types';

import { ClientVehiclesSection } from './client-vehicles-section';

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

const VEICULOS: readonly VeiculoResumo[] = [
  { id: 11, placa: 'RTK4M81', marca: 'Honda', modelo: 'Civic' },
  { id: 12, placa: 'ABC1D23', marca: 'Fiat', modelo: 'Uno' },
];

function renderSecao(estado: EstadoCarga<readonly VeiculoResumo[]>) {
  const handlers = { onOpen: jest.fn(), onNew: jest.fn(), onRetry: jest.fn() };
  render(<ClientVehiclesSection estado={estado} {...handlers} />);
  return handlers;
}

describe('ClientVehiclesSection', () => {
  it('should show a busy indicator with an accessible name while loading', () => {
    renderSecao({ tipo: 'carregando' });

    expect(screen.getByRole('progressbar', { name: 'Carregando veículos…' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: '+ Veículo' })).toBeNull();
  });

  it('should list the vehicles with the count in the title', () => {
    renderSecao({ tipo: 'sucesso', dados: VEICULOS, atualizando: false });

    expect(screen.getByRole('header', { name: 'Veículos (2)' })).toBeTruthy();
    expect(screen.getByText('RTK4M81')).toBeTruthy();
    expect(screen.getByText('ABC1D23')).toBeTruthy();
  });

  it('should call onOpen with the vehicle id when a row is pressed', () => {
    const { onOpen } = renderSecao({ tipo: 'sucesso', dados: VEICULOS, atualizando: false });

    fireEvent.press(screen.getByRole('button', { name: 'RTK4M81, Honda Civic' }));

    expect(onOpen).toHaveBeenCalledWith(11);
  });

  it('should show the empty card and keep the register action when there are no vehicles', () => {
    const { onNew } = renderSecao({ tipo: 'sucesso', dados: [], atualizando: false });

    expect(screen.getByText('Nenhum veículo cadastrado')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Veículos (0)' })).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: '+ Veículo' }));
    expect(onNew).toHaveBeenCalledTimes(1);
  });

  it('should show an error with retry and no register action when the list fails', () => {
    const { onRetry } = renderSecao({ tipo: 'erroConexao' });

    expect(screen.getByText('Não foi possível carregar os veículos.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: '+ Veículo' })).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should treat "not found" of the list as a section failure', () => {
    renderSecao({ tipo: 'naoEncontrado' });

    expect(screen.getByText('Não foi possível carregar os veículos.')).toBeTruthy();
  });
});

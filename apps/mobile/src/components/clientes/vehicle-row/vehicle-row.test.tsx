import { fireEvent, render, screen } from '@testing-library/react-native';

import type { VeiculoResumo } from '@/services/vehicles-types';

import { VehicleRow } from './vehicle-row';

// Fonte de ícones é a borda externa: o carregamento assíncrono da fonte
// atualiza estado fora do `act` e não faz parte do que se testa aqui.
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

const CIVIC: VeiculoResumo = { id: 3, placa: 'ABC1D23', marca: 'Honda', modelo: 'Civic' };

describe('VehicleRow', () => {
  it('should show the plate as title and brand with model as subtitle', () => {
    render(<VehicleRow veiculo={CIVIC} onPress={jest.fn()} />);

    expect(screen.getByText('ABC1D23')).toBeTruthy();
    expect(screen.getByText('Honda Civic')).toBeTruthy();
  });

  it('should name the button with plate, brand and model, and give the hint', () => {
    render(<VehicleRow veiculo={CIVIC} onPress={jest.fn()} />);

    const button = screen.getByRole('button', { name: 'ABC1D23, Honda Civic' });

    expect(button.props.accessibilityHint).toBe('Abre os dados do veículo');
  });

  it('should call onPress with the vehicle id only', () => {
    const onPress = jest.fn();
    render(<VehicleRow veiculo={CIVIC} onPress={onPress} />);

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledWith(3);
  });
});

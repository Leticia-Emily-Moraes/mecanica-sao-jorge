import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import InicioScreen from './inicio';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const METRICAS_DE_TESTE = {
  frame: { x: 0, y: 0, width: 360, height: 740 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

function renderInicio(): void {
  render(
    <SafeAreaProvider initialMetrics={METRICAS_DE_TESTE}>
      <InicioScreen />
    </SafeAreaProvider>,
  );
}

describe('InicioScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show the header title and the empty state while no module is programmed', () => {
    renderInicio();

    expect(screen.getByRole('header', { name: 'Início' })).toBeTruthy();
    expect(screen.getByText('Em breve')).toBeTruthy();
    expect(screen.getByText('Os módulos da oficina chegam nas próximas versões.')).toBeTruthy();
  });

  it('should open the Perfil from the user button in the header', () => {
    renderInicio();

    fireEvent.press(screen.getByRole('button', { name: 'Perfil' }));

    expect(mockPush).toHaveBeenCalledWith('/perfil');
  });
});

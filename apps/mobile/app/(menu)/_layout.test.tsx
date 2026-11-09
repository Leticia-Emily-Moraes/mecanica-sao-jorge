import { render, screen, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import type { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/auth/auth-context';

import MenuLayout from './_layout';

const METRICAS_DE_TESTE = {
  frame: { x: 0, y: 0, width: 375, height: 812 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

function renderComProvedores(children: ReactNode): ReturnType<typeof render> {
  return render(
    <SafeAreaProvider initialMetrics={METRICAS_DE_TESTE}>
      <AuthProvider>{children}</AuthProvider>
    </SafeAreaProvider>,
  );
}

const mockReplace = jest.fn();
const mockSlotRenderizado = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
  Slot: () => {
    mockSlotRenderizado();
    return null;
  },
}));

const secureStoreMock = SecureStore as unknown as { __limparArmazenamentoDeTeste: () => void };

describe('MenuLayout', () => {
  beforeEach(() => {
    secureStoreMock.__limparArmazenamentoDeTeste();
    jest.clearAllMocks();
  });

  it('should redirect to /login and render nothing when there is no stored session (US-MENU-08)', async () => {
    renderComProvedores(<MenuLayout />);

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/login'));
    expect(mockSlotRenderizado).not.toHaveBeenCalled();
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
  });

  it('should render the route content and the tab bar when the session is valid', async () => {
    await SecureStore.setItemAsync('mecanicaSaoJorge.auth.token', 'token-existente');
    await SecureStore.setItemAsync(
      'mecanicaSaoJorge.auth.usuario',
      JSON.stringify({ id: 1, nome: 'Ana Beatriz Souza', email: 'a@a.com', perfil: 'ADMIN' }),
    );

    renderComProvedores(<MenuLayout />);

    await waitFor(() => expect(mockSlotRenderizado).toHaveBeenCalled());
    expect(screen.getAllByRole('tab')).toHaveLength(5);
    expect(mockReplace).not.toHaveBeenCalled();
  });
});

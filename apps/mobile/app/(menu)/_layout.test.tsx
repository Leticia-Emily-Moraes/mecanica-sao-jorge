import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import type { ReactElement, ReactNode } from 'react';
import { Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '@/auth/auth-context';

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

/** Simula, de dentro do mesmo AuthContext real, a sessão virando inválida (US-MENU-07). */
function GatilhoDeExpiracao(): ReactElement {
  const { tratarSessaoExpirada } = useAuth();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="forcar-expiracao-de-teste"
      onPress={() => void tratarSessaoExpirada()}
    />
  );
}

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

  it('should redirect to /login and hide every menu item when the session expires while the menu is on screen (US-MENU-07)', async () => {
    await SecureStore.setItemAsync('mecanicaSaoJorge.auth.token', 'token-existente');
    await SecureStore.setItemAsync(
      'mecanicaSaoJorge.auth.usuario',
      JSON.stringify({ id: 1, nome: 'Ana Beatriz Souza', email: 'a@a.com', perfil: 'ADMIN' }),
    );

    renderComProvedores(
      <>
        <GatilhoDeExpiracao />
        <MenuLayout />
      </>,
    );

    await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(5));

    fireEvent.press(screen.getByLabelText('forcar-expiracao-de-teste'));

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/login'));
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(await SecureStore.getItemAsync('mecanicaSaoJorge.auth.token')).toBeNull();
  });
});

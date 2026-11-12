import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';

import { AuthProvider } from '@/auth/auth-context';

import PerfilScreen from './perfil';

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

const secureStoreMock = SecureStore as unknown as { __limparArmazenamentoDeTeste: () => void };

const USUARIO_FICTICIO = {
  id: 1,
  nome: 'Ana Beatriz Souza',
  email: 'ana.souza@exemplo-ficticio.com.br',
  perfil: 'ADMIN',
};

async function renderPerfilScreen(): Promise<void> {
  render(
    <AuthProvider>
      <PerfilScreen />
    </AuthProvider>,
  );
  await act(async () => {});
}

describe('PerfilScreen', () => {
  beforeEach(async () => {
    secureStoreMock.__limparArmazenamentoDeTeste();
    jest.clearAllMocks();
    await SecureStore.setItemAsync('mecanicaSaoJorge.auth.token', 'token-existente');
    await SecureStore.setItemAsync(
      'mecanicaSaoJorge.auth.usuario',
      JSON.stringify(USUARIO_FICTICIO),
    );
  });

  it('should show the logged-in user name, email and profile badge', async () => {
    await renderPerfilScreen();

    expect(screen.getByText('Ana Beatriz Souza')).toBeTruthy();
    expect(screen.getByText('ana.souza@exemplo-ficticio.com.br')).toBeTruthy();
    expect(screen.getByText('ADMIN')).toBeTruthy();
  });

  it('should open a confirmation dialog when pressing "Sair" and keep the session on cancel', async () => {
    await renderPerfilScreen();

    fireEvent.press(screen.getByRole('button', { name: 'Sair' }));

    expect(screen.getByText('Deseja realmente sair?')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByText('Deseja realmente sair?')).toBeNull();
    expect(await SecureStore.getItemAsync('mecanicaSaoJorge.auth.token')).toBe('token-existente');
    expect(mockReplace).not.toHaveBeenCalledWith('/login');
  });

  it('should clear the token and navigate to /login when logout is confirmed', async () => {
    await renderPerfilScreen();

    fireEvent.press(screen.getByRole('button', { name: 'Sair' }));
    fireEvent.press(screen.getAllByRole('button', { name: 'Sair' })[1]);

    await waitFor(async () => {
      expect(await SecureStore.getItemAsync('mecanicaSaoJorge.auth.token')).toBeNull();
    });
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/login'));
  });
});

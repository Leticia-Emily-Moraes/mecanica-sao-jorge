import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';

import { AuthProvider } from '@/hooks/use-auth';

import IndexScreen from './index';

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

const secureStoreMock = SecureStore as unknown as { __limparArmazenamentoDeTeste: () => void };

describe('IndexScreen', () => {
  beforeEach(() => {
    secureStoreMock.__limparArmazenamentoDeTeste();
    jest.clearAllMocks();
  });

  it('should redirect to /login when there is no stored session', async () => {
    render(
      <AuthProvider>
        <IndexScreen />
      </AuthProvider>,
    );

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/login'));
  });

  it('should redirect to /perfil when a valid session is already stored', async () => {
    await SecureStore.setItemAsync('mecanicaSaoJorge.auth.token', 'token-existente');
    await SecureStore.setItemAsync(
      'mecanicaSaoJorge.auth.usuario',
      JSON.stringify({ id: 1, nome: 'Ana Beatriz Souza', email: 'a@a.com', perfil: 'ADMIN' }),
    );

    render(
      <AuthProvider>
        <IndexScreen />
      </AuthProvider>,
    );

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/perfil'));
  });

  it('should show a retry modal when restoring the session fails', async () => {
    jest.spyOn(SecureStore, 'getItemAsync').mockRejectedValueOnce(new Error('falha de leitura'));

    render(
      <AuthProvider>
        <IndexScreen />
      </AuthProvider>,
    );

    expect(await screen.findByText('Não foi possível carregar.')).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should recover from the error by retrying the session restore', async () => {
    jest.spyOn(SecureStore, 'getItemAsync').mockRejectedValueOnce(new Error('falha de leitura'));

    render(
      <AuthProvider>
        <IndexScreen />
      </AuthProvider>,
    );

    const botaoTentarNovamente = await screen.findByRole('button', { name: 'Tentar novamente' });
    fireEvent.press(botaoTentarNovamente);

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/login'));
  });
});

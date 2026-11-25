import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { Modal } from 'react-native';

import { AuthProvider } from '@/hooks/use-auth';

import IndexScreen from './session-restore-screen';

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

  it('should redirect to /inicio when a valid session is already stored', async () => {
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

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/inicio'));
  });

  it('should show the visible loading text while the session is being restored (P1)', () => {
    render(
      <AuthProvider>
        <IndexScreen />
      </AuthProvider>,
    );

    expect(screen.getByText('Carregando sessão…')).toBeTruthy();
    expect(screen.getByRole('progressbar', { name: 'Carregando sessão…' })).toBeTruthy();
  });

  it('should show the full-screen error with both actions when restoring the session fails (P2)', async () => {
    jest.spyOn(SecureStore, 'getItemAsync').mockRejectedValueOnce(new Error('falha de leitura'));

    render(
      <AuthProvider>
        <IndexScreen />
      </AuthProvider>,
    );

    expect(await screen.findByText('Não foi possível carregar')).toBeTruthy();
    expect(
      screen.getByText(
        'Verifique a internet da oficina e tente de novo. Se continuar, entre novamente.',
      ),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Entrar novamente' })).toBeTruthy();
    expect(screen.UNSAFE_queryByType(Modal)).toBeNull();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should go to /login when Entrar novamente is pressed after a restore failure', async () => {
    jest.spyOn(SecureStore, 'getItemAsync').mockRejectedValueOnce(new Error('falha de leitura'));

    render(
      <AuthProvider>
        <IndexScreen />
      </AuthProvider>,
    );

    fireEvent.press(await screen.findByRole('button', { name: 'Entrar novamente' }));

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/login'));
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

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';

import { AuthProvider } from '@/hooks/use-auth';

import PerfilScreen from './profile-screen';

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

  it('should show the header band, the avatar initials and the confirmation message on logout', async () => {
    await renderPerfilScreen();

    expect(screen.getByRole('header', { name: 'Perfil' })).toBeTruthy();
    expect(screen.getByText('AB', { includeHiddenElements: true })).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Sair' }));

    expect(
      screen.getByText('Você precisará entrar novamente com seu e-mail e senha.'),
    ).toBeTruthy();
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
    // O diálogo fica no corpo e o Sair da tela no rodapé: o do diálogo vem primeiro na árvore.
    fireEvent.press(screen.getAllByRole('button', { name: 'Sair' })[0]);

    await waitFor(async () => {
      expect(await SecureStore.getItemAsync('mecanicaSaoJorge.auth.token')).toBeNull();
    });
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/login'));
  });
});

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { AuthProvider } from '@/hooks/use-auth';
import { autenticar, CredenciaisInvalidasError, ErroDeRedeError } from '@/services/auth-service';

import LoginScreen from './login';

// Só a função é mockada — as classes de erro reais ficam, senão o
// `instanceof` da tela compararia contra uma classe automockada diferente.
jest.mock('@/services/auth-service', () => ({
  ...jest.requireActual('@/services/auth-service'),
  autenticar: jest.fn(),
}));

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

const autenticarMock = autenticar as jest.MockedFunction<typeof autenticar>;

async function renderLoginScreen(): Promise<void> {
  render(
    <AuthProvider>
      <LoginScreen />
    </AuthProvider>,
  );
  // Aguarda o bootstrap assíncrono do AuthProvider (leitura do SecureStore) resolver.
  await act(async () => {});
}

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show field validation errors and never call the API when email and senha are empty', async () => {
    await renderLoginScreen();

    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Informe seu e-mail')).toBeTruthy();
    expect(screen.getByText('Informe sua senha')).toBeTruthy();
    expect(autenticarMock).not.toHaveBeenCalled();
  });

  it('should show a generic credential error banner on 401 and stay on the login screen', async () => {
    autenticarMock.mockRejectedValueOnce(new CredenciaisInvalidasError());
    await renderLoginScreen();

    fireEvent.changeText(screen.getByLabelText('E-mail'), 'ana.souza@exemplo-ficticio.com.br');
    fireEvent.changeText(screen.getByLabelText('Senha'), 'senha-errada');
    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('E-mail ou senha incorretos.')).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalledWith('/perfil');
  });

  it('should show the network error modal with a retry action when the API is unreachable', async () => {
    autenticarMock.mockRejectedValueOnce(new ErroDeRedeError());
    await renderLoginScreen();

    fireEvent.changeText(screen.getByLabelText('E-mail'), 'ana.souza@exemplo-ficticio.com.br');
    fireEvent.changeText(screen.getByLabelText('Senha'), 'senha-ficticia');
    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Não foi possível conectar.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeTruthy();
  });

  it('should log in and navigate to /perfil when credentials are valid', async () => {
    autenticarMock.mockResolvedValueOnce({
      token: 'token-jwt-fake',
      tipo: 'Bearer',
      expiraEm: '2026-11-14T00:00:00Z',
      usuario: {
        id: 1,
        nome: 'Ana Beatriz Souza',
        email: 'ana.souza@exemplo-ficticio.com.br',
        perfil: 'ADMIN',
      },
    });
    await renderLoginScreen();

    fireEvent.changeText(screen.getByLabelText('E-mail'), 'ana.souza@exemplo-ficticio.com.br');
    fireEvent.changeText(screen.getByLabelText('Senha'), 'senha-ficticia');
    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/perfil'));
  });

  it('should toggle password visibility with an accessible button', async () => {
    await renderLoginScreen();

    const campoSenha = screen.getByLabelText('Senha');
    expect(campoSenha.props.secureTextEntry).toBe(true);

    fireEvent.press(screen.getByRole('button', { name: 'Mostrar senha' }));

    expect(screen.getByLabelText('Senha').props.secureTextEntry).toBe(false);
    expect(screen.getByRole('button', { name: 'Ocultar senha' })).toBeTruthy();
  });
});

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { StyleSheet } from 'react-native';
import type { TestStyle } from '@/test-utils/flat-style';

import { AuthProvider } from '@/hooks/use-auth';
import { autenticar, CredenciaisInvalidasError, ErroDeRedeError } from '@/services/auth-service';
import type { Usuario } from '@/services/auth-types';
import { borderWidth, color } from '@/theme/tokens';

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
const secureStoreMock = SecureStore as unknown as { __limparArmazenamentoDeTeste: () => void };

const USUARIO_FICTICIO: Usuario = {
  id: 1,
  nome: 'Ana Beatriz Souza',
  email: 'ana.souza@exemplo-ficticio.com.br',
  perfil: 'ADMIN',
};

const MENSAGEM_CREDENCIAL = 'Usuário ou senha incorretos. Confira os dados e tente novamente.';

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
    // Um login bem-sucedido grava a sessão; sem limpar, o teste seguinte já nasce autenticado.
    secureStoreMock.__limparArmazenamentoDeTeste();
    jest.clearAllMocks();
  });

  it('should show the brand block: title in caps and the subtitle from the Figma', async () => {
    await renderLoginScreen();

    expect(screen.getByRole('header', { name: 'MECÂNICA SÃO JORGE' })).toBeTruthy();
    expect(screen.getByText('Gestão da oficina')).toBeTruthy();
  });

  it('should label the first field "Usuário" and show both placeholders (US-PAR-16)', async () => {
    await renderLoginScreen();

    expect(screen.getByText('Usuário')).toBeTruthy();
    expect(screen.getByLabelText('Usuário').props.placeholder).toBe('Seu usuário');
    expect(screen.getByLabelText('Senha').props.placeholder).toBe('Sua senha');
    expect(screen.queryByText('E-mail')).toBeNull();
  });

  it('should keep the e-mail keyboard on the "Usuário" field (US-PAR-16)', async () => {
    await renderLoginScreen();

    expect(screen.getByLabelText('Usuário').props.keyboardType).toBe('email-address');
  });

  it('should show field validation errors and never call the API when usuário and senha are empty', async () => {
    await renderLoginScreen();

    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Informe seu usuário')).toBeTruthy();
    expect(screen.getByText('Informe sua senha')).toBeTruthy();
    expect(autenticarMock).not.toHaveBeenCalled();
  });

  it('should send the typed value as the e-mail of the single login call (US-PAR-16)', async () => {
    autenticarMock.mockResolvedValueOnce({
      token: 'token-jwt-fake',
      tipo: 'Bearer',
      expiraEm: '2026-11-14T00:00:00Z',
      usuario: USUARIO_FICTICIO,
    });
    await renderLoginScreen();

    fireEvent.changeText(screen.getByLabelText('Usuário'), 'ana.souza@exemplo-ficticio.com.br');
    fireEvent.changeText(screen.getByLabelText('Senha'), 'senha-ficticia');
    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(autenticarMock).toHaveBeenCalledTimes(1));
    expect(autenticarMock).toHaveBeenCalledWith(
      'ana.souza@exemplo-ficticio.com.br',
      'senha-ficticia',
    );
  });

  it('should show the generic credential banner and mark both fields with a 2 px error border on 401', async () => {
    autenticarMock.mockRejectedValueOnce(new CredenciaisInvalidasError());
    await renderLoginScreen();

    fireEvent.changeText(screen.getByLabelText('Usuário'), 'ana.souza@exemplo-ficticio.com.br');
    fireEvent.changeText(screen.getByLabelText('Senha'), 'senha-errada');
    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText(MENSAGEM_CREDENCIAL)).toBeTruthy();
    expect(screen.getByRole('alert', { name: MENSAGEM_CREDENCIAL })).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalledWith('/inicio');

    const caixas = screen.getAllByTestId('text-field-box');
    expect(caixas).toHaveLength(2);
    for (const caixa of caixas) {
      expect(StyleSheet.flatten(caixa.props.style as TestStyle)).toMatchObject({
        borderWidth: borderWidth.field,
        borderColor: color.border.error,
      });
    }
  });

  it('should place the credential banner between the password field and the button', async () => {
    autenticarMock.mockRejectedValueOnce(new CredenciaisInvalidasError());
    await renderLoginScreen();

    fireEvent.changeText(screen.getByLabelText('Usuário'), 'ana.souza@exemplo-ficticio.com.br');
    fireEvent.changeText(screen.getByLabelText('Senha'), 'senha-errada');
    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
    await screen.findByText(MENSAGEM_CREDENCIAL);

    const tree = JSON.stringify(screen.toJSON());

    expect(tree.indexOf('"Sua senha"')).toBeLessThan(tree.indexOf(MENSAGEM_CREDENCIAL));
    expect(tree.indexOf(MENSAGEM_CREDENCIAL)).toBeLessThan(tree.lastIndexOf('"Entrar"'));
  });

  it('should show the network error modal with a retry action when the API is unreachable', async () => {
    autenticarMock.mockRejectedValueOnce(new ErroDeRedeError());
    await renderLoginScreen();

    fireEvent.changeText(screen.getByLabelText('Usuário'), 'ana.souza@exemplo-ficticio.com.br');
    fireEvent.changeText(screen.getByLabelText('Senha'), 'senha-ficticia');
    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Não foi possível conectar.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeTruthy();
  });

  it('should log in and navigate to /inicio when credentials are valid', async () => {
    autenticarMock.mockResolvedValueOnce({
      token: 'token-jwt-fake',
      tipo: 'Bearer',
      expiraEm: '2026-11-14T00:00:00Z',
      usuario: USUARIO_FICTICIO,
    });
    await renderLoginScreen();

    fireEvent.changeText(screen.getByLabelText('Usuário'), 'ana.souza@exemplo-ficticio.com.br');
    fireEvent.changeText(screen.getByLabelText('Senha'), 'senha-ficticia');
    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/inicio'));
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

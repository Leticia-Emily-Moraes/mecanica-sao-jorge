import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import * as ReactNative from 'react-native';
import { Modal, StyleSheet } from 'react-native';

import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { autenticar, CredenciaisInvalidasError, ErroDeRedeError } from '@/services/auth-service';
import type { Usuario } from '@/services/auth-types';
import type { TestStyle } from '@/test-utils/flat-style';
import { findFixedWidths } from '@/test-utils/find-fixed-widths';
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
const MENSAGEM_REDE = 'Sem conexão. Verifique a internet da oficina e tente de novo.';
const MENSAGEM_SESSAO_EXPIRADA = 'Sua sessão expirou. Faça login novamente.';

/** Simula o que o app faz quando o token expira: marca a sessão como expirada. */
function ExpireSessionOnMount(): null {
  const { status, tratarSessaoExpirada } = useAuth();

  // Espera o bootstrap terminar, senão ele sobrescreve o estado de expirada.
  useEffect(() => {
    if (status.tipo === 'naoAutenticado' && !status.sessaoExpirada) {
      void tratarSessaoExpirada();
    }
  }, [status, tratarSessaoExpirada]);

  return null;
}

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

  it('should show the connection error box between the password and the button, not a popup (L3)', async () => {
    autenticarMock.mockRejectedValueOnce(new ErroDeRedeError());
    await renderLoginScreen();

    fireEvent.changeText(screen.getByLabelText('Usuário'), 'ana.souza@exemplo-ficticio.com.br');
    fireEvent.changeText(screen.getByLabelText('Senha'), 'senha-ficticia');
    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText(MENSAGEM_REDE)).toBeTruthy();
    expect(screen.getByRole('alert', { name: MENSAGEM_REDE })).toBeTruthy();
    expect(screen.UNSAFE_queryByType(Modal)).toBeNull();

    const tree = JSON.stringify(screen.toJSON());
    expect(tree.indexOf('"Sua senha"')).toBeLessThan(tree.indexOf(MENSAGEM_REDE));
    expect(tree.indexOf(MENSAGEM_REDE)).toBeLessThan(tree.lastIndexOf('"Entrar"'));
  });

  it('should keep the fields without the error border on a connection failure', async () => {
    autenticarMock.mockRejectedValueOnce(new ErroDeRedeError());
    await renderLoginScreen();

    fireEvent.changeText(screen.getByLabelText('Usuário'), 'ana.souza@exemplo-ficticio.com.br');
    fireEvent.changeText(screen.getByLabelText('Senha'), 'senha-ficticia');
    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));
    await screen.findByText(MENSAGEM_REDE);

    for (const caixa of screen.getAllByTestId('text-field-box')) {
      expect(StyleSheet.flatten(caixa.props.style as TestStyle).borderColor).toBe(
        color.border.default,
      );
    }
  });

  it('should retry the login by pressing the same Entrar button after a connection failure', async () => {
    autenticarMock.mockRejectedValueOnce(new ErroDeRedeError());
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
    await screen.findByText(MENSAGEM_REDE);

    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/inicio'));
    expect(autenticarMock).toHaveBeenCalledTimes(2);
  });

  it('should show the expired session notice as an alert above the form (L4)', async () => {
    render(
      <AuthProvider>
        <ExpireSessionOnMount />
        <LoginScreen />
      </AuthProvider>,
    );

    expect(await screen.findByRole('alert', { name: MENSAGEM_SESSAO_EXPIRADA })).toBeTruthy();

    const tree = JSON.stringify(screen.toJSON());
    expect(tree.indexOf(MENSAGEM_SESSAO_EXPIRADA)).toBeLessThan(tree.indexOf('"Seu usuário"'));
  });

  it('should show no alert when the session did not expire', async () => {
    await renderLoginScreen();

    expect(screen.queryByRole('alert')).toBeNull();
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

  it('should show the short visible words Mostrar and Ocultar, keeping the long accessible name (L1)', async () => {
    await renderLoginScreen();

    expect(screen.getByText('Mostrar')).toBeTruthy();
    expect(screen.queryByText('Mostrar senha')).toBeNull();
    expect(screen.getByRole('button', { name: 'Mostrar senha' })).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Mostrar senha' }));

    expect(screen.getByText('Ocultar')).toBeTruthy();
    expect(screen.queryByText('Ocultar senha')).toBeNull();
    expect(screen.getByRole('button', { name: 'Ocultar senha' })).toBeTruthy();
  });

  it.each([320, 430])(
    'should not pin the content to a fixed width when the window is %i wide',
    async (windowWidth) => {
      jest
        .spyOn(ReactNative, 'useWindowDimensions')
        .mockReturnValue({ width: windowWidth, height: 800, scale: 2, fontScale: 1 });
      await renderLoginScreen();

      expect(findFixedWidths(screen.toJSON())).toEqual([]);
    },
  );
});

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getAppVersion } from '@/config/app-version';
import { AuthProvider } from '@/hooks/use-auth';
import type { TestStyle } from '@/test-utils/flat-style';

import PerfilScreen from './perfil';

const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockCanGoBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, back: mockBack, canGoBack: mockCanGoBack }),
}));

// A versão vem da configuração do Expo (borda); o leitor real tem teste próprio.
jest.mock('@/config/app-version', () => ({ getAppVersion: jest.fn(() => '0.1.0') }));
const getAppVersionMock = getAppVersion as jest.MockedFunction<typeof getAppVersion>;

const secureStoreMock = SecureStore as unknown as { __limparArmazenamentoDeTeste: () => void };

const METRICAS_DE_TESTE = {
  frame: { x: 0, y: 0, width: 360, height: 740 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

const USUARIO_FICTICIO = {
  id: 1,
  nome: 'João da Silva',
  email: 'joao.silva@exemplo-ficticio.com.br',
  perfil: 'ADMIN',
};

async function guardarSessao(usuario: object = USUARIO_FICTICIO): Promise<void> {
  await SecureStore.setItemAsync('mecanicaSaoJorge.auth.token', 'token-existente');
  await SecureStore.setItemAsync('mecanicaSaoJorge.auth.usuario', JSON.stringify(usuario));
}

async function renderPerfilScreen(): Promise<void> {
  render(
    <SafeAreaProvider initialMetrics={METRICAS_DE_TESTE}>
      <AuthProvider>
        <PerfilScreen />
      </AuthProvider>
    </SafeAreaProvider>,
  );
  await act(async () => {});
}

describe('PerfilScreen', () => {
  beforeEach(async () => {
    secureStoreMock.__limparArmazenamentoDeTeste();
    jest.clearAllMocks();
    getAppVersionMock.mockReturnValue('0.1.0');
    mockCanGoBack.mockReturnValue(true);
    await guardarSessao();
  });

  it('should show the name, the initials avatar, the profile badge and the three card rows', async () => {
    await renderPerfilScreen();

    expect(screen.getByText('João da Silva')).toBeTruthy();
    expect(screen.getByText('JS', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText('ADMIN')).toBeTruthy();
    expect(screen.getByLabelText('Usuário: joao.silva@exemplo-ficticio.com.br')).toBeTruthy();
    expect(screen.getByLabelText('Perfil de acesso: Administrador')).toBeTruthy();
    expect(screen.getByLabelText('Versão do app: 0.1.0')).toBeTruthy();
  });

  it('should draw the name in Barlow Condensed SemiBold 24 petro, centered (V-P04)', async () => {
    await renderPerfilScreen();

    expect(
      StyleSheet.flatten(screen.getByText('João da Silva').props.style as TestStyle),
    ).toMatchObject({
      fontFamily: 'BarlowCondensed_600SemiBold',
      fontSize: 24,
      color: '#1E3A3F',
      textAlign: 'center',
    });
  });

  it('should show the e-mail under the "Usuário" label and no separate name or e-mail rows', async () => {
    await renderPerfilScreen();

    expect(screen.queryByText('Nome')).toBeNull();
    expect(screen.queryByText('E-mail')).toBeNull();
  });

  it('should read the app version from the Expo config and show the neutral text when it is missing', async () => {
    getAppVersionMock.mockReturnValue(undefined);

    await renderPerfilScreen();

    expect(screen.getByLabelText('Versão do app: Não informada')).toBeTruthy();
  });

  it('should show the FUNCIONARIO profile with its own badge and text', async () => {
    secureStoreMock.__limparArmazenamentoDeTeste();
    await guardarSessao({ ...USUARIO_FICTICIO, perfil: 'FUNCIONARIO' });

    await renderPerfilScreen();

    expect(screen.getByText('FUNCIONÁRIO')).toBeTruthy();
    expect(screen.getByLabelText('Perfil de acesso: Funcionário')).toBeTruthy();
  });

  it('should render without a tab bar (the Perfil left the menu, D-05)', async () => {
    await renderPerfilScreen();

    expect(screen.queryAllByRole('tab')).toHaveLength(0);
  });

  it('should go back with the header arrow when there is history', async () => {
    await renderPerfilScreen();

    fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));

    expect(mockBack).toHaveBeenCalledTimes(1);
    expect(mockReplace).not.toHaveBeenCalledWith('/inicio');
  });

  it('should land on /inicio with the header arrow when there is no history to go back to', async () => {
    mockCanGoBack.mockReturnValue(false);
    await renderPerfilScreen();

    fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));

    expect(mockReplace).toHaveBeenCalledWith('/inicio');
    expect(mockBack).not.toHaveBeenCalled();
  });

  it('should open the confirmation dialog from "Sair da conta" and keep the session on cancel', async () => {
    await renderPerfilScreen();

    fireEvent.press(screen.getByRole('button', { name: 'Sair da conta' }));

    expect(screen.getByText('Sair da conta?')).toBeTruthy();
    expect(
      screen.getByText('Você vai precisar do usuário e senha para entrar de novo.'),
    ).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByText('Sair da conta?')).toBeNull();
    expect(await SecureStore.getItemAsync('mecanicaSaoJorge.auth.token')).toBe('token-existente');
    expect(mockReplace).not.toHaveBeenCalledWith('/login');
  });

  it('should clear the token and navigate to /login when logout is confirmed', async () => {
    await renderPerfilScreen();

    fireEvent.press(screen.getByRole('button', { name: 'Sair da conta' }));
    fireEvent.press(screen.getByRole('button', { name: 'Sair' }));

    await waitFor(async () => {
      expect(await SecureStore.getItemAsync('mecanicaSaoJorge.auth.token')).toBeNull();
    });
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/login'));
  });

  it('should send a visitor without session to /login and show nothing', async () => {
    secureStoreMock.__limparArmazenamentoDeTeste();

    await renderPerfilScreen();

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/login'));
    expect(screen.queryByText('João da Silva')).toBeNull();
  });
});

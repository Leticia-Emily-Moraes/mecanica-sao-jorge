import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';

import { autenticar, CredenciaisInvalidasError } from '@/services/auth-service';
import type { Usuario } from '@/services/auth-types';

import { AuthProvider, useAuth } from './use-auth';

jest.mock('@/services/auth-service');

const autenticarMock = autenticar as jest.MockedFunction<typeof autenticar>;
const secureStoreMock = SecureStore as unknown as {
  __limparArmazenamentoDeTeste: () => void;
  __opcoesDaChaveDeTeste: (chave: string) => unknown;
};

const USUARIO_FICTICIO: Usuario = {
  id: 1,
  nome: 'Ana Beatriz Souza',
  email: 'ana.souza@exemplo-ficticio.com.br',
  perfil: 'ADMIN',
};

describe('AuthProvider / useAuth', () => {
  beforeEach(() => {
    secureStoreMock.__limparArmazenamentoDeTeste();
    jest.clearAllMocks();
  });

  it('should start as naoAutenticado when SecureStore has no stored session', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.status.tipo).not.toBe('carregando'));

    expect(result.current.status).toEqual({ tipo: 'naoAutenticado', sessaoExpirada: false });
  });

  it('should restore the session as autenticado when a token and user are already stored', async () => {
    await SecureStore.setItemAsync('mecanicaSaoJorge.auth.token', 'token-existente');
    await SecureStore.setItemAsync(
      'mecanicaSaoJorge.auth.usuario',
      JSON.stringify(USUARIO_FICTICIO),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.status.tipo).toBe('autenticado'));

    expect(result.current.status).toEqual({ tipo: 'autenticado', usuario: USUARIO_FICTICIO });
    expect(result.current.tokenAtual).toBe('token-existente');
  });

  it('should report erroInicializacao when reading SecureStore throws', async () => {
    jest.spyOn(SecureStore, 'getItemAsync').mockRejectedValueOnce(new Error('falha de leitura'));

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.status.tipo).toBe('erroInicializacao'));
  });

  it('should persist the token and user and switch to autenticado when login succeeds', async () => {
    autenticarMock.mockResolvedValueOnce({
      token: 'novo-token',
      tipo: 'Bearer',
      expiraEm: '2026-11-14T00:00:00Z',
      usuario: USUARIO_FICTICIO,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.status.tipo).toBe('naoAutenticado'));

    await act(async () => {
      await result.current.login('ana.souza@exemplo-ficticio.com.br', 'senha-ficticia');
    });

    expect(result.current.status).toEqual({ tipo: 'autenticado', usuario: USUARIO_FICTICIO });
    expect(await SecureStore.getItemAsync('mecanicaSaoJorge.auth.token')).toBe('novo-token');
  });

  it('should store token and user bound to this device only (no encrypted backup)', async () => {
    autenticarMock.mockResolvedValueOnce({
      token: 'novo-token',
      tipo: 'Bearer',
      expiraEm: '2026-11-14T00:00:00Z',
      usuario: USUARIO_FICTICIO,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.status.tipo).toBe('naoAutenticado'));

    await act(async () => {
      await result.current.login('ana.souza@exemplo-ficticio.com.br', 'senha-ficticia');
    });

    const opcoesToken = secureStoreMock.__opcoesDaChaveDeTeste('mecanicaSaoJorge.auth.token');
    const opcoesUsuario = secureStoreMock.__opcoesDaChaveDeTeste('mecanicaSaoJorge.auth.usuario');

    expect(opcoesToken).toEqual({
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    expect(opcoesUsuario).toEqual({
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  });

  it('should keep status naoAutenticado and rethrow when login fails', async () => {
    autenticarMock.mockRejectedValueOnce(new CredenciaisInvalidasError());

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.status.tipo).toBe('naoAutenticado'));

    await expect(
      act(async () => {
        await result.current.login('ana.souza@exemplo-ficticio.com.br', 'senha-errada');
      }),
    ).rejects.toBeInstanceOf(CredenciaisInvalidasError);

    expect(result.current.status).toEqual({ tipo: 'naoAutenticado', sessaoExpirada: false });
  });

  it('should clear the stored session and go back to naoAutenticado on logout', async () => {
    await SecureStore.setItemAsync('mecanicaSaoJorge.auth.token', 'token-existente');
    await SecureStore.setItemAsync(
      'mecanicaSaoJorge.auth.usuario',
      JSON.stringify(USUARIO_FICTICIO),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.status.tipo).toBe('autenticado'));

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.status).toEqual({ tipo: 'naoAutenticado', sessaoExpirada: false });
    expect(await SecureStore.getItemAsync('mecanicaSaoJorge.auth.token')).toBeNull();
  });

  it('should clear the session and flag sessaoExpirada on tratarSessaoExpirada', async () => {
    await SecureStore.setItemAsync('mecanicaSaoJorge.auth.token', 'token-existente');
    await SecureStore.setItemAsync(
      'mecanicaSaoJorge.auth.usuario',
      JSON.stringify(USUARIO_FICTICIO),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.status.tipo).toBe('autenticado'));

    await act(async () => {
      await result.current.tratarSessaoExpirada();
    });

    expect(result.current.status).toEqual({ tipo: 'naoAutenticado', sessaoExpirada: true });
  });
});

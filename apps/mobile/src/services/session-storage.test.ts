import * as SecureStore from 'expo-secure-store';

import type { Usuario } from './auth-types';
import { clearStoredSession, readStoredSession, saveSession } from './session-storage';

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

describe('session-storage', () => {
  beforeEach(() => {
    secureStoreMock.__limparArmazenamentoDeTeste();
  });

  it('should return null when nothing is stored', async () => {
    await expect(readStoredSession()).resolves.toBeNull();
  });

  it('should read back the token and the user after saving', async () => {
    await saveSession({ token: 'token-jwt-fake', usuario: USUARIO_FICTICIO });

    await expect(readStoredSession()).resolves.toEqual({
      token: 'token-jwt-fake',
      usuario: USUARIO_FICTICIO,
    });
  });

  it('should keep token and user bound to this device only, out of encrypted backups', async () => {
    await saveSession({ token: 'token-jwt-fake', usuario: USUARIO_FICTICIO });

    const expected = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };
    expect(secureStoreMock.__opcoesDaChaveDeTeste('mecanicaSaoJorge.auth.token')).toEqual(expected);
    expect(secureStoreMock.__opcoesDaChaveDeTeste('mecanicaSaoJorge.auth.usuario')).toEqual(
      expected,
    );
  });

  it('should return null when only the token is stored', async () => {
    await SecureStore.setItemAsync('mecanicaSaoJorge.auth.token', 'token-jwt-fake');

    await expect(readStoredSession()).resolves.toBeNull();
  });

  it('should return null when the stored user is unreadable', async () => {
    await SecureStore.setItemAsync('mecanicaSaoJorge.auth.token', 'token-jwt-fake');
    await SecureStore.setItemAsync('mecanicaSaoJorge.auth.usuario', '{isto não é json');

    await expect(readStoredSession()).resolves.toBeNull();
  });

  it('should remove token and user when the session is cleared', async () => {
    await saveSession({ token: 'token-jwt-fake', usuario: USUARIO_FICTICIO });

    await clearStoredSession();

    await expect(readStoredSession()).resolves.toBeNull();
    expect(await SecureStore.getItemAsync('mecanicaSaoJorge.auth.token')).toBeNull();
    expect(await SecureStore.getItemAsync('mecanicaSaoJorge.auth.usuario')).toBeNull();
  });

  it('should let a storage failure reach the caller instead of swallowing it', async () => {
    jest.spyOn(SecureStore, 'getItemAsync').mockRejectedValueOnce(new Error('falha de leitura'));

    await expect(readStoredSession()).rejects.toThrow('falha de leitura');
  });
});

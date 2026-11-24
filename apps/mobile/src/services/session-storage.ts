import * as SecureStore from 'expo-secure-store';

import type { Usuario } from './auth-types';

const TOKEN_KEY = 'mecanicaSaoJorge.auth.token';
const USER_KEY = 'mecanicaSaoJorge.auth.usuario';

/**
 * Credencial de autenticação e PII (token JWT + nome/e-mail/perfil) só são
 * acessíveis com o aparelho desbloqueado e NUNCA saem do dispositivo: o
 * sufixo THIS_DEVICE_ONLY exclui o item de backups criptografados (iCloud/
 * iTunes) e impede restauração em outro aparelho. Minimiza a exposição do
 * dado pessoal (LGPD art. 46) além do Keychain/Keystore local. Ver
 * docs/product/F30-appsec-lgpd-login-perfil.md.
 *
 * Único módulo do app que toca o SecureStore: token e dado pessoal não
 * circulam por tela nem por componente.
 */
const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export interface StoredSession {
  readonly token: string;
  readonly usuario: Usuario;
}

function parseStoredUser(serialized: string): Usuario | null {
  try {
    return JSON.parse(serialized) as Usuario;
  } catch {
    return null;
  }
}

/** Lê a sessão gravada. Devolve `null` se faltar token ou usuário (ou se o usuário estiver ilegível). */
export async function readStoredSession(): Promise<StoredSession | null> {
  const [token, serializedUser] = await Promise.all([
    SecureStore.getItemAsync(TOKEN_KEY),
    SecureStore.getItemAsync(USER_KEY),
  ]);

  const usuario = serializedUser ? parseStoredUser(serializedUser) : null;

  return token && usuario ? { token, usuario } : null;
}

export async function saveSession(session: StoredSession): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEY, session.token, SECURE_STORE_OPTIONS),
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(session.usuario), SECURE_STORE_OPTIONS),
  ]);
}

export async function clearStoredSession(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
}

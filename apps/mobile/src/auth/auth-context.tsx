import * as SecureStore from 'expo-secure-store';
import type { ReactElement, ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { autenticar } from './auth-api';
import type { Usuario } from './types';

const CHAVE_TOKEN = 'mecanicaSaoJorge.auth.token';
const CHAVE_USUARIO = 'mecanicaSaoJorge.auth.usuario';

/**
 * Credencial de autenticação e PII (token JWT + nome/e-mail/perfil) só são
 * acessíveis com o aparelho desbloqueado e NUNCA saem do dispositivo: o
 * sufixo THIS_DEVICE_ONLY exclui o item de backups criptografados (iCloud/
 * iTunes) e impede restauração em outro aparelho. Minimiza a exposição do
 * dado pessoal (LGPD art. 46) além do Keychain/Keystore local. Ver
 * docs/product/F30-appsec-lgpd-login-perfil.md.
 */
const OPCOES_ARMAZENAMENTO_SEGURO: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export type AuthStatus =
  | { tipo: 'carregando' }
  | { tipo: 'erroInicializacao' }
  | { tipo: 'autenticado'; usuario: Usuario }
  | { tipo: 'naoAutenticado'; sessaoExpirada: boolean };

export interface AuthContextValue {
  readonly status: AuthStatus;
  readonly tokenAtual: string | null;
  login(email: string, senha: string): Promise<void>;
  logout(): Promise<void>;
  tratarSessaoExpirada(): Promise<void>;
  tentarNovamenteInicializacao(): void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function limparCredenciaisArmazenadas(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(CHAVE_TOKEN),
    SecureStore.deleteItemAsync(CHAVE_USUARIO),
  ]);
}

function parseUsuarioArmazenado(valor: string): Usuario | null {
  try {
    const candidato = JSON.parse(valor) as Usuario;
    return candidato;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }): ReactElement {
  const [status, setStatus] = useState<AuthStatus>({ tipo: 'carregando' });
  const [tokenAtual, setTokenAtual] = useState<string | null>(null);

  const inicializar = useCallback(async () => {
    setStatus({ tipo: 'carregando' });
    try {
      const [token, usuarioSerializado] = await Promise.all([
        SecureStore.getItemAsync(CHAVE_TOKEN),
        SecureStore.getItemAsync(CHAVE_USUARIO),
      ]);

      const usuario = usuarioSerializado ? parseUsuarioArmazenado(usuarioSerializado) : null;

      if (token && usuario) {
        setTokenAtual(token);
        setStatus({ tipo: 'autenticado', usuario });
      } else {
        setTokenAtual(null);
        setStatus({ tipo: 'naoAutenticado', sessaoExpirada: false });
      }
    } catch {
      setStatus({ tipo: 'erroInicializacao' });
    }
  }, []);

  useEffect(() => {
    void inicializar();
  }, [inicializar]);

  const login = useCallback(async (email: string, senha: string): Promise<void> => {
    const resposta = await autenticar(email, senha);

    await Promise.all([
      SecureStore.setItemAsync(CHAVE_TOKEN, resposta.token, OPCOES_ARMAZENAMENTO_SEGURO),
      SecureStore.setItemAsync(
        CHAVE_USUARIO,
        JSON.stringify(resposta.usuario),
        OPCOES_ARMAZENAMENTO_SEGURO,
      ),
    ]);

    setTokenAtual(resposta.token);
    setStatus({ tipo: 'autenticado', usuario: resposta.usuario });
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await limparCredenciaisArmazenadas();
    setTokenAtual(null);
    setStatus({ tipo: 'naoAutenticado', sessaoExpirada: false });
  }, []);

  const tratarSessaoExpirada = useCallback(async (): Promise<void> => {
    await limparCredenciaisArmazenadas();
    setTokenAtual(null);
    setStatus({ tipo: 'naoAutenticado', sessaoExpirada: true });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      tokenAtual,
      login,
      logout,
      tratarSessaoExpirada,
      tentarNovamenteInicializacao: () => void inicializar(),
    }),
    [status, tokenAtual, login, logout, tratarSessaoExpirada, inicializar],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

import type { ReactElement, ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { autenticar } from '@/services/auth-service';
import type { Usuario } from '@/services/auth-types';
import { clearStoredSession, readStoredSession, saveSession } from '@/services/session-storage';

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

export function AuthProvider({ children }: { children: ReactNode }): ReactElement {
  const [status, setStatus] = useState<AuthStatus>({ tipo: 'carregando' });
  const [tokenAtual, setTokenAtual] = useState<string | null>(null);

  const inicializar = useCallback(async () => {
    setStatus({ tipo: 'carregando' });
    try {
      const sessao = await readStoredSession();

      if (sessao) {
        setTokenAtual(sessao.token);
        setStatus({ tipo: 'autenticado', usuario: sessao.usuario });
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

    await saveSession({ token: resposta.token, usuario: resposta.usuario });

    setTokenAtual(resposta.token);
    setStatus({ tipo: 'autenticado', usuario: resposta.usuario });
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await clearStoredSession();
    setTokenAtual(null);
    setStatus({ tipo: 'naoAutenticado', sessaoExpirada: false });
  }, []);

  const tratarSessaoExpirada = useCallback(async (): Promise<void> => {
    await clearStoredSession();
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

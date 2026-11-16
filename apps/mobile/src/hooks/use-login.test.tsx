import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';

import { autenticar, CredenciaisInvalidasError, ErroDeRedeError } from '@/services/auth-service';
import type { RespostaLogin } from '@/services/auth-types';

import { AuthProvider, useAuth } from './use-auth';
import { useLogin } from './use-login';

// Só a função é mockada: as classes de erro reais ficam, senão o `instanceof`
// do hook compararia contra uma classe automockada diferente.
jest.mock('@/services/auth-service', () => ({
  ...jest.requireActual('@/services/auth-service'),
  autenticar: jest.fn(),
}));

const autenticarMock = autenticar as jest.MockedFunction<typeof autenticar>;
const secureStoreMock = SecureStore as unknown as { __limparArmazenamentoDeTeste: () => void };

const EMAIL = 'ana.souza@exemplo-ficticio.com.br';
const SENHA = 'senha-ficticia';

const RESPOSTA_LOGIN: RespostaLogin = {
  token: 'token-jwt-fake',
  tipo: 'Bearer',
  expiraEm: '2026-11-14T00:00:00Z',
  usuario: { id: 1, nome: 'Ana Beatriz Souza', email: EMAIL, perfil: 'ADMIN' },
};

async function renderLoginHook() {
  const hook = renderHook(() => ({ form: useLogin(), auth: useAuth() }), {
    wrapper: AuthProvider,
  });
  await waitFor(() => expect(hook.result.current.auth.status.tipo).toBe('naoAutenticado'));
  return hook;
}

function preencher(result: Awaited<ReturnType<typeof renderLoginHook>>['result']): void {
  act(() => {
    result.current.form.atualizarEmail(`  ${EMAIL}  `);
    result.current.form.atualizarSenha(SENHA);
  });
}

describe('useLogin', () => {
  beforeEach(() => {
    secureStoreMock.__limparArmazenamentoDeTeste();
    jest.clearAllMocks();
  });

  it('should start idle with empty fields and the password hidden', async () => {
    const { result } = await renderLoginHook();

    expect(result.current.form).toMatchObject({
      email: '',
      senha: '',
      mostrarSenha: false,
      erroEmail: undefined,
      erroSenha: undefined,
      estadoEnvio: 'idle',
      sessaoExpirada: false,
    });
  });

  it('should flag both fields as empty and never call the API when nothing was typed', async () => {
    const { result } = await renderLoginHook();

    await act(async () => {
      await result.current.form.enviar();
    });

    expect(result.current.form.erroEmail).toBe('vazio');
    expect(result.current.form.erroSenha).toBe('vazio');
    expect(result.current.form.estadoEnvio).toBe('idle');
    expect(autenticarMock).not.toHaveBeenCalled();
  });

  it('should treat a blank e-mail as empty even when it has only spaces', async () => {
    const { result } = await renderLoginHook();
    act(() => {
      result.current.form.atualizarEmail('   ');
      result.current.form.atualizarSenha(SENHA);
    });

    await act(async () => {
      await result.current.form.enviar();
    });

    expect(result.current.form.erroEmail).toBe('vazio');
    expect(result.current.form.erroSenha).toBeUndefined();
    expect(autenticarMock).not.toHaveBeenCalled();
  });

  it('should authenticate with the trimmed e-mail and become autenticado when the API accepts', async () => {
    autenticarMock.mockResolvedValueOnce(RESPOSTA_LOGIN);
    const { result } = await renderLoginHook();
    preencher(result);

    await act(async () => {
      await result.current.form.enviar();
    });

    expect(autenticarMock).toHaveBeenCalledWith(EMAIL, SENHA);
    expect(result.current.auth.status).toEqual({
      tipo: 'autenticado',
      usuario: RESPOSTA_LOGIN.usuario,
    });
  });

  it('should report erroCredencial and stay unauthenticated when the API answers 401', async () => {
    autenticarMock.mockRejectedValueOnce(new CredenciaisInvalidasError());
    const { result } = await renderLoginHook();
    preencher(result);

    await act(async () => {
      await result.current.form.enviar();
    });

    expect(result.current.form.estadoEnvio).toBe('erroCredencial');
    expect(result.current.auth.status.tipo).toBe('naoAutenticado');
  });

  it('should report erroRede when the API is unreachable', async () => {
    autenticarMock.mockRejectedValueOnce(new ErroDeRedeError());
    const { result } = await renderLoginHook();
    preencher(result);

    await act(async () => {
      await result.current.form.enviar();
    });

    expect(result.current.form.estadoEnvio).toBe('erroRede');
    expect(result.current.auth.status.tipo).toBe('naoAutenticado');
  });

  it('should retry the submission after a network error and then authenticate', async () => {
    autenticarMock.mockRejectedValueOnce(new ErroDeRedeError());
    autenticarMock.mockResolvedValueOnce(RESPOSTA_LOGIN);
    const { result } = await renderLoginHook();
    preencher(result);

    await act(async () => {
      await result.current.form.enviar();
    });
    await act(async () => {
      await result.current.form.enviar();
    });

    expect(autenticarMock).toHaveBeenCalledTimes(2);
    expect(result.current.auth.status.tipo).toBe('autenticado');
  });

  it('should clear the submission error as soon as the user edits a field', async () => {
    autenticarMock.mockRejectedValueOnce(new CredenciaisInvalidasError());
    const { result } = await renderLoginHook();
    preencher(result);
    await act(async () => {
      await result.current.form.enviar();
    });

    act(() => {
      result.current.form.atualizarSenha('outra-senha');
    });

    expect(result.current.form.estadoEnvio).toBe('idle');
  });

  it('should toggle the password visibility', async () => {
    const { result } = await renderLoginHook();

    act(() => {
      result.current.form.alternarMostrarSenha();
    });
    expect(result.current.form.mostrarSenha).toBe(true);

    act(() => {
      result.current.form.alternarMostrarSenha();
    });
    expect(result.current.form.mostrarSenha).toBe(false);
  });

  it('should expose sessaoExpirada after the session expires', async () => {
    const { result } = await renderLoginHook();

    await act(async () => {
      await result.current.auth.tratarSessaoExpirada();
    });

    expect(result.current.form.sessaoExpirada).toBe(true);
  });
});

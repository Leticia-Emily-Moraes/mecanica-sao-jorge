import { renderHook } from '@testing-library/react-native';

import {
  ErroDeValidacaoError,
  FalhaDeConexaoError,
  RequisicaoCanceladaError,
} from '@/services/api-errors';
import { SessaoExpiradaError } from '@/services/http-client';

import { useAuth } from './use-auth';
import { useAuthenticatedRequest } from './use-authenticated-request';

jest.mock('./use-auth');

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const tratarSessaoExpirada = jest.fn(async () => undefined);

function autenticar(token: string | null): void {
  mockedUseAuth.mockReturnValue({
    tokenAtual: token,
    tratarSessaoExpirada,
  } as unknown as ReturnType<typeof useAuth>);
}

describe('useAuthenticatedRequest', () => {
  beforeEach(() => {
    tratarSessaoExpirada.mockClear();
    autenticar('token-de-teste');
  });

  it('should pass the session token and a signal to the call and return its value', async () => {
    const { result } = renderHook(() => useAuthenticatedRequest());
    const chamada = jest.fn(async () => 42);

    const resultado = await result.current.executar(chamada);

    expect(resultado).toEqual({ ok: true, valor: 42 });
    expect(chamada).toHaveBeenCalledWith('token-de-teste', expect.any(AbortSignal));
  });

  it('should treat a missing token as an expired session without calling the API', async () => {
    autenticar(null);
    const { result } = renderHook(() => useAuthenticatedRequest());
    const chamada = jest.fn(async () => 1);

    const resultado = await result.current.executar(chamada);

    expect(chamada).not.toHaveBeenCalled();
    expect(tratarSessaoExpirada).toHaveBeenCalledTimes(1);
    expect(resultado.ok === false && resultado.erro instanceof RequisicaoCanceladaError).toBe(true);
  });

  it('should handle a 401 once, centrally, and hand the screen a cancelled result', async () => {
    const { result } = renderHook(() => useAuthenticatedRequest());

    const resultado = await result.current.executar(async () => {
      throw new SessaoExpiradaError();
    });

    expect(tratarSessaoExpirada).toHaveBeenCalledTimes(1);
    expect(resultado.ok === false && resultado.erro instanceof RequisicaoCanceladaError).toBe(true);
  });

  it('should keep a typed API error as it came', async () => {
    const { result } = renderHook(() => useAuthenticatedRequest());
    const erro = new ErroDeValidacaoError(400, [], null);

    const resultado = await result.current.executar(async () => {
      throw erro;
    });

    expect(resultado).toEqual({ ok: false, erro });
  });

  it('should turn an unknown error into a visible connection failure, never silence', async () => {
    const { result } = renderHook(() => useAuthenticatedRequest());

    const resultado = await result.current.executar(async () => {
      throw new TypeError('defeito de código');
    });

    expect(resultado.ok).toBe(false);
    expect(
      !resultado.ok &&
        resultado.erro instanceof FalhaDeConexaoError &&
        resultado.erro.motivo === 'respostaInesperada',
    ).toBe(true);
  });

  it('should abort the previous call of the same channel and drop its late response', async () => {
    const { result } = renderHook(() => useAuthenticatedRequest());
    let sinalDaPrimeira: AbortSignal | undefined;
    let liberarPrimeira: (valor: string) => void = () => undefined;

    const primeira = result.current.executar<string>(
      (_token, signal) =>
        new Promise((resolver) => {
          sinalDaPrimeira = signal;
          liberarPrimeira = resolver;
        }),
      'busca',
    );
    const segunda = result.current.executar(async () => 'nova', 'busca');

    liberarPrimeira('velha');

    expect(sinalDaPrimeira?.aborted).toBe(true);
    await expect(segunda).resolves.toEqual({ ok: true, valor: 'nova' });
    const resultadoDaPrimeira = await primeira;
    expect(resultadoDaPrimeira.ok).toBe(false);
  });

  it('should not abort a call of another channel', async () => {
    const { result } = renderHook(() => useAuthenticatedRequest());
    let sinal: AbortSignal | undefined;
    let liberar: (valor: string) => void = () => undefined;

    const lenta = result.current.executar<string>(
      (_token, signal) =>
        new Promise((resolver) => {
          sinal = signal;
          liberar = resolver;
        }),
      'a',
    );
    await result.current.executar(async () => 'outra', 'b');
    liberar('ok');

    expect(sinal?.aborted).toBe(false);
    await expect(lenta).resolves.toEqual({ ok: true, valor: 'ok' });
  });

  it('should abort every pending call when the screen unmounts', async () => {
    const { result, unmount } = renderHook(() => useAuthenticatedRequest());
    let sinal: AbortSignal | undefined;

    const pendente = result.current.executar<string>(
      (_token, signal) =>
        new Promise((resolver) => {
          sinal = signal;
          setTimeout(() => resolver('tarde'), 0);
        }),
    );
    unmount();

    expect(sinal?.aborted).toBe(true);
    expect((await pendente).ok).toBe(false);
  });

  it('should keep the same executar identity when the token changes', () => {
    const { result, rerender } = renderHook(() => useAuthenticatedRequest());
    const antes = result.current.executar;

    autenticar('outro-token');
    rerender({});

    expect(result.current.executar).toBe(antes);
  });
});

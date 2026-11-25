import { act, renderHook, waitFor } from '@testing-library/react-native';

import { FalhaDeConexaoError, RecursoNaoEncontradoError } from '@/services/api-errors';

import { useAuth } from './use-auth';
import { useResource } from './use-resource';

jest.mock('./use-auth');

const tratarSessaoExpirada = jest.fn(async () => undefined);

beforeEach(() => {
  tratarSessaoExpirada.mockClear();
  (useAuth as jest.MockedFunction<typeof useAuth>).mockReturnValue({
    tokenAtual: 'token-de-teste',
    tratarSessaoExpirada,
  } as unknown as ReturnType<typeof useAuth>);
});

describe('useResource', () => {
  it('should start loading and end in success with the loaded data', async () => {
    const carregar = jest.fn(async (id: number) => ({ id }));

    const { result } = renderHook(() => useResource(5, carregar));

    expect(result.current.estado).toEqual({ tipo: 'carregando' });
    await waitFor(() =>
      expect(result.current.estado).toEqual({
        tipo: 'sucesso',
        dados: { id: 5 },
        atualizando: false,
      }),
    );
    expect(carregar).toHaveBeenCalledWith(5, 'token-de-teste', expect.any(AbortSignal));
  });

  it('should be not found without calling the API when the key is null', () => {
    const carregar = jest.fn(async () => 1);

    const { result } = renderHook(() => useResource(null, carregar));

    expect(result.current.estado).toEqual({ tipo: 'naoEncontrado' });
    expect(carregar).not.toHaveBeenCalled();
  });

  it('should be not found when the API answers 404', async () => {
    const carregar = jest.fn(async () => {
      throw new RecursoNaoEncontradoError();
    });

    const { result } = renderHook(() => useResource(5, carregar));

    await waitFor(() => expect(result.current.estado).toEqual({ tipo: 'naoEncontrado' }));
  });

  it('should show a connection error and recover with tentarNovamente', async () => {
    const carregar = jest
      .fn<Promise<string>, [number]>()
      .mockRejectedValueOnce(new FalhaDeConexaoError('semResposta'))
      .mockResolvedValueOnce('dados');

    const { result } = renderHook(() => useResource(5, carregar));
    await waitFor(() => expect(result.current.estado).toEqual({ tipo: 'erroConexao' }));

    act(() => {
      result.current.tentarNovamente();
    });
    expect(result.current.estado).toEqual({ tipo: 'carregando' });

    await waitFor(() => expect(result.current.estado.tipo).toBe('sucesso'));
  });

  it('should load again when the key changes and drop the old answer', async () => {
    let liberarPrimeira: (valor: string) => void = () => undefined;
    const carregar = jest.fn((id: number) =>
      id === 1
        ? new Promise<string>((resolver) => {
            liberarPrimeira = resolver;
          })
        : Promise.resolve('segundo'),
    );

    const { result, rerender } = renderHook(
      ({ chave }: { chave: number }) => useResource(chave, carregar),
      { initialProps: { chave: 1 } },
    );
    rerender({ chave: 2 });
    await waitFor(() =>
      expect(result.current.estado).toMatchObject({ tipo: 'sucesso', dados: 'segundo' }),
    );

    await act(async () => {
      liberarPrimeira('primeiro');
    });

    expect(result.current.estado).toMatchObject({ dados: 'segundo' });
  });

  it('should keep the data and flag the failure when a refresh fails', async () => {
    const carregar = jest
      .fn<Promise<string>, [number]>()
      .mockResolvedValueOnce('dados')
      .mockRejectedValueOnce(new FalhaDeConexaoError('servidor'));

    const { result } = renderHook(() => useResource(5, carregar));
    await waitFor(() => expect(result.current.estado.tipo).toBe('sucesso'));

    act(() => {
      result.current.atualizar();
    });
    expect(result.current.estado).toMatchObject({ tipo: 'sucesso', atualizando: true });

    await waitFor(() => expect(result.current.falhaAoAtualizar).toBe(true));
    expect(result.current.estado).toEqual({
      tipo: 'sucesso',
      dados: 'dados',
      atualizando: false,
    });
  });

  it('should replace the data and clear the failure flag when a refresh succeeds', async () => {
    const carregar = jest
      .fn<Promise<string>, [number]>()
      .mockResolvedValueOnce('antigo')
      .mockResolvedValueOnce('novo');

    const { result } = renderHook(() => useResource(5, carregar));
    await waitFor(() => expect(result.current.estado.tipo).toBe('sucesso'));

    act(() => {
      result.current.atualizar();
    });

    await waitFor(() =>
      expect(result.current.estado).toEqual({
        tipo: 'sucesso',
        dados: 'novo',
        atualizando: false,
      }),
    );
    expect(result.current.falhaAoAtualizar).toBe(false);
  });

  it('should become not found when a refresh finds the record gone', async () => {
    const carregar = jest
      .fn<Promise<string>, [number]>()
      .mockResolvedValueOnce('dados')
      .mockRejectedValueOnce(new RecursoNaoEncontradoError());

    const { result } = renderHook(() => useResource(5, carregar));
    await waitFor(() => expect(result.current.estado.tipo).toBe('sucesso'));

    act(() => {
      result.current.atualizar();
    });

    await waitFor(() => expect(result.current.estado).toEqual({ tipo: 'naoEncontrado' }));
  });
});

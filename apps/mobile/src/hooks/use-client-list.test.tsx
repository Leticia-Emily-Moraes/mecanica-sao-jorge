import { act, renderHook, waitFor } from '@testing-library/react-native';

import { fakeResponse, mockFetch } from '@/test-utils/fake-response';

import { useAuth } from './use-auth';
import { useClientList } from './use-client-list';

jest.mock('./use-auth');
jest.mock('expo-router', () => ({ useFocusEffect: jest.fn() }));

const tratarSessaoExpirada = jest.fn(async () => undefined);

function cliente(id: number): { id: number; nome: string; telefone: null; email: null } {
  return { id, nome: `Cliente de Teste ${id}`, telefone: null, email: null };
}

function pagina(
  ids: number[],
  numero: number,
  totalPaginas: number,
  totalItens: number = ids.length,
): unknown {
  return { itens: ids.map(cliente), pagina: numero, tamanho: 20, totalItens, totalPaginas };
}

const VAZIA = pagina([], 0, 0, 0);

function urlsChamadas(fetchMock: jest.Mock): string[] {
  return fetchMock.mock.calls.map((chamada) => String(chamada[0]).replace(/^.*\/api\/v1/, ''));
}

describe('useClientList', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    tratarSessaoExpirada.mockClear();
    (useAuth as jest.MockedFunction<typeof useAuth>).mockReturnValue({
      tokenAtual: 'token-de-teste',
      tratarSessaoExpirada,
    } as unknown as ReturnType<typeof useAuth>);
    fetchMock = mockFetch();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should load the first page on mount and end in success', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, pagina([1, 2], 0, 1)));

    const { result } = renderHook(() => useClientList());

    expect(result.current.estado).toEqual({ tipo: 'carregando' });
    await waitFor(() => expect(result.current.estado.tipo).toBe('sucesso'));
    expect(urlsChamadas(fetchMock)).toEqual(['/clientes?page=0&size=20']);
    expect(result.current.estado).toMatchObject({ total: 2, temMais: false });
  });

  it('should be empty, not "no result", when there is no term and no client', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, VAZIA));

    const { result } = renderHook(() => useClientList());

    await waitFor(() => expect(result.current.estado).toEqual({ tipo: 'vazio' }));
  });

  it('should show a connection error when the first load fails', async () => {
    fetchMock.mockResolvedValue(fakeResponse(500, {}));

    const { result } = renderHook(() => useClientList());

    await waitFor(() => expect(result.current.estado).toEqual({ tipo: 'erroConexao' }));
  });

  it('should recover from an error with tentarNovamente', async () => {
    fetchMock
      .mockResolvedValueOnce(fakeResponse(500, {}))
      .mockResolvedValueOnce(fakeResponse(200, pagina([1], 0, 1)));
    const { result } = renderHook(() => useClientList());
    await waitFor(() => expect(result.current.estado.tipo).toBe('erroConexao'));

    act(() => {
      result.current.tentarNovamente();
    });

    await waitFor(() => expect(result.current.estado.tipo).toBe('sucesso'));
  });

  it('should wait 400 ms after the last key before searching, with the trimmed term', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, pagina([1], 0, 1)));
    const { result } = renderHook(() => useClientList());
    await waitFor(() => expect(result.current.estado.tipo).toBe('sucesso'));
    fetchMock.mockClear();

    act(() => {
      result.current.alterarTermo('  ana ');
    });
    act(() => {
      jest.advanceTimersByTime(399);
    });
    expect(fetchMock).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(urlsChamadas(fetchMock)).toEqual(['/clientes?q=ana&page=0&size=20']);
    expect(result.current.termoAplicado).toBe('ana');
  });

  it('should not search again when the typed text changes only in its edge spaces', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, pagina([1], 0, 1)));
    const { result } = renderHook(() => useClientList());
    await waitFor(() => expect(result.current.estado.tipo).toBe('sucesso'));
    fetchMock.mockClear();

    act(() => {
      result.current.alterarTermo('   ');
    });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should show "no result" when a term finds nothing', async () => {
    fetchMock
      .mockResolvedValueOnce(fakeResponse(200, pagina([1], 0, 1)))
      .mockResolvedValueOnce(fakeResponse(200, VAZIA));
    const { result } = renderHook(() => useClientList());
    await waitFor(() => expect(result.current.estado.tipo).toBe('sucesso'));

    act(() => {
      result.current.alterarTermo('zzz');
    });
    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    await waitFor(() => expect(result.current.estado).toEqual({ tipo: 'semResultado' }));
  });

  it('should search at once on buscarAgora, without waiting for the pause', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, pagina([1], 0, 1)));
    const { result } = renderHook(() => useClientList());
    await waitFor(() => expect(result.current.estado.tipo).toBe('sucesso'));
    fetchMock.mockClear();

    act(() => {
      result.current.alterarTermo('ana');
    });
    act(() => {
      result.current.buscarAgora();
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(urlsChamadas(fetchMock)).toEqual(['/clientes?q=ana&page=0&size=20']);
  });

  it('should clear the field and load the full list at once, without q', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, pagina([1], 0, 1)));
    const { result } = renderHook(() => useClientList());
    await waitFor(() => expect(result.current.estado.tipo).toBe('sucesso'));
    act(() => {
      result.current.alterarTermo('ana');
    });
    act(() => {
      result.current.buscarAgora();
    });
    await waitFor(() => expect(result.current.termoAplicado).toBe('ana'));
    fetchMock.mockClear();

    act(() => {
      result.current.limpar();
    });

    expect(result.current.termo).toBe('');
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(urlsChamadas(fetchMock)).toEqual(['/clientes?page=0&size=20']);
  });

  it('should drop the answer of an old search that arrives after a newer one', async () => {
    let liberarVelha: (resposta: Response) => void = () => undefined;
    fetchMock.mockResolvedValueOnce(fakeResponse(200, pagina([1], 0, 1)));
    const { result } = renderHook(() => useClientList());
    await waitFor(() => expect(result.current.estado.tipo).toBe('sucesso'));

    fetchMock.mockImplementationOnce(
      () =>
        new Promise<Response>((resolver) => {
          liberarVelha = resolver;
        }),
    );
    act(() => {
      result.current.alterarTermo('velha');
    });
    act(() => {
      result.current.buscarAgora();
    });
    fetchMock.mockResolvedValueOnce(fakeResponse(200, pagina([9], 0, 1)));
    act(() => {
      result.current.alterarTermo('nova');
    });
    act(() => {
      result.current.buscarAgora();
    });
    await waitFor(() => expect(result.current.estado).toMatchObject({ itens: [cliente(9)] }));

    await act(async () => {
      liberarVelha(fakeResponse(200, pagina([7], 0, 1)));
    });

    expect(result.current.estado).toMatchObject({ itens: [cliente(9)] });
  });

  it('should append the next page without repeating a client already listed', async () => {
    fetchMock
      .mockResolvedValueOnce(fakeResponse(200, pagina([1, 2], 0, 2, 3)))
      .mockResolvedValueOnce(fakeResponse(200, pagina([2, 3], 1, 2, 3)));
    const { result } = renderHook(() => useClientList());
    await waitFor(() => expect(result.current.estado).toMatchObject({ temMais: true }));

    act(() => {
      result.current.carregarMais();
    });
    expect(result.current.estado).toMatchObject({ carregandoMais: true });

    await waitFor(() =>
      expect(result.current.estado).toMatchObject({
        itens: [cliente(1), cliente(2), cliente(3)],
        temMais: false,
        carregandoMais: false,
      }),
    );
    expect(urlsChamadas(fetchMock)[1]).toBe('/clientes?page=1&size=20');
  });

  it('should keep the list and flag the failure when loading more fails, then retry', async () => {
    fetchMock
      .mockResolvedValueOnce(fakeResponse(200, pagina([1], 0, 2, 2)))
      .mockResolvedValueOnce(fakeResponse(500, {}))
      .mockResolvedValueOnce(fakeResponse(200, pagina([2], 1, 2, 2)));
    const { result } = renderHook(() => useClientList());
    await waitFor(() => expect(result.current.estado).toMatchObject({ temMais: true }));

    act(() => {
      result.current.carregarMais();
    });
    await waitFor(() =>
      expect(result.current.estado).toMatchObject({
        itens: [cliente(1)],
        falhaAoCarregarMais: true,
        carregandoMais: false,
      }),
    );

    act(() => {
      result.current.carregarMais();
    });
    await waitFor(() =>
      expect(result.current.estado).toMatchObject({
        itens: [cliente(1), cliente(2)],
        falhaAoCarregarMais: false,
      }),
    );
  });

  it('should ignore carregarMais when there is no next page or one is already loading', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, pagina([1], 0, 1)));
    const { result } = renderHook(() => useClientList());
    await waitFor(() => expect(result.current.estado.tipo).toBe('sucesso'));
    fetchMock.mockClear();

    act(() => {
      result.current.carregarMais();
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should refresh keeping the list on screen and flag a failed refresh', async () => {
    fetchMock
      .mockResolvedValueOnce(fakeResponse(200, pagina([1], 0, 1)))
      .mockResolvedValueOnce(fakeResponse(500, {}));
    const { result } = renderHook(() => useClientList());
    await waitFor(() => expect(result.current.estado.tipo).toBe('sucesso'));

    act(() => {
      result.current.atualizar();
    });
    expect(result.current.estado).toMatchObject({ itens: [cliente(1)], atualizando: true });

    await waitFor(() =>
      expect(result.current.estado).toMatchObject({
        itens: [cliente(1)],
        atualizando: false,
        falhaAoAtualizar: true,
      }),
    );
  });

  it('should hand a 401 to the session handler once and not show an error', async () => {
    fetchMock.mockResolvedValue(fakeResponse(401));

    renderHook(() => useClientList());

    await waitFor(() => expect(tratarSessaoExpirada).toHaveBeenCalledTimes(1));
  });
});

import { fetchAutenticado, SessaoExpiradaError } from './http-client';

function mockFetch(status: number): jest.Mock {
  const fetchMock = jest.fn().mockResolvedValue({ status, ok: status >= 200 && status < 300 });
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

describe('fetchAutenticado', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should send the bearer token and keep the caller headers when the API answers 200', async () => {
    const fetchMock = mockFetch(200);

    const resposta = await fetchAutenticado('/clientes', 'token-jwt-fake', {
      headers: { Accept: 'application/json' },
    });

    expect(resposta.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/clientes$/),
      expect.objectContaining({
        headers: { Accept: 'application/json', Authorization: 'Bearer token-jwt-fake' },
      }),
    );
  });

  it('should throw SessaoExpiradaError when the API answers 401', async () => {
    mockFetch(401);

    await expect(fetchAutenticado('/clientes', 'token-expirado')).rejects.toBeInstanceOf(
      SessaoExpiradaError,
    );
  });

  it('should return other error statuses to the caller without treating them as session expiry', async () => {
    mockFetch(500);

    const resposta = await fetchAutenticado('/clientes', 'token-jwt-fake');

    expect(resposta.status).toBe(500);
  });

  it('should let a network failure reach the caller', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(fetchAutenticado('/clientes', 'token-jwt-fake')).rejects.toThrow('network down');
  });
});

import { autenticar, CredenciaisInvalidasError, ErroDeRedeError } from './auth-api';

function mockFetchOnce(resposta: Partial<Response> & { json?: () => Promise<unknown> }): void {
  global.fetch = jest.fn().mockResolvedValue(resposta) as unknown as typeof fetch;
}

describe('autenticar', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the login response when the API answers 200 with a valid body', async () => {
    const corpo = {
      token: 'token-jwt-fake',
      tipo: 'Bearer',
      expiraEm: '2026-11-14T00:00:00Z',
      usuario: {
        id: 1,
        nome: 'Ana Beatriz Souza',
        email: 'ana.souza@exemplo-ficticio.com.br',
        perfil: 'ADMIN',
      },
    };
    mockFetchOnce({ ok: true, status: 200, json: () => Promise.resolve(corpo) });

    const resultado = await autenticar('ana.souza@exemplo-ficticio.com.br', 'senha-ficticia');

    expect(resultado).toEqual(corpo);
  });

  it('should throw CredenciaisInvalidasError when the API answers 401', async () => {
    mockFetchOnce({ ok: false, status: 401, json: () => Promise.resolve({}) });

    await expect(autenticar('inexistente@oficina.com', 'qualquer')).rejects.toBeInstanceOf(
      CredenciaisInvalidasError,
    );
  });

  it('should throw ErroDeRedeError when fetch rejects (API fora do ar)', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(autenticar('alguem@oficina.com', 'senha')).rejects.toBeInstanceOf(ErroDeRedeError);
  });

  it('should throw ErroDeRedeError when the API answers an unexpected non-401 status', async () => {
    mockFetchOnce({ ok: false, status: 500, json: () => Promise.resolve({}) });

    await expect(autenticar('alguem@oficina.com', 'senha')).rejects.toBeInstanceOf(ErroDeRedeError);
  });

  it('should throw ErroDeRedeError when the response body does not look like a login response', async () => {
    mockFetchOnce({ ok: true, status: 200, json: () => Promise.resolve({ foo: 'bar' }) });

    await expect(autenticar('alguem@oficina.com', 'senha')).rejects.toBeInstanceOf(ErroDeRedeError);
  });
});

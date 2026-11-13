import { autenticar } from './auth-service';
import { fetchAutenticado } from './http-client';

/**
 * US-COMP-15: nenhum log pode conter senha, token ou e-mail em claro. Como o
 * contrato mais forte é "a camada de serviço não loga nada", o teste exige que
 * nenhum método de `console` seja chamado em sucesso, em 401, em falha de
 * rede e em resposta inesperada.
 */
const EMAIL = 'ana.souza@exemplo-ficticio.com.br';
const SENHA = 'senha-ficticia-123';
const TOKEN = 'token-jwt-fake-abc';

const CONSOLE_METHODS = ['log', 'info', 'warn', 'error', 'debug'] as const;

function spyOnConsole(): jest.SpyInstance[] {
  return CONSOLE_METHODS.map((method) => jest.spyOn(console, method).mockImplementation(() => {}));
}

function loggedText(spies: jest.SpyInstance[]): string {
  return spies.flatMap((spy) => spy.mock.calls.flat()).join(' ');
}

describe('auth-service logging', () => {
  let spies: jest.SpyInstance[];

  beforeEach(() => {
    spies = spyOnConsole();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not log anything when the login succeeds', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          token: TOKEN,
          tipo: 'Bearer',
          expiraEm: '2026-11-14T00:00:00Z',
          usuario: { id: 1, nome: 'Ana Beatriz Souza', email: EMAIL, perfil: 'ADMIN' },
        }),
    }) as unknown as typeof fetch;

    await autenticar(EMAIL, SENHA);

    expect(loggedText(spies)).toBe('');
  });

  it('should not log credentials when the API answers 401', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 401, json: () => Promise.resolve({}) }) as never;

    await autenticar(EMAIL, SENHA).catch(() => undefined);

    expect(loggedText(spies)).toBe('');
  });

  it('should not log credentials when the network fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error(`falha com ${EMAIL}`)) as never;

    const erro: unknown = await autenticar(EMAIL, SENHA).catch((e: unknown) => e);

    expect(loggedText(spies)).toBe('');
    // O erro que sobe para o chamador também não repete a causa original.
    expect(String((erro as Error).message)).not.toContain(EMAIL);
    expect(String((erro as Error).message)).not.toContain(SENHA);
  });

  it('should not echo credentials in the error message when the API answers 500', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({}) }) as never;

    const erro: unknown = await autenticar(EMAIL, SENHA).catch((e: unknown) => e);

    expect(loggedText(spies)).toBe('');
    expect(String((erro as Error).message)).not.toContain(SENHA);
    expect(String((erro as Error).message)).not.toContain(EMAIL);
  });

  it('should not log the token when an authenticated call fails with 401', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401 }) as never;

    await fetchAutenticado('/clientes', TOKEN).catch(() => undefined);

    expect(loggedText(spies)).toBe('');
  });
});

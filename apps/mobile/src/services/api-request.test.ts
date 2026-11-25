import { fakeResponse, mockFetch } from '@/test-utils/fake-response';

import {
  ErroDeValidacaoError,
  FalhaDeConexaoError,
  RecursoNaoEncontradoError,
  RequisicaoCanceladaError,
} from './api-errors';
import { chamarApi, comParametros } from './api-request';
import { SessaoExpiradaError } from './http-client';

interface Eco {
  readonly ok: true;
}

const ehEco = (valor: unknown): valor is Eco =>
  typeof valor === 'object' && valor !== null && (valor as { ok?: unknown }).ok === true;

function chamar(
  overrides: Partial<Parameters<typeof chamarApi<Eco>>[0]> = {},
  signal: AbortSignal = new AbortController().signal,
): Promise<Eco> {
  return chamarApi<Eco>({
    caminho: '/clientes/1',
    token: 'token-x',
    signal,
    guarda: ehEco,
    ...overrides,
  });
}

describe('chamarApi', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = mockFetch();
  });

  it('should return the body when the status is 2xx and the shape matches the guard', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, { ok: true }));

    await expect(chamar()).resolves.toEqual({ ok: true });
  });

  it('should send the bearer token and no content type on a GET', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, { ok: true }));

    await chamar();

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://localhost:8080/api/v1/clientes/1');
    expect(init.method).toBe('GET');
    expect(init.headers).toEqual({ Authorization: 'Bearer token-x' });
    expect(init.body).toBeUndefined();
  });

  it('should send a JSON body with content type on a POST', async () => {
    fetchMock.mockResolvedValue(fakeResponse(201, { ok: true }));

    await chamar({ metodo: 'POST', corpo: { nome: 'Fulano de Teste' } });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe('POST');
    expect(init.body).toBe('{"nome":"Fulano de Teste"}');
    expect(init.headers).toMatchObject({ 'Content-Type': 'application/json' });
  });

  it('should throw RecursoNaoEncontradoError on 404', async () => {
    fetchMock.mockResolvedValue(fakeResponse(404, { mensagem: 'x' }));

    await expect(chamar()).rejects.toBeInstanceOf(RecursoNaoEncontradoError);
  });

  it('should rethrow SessaoExpiradaError on 401', async () => {
    fetchMock.mockResolvedValue(fakeResponse(401));

    await expect(chamar()).rejects.toBeInstanceOf(SessaoExpiradaError);
  });

  it('should throw ErroDeValidacaoError with the fields on 400 with an erros list', async () => {
    fetchMock.mockResolvedValue(
      fakeResponse(400, {
        erros: [{ campo: 'placa', chave: 'veiculo.form.placa.invalida' }, { campo: 'x' }, 'lixo'],
      }),
    );

    const erro = await chamar().catch((e: unknown) => e);

    expect(erro).toBeInstanceOf(ErroDeValidacaoError);
    expect((erro as ErroDeValidacaoError).status).toBe(400);
    expect((erro as ErroDeValidacaoError).campos).toEqual([
      { campo: 'placa', chave: 'veiculo.form.placa.invalida' },
      { campo: 'x', chave: null },
    ]);
    expect((erro as ErroDeValidacaoError).conflito).toBeNull();
  });

  it('should keep the message of a 409 without field errors as the conflict text', async () => {
    fetchMock.mockResolvedValue(fakeResponse(409, { mensagem: 'CPF ja cadastrado', erros: [] }));

    const erro = await chamar().catch((e: unknown) => e);

    expect(erro).toBeInstanceOf(ErroDeValidacaoError);
    expect((erro as ErroDeValidacaoError).status).toBe(409);
    expect((erro as ErroDeValidacaoError).conflito).toBe('CPF ja cadastrado');
  });

  it('should not keep the server message on a 409 that has field errors', async () => {
    fetchMock.mockResolvedValue(
      fakeResponse(409, {
        mensagem: 'Placa ja cadastrada',
        erros: [{ campo: 'placa', chave: 'veiculo.form.placa.duplicada' }],
      }),
    );

    const erro = (await chamar().catch((e: unknown) => e)) as ErroDeValidacaoError;

    expect(erro.conflito).toBeNull();
    expect(erro.campos).toHaveLength(1);
  });

  it('should treat a 400 without an erros list as an unexpected response', async () => {
    fetchMock.mockResolvedValue(fakeResponse(400, { mensagem: 'id invalido' }));

    const erro = await chamar().catch((e: unknown) => e);

    expect(erro).toBeInstanceOf(FalhaDeConexaoError);
    expect((erro as FalhaDeConexaoError).motivo).toBe('respostaInesperada');
  });

  it.each([403, 405, 415, 500, 503])(
    'should treat status %i as a server failure',
    async (status) => {
      fetchMock.mockResolvedValue(fakeResponse(status, {}));

      const erro = await chamar().catch((e: unknown) => e);

      expect(erro).toBeInstanceOf(FalhaDeConexaoError);
      expect((erro as FalhaDeConexaoError).motivo).toBe('servidor');
    },
  );

  it('should treat a rejected fetch as a connection failure', async () => {
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));

    const erro = await chamar().catch((e: unknown) => e);

    expect(erro).toBeInstanceOf(FalhaDeConexaoError);
    expect((erro as FalhaDeConexaoError).motivo).toBe('semResposta');
  });

  it('should throw RequisicaoCanceladaError when the fetch rejects after the signal aborted', async () => {
    const controlador = new AbortController();
    fetchMock.mockImplementation(async () => {
      controlador.abort();
      throw new Error('aborted');
    });

    await expect(chamar({}, controlador.signal)).rejects.toBeInstanceOf(RequisicaoCanceladaError);
  });

  it('should treat a 2xx body that is not JSON as an unexpected response', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200));

    const erro = await chamar().catch((e: unknown) => e);

    expect((erro as FalhaDeConexaoError).motivo).toBe('respostaInesperada');
  });

  it('should treat a 2xx body outside the guard as an unexpected response', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, { ok: false }));

    const erro = await chamar().catch((e: unknown) => e);

    expect((erro as FalhaDeConexaoError).motivo).toBe('respostaInesperada');
  });

  it('should keep status, URL, body and typed values out of every error message', async () => {
    const segredos = ['12345678909', '11900000001', '/clientes/1', '500', 'segredo-do-corpo'];
    const cenarios = [
      fakeResponse(404, { mensagem: 'segredo-do-corpo' }),
      fakeResponse(409, { mensagem: 'segredo-do-corpo', erros: [] }),
      fakeResponse(500, { mensagem: 'segredo-do-corpo' }),
      fakeResponse(200, { cpf: '12345678909' }),
    ];

    for (const resposta of cenarios) {
      fetchMock.mockResolvedValueOnce(resposta);
      const erro = (await chamar({
        corpo: { cpf: '12345678909', telefone: '11900000001' },
        metodo: 'POST',
      }).catch((e: unknown) => e)) as Error;
      for (const segredo of segredos) {
        expect(erro.message).not.toContain(segredo);
      }
    }
  });
});

describe('comParametros', () => {
  it('should append only the defined parameters, encoded', () => {
    expect(comParametros('/clientes', { q: 'ana & maria', page: 0, size: undefined })).toBe(
      '/clientes?q=ana%20%26%20maria&page=0',
    );
  });

  it('should return the path unchanged when no parameter is defined', () => {
    expect(comParametros('/clientes', { q: undefined })).toBe('/clientes');
  });
});

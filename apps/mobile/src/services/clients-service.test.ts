import { fakeResponse, mockFetch } from '@/test-utils/fake-response';

import { ErroDeValidacaoError, FalhaDeConexaoError, RecursoNaoEncontradoError } from './api-errors';
import {
  atualizarCliente,
  criarCliente,
  listarClientes,
  montarCorpoDoCliente,
  obterCliente,
} from './clients-service';

const PAGINA = {
  itens: [{ id: 1, nome: 'Fulano de Teste', telefone: '11900000001', email: null }],
  pagina: 0,
  tamanho: 20,
  totalItens: 1,
  totalPaginas: 1,
};

const DETALHE = {
  id: 1,
  nome: 'Fulano de Teste',
  cpf: '52998224725',
  telefone: null,
  email: null,
  endereco: null,
};

describe('listarClientes', () => {
  let fetchMock: jest.Mock;
  const signal = new AbortController().signal;

  beforeEach(() => {
    fetchMock = mockFetch();
  });

  it('should return the page and send page and size without q when there is no term', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, PAGINA));

    await expect(listarClientes({ page: 0 }, 'tok', signal)).resolves.toEqual(PAGINA);

    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8080/api/v1/clientes?page=0&size=20');
  });

  it('should send the trimmed and encoded term as q', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, PAGINA));

    await listarClientes({ q: '  ana & maria ', page: 2 }, 'tok', signal);

    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://localhost:8080/api/v1/clientes?q=ana%20%26%20maria&page=2&size=20',
    );
  });

  it('should omit q when the term is only spaces', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, PAGINA));

    await listarClientes({ q: '   ', page: 0 }, 'tok', signal);

    expect(fetchMock.mock.calls[0][0]).not.toContain('q=');
  });

  it.each([
    ['itens is not a list', { ...PAGINA, itens: 'x' }],
    ['an item has no name', { ...PAGINA, itens: [{ id: 1, telefone: null, email: null }] }],
    ['an item has a numeric phone', { ...PAGINA, itens: [{ ...PAGINA.itens[0], telefone: 1 }] }],
    ['totalPaginas is missing', { ...PAGINA, totalPaginas: undefined }],
    ['the body is a list', []],
  ])('should reject the body when %s', async (_caso, corpo) => {
    fetchMock.mockResolvedValue(fakeResponse(200, corpo));

    const erro = await listarClientes({ page: 0 }, 'tok', signal).catch((e: unknown) => e);

    expect(erro).toBeInstanceOf(FalhaDeConexaoError);
    expect((erro as FalhaDeConexaoError).motivo).toBe('respostaInesperada');
  });
});

describe('obterCliente', () => {
  let fetchMock: jest.Mock;
  const signal = new AbortController().signal;

  beforeEach(() => {
    fetchMock = mockFetch();
  });

  it('should return the client detail from GET /clientes/{id}', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, DETALHE));

    await expect(obterCliente(1, 'tok', signal)).resolves.toEqual(DETALHE);

    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8080/api/v1/clientes/1');
  });

  it('should throw RecursoNaoEncontradoError on 404', async () => {
    fetchMock.mockResolvedValue(fakeResponse(404, {}));

    await expect(obterCliente(9, 'tok', signal)).rejects.toBeInstanceOf(RecursoNaoEncontradoError);
  });

  it('should reject a body whose cpf is a number', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, { ...DETALHE, cpf: 52998224725 }));

    await expect(obterCliente(1, 'tok', signal)).rejects.toBeInstanceOf(FalhaDeConexaoError);
  });
});

const ENTRADA = {
  nome: '  Fulano de Teste ',
  cpf: '529.982.247-25',
  telefone: '(11) 90000-0001',
  email: ' ',
  endereco: '',
};

describe('montarCorpoDoCliente', () => {
  it('should keep only digits in CPF and phone and turn blank optional text into null', () => {
    expect(montarCorpoDoCliente(ENTRADA)).toEqual({
      nome: 'Fulano de Teste',
      cpf: '52998224725',
      telefone: '11900000001',
      email: null,
      endereco: null,
    });
  });

  it('should send null for CPF and phone when they are empty', () => {
    const corpo = montarCorpoDoCliente({ ...ENTRADA, cpf: '', telefone: '' });

    expect(corpo.cpf).toBeNull();
    expect(corpo.telefone).toBeNull();
  });
});

describe('criarCliente e atualizarCliente', () => {
  let fetchMock: jest.Mock;
  const signal = new AbortController().signal;

  beforeEach(() => {
    fetchMock = mockFetch();
  });

  it('should POST the normalized body to /clientes and return the created client', async () => {
    fetchMock.mockResolvedValue(fakeResponse(201, DETALHE));

    await expect(criarCliente(ENTRADA, 'tok', signal)).resolves.toEqual(DETALHE);

    const [url, opcoes] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/v1/clientes');
    expect(opcoes.method).toBe('POST');
    expect(JSON.parse(opcoes.body)).toEqual({
      nome: 'Fulano de Teste',
      cpf: '52998224725',
      telefone: '11900000001',
      email: null,
      endereco: null,
    });
  });

  it('should PUT to /clientes/{id} and return the updated client', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, DETALHE));

    await expect(atualizarCliente(7, ENTRADA, 'tok', signal)).resolves.toEqual(DETALHE);

    const [url, opcoes] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/v1/clientes/7');
    expect(opcoes.method).toBe('PUT');
  });

  it('should reject with the field errors of a 400', async () => {
    fetchMock.mockResolvedValue(
      fakeResponse(400, { erros: [{ campo: 'email', chave: null }], mensagem: 'x' }),
    );

    const erro = await criarCliente(ENTRADA, 'tok', signal).catch((e: unknown) => e);

    expect(erro).toBeInstanceOf(ErroDeValidacaoError);
    expect((erro as ErroDeValidacaoError).campos).toEqual([{ campo: 'email', chave: null }]);
  });

  it.each([
    ['CPF ja cadastrado', 'cpf', 'cliente.form.cpf.duplicado'],
    ['Email ja cadastrado', 'email', 'cliente.form.email.duplicado'],
  ])('should turn the 409 "%s" into a field error on %s', async (mensagem, campo, chave) => {
    fetchMock.mockResolvedValue(fakeResponse(409, { erros: [], mensagem }));

    const erro = await criarCliente(ENTRADA, 'tok', signal).catch((e: unknown) => e);

    expect(erro).toBeInstanceOf(ErroDeValidacaoError);
    expect((erro as ErroDeValidacaoError).campos).toEqual([{ campo, chave }]);
    expect((erro as ErroDeValidacaoError).conflito).toBeNull();
  });

  it('should keep an unknown 409 as a general conflict without field errors', async () => {
    fetchMock.mockResolvedValue(fakeResponse(409, { erros: [], mensagem: 'Outro conflito' }));

    const erro = await criarCliente(ENTRADA, 'tok', signal).catch((e: unknown) => e);

    expect((erro as ErroDeValidacaoError).campos).toEqual([]);
    expect((erro as ErroDeValidacaoError).conflito).toBe('Outro conflito');
  });

  it('should reject with not found when the client of a PUT does not exist', async () => {
    fetchMock.mockResolvedValue(fakeResponse(404, {}));

    await expect(atualizarCliente(7, ENTRADA, 'tok', signal)).rejects.toBeInstanceOf(
      RecursoNaoEncontradoError,
    );
  });

  it('should reject with a connection failure on a 500', async () => {
    fetchMock.mockResolvedValue(fakeResponse(500, {}));

    await expect(criarCliente(ENTRADA, 'tok', signal)).rejects.toBeInstanceOf(FalhaDeConexaoError);
  });
});

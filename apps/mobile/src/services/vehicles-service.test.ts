import { fakeResponse, mockFetch } from '@/test-utils/fake-response';

import { ErroDeValidacaoError, FalhaDeConexaoError } from './api-errors';
import {
  atualizarVeiculo,
  criarVeiculo,
  listarVeiculosDoCliente,
  montarCorpoDoVeiculo,
  obterVeiculo,
  type VeiculoEntrada,
} from './vehicles-service';

const RESUMO = { id: 7, placa: 'ABC1D23', marca: 'Marca Teste', modelo: 'Modelo Teste' };

const DETALHE = {
  id: 7,
  clienteId: 1,
  clienteNome: 'Fulano de Teste',
  placa: 'ABC1D23',
  marca: 'Marca Teste',
  modelo: 'Modelo Teste',
  ano: 2020,
  cor: null,
  historicoOs: [{ id: 3, status: 'ABERTA', valorTotal: 150.5 }],
};

describe('listarVeiculosDoCliente', () => {
  let fetchMock: jest.Mock;
  const signal = new AbortController().signal;

  beforeEach(() => {
    fetchMock = mockFetch();
  });

  it('should return the plain list from GET /clientes/{id}/veiculos', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, [RESUMO]));

    await expect(listarVeiculosDoCliente(1, 'tok', signal)).resolves.toEqual([RESUMO]);

    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8080/api/v1/clientes/1/veiculos');
  });

  it('should accept an empty list', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, []));

    await expect(listarVeiculosDoCliente(1, 'tok', signal)).resolves.toEqual([]);
  });

  it('should reject a paged object where a plain list is expected', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, { itens: [RESUMO] }));

    await expect(listarVeiculosDoCliente(1, 'tok', signal)).rejects.toBeInstanceOf(
      FalhaDeConexaoError,
    );
  });
});

describe('obterVeiculo', () => {
  let fetchMock: jest.Mock;
  const signal = new AbortController().signal;

  beforeEach(() => {
    fetchMock = mockFetch();
  });

  it('should return the vehicle with its service order history', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, DETALHE));

    await expect(obterVeiculo(7, 'tok', signal)).resolves.toEqual(DETALHE);

    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8080/api/v1/veiculos/7');
  });

  it('should accept an empty history, the default until F06', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, { ...DETALHE, historicoOs: [] }));

    const veiculo = await obterVeiculo(7, 'tok', signal);

    expect(veiculo.historicoOs).toEqual([]);
  });

  it.each([
    ['historicoOs is missing', { ...DETALHE, historicoOs: undefined }],
    ['historicoOs is not a list', { ...DETALHE, historicoOs: 'x' }],
    [
      'a history item has a text value',
      { ...DETALHE, historicoOs: [{ id: 1, status: 'A', valorTotal: '10' }] },
    ],
    ['clienteId is missing', { ...DETALHE, clienteId: undefined }],
    ['ano is a text', { ...DETALHE, ano: '2020' }],
  ])('should reject the body when %s', async (_caso, corpo) => {
    fetchMock.mockResolvedValue(fakeResponse(200, corpo));

    await expect(obterVeiculo(7, 'tok', signal)).rejects.toBeInstanceOf(FalhaDeConexaoError);
  });
});

const ENTRADA: VeiculoEntrada = {
  placa: 'abc-1d23',
  marca: ' Marca Teste ',
  modelo: 'Modelo Teste',
  ano: '2020',
  cor: '  ',
};

const SALVO = {
  id: 7,
  clienteId: 1,
  placa: 'ABC1D23',
  marca: 'Marca Teste',
  modelo: 'Modelo Teste',
  ano: 2020,
  cor: null,
};

describe('montarCorpoDoVeiculo', () => {
  it('should normalize the plate, trim the text and turn empty optional fields into null', () => {
    expect(montarCorpoDoVeiculo(ENTRADA)).toEqual({
      placa: 'ABC1D23',
      marca: 'Marca Teste',
      modelo: 'Modelo Teste',
      ano: 2020,
      cor: null,
    });
  });

  it('should send a null year when the field is empty', () => {
    expect(montarCorpoDoVeiculo({ ...ENTRADA, ano: '', cor: 'Prata' })).toMatchObject({
      ano: null,
      cor: 'Prata',
    });
  });
});

describe('criarVeiculo', () => {
  let fetchMock: jest.Mock;
  const signal = new AbortController().signal;

  beforeEach(() => {
    fetchMock = mockFetch();
  });

  it('should POST the body to /clientes/{id}/veiculos and return the saved vehicle', async () => {
    fetchMock.mockResolvedValue(fakeResponse(201, SALVO));

    await expect(criarVeiculo(1, ENTRADA, 'tok', signal)).resolves.toEqual(SALVO);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://localhost:8080/api/v1/clientes/1/veiculos');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({
      placa: 'ABC1D23',
      marca: 'Marca Teste',
      modelo: 'Modelo Teste',
      ano: 2020,
      cor: null,
    });
  });

  it('should surface the duplicate plate as a field error with the API key', async () => {
    fetchMock.mockResolvedValue(
      fakeResponse(409, {
        mensagem: 'Placa ja cadastrada',
        erros: [{ campo: 'placa', chave: 'veiculo.form.placa.duplicada' }],
      }),
    );

    const erro: unknown = await criarVeiculo(1, ENTRADA, 'tok', signal).catch((e: unknown) => e);

    expect(erro).toBeInstanceOf(ErroDeValidacaoError);
    expect((erro as ErroDeValidacaoError).campos).toEqual([
      { campo: 'placa', chave: 'veiculo.form.placa.duplicada' },
    ]);
  });

  it('should reject a body without the client id', async () => {
    fetchMock.mockResolvedValue(fakeResponse(201, { ...SALVO, clienteId: undefined }));

    await expect(criarVeiculo(1, ENTRADA, 'tok', signal)).rejects.toBeInstanceOf(
      FalhaDeConexaoError,
    );
  });
});

describe('atualizarVeiculo', () => {
  let fetchMock: jest.Mock;
  const signal = new AbortController().signal;

  beforeEach(() => {
    fetchMock = mockFetch();
  });

  it('should PUT the body to /veiculos/{id} and return the saved vehicle', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, SALVO));

    await expect(atualizarVeiculo(7, ENTRADA, 'tok', signal)).resolves.toEqual(SALVO);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://localhost:8080/api/v1/veiculos/7');
    expect(init.method).toBe('PUT');
  });
});

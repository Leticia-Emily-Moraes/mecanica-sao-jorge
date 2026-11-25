import { act, renderHook, waitFor } from '@testing-library/react-native';

import { fakeResponse, mockFetch } from '@/test-utils/fake-response';

import { useAuth } from './use-auth';
import { useVehicleForm, validarVeiculo, type AlvoDoFormularioDeVeiculo } from './use-vehicle-form';

jest.mock('./use-auth');

const tratarSessaoExpirada = jest.fn(async () => undefined);

const CLIENTE = {
  id: 1,
  nome: 'Teodoro Lemos',
  cpf: null,
  telefone: null,
  email: null,
  endereco: null,
};

const VEICULO = {
  id: 7,
  clienteId: 1,
  clienteNome: 'Teodoro Lemos',
  placa: 'RTK4M81',
  marca: 'Honda',
  modelo: 'Civic',
  ano: 2018,
  cor: null,
  historicoOs: [],
};

const SALVO = {
  id: 7,
  clienteId: 1,
  placa: 'RTK4M81',
  marca: 'Honda',
  modelo: 'Civic',
  ano: 2018,
  cor: null,
};

const NOVO: AlvoDoFormularioDeVeiculo = { modo: 'novo', clienteId: 1 };
const EDITAR: AlvoDoFormularioDeVeiculo = { modo: 'editar', veiculoId: 7 };
const ANO_ATUAL = 2026;

interface Respostas {
  readonly leitura?: Response;
  readonly gravacao?: Response | Error;
}

let fetchMock: jest.Mock;

function simularApi({ leitura, gravacao }: Respostas = {}): void {
  fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
    if (init?.method === 'POST' || init?.method === 'PUT') {
      if (gravacao instanceof Error) {
        throw gravacao;
      }
      return gravacao ?? fakeResponse(200, SALVO);
    }
    if (leitura !== undefined) {
      return leitura;
    }
    return fakeResponse(200, String(url).includes('/veiculos/') ? VEICULO : CLIENTE);
  });
}

function chamadasDeGravacao(): [string, RequestInit][] {
  return (fetchMock.mock.calls as [string, RequestInit][]).filter(
    ([, init]) => init?.method === 'POST' || init?.method === 'PUT',
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  fetchMock = mockFetch();
  (useAuth as jest.MockedFunction<typeof useAuth>).mockReturnValue({
    tokenAtual: 'token-de-teste',
    tratarSessaoExpirada,
  } as unknown as ReturnType<typeof useAuth>);
});

type Hook = { current: ReturnType<typeof useVehicleForm> };

function preencher(form: Hook): void {
  act(() => form.current.alterar('placa', 'rtk4m81'));
  act(() => form.current.alterar('marca', 'Honda'));
  act(() => form.current.alterar('modelo', 'Civic'));
}

describe('validarVeiculo', () => {
  const vazios = { placa: '', marca: '', modelo: '', ano: '', cor: '' };
  const validos = { placa: 'ABC1D23', marca: 'Fiat', modelo: 'Uno', ano: '', cor: '' };

  it('should ask for plate, brand and model when everything is empty', () => {
    expect(validarVeiculo(vazios, ANO_ATUAL)).toEqual({
      placa: 'veiculo.form.placa.erro',
      marca: 'veiculo.form.marca.invalido',
      modelo: 'veiculo.form.modelo.invalido',
    });
  });

  it('should accept the required fields alone', () => {
    expect(validarVeiculo(validos, ANO_ATUAL)).toEqual({});
  });

  it('should reject a blank brand made of spaces', () => {
    expect(validarVeiculo({ ...validos, marca: '   ' }, ANO_ATUAL).marca).toBe(
      'veiculo.form.marca.invalido',
    );
  });

  it.each(['abc', '20', '1899', '2028', '20x0'])('should reject the year "%s"', (ano) => {
    expect(validarVeiculo({ ...validos, ano }, ANO_ATUAL).ano).toBe('veiculo.form.ano.invalido');
  });

  it.each(['1900', '2020', '2027'])('should accept the year "%s"', (ano) => {
    expect(validarVeiculo({ ...validos, ano }, ANO_ATUAL)).toEqual({});
  });
});

describe('useVehicleForm (novo)', () => {
  it('should load the owner name and then become ready, empty and without changes', async () => {
    simularApi();

    const { result } = renderHook(() => useVehicleForm(NOVO));
    expect(result.current.carga).toBe('carregando');
    await waitFor(() => expect(result.current.carga).toBe('pronto'));

    expect(result.current.clienteNome).toBe('Teodoro Lemos');
    expect(result.current.valores.placa).toBe('');
    expect(result.current.temAlteracao).toBe(false);
  });

  it('should report not found without calling the API when the route id is invalid', () => {
    simularApi();

    const { result } = renderHook(() => useVehicleForm({ modo: 'novo', clienteId: null }));

    expect(result.current.carga).toBe('naoEncontrado');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should report not found when the owner does not exist', async () => {
    simularApi({ leitura: fakeResponse(404, {}) });

    const { result } = renderHook(() => useVehicleForm(NOVO));

    await waitFor(() => expect(result.current.carga).toBe('naoEncontrado'));
  });

  it('should report a connection error and load again on retry', async () => {
    simularApi({ leitura: fakeResponse(500, {}) });
    const { result } = renderHook(() => useVehicleForm(NOVO));
    await waitFor(() => expect(result.current.carga).toBe('erroConexao'));

    simularApi();
    act(() => result.current.recarregar());

    await waitFor(() => expect(result.current.carga).toBe('pronto'));
  });

  it('should upper-case the plate, keep only 4 digits in the year and flag the change', async () => {
    simularApi();
    const { result } = renderHook(() => useVehicleForm(NOVO));
    await waitFor(() => expect(result.current.carga).toBe('pronto'));

    act(() => result.current.alterar('placa', 'abc-1d23x'));
    act(() => result.current.alterar('ano', '20a2b0c2'));

    expect(result.current.valores.placa).toBe('ABC1D23');
    expect(result.current.valores.ano).toBe('2020');
    expect(result.current.temAlteracao).toBe(true);
  });

  it('should not call the API and mark the invalid fields when validation fails', async () => {
    simularApi();
    const { result } = renderHook(() => useVehicleForm(NOVO));
    await waitFor(() => expect(result.current.carga).toBe('pronto'));

    await act(async () => {
      await result.current.enviar();
    });

    expect(chamadasDeGravacao()).toHaveLength(0);
    expect(result.current.estadoEnvio).toBe('erroValidacao');
    expect(Object.keys(result.current.errosDeCampo)).toEqual(['placa', 'marca', 'modelo']);
    expect(result.current.recusas).toBe(1);
  });

  it('should clear the error of a field when the person edits it', async () => {
    simularApi();
    const { result } = renderHook(() => useVehicleForm(NOVO));
    await waitFor(() => expect(result.current.carga).toBe('pronto'));
    await act(async () => {
      await result.current.enviar();
    });

    act(() => result.current.alterar('marca', 'H'));

    expect(result.current.errosDeCampo.marca).toBeUndefined();
    expect(result.current.errosDeCampo.modelo).toBeDefined();
  });

  it('should POST to the owner and expose the saved vehicle', async () => {
    simularApi({ gravacao: fakeResponse(201, SALVO) });
    const { result } = renderHook(() => useVehicleForm(NOVO));
    await waitFor(() => expect(result.current.carga).toBe('pronto'));
    preencher(result);

    await act(async () => {
      await result.current.enviar();
    });

    expect(result.current.estadoEnvio).toBe('salvo');
    expect(result.current.salvo).toEqual({ id: 7, clienteId: 1 });
    const [[url, init]] = chamadasDeGravacao();
    expect(url.endsWith('/clientes/1/veiculos')).toBe(true);
    expect(init.method).toBe('POST');
  });

  it('should not send twice when the save is triggered again while sending', async () => {
    simularApi({ gravacao: fakeResponse(201, SALVO) });
    const { result } = renderHook(() => useVehicleForm(NOVO));
    await waitFor(() => expect(result.current.carga).toBe('pronto'));
    preencher(result);

    await act(async () => {
      await Promise.all([result.current.enviar(), result.current.enviar()]);
    });

    expect(chamadasDeGravacao()).toHaveLength(1);
  });

  it('should map the duplicate plate from the API to the field and keep the typed values', async () => {
    simularApi({
      gravacao: fakeResponse(409, {
        mensagem: 'Placa ja cadastrada',
        erros: [{ campo: 'placa', chave: 'veiculo.form.placa.duplicada' }],
      }),
    });
    const { result } = renderHook(() => useVehicleForm(NOVO));
    await waitFor(() => expect(result.current.carga).toBe('pronto'));
    preencher(result);

    await act(async () => {
      await result.current.enviar();
    });

    expect(result.current.estadoEnvio).toBe('erroValidacao');
    expect(result.current.errosDeCampo).toEqual({ placa: 'veiculo.form.placa.duplicada' });
    expect(result.current.conflitoGeral).toBe(false);
    expect(result.current.valores.placa).toBe('RTK4M81');
  });

  it('should fall back to the field default key when the API sends no key', async () => {
    simularApi({
      gravacao: fakeResponse(400, { mensagem: 'x', erros: [{ campo: 'modelo', chave: null }] }),
    });
    const { result } = renderHook(() => useVehicleForm(NOVO));
    await waitFor(() => expect(result.current.carga).toBe('pronto'));
    preencher(result);

    await act(async () => {
      await result.current.enviar();
    });

    expect(result.current.errosDeCampo).toEqual({ modelo: 'veiculo.form.modelo.invalido' });
  });

  it('should show the general conflict when the 409 has no field', async () => {
    simularApi({ gravacao: fakeResponse(409, { mensagem: 'Conflito', erros: [] }) });
    const { result } = renderHook(() => useVehicleForm(NOVO));
    await waitFor(() => expect(result.current.carga).toBe('pronto'));
    preencher(result);

    await act(async () => {
      await result.current.enviar();
    });

    expect(result.current.conflitoGeral).toBe(true);
    expect(result.current.errosDeCampo).toEqual({});
  });

  it('should report a connection error on send and keep the values', async () => {
    simularApi({ gravacao: new TypeError('Network request failed') });
    const { result } = renderHook(() => useVehicleForm(NOVO));
    await waitFor(() => expect(result.current.carga).toBe('pronto'));
    preencher(result);

    await act(async () => {
      await result.current.enviar();
    });

    expect(result.current.estadoEnvio).toBe('erroConexao');
    expect(result.current.valores.modelo).toBe('Civic');
  });

  it('should end the session when the API answers 401', async () => {
    simularApi({ gravacao: fakeResponse(401, {}) });
    const { result } = renderHook(() => useVehicleForm(NOVO));
    await waitFor(() => expect(result.current.carga).toBe('pronto'));
    preencher(result);

    await act(async () => {
      await result.current.enviar();
    });

    expect(tratarSessaoExpirada).toHaveBeenCalledTimes(1);
    expect(result.current.estadoEnvio).not.toBe('salvo');
  });
});

describe('useVehicleForm (editar)', () => {
  it('should fill the fields with the vehicle data once it is loaded', async () => {
    simularApi();

    const { result } = renderHook(() => useVehicleForm(EDITAR));
    expect(result.current.carga).toBe('carregando');
    await waitFor(() => expect(result.current.carga).toBe('pronto'));

    expect(result.current.valores).toEqual({
      placa: 'RTK4M81',
      marca: 'Honda',
      modelo: 'Civic',
      ano: '2018',
      cor: '',
    });
    expect(result.current.clienteNome).toBe('Teodoro Lemos');
    expect(result.current.temAlteracao).toBe(false);
  });

  it('should report not found without calling the API when the route id is invalid', () => {
    simularApi();

    const { result } = renderHook(() => useVehicleForm({ modo: 'editar', veiculoId: null }));

    expect(result.current.carga).toBe('naoEncontrado');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should detect a change against the loaded values', async () => {
    simularApi();
    const { result } = renderHook(() => useVehicleForm(EDITAR));
    await waitFor(() => expect(result.current.carga).toBe('pronto'));

    act(() => result.current.alterar('cor', 'Preto'));
    expect(result.current.temAlteracao).toBe(true);

    act(() => result.current.alterar('cor', ''));
    expect(result.current.temAlteracao).toBe(false);
  });

  it('should PUT to the vehicle and expose the saved vehicle', async () => {
    simularApi();
    const { result } = renderHook(() => useVehicleForm(EDITAR));
    await waitFor(() => expect(result.current.carga).toBe('pronto'));
    act(() => result.current.alterar('cor', 'Preto'));

    await act(async () => {
      await result.current.enviar();
    });

    expect(result.current.estadoEnvio).toBe('salvo');
    expect(result.current.salvo).toEqual({ id: 7, clienteId: 1 });
    const [[url, init]] = chamadasDeGravacao();
    expect(url.endsWith('/veiculos/7')).toBe(true);
    expect(init.method).toBe('PUT');
    expect(JSON.parse(String(init.body))).toMatchObject({ placa: 'RTK4M81', cor: 'Preto' });
  });

  it('should report not found when the vehicle disappears before saving', async () => {
    simularApi({ gravacao: fakeResponse(404, {}) });
    const { result } = renderHook(() => useVehicleForm(EDITAR));
    await waitFor(() => expect(result.current.carga).toBe('pronto'));
    act(() => result.current.alterar('cor', 'Preto'));

    await act(async () => {
      await result.current.enviar();
    });

    expect(result.current.estadoEnvio).toBe('naoEncontrado');
  });
});

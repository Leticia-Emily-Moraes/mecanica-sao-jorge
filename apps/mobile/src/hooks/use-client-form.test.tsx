import { act, renderHook, waitFor } from '@testing-library/react-native';

import { fakeResponse, mockFetch } from '@/test-utils/fake-response';

import { useAuth } from './use-auth';
import { type AlvoDoFormulario, useClientForm, validarCliente } from './use-client-form';

jest.mock('./use-auth');

const tratarSessaoExpirada = jest.fn(async () => undefined);

const CPF_VALIDO = '52998224725';

const DETALHE = {
  id: 7,
  nome: 'Teodoro Lemos',
  cpf: CPF_VALIDO,
  telefone: '11900000001',
  email: 'teodoro@example.com',
  endereco: 'Rua das Flores, 10',
};

const NOVO: AlvoDoFormulario = { modo: 'novo' };
const EDITAR: AlvoDoFormulario = { modo: 'editar', clienteId: 7 };

let fetchMock: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  fetchMock = mockFetch();
  (useAuth as jest.MockedFunction<typeof useAuth>).mockReturnValue({
    tokenAtual: 'token-de-teste',
    tratarSessaoExpirada,
  } as unknown as ReturnType<typeof useAuth>);
});

function preencherNovo(form: { current: ReturnType<typeof useClientForm> }): void {
  act(() => form.current.alterar('nome', 'Fulano de Teste'));
  act(() => form.current.alterar('telefone', '11900000001'));
}

describe('validarCliente', () => {
  const vazios = { nome: '', telefone: '', email: '', cpf: '', endereco: '' };

  it('should ask only for the name when the optional fields are empty', () => {
    expect(validarCliente(vazios)).toEqual({ nome: 'cliente.form.nome.invalido' });
  });

  it('should accept a name alone', () => {
    expect(validarCliente({ ...vazios, nome: 'Fulano' })).toEqual({});
  });

  it('should reject a blank name made of spaces', () => {
    expect(validarCliente({ ...vazios, nome: '   ' }).nome).toBe('cliente.form.nome.invalido');
  });

  it('should reject an incomplete phone', () => {
    const erros = validarCliente({ ...vazios, nome: 'F', telefone: '(11) 9000' });

    expect(erros.telefone).toBe('cliente.form.telefone.invalido');
  });

  it.each(['semarroba', 'a@b', 'a b@c.com'])('should reject the e-mail "%s"', (email) => {
    expect(validarCliente({ ...vazios, nome: 'F', email }).email).toBe(
      'cliente.form.email.invalido',
    );
  });

  it('should reject an invalid CPF and accept a valid one', () => {
    expect(validarCliente({ ...vazios, nome: 'F', cpf: '111.111.111-11' }).cpf).toBe(
      'cliente.form.cpf.invalido',
    );
    expect(validarCliente({ ...vazios, nome: 'F', cpf: '529.982.247-25' })).toEqual({});
  });
});

describe('useClientForm (novo)', () => {
  it('should start ready, empty and without changes', () => {
    const { result } = renderHook(() => useClientForm(NOVO));

    expect(result.current.carga).toBe('pronto');
    expect(result.current.valores.nome).toBe('');
    expect(result.current.temAlteracao).toBe(false);
    expect(result.current.estadoEnvio).toBe('idle');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should start with the suggested name and without counting it as a change', () => {
    const { result } = renderHook(() => useClientForm({ modo: 'novo', nomeInicial: 'Lauro' }));

    expect(result.current.valores.nome).toBe('Lauro');
    expect(result.current.temAlteracao).toBe(false);
  });

  it('should flag a change when the suggested name is edited', () => {
    const { result } = renderHook(() => useClientForm({ modo: 'novo', nomeInicial: 'Lauro' }));

    act(() => result.current.alterar('nome', 'Lauro Teste'));

    expect(result.current.temAlteracao).toBe(true);
  });

  it('should mask phone and CPF while typing and flag the change', () => {
    const { result } = renderHook(() => useClientForm(NOVO));

    act(() => result.current.alterar('telefone', '11900000001'));
    act(() => result.current.alterar('cpf', '52998224725'));

    expect(result.current.valores.telefone).toBe('(11) 90000-0001');
    expect(result.current.valores.cpf).toBe('529.982.247-25');
    expect(result.current.temAlteracao).toBe(true);
  });

  it('should not call the API and mark the invalid fields when validation fails', async () => {
    const { result } = renderHook(() => useClientForm(NOVO));

    await act(async () => {
      await result.current.enviar();
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.estadoEnvio).toBe('erroValidacao');
    expect(result.current.errosDeCampo).toEqual({ nome: 'cliente.form.nome.invalido' });
    expect(result.current.recusas).toBe(1);
  });

  it('should clear the error of a field when the person edits it', async () => {
    const { result } = renderHook(() => useClientForm(NOVO));
    await act(async () => {
      await result.current.enviar();
    });

    act(() => result.current.alterar('nome', 'F'));

    expect(result.current.errosDeCampo.nome).toBeUndefined();
  });

  it('should create the client and expose the saved id', async () => {
    fetchMock.mockResolvedValue(fakeResponse(201, { ...DETALHE, id: 21 }));
    const { result } = renderHook(() => useClientForm(NOVO));
    preencherNovo(result);

    await act(async () => {
      await result.current.enviar();
    });

    expect(result.current.estadoEnvio).toBe('salvo');
    expect(result.current.clienteSalvoId).toBe(21);
    const [url, opcoes] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8080/api/v1/clientes');
    expect(opcoes.method).toBe('POST');
  });

  it('should keep the typed values and allow a retry after a connection failure', async () => {
    fetchMock.mockResolvedValueOnce(fakeResponse(500, {}));
    fetchMock.mockResolvedValueOnce(fakeResponse(201, DETALHE));
    const { result } = renderHook(() => useClientForm(NOVO));
    preencherNovo(result);

    await act(async () => {
      await result.current.enviar();
    });
    expect(result.current.estadoEnvio).toBe('erroConexao');
    expect(result.current.valores.nome).toBe('Fulano de Teste');

    await act(async () => {
      await result.current.enviar();
    });
    expect(result.current.estadoEnvio).toBe('salvo');
  });

  it('should show the duplicated CPF on the CPF field and keep the values', async () => {
    fetchMock.mockResolvedValue(fakeResponse(409, { erros: [], mensagem: 'CPF ja cadastrado' }));
    const { result } = renderHook(() => useClientForm(NOVO));
    preencherNovo(result);
    act(() => result.current.alterar('cpf', CPF_VALIDO));

    await act(async () => {
      await result.current.enviar();
    });

    expect(result.current.estadoEnvio).toBe('erroValidacao');
    expect(result.current.errosDeCampo).toEqual({ cpf: 'cliente.form.cpf.duplicado' });
    expect(result.current.conflitoGeral).toBe(false);
    expect(result.current.valores.cpf).toBe('529.982.247-25');
  });

  it('should map a 400 with a null key to the default invalid key of the field', async () => {
    fetchMock.mockResolvedValue(
      fakeResponse(400, { erros: [{ campo: 'email', chave: null }], mensagem: 'x' }),
    );
    const { result } = renderHook(() => useClientForm(NOVO));
    preencherNovo(result);

    await act(async () => {
      await result.current.enviar();
    });

    expect(result.current.errosDeCampo).toEqual({ email: 'cliente.form.email.invalido' });
  });

  it('should flag a general conflict when the 409 is unknown', async () => {
    fetchMock.mockResolvedValue(fakeResponse(409, { erros: [], mensagem: 'Outro conflito' }));
    const { result } = renderHook(() => useClientForm(NOVO));
    preencherNovo(result);

    await act(async () => {
      await result.current.enviar();
    });

    expect(result.current.conflitoGeral).toBe(true);
    expect(result.current.errosDeCampo).toEqual({});
  });

  it('should ignore a second send while the first is in flight', async () => {
    let concluir: (resposta: Response) => void = () => undefined;
    fetchMock.mockReturnValue(new Promise<Response>((resolve) => (concluir = resolve)));
    const { result } = renderHook(() => useClientForm(NOVO));
    preencherNovo(result);

    let primeira: Promise<void> = Promise.resolve();
    act(() => {
      primeira = result.current.enviar();
    });
    await act(async () => {
      await result.current.enviar();
    });
    await act(async () => {
      concluir(fakeResponse(201, DETALHE));
      await primeira;
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('useClientForm (editar)', () => {
  it('should load the client, fill the form with masks and report no change', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, DETALHE));

    const { result } = renderHook(() => useClientForm(EDITAR));

    expect(result.current.carga).toBe('carregando');
    await waitFor(() => expect(result.current.carga).toBe('pronto'));
    expect(result.current.valores).toEqual({
      nome: 'Teodoro Lemos',
      telefone: '(11) 90000-0001',
      email: 'teodoro@example.com',
      cpf: '529.982.247-25',
      endereco: 'Rua das Flores, 10',
    });
    expect(result.current.temAlteracao).toBe(false);
  });

  it('should report a change when a field differs from the loaded value, and none when it is restored', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, DETALHE));
    const { result } = renderHook(() => useClientForm(EDITAR));
    await waitFor(() => expect(result.current.carga).toBe('pronto'));

    act(() => result.current.alterar('nome', 'Outro Nome'));
    expect(result.current.temAlteracao).toBe(true);

    act(() => result.current.alterar('nome', 'Teodoro Lemos'));
    expect(result.current.temAlteracao).toBe(false);
  });

  it('should be not found without calling the API when the route id is invalid', () => {
    const { result } = renderHook(() => useClientForm({ modo: 'editar', clienteId: null }));

    expect(result.current.carga).toBe('naoEncontrado');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should show a load error and recover with recarregar', async () => {
    fetchMock.mockResolvedValueOnce(fakeResponse(500, {}));
    fetchMock.mockResolvedValueOnce(fakeResponse(200, DETALHE));
    const { result } = renderHook(() => useClientForm(EDITAR));
    await waitFor(() => expect(result.current.carga).toBe('erroConexao'));

    act(() => result.current.recarregar());

    await waitFor(() => expect(result.current.carga).toBe('pronto'));
  });

  it('should send a PUT with the edited values', async () => {
    fetchMock.mockResolvedValueOnce(fakeResponse(200, DETALHE));
    const { result } = renderHook(() => useClientForm(EDITAR));
    await waitFor(() => expect(result.current.carga).toBe('pronto'));
    fetchMock.mockResolvedValueOnce(fakeResponse(200, { ...DETALHE, nome: 'Outro Nome' }));

    act(() => result.current.alterar('nome', 'Outro Nome'));
    await act(async () => {
      await result.current.enviar();
    });

    const [url, opcoes] = fetchMock.mock.calls[1];
    expect(url).toBe('http://localhost:8080/api/v1/clientes/7');
    expect(opcoes.method).toBe('PUT');
    expect(JSON.parse(opcoes.body).nome).toBe('Outro Nome');
    expect(result.current.estadoEnvio).toBe('salvo');
    expect(result.current.clienteSalvoId).toBe(7);
  });

  it('should become not found when the PUT answers 404', async () => {
    fetchMock.mockResolvedValueOnce(fakeResponse(200, DETALHE));
    const { result } = renderHook(() => useClientForm(EDITAR));
    await waitFor(() => expect(result.current.carga).toBe('pronto'));
    fetchMock.mockResolvedValueOnce(fakeResponse(404, {}));

    await act(async () => {
      await result.current.enviar();
    });

    expect(result.current.estadoEnvio).toBe('naoEncontrado');
  });
});

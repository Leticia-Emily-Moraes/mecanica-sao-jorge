import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/use-auth';
import { fakeResponse, mockFetch } from '@/test-utils/fake-response';

import EditarVeiculoScreen from './vehicle-edit-screen';

jest.mock('@/hooks/use-auth');
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

type Ouvinte = (evento: { preventDefault: () => void; data: { action: unknown } }) => void;

const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockDismissTo = jest.fn();
let mockParams: Record<string, string> = {};
const mockNavigation = { addListener: jest.fn(), dispatch: jest.fn() };
let ouvinte: Ouvinte | null = null;
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    back: mockBack,
    dismissTo: mockDismissTo,
    canGoBack: () => true,
  }),
  useLocalSearchParams: () => mockParams,
  useNavigation: () => mockNavigation,
}));

const METRICAS = {
  frame: { x: 0, y: 0, width: 360, height: 740 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

const PLACA_FICTICIA = 'ABC1D23';
const VEICULO = {
  id: 21,
  clienteId: 7,
  clienteNome: 'Teodoro Lemos',
  placa: PLACA_FICTICIA,
  marca: 'Honda',
  modelo: 'Civic',
  ano: 2020,
  cor: 'Prata',
  historicoOs: [],
};
const SALVO = {
  id: 21,
  clienteId: 7,
  placa: PLACA_FICTICIA,
  marca: 'Honda',
  modelo: 'Civic Touring',
  ano: 2020,
  cor: 'Prata',
};

const tratarSessaoExpirada = jest.fn(async () => undefined);

function renderTela(): void {
  render(
    <SafeAreaProvider initialMetrics={METRICAS}>
      <EditarVeiculoScreen />
    </SafeAreaProvider>,
  );
}

function simularApi(leitura: Response | Promise<Response>, gravacao?: Response): jest.Mock {
  const fetchMock = mockFetch();
  fetchMock.mockImplementation(async (_url: string, init?: RequestInit) =>
    init?.method === 'PUT' && gravacao !== undefined ? gravacao : leitura,
  );
  return fetchMock;
}

function chamadasPut(fetchMock: jest.Mock): [string, RequestInit][] {
  return (fetchMock.mock.calls as [string, RequestInit][]).filter(
    ([, init]) => init?.method === 'PUT',
  );
}

async function abrirFormulario(): Promise<void> {
  renderTela();
  await screen.findByLabelText('Placa *');
}

describe('EditarVeiculoScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { veiculoId: '21' };
    ouvinte = null;
    mockNavigation.addListener.mockImplementation((_nome: string, fn: Ouvinte) => {
      ouvinte = fn;
      return jest.fn();
    });
    (useAuth as jest.MockedFunction<typeof useAuth>).mockReturnValue({
      tokenAtual: 'token-de-teste',
      tratarSessaoExpirada,
    } as unknown as ReturnType<typeof useAuth>);
  });

  it('should show a loading indicator while the vehicle is fetched', () => {
    simularApi(new Promise(() => undefined));

    renderTela();

    expect(screen.getByRole('progressbar', { name: 'Carregando veículo…' })).toBeTruthy();
    expect(screen.queryByLabelText('Placa *')).toBeNull();
  });

  it('should fill the form with the vehicle data once it is loaded', async () => {
    simularApi(fakeResponse(200, VEICULO));

    await abrirFormulario();

    expect(screen.getByRole('header', { name: 'Editar veículo' })).toBeTruthy();
    expect(screen.getByLabelText('Cliente: Teodoro Lemos')).toBeTruthy();
    expect(screen.getByLabelText('Placa *').props.value).toBe(PLACA_FICTICIA);
    expect(screen.getByLabelText('Marca *').props.value).toBe('Honda');
    expect(screen.getByLabelText('Modelo *').props.value).toBe('Civic');
    expect(screen.getByLabelText('Ano (opcional)').props.value).toBe('2020');
    expect(screen.getByLabelText('Cor (opcional)').props.value).toBe('Prata');
    expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeTruthy();
  });

  it('should show the not found state with a way back on a 404', async () => {
    simularApi(fakeResponse(404, {}));

    renderTela();

    expect(await screen.findByText('Veículo não encontrado')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Voltar para o cliente' }));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('should show the error state and load again when the retry is pressed', async () => {
    const fetchMock = simularApi(fakeResponse(500, {}));

    renderTela();
    const tentar = await screen.findByRole('button', { name: 'Tentar novamente' });
    fetchMock.mockImplementation(async () => fakeResponse(200, VEICULO));
    fireEvent.press(tentar);

    expect(await screen.findByLabelText('Placa *')).toBeTruthy();
  });

  it('should not call the API with an invalid id from the route', () => {
    mockParams = { veiculoId: 'abc' };
    const fetchMock = simularApi(fakeResponse(200, VEICULO));

    renderTela();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText('Veículo não encontrado')).toBeTruthy();
  });

  it('should refuse an invalid plate without sending the update', async () => {
    const fetchMock = simularApi(fakeResponse(200, VEICULO));
    await abrirFormulario();

    fireEvent.changeText(screen.getByLabelText('Placa *'), 'ABC');
    fireEvent.press(screen.getByRole('button', { name: 'Salvar alterações' }));

    expect(screen.getByText('Placa inválida. Use ABC1D23 ou ABC1234.')).toBeTruthy();
    expect(chamadasPut(fetchMock)).toHaveLength(0);
  });

  it('should send the update and go back to the detail with the edited notice', async () => {
    const fetchMock = simularApi(fakeResponse(200, VEICULO), fakeResponse(200, SALVO));
    await abrirFormulario();

    fireEvent.changeText(screen.getByLabelText('Modelo *'), 'Civic Touring');
    fireEvent.press(screen.getByRole('button', { name: 'Salvar alterações' }));

    await waitFor(() => expect(mockDismissTo).toHaveBeenCalledTimes(1));
    expect(mockDismissTo).toHaveBeenCalledWith({
      pathname: '/clientes/veiculos/[veiculoId]',
      params: expect.objectContaining({ veiculoId: '21', aviso: 'editado' }),
    });
    const [[url, init]] = chamadasPut(fetchMock);
    expect(url.endsWith('/veiculos/21')).toBe(true);
    expect(JSON.parse(String(init.body))).toMatchObject({
      placa: PLACA_FICTICIA,
      modelo: 'Civic Touring',
    });
  });

  it('should show the duplicate plate error under the field on a 409', async () => {
    simularApi(
      fakeResponse(200, VEICULO),
      fakeResponse(409, {
        erros: [{ campo: 'placa', chave: 'veiculo.form.placa.duplicada' }],
      }),
    );
    await abrirFormulario();

    fireEvent.changeText(screen.getByLabelText('Placa *'), 'XYZ9K88');
    fireEvent.press(screen.getByRole('button', { name: 'Salvar alterações' }));

    expect(await screen.findByText('Esta placa já está cadastrada.')).toBeTruthy();
    expect(mockDismissTo).not.toHaveBeenCalled();
  });

  it('should show the not found state when the vehicle disappears before saving', async () => {
    simularApi(fakeResponse(200, VEICULO), fakeResponse(404, {}));
    await abrirFormulario();

    fireEvent.changeText(screen.getByLabelText('Modelo *'), 'Civic Touring');
    fireEvent.press(screen.getByRole('button', { name: 'Salvar alterações' }));

    expect(await screen.findByText('Veículo não encontrado')).toBeTruthy();
    expect(mockDismissTo).not.toHaveBeenCalled();
  });

  it('should keep the typed values when the connection fails', async () => {
    simularApi(fakeResponse(200, VEICULO), fakeResponse(500, {}));
    await abrirFormulario();

    fireEvent.changeText(screen.getByLabelText('Modelo *'), 'Civic Touring');
    fireEvent.press(screen.getByRole('button', { name: 'Salvar alterações' }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeTruthy(),
    );
    expect(screen.getByLabelText('Modelo *').props.value).toBe('Civic Touring');
    expect(mockDismissTo).not.toHaveBeenCalled();
  });

  it('should end the session when the update answers 401', async () => {
    simularApi(fakeResponse(200, VEICULO), fakeResponse(401, {}));
    await abrirFormulario();

    fireEvent.changeText(screen.getByLabelText('Modelo *'), 'Civic Touring');
    fireEvent.press(screen.getByRole('button', { name: 'Salvar alterações' }));

    await waitFor(() => expect(tratarSessaoExpirada).toHaveBeenCalledTimes(1));
    expect(mockDismissTo).not.toHaveBeenCalled();
  });

  it('should leave without asking when nothing changed after loading', async () => {
    simularApi(fakeResponse(200, VEICULO));
    await abrirFormulario();

    const evento = { preventDefault: jest.fn(), data: { action: { type: 'GO_BACK' } } };
    act(() => ouvinte?.(evento));

    expect(evento.preventDefault).not.toHaveBeenCalled();
  });

  it('should ask before discarding when a field was changed', async () => {
    simularApi(fakeResponse(200, VEICULO));
    await abrirFormulario();

    fireEvent.changeText(screen.getByLabelText('Marca *'), 'Toyota');
    const evento = { preventDefault: jest.fn(), data: { action: { type: 'GO_BACK' } } };
    act(() => ouvinte?.(evento));

    expect(evento.preventDefault).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Descartar alterações?')).toBeTruthy();
  });

  describe('personal data in the log (criterion 16)', () => {
    const METODOS = ['log', 'info', 'warn', 'error', 'debug'] as const;

    it.each([
      ['success', fakeResponse(200, SALVO)],
      [
        'conflict',
        fakeResponse(409, { erros: [{ campo: 'placa', chave: 'veiculo.form.placa.duplicada' }] }),
      ],
      ['server error', fakeResponse(500, {})],
    ])(
      'should not write the plate or the owner name to the console on %s',
      async (_nome, resposta) => {
        const espioes = METODOS.map((metodo) =>
          jest.spyOn(console, metodo).mockImplementation(() => undefined),
        );
        simularApi(fakeResponse(200, VEICULO), resposta);
        await abrirFormulario();

        fireEvent.changeText(screen.getByLabelText('Modelo *'), 'Civic Touring');
        fireEvent.press(screen.getByRole('button', { name: 'Salvar alterações' }));
        await act(async () => undefined);
        await act(async () => undefined);

        const saida = JSON.stringify(espioes.flatMap((espiao) => espiao.mock.calls));
        expect(saida).not.toContain(PLACA_FICTICIA);
        expect(saida).not.toContain(VEICULO.clienteNome);
        espioes.forEach((espiao) => espiao.mockRestore());
      },
    );
  });
});

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/use-auth';
import { fakeResponse, mockFetch } from '@/test-utils/fake-response';

import NovoVeiculoScreen from './novo';

jest.mock('@/hooks/use-auth');
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

type Ouvinte = (evento: { preventDefault: () => void; data: { action: unknown } }) => void;

const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockDismissTo = jest.fn();
let mockPodeVoltar = true;
let mockParams: Record<string, string> = {};
const mockNavigation = { addListener: jest.fn(), dispatch: jest.fn() };
let ouvinte: Ouvinte | null = null;
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    back: mockBack,
    dismissTo: mockDismissTo,
    canGoBack: () => mockPodeVoltar,
  }),
  useLocalSearchParams: () => mockParams,
  useNavigation: () => mockNavigation,
}));

const METRICAS = {
  frame: { x: 0, y: 0, width: 360, height: 740 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

const PLACA_FICTICIA = 'ABC1D23';
const CLIENTE = {
  id: 7,
  nome: 'Teodoro Lemos',
  cpf: '52998224725',
  telefone: '11900000001',
  email: 'teodoro@example.com',
  endereco: 'Rua das Flores, 10, Centro',
};
const CRIADO = {
  id: 21,
  clienteId: 7,
  placa: PLACA_FICTICIA,
  marca: 'Honda',
  modelo: 'Civic',
  ano: 2020,
  cor: 'Prata',
};

const tratarSessaoExpirada = jest.fn(async () => undefined);

function renderTela(): void {
  render(
    <SafeAreaProvider initialMetrics={METRICAS}>
      <NovoVeiculoScreen />
    </SafeAreaProvider>,
  );
}

function simularApi(leitura: Response | Promise<Response>, gravacao?: Response): jest.Mock {
  const fetchMock = mockFetch();
  fetchMock.mockImplementation(async (_url: string, init?: RequestInit) =>
    init?.method === 'POST' && gravacao !== undefined ? gravacao : leitura,
  );
  return fetchMock;
}

function chamadasPost(fetchMock: jest.Mock): [string, RequestInit][] {
  return (fetchMock.mock.calls as [string, RequestInit][]).filter(
    ([, init]) => init?.method === 'POST',
  );
}

async function abrirFormulario(): Promise<void> {
  renderTela();
  await screen.findByLabelText('Placa *');
}

function preencherObrigatorios(): void {
  fireEvent.changeText(screen.getByLabelText('Placa *'), PLACA_FICTICIA);
  fireEvent.changeText(screen.getByLabelText('Marca *'), 'Honda');
  fireEvent.changeText(screen.getByLabelText('Modelo *'), 'Civic');
}

describe('NovoVeiculoScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { clienteId: '7' };
    mockPodeVoltar = true;
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

  it('should show a loading indicator while the owner is fetched', () => {
    simularApi(new Promise(() => undefined));

    renderTela();

    expect(screen.getByRole('progressbar', { name: 'Carregando veículo…' })).toBeTruthy();
    expect(screen.queryByLabelText('Placa *')).toBeNull();
  });

  it('should show the title, the owner name and the empty fields once loaded', async () => {
    simularApi(fakeResponse(200, CLIENTE));

    await abrirFormulario();

    expect(screen.getByRole('header', { name: 'Novo veículo' })).toBeTruthy();
    expect(screen.getByLabelText('Cliente: Teodoro Lemos')).toBeTruthy();
    expect(screen.getByLabelText('Placa *').props.value).toBe('');
    expect(screen.getByRole('button', { name: 'Salvar veículo' })).toBeTruthy();
  });

  it('should show the not found state with a way back when the owner does not exist', async () => {
    simularApi(fakeResponse(404, {}));

    renderTela();

    expect(await screen.findByText('Veículo não encontrado')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Voltar para o cliente' }));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('should go to the client list when there is no history to go back to', async () => {
    mockPodeVoltar = false;
    simularApi(fakeResponse(404, {}));

    renderTela();
    fireEvent.press(await screen.findByRole('button', { name: 'Voltar para o cliente' }));

    expect(mockReplace).toHaveBeenCalledWith('/clientes');
  });

  it('should not call the API with an invalid id from the route', () => {
    mockParams = { clienteId: 'abc' };
    const fetchMock = simularApi(fakeResponse(200, CLIENTE));

    renderTela();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText('Veículo não encontrado')).toBeTruthy();
  });

  it('should show the error state and load again when the retry is pressed', async () => {
    const fetchMock = simularApi(fakeResponse(500, {}));

    renderTela();
    const tentar = await screen.findByRole('button', { name: 'Tentar novamente' });
    fetchMock.mockImplementation(async () => fakeResponse(200, CLIENTE));
    fireEvent.press(tentar);

    expect(await screen.findByLabelText('Placa *')).toBeTruthy();
  });

  it('should refuse an invalid plate without sending the vehicle', async () => {
    const fetchMock = simularApi(fakeResponse(200, CLIENTE));
    await abrirFormulario();

    fireEvent.changeText(screen.getByLabelText('Placa *'), 'ABC');
    fireEvent.changeText(screen.getByLabelText('Marca *'), 'Honda');
    fireEvent.changeText(screen.getByLabelText('Modelo *'), 'Civic');
    fireEvent.press(screen.getByRole('button', { name: 'Salvar veículo' }));

    expect(screen.getByText('Placa inválida. Use ABC1D23 ou ABC1234.')).toBeTruthy();
    expect(chamadasPost(fetchMock)).toHaveLength(0);
  });

  it('should refuse an empty brand and model without sending the vehicle', async () => {
    const fetchMock = simularApi(fakeResponse(200, CLIENTE));
    await abrirFormulario();

    fireEvent.changeText(screen.getByLabelText('Placa *'), PLACA_FICTICIA);
    fireEvent.press(screen.getByRole('button', { name: 'Salvar veículo' }));

    expect(screen.getByText('Informe a marca.')).toBeTruthy();
    expect(screen.getByText('Informe o modelo.')).toBeTruthy();
    expect(chamadasPost(fetchMock)).toHaveLength(0);
  });

  it('should send the vehicle and go back to the client with the created notice', async () => {
    const fetchMock = simularApi(fakeResponse(200, CLIENTE), fakeResponse(201, CRIADO));
    await abrirFormulario();

    preencherObrigatorios();
    fireEvent.press(screen.getByRole('button', { name: 'Salvar veículo' }));

    await waitFor(() => expect(mockDismissTo).toHaveBeenCalledTimes(1));
    expect(mockDismissTo).toHaveBeenCalledWith({
      pathname: '/clientes/[clienteId]',
      params: expect.objectContaining({ clienteId: '7', aviso: 'veiculoCriado' }),
    });
    const [[url, init]] = chamadasPost(fetchMock);
    expect(url.endsWith('/clientes/7/veiculos')).toBe(true);
    expect(JSON.parse(String(init.body))).toMatchObject({
      placa: PLACA_FICTICIA,
      marca: 'Honda',
      modelo: 'Civic',
    });
  });

  it('should show the duplicate plate error under the field on a 409', async () => {
    simularApi(
      fakeResponse(200, CLIENTE),
      fakeResponse(409, {
        erros: [{ campo: 'placa', chave: 'veiculo.form.placa.duplicada' }],
      }),
    );
    await abrirFormulario();

    preencherObrigatorios();
    fireEvent.press(screen.getByRole('button', { name: 'Salvar veículo' }));

    expect(await screen.findByText('Esta placa já está cadastrada.')).toBeTruthy();
    expect(mockDismissTo).not.toHaveBeenCalled();
  });

  it('should keep the typed values when the connection fails', async () => {
    simularApi(fakeResponse(200, CLIENTE), fakeResponse(500, {}));
    await abrirFormulario();

    preencherObrigatorios();
    fireEvent.press(screen.getByRole('button', { name: 'Salvar veículo' }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Salvar veículo' })).toBeTruthy(),
    );
    expect(screen.getByLabelText('Placa *').props.value).toBe(PLACA_FICTICIA);
    expect(screen.getByLabelText('Modelo *').props.value).toBe('Civic');
    expect(mockDismissTo).not.toHaveBeenCalled();
  });

  it('should end the session when the creation answers 401', async () => {
    simularApi(fakeResponse(200, CLIENTE), fakeResponse(401, {}));
    await abrirFormulario();

    preencherObrigatorios();
    fireEvent.press(screen.getByRole('button', { name: 'Salvar veículo' }));

    await waitFor(() => expect(tratarSessaoExpirada).toHaveBeenCalledTimes(1));
    expect(mockDismissTo).not.toHaveBeenCalled();
  });

  it('should leave without asking when nothing was typed', async () => {
    simularApi(fakeResponse(200, CLIENTE));
    await abrirFormulario();

    const evento = { preventDefault: jest.fn(), data: { action: { type: 'GO_BACK' } } };
    act(() => ouvinte?.(evento));

    expect(evento.preventDefault).not.toHaveBeenCalled();
  });

  it('should ask before discarding when a field was typed', async () => {
    simularApi(fakeResponse(200, CLIENTE));
    await abrirFormulario();

    fireEvent.changeText(screen.getByLabelText('Marca *'), 'Honda');
    const evento = { preventDefault: jest.fn(), data: { action: { type: 'GO_BACK' } } };
    act(() => ouvinte?.(evento));

    expect(evento.preventDefault).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Descartar alterações?')).toBeTruthy();
  });

  describe('personal data in the log (criterion 16)', () => {
    const METODOS = ['log', 'info', 'warn', 'error', 'debug'] as const;

    it.each([
      ['success', fakeResponse(201, CRIADO)],
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
        simularApi(fakeResponse(200, CLIENTE), resposta);
        await abrirFormulario();

        preencherObrigatorios();
        fireEvent.press(screen.getByRole('button', { name: 'Salvar veículo' }));
        await act(async () => undefined);
        await act(async () => undefined);

        const saida = JSON.stringify(espioes.flatMap((espiao) => espiao.mock.calls));
        expect(saida).not.toContain(PLACA_FICTICIA);
        expect(saida).not.toContain(CLIENTE.nome);
        expect(saida).not.toContain(CLIENTE.cpf);
        espioes.forEach((espiao) => espiao.mockRestore());
      },
    );
  });
});

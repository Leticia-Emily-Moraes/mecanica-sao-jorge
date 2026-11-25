import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/use-auth';
import { fakeResponse, mockFetch } from '@/test-utils/fake-response';

import ClienteDetalheScreen from './client-detail-screen';

jest.mock('@/hooks/use-auth');
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockDismissTo = jest.fn();
let mockParams: Record<string, string> = {};
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    dismissTo: mockDismissTo,
    canGoBack: () => true,
  }),
  useLocalSearchParams: () => mockParams,
  useFocusEffect: jest.fn(),
}));

const METRICAS = {
  frame: { x: 0, y: 0, width: 360, height: 740 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

const CPF_FICTICIO = '12345678900';
const TELEFONE_FICTICIO = '11900000001';

const CLIENTE = {
  id: 7,
  nome: 'Teodoro Lemos',
  cpf: CPF_FICTICIO,
  telefone: TELEFONE_FICTICIO,
  email: 'teodoro@example.com',
  endereco: 'Rua das Flores, 10, Centro',
};

const VEICULOS = [
  { id: 11, placa: 'RTK4M81', marca: 'Honda', modelo: 'Civic' },
  { id: 12, placa: 'ABC1D23', marca: 'Fiat', modelo: 'Uno' },
];

const tratarSessaoExpirada = jest.fn(async () => undefined);

interface Respostas {
  readonly cliente: Response | Promise<Response>;
  readonly veiculos: Response | Promise<Response>;
}

function simularApi(respostas: Respostas): jest.Mock {
  const fetchMock = mockFetch();
  fetchMock.mockImplementation(async (url: string) =>
    String(url).endsWith('/veiculos') ? respostas.veiculos : respostas.cliente,
  );
  return fetchMock;
}

function renderTela(): void {
  render(
    <SafeAreaProvider initialMetrics={METRICAS}>
      <ClienteDetalheScreen />
    </SafeAreaProvider>,
  );
}

describe('ClienteDetalheScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { clienteId: '7' };
    (useAuth as jest.MockedFunction<typeof useAuth>).mockReturnValue({
      tokenAtual: 'token-de-teste',
      tratarSessaoExpirada,
    } as unknown as ReturnType<typeof useAuth>);
  });

  it('should show a loading indicator with an accessible name while the client is fetched', () => {
    simularApi({ cliente: new Promise(() => undefined), veiculos: new Promise(() => undefined) });

    renderTela();

    expect(screen.getByRole('progressbar', { name: 'Carregando cliente…' })).toBeTruthy();
  });

  it('should show the client data with the CPF masked and the linked vehicles', async () => {
    simularApi({
      cliente: fakeResponse(200, CLIENTE),
      veiculos: fakeResponse(200, VEICULOS),
    });

    renderTela();

    expect(await screen.findByText('(11) 90000-0001')).toBeTruthy();
    expect(screen.getAllByRole('header', { name: 'Teodoro Lemos' }).length).toBeGreaterThan(0);
    expect(screen.getByText('teodoro@example.com')).toBeTruthy();
    expect(screen.getByText('***.*56.7**-**')).toBeTruthy();
    expect(screen.getByText('Rua das Flores, 10, Centro')).toBeTruthy();
    expect(await screen.findByText('RTK4M81')).toBeTruthy();
    expect(screen.getByText('Honda Civic')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Veículos (2)' })).toBeTruthy();
    expect(screen.queryByText(CPF_FICTICIO)).toBeNull();
  });

  it('should read the CPF field of the detail as "CPF parcialmente oculto" (criterion 29)', async () => {
    simularApi({ cliente: fakeResponse(200, CLIENTE), veiculos: fakeResponse(200, VEICULOS) });

    renderTela();

    const campo = await screen.findByLabelText('CPF parcialmente oculto');

    expect(campo.props.accessible).toBe(true);
    expect(screen.queryByLabelText(/\*/)).toBeNull();
  });

  it('should show "Não informado" for missing fields without breaking the screen', async () => {
    simularApi({
      cliente: fakeResponse(200, {
        ...CLIENTE,
        cpf: null,
        email: null,
        endereco: null,
        telefone: null,
      }),
      veiculos: fakeResponse(200, VEICULOS),
    });

    renderTela();

    expect(await screen.findAllByText('Não informado')).toHaveLength(4);
    expect(screen.queryByText(/null/)).toBeNull();
  });

  it('should show "no vehicle" with the register action, which opens the new vehicle screen', async () => {
    simularApi({ cliente: fakeResponse(200, CLIENTE), veiculos: fakeResponse(200, []) });

    renderTela();

    expect(await screen.findByText('Nenhum veículo cadastrado')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: '+ Veículo' }));
    expect(mockPush).toHaveBeenCalledWith('/clientes/7/veiculos/novo');
  });

  it('should keep the client visible when only the vehicle list fails, and retry it', async () => {
    const fetchMock = simularApi({
      cliente: fakeResponse(200, CLIENTE),
      veiculos: fakeResponse(500, {}),
    });

    renderTela();

    expect(await screen.findByText('Não foi possível carregar os veículos.')).toBeTruthy();
    expect(screen.getByText('(11) 90000-0001')).toBeTruthy();
    fetchMock.mockClear();
    fireEvent.press(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should open the vehicle detail by id and the edit screen by client id', async () => {
    simularApi({ cliente: fakeResponse(200, CLIENTE), veiculos: fakeResponse(200, VEICULOS) });

    renderTela();
    fireEvent.press(await screen.findByRole('button', { name: 'RTK4M81, Honda Civic' }));
    fireEvent.press(screen.getByRole('button', { name: 'Editar cliente Teodoro Lemos' }));

    expect(mockPush).toHaveBeenCalledWith('/clientes/veiculos/11');
    expect(mockPush).toHaveBeenCalledWith('/clientes/7/editar');
  });

  it('should show a connection error with retry that loads the client again', async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValueOnce(fakeResponse(500, {}));
    fetchMock.mockImplementation(async (url: string) =>
      String(url).endsWith('/veiculos') ? fakeResponse(200, []) : fakeResponse(200, CLIENTE),
    );

    renderTela();
    fireEvent.press(await screen.findByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByText('(11) 90000-0001')).toBeTruthy();
  });

  it('should show "not found" without retry and go back to the list on the action', async () => {
    simularApi({ cliente: fakeResponse(404, {}), veiculos: fakeResponse(404, {}) });

    renderTela();

    expect(await screen.findByText('Cliente não encontrado')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Tentar novamente' })).toBeNull();
    const botoes = screen.getAllByRole('button', { name: 'Voltar para clientes' });
    fireEvent.press(botoes[botoes.length - 1]);
    expect(mockDismissTo).toHaveBeenCalledWith('/clientes');
  });

  it('should show "not found" without calling the API when the route id is invalid', () => {
    mockParams = { clienteId: 'abc' };
    const fetchMock = simularApi({
      cliente: fakeResponse(200, CLIENTE),
      veiculos: fakeResponse(200, []),
    });

    renderTela();

    expect(screen.getByText('Cliente não encontrado')).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should hand the session over to the expired-session handler on 401 and show no data', async () => {
    simularApi({ cliente: fakeResponse(401, {}), veiculos: fakeResponse(401, {}) });

    renderTela();

    await screen.findByRole('progressbar', { name: 'Carregando cliente…' });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(tratarSessaoExpirada).toHaveBeenCalled();
    expect(screen.queryByText('Teodoro Lemos')).toBeNull();
    expect(screen.queryByText('Cliente não encontrado')).toBeNull();
  });

  it('should show the success notice carried by the route', async () => {
    mockParams = { clienteId: '7', aviso: 'editado', avisoId: '1' };
    simularApi({ cliente: fakeResponse(200, CLIENTE), veiculos: fakeResponse(200, []) });

    renderTela();

    expect(await screen.findByText('Alterações salvas.')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Fechar aviso' }));
    expect(screen.queryByText('Alterações salvas.')).toBeNull();
  });

  it('should ignore a notice that is not in the fixed list', async () => {
    mockParams = { clienteId: '7', aviso: '<script>', avisoId: '1' };
    simularApi({ cliente: fakeResponse(200, CLIENTE), veiculos: fakeResponse(200, []) });

    renderTela();

    await screen.findByText('(11) 90000-0001');
    expect(screen.queryByText('<script>')).toBeNull();
    expect(screen.queryByTestId('inline-notice')).toBeNull();
  });

  describe('personal data in the log (criterion 16)', () => {
    const METODOS = ['log', 'info', 'warn', 'error', 'debug'] as const;

    it.each([
      ['success', 200, '(11) 90000-0001'],
      ['not found', 404, 'Cliente não encontrado'],
      ['server error', 500, 'Não foi possível carregar'],
    ])(
      'should not write CPF or phone to the console on %s',
      async (_nome, status, textoEsperado) => {
        const espioes = METODOS.map((metodo) =>
          jest.spyOn(console, metodo).mockImplementation(() => undefined),
        );
        simularApi({
          cliente: fakeResponse(status, status === 200 ? CLIENTE : {}),
          veiculos: fakeResponse(status === 200 ? 200 : status, status === 200 ? VEICULOS : {}),
        });

        renderTela();
        await screen.findByText(textoEsperado);

        const saida = JSON.stringify(espioes.flatMap((espiao) => espiao.mock.calls));
        expect(saida).not.toContain(CPF_FICTICIO);
        expect(saida).not.toContain(TELEFONE_FICTICIO);
        espioes.forEach((espiao) => espiao.mockRestore());
      },
    );
  });
});

import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/use-auth';
import { fakeResponse, mockFetch } from '@/test-utils/fake-response';

import VeiculoDetalheScreen from './vehicle-detail-screen';

jest.mock('@/hooks/use-auth');
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();
let mockPodeVoltar = true;
let mockParams: Record<string, string> = {};
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    canGoBack: () => mockPodeVoltar,
  }),
  useLocalSearchParams: () => mockParams,
  useFocusEffect: (efeito: () => void) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useEffect } = require('react') as typeof import('react');
    useEffect(() => efeito(), [efeito]);
  },
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

const tratarSessaoExpirada = jest.fn(async () => undefined);

function renderTela(): void {
  render(
    <SafeAreaProvider initialMetrics={METRICAS}>
      <VeiculoDetalheScreen />
    </SafeAreaProvider>,
  );
}

describe('VeiculoDetalheScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { veiculoId: '21' };
    mockPodeVoltar = true;
    (useAuth as jest.MockedFunction<typeof useAuth>).mockReturnValue({
      tokenAtual: 'token-de-teste',
      tratarSessaoExpirada,
    } as unknown as ReturnType<typeof useAuth>);
  });

  it('should show a loading indicator with an accessible name while the vehicle is fetched', () => {
    mockFetch().mockImplementation(() => new Promise(() => undefined));

    renderTela();

    expect(screen.getByRole('progressbar', { name: 'Carregando veículo…' })).toBeTruthy();
  });

  it('should show the plate as title, the data and the empty history by default', async () => {
    mockFetch().mockImplementation(async () => fakeResponse(200, VEICULO));

    renderTela();

    expect(await screen.findByRole('header', { name: PLACA_FICTICIA })).toBeTruthy();
    expect(screen.getByText('Honda Civic')).toBeTruthy();
    expect(screen.getByText('Teodoro Lemos')).toBeTruthy();
    expect(screen.getByText('2020')).toBeTruthy();
    expect(screen.getByText('Prata')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Histórico de OS (0)' })).toBeTruthy();
    expect(screen.getByText('Nenhuma OS neste veículo')).toBeTruthy();
  });

  it('should list the service orders of the vehicle when the API returns them', async () => {
    mockFetch().mockImplementation(async () =>
      fakeResponse(200, {
        ...VEICULO,
        historicoOs: [{ id: 3, status: 'EM_ANDAMENTO', valorTotal: 455 }],
      }),
    );

    renderTela();

    expect(await screen.findByRole('header', { name: 'Histórico de OS (1)' })).toBeTruthy();
    expect(screen.getByText('OS #3')).toBeTruthy();
    expect(screen.getByText('EM ANDAMENTO')).toBeTruthy();
    expect(screen.queryByText('Nenhuma OS neste veículo')).toBeNull();
  });

  it('should open the edit screen from the header action named with the plate', async () => {
    mockFetch().mockImplementation(async () => fakeResponse(200, VEICULO));

    renderTela();
    fireEvent.press(await screen.findByRole('button', { name: 'Editar veículo ABC1D23' }));

    expect(mockPush).toHaveBeenCalledWith('/clientes/veiculos/21/editar');
  });

  it('should not offer the edit action before the vehicle is loaded', () => {
    mockFetch().mockImplementation(() => new Promise(() => undefined));

    renderTela();

    expect(screen.queryByRole('button', { name: /Editar veículo/ })).toBeNull();
  });

  it('should show the saved notice when it comes from the route and let it be dismissed', async () => {
    mockParams = { veiculoId: '21', aviso: 'editado', avisoId: '1' };
    mockFetch().mockImplementation(async () => fakeResponse(200, VEICULO));

    renderTela();

    expect(await screen.findByText('Alterações salvas.')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Fechar aviso' }));
    expect(screen.queryByText('Alterações salvas.')).toBeNull();
  });

  it('should show the not found state with a way back on a 404', async () => {
    mockFetch().mockImplementation(async () => fakeResponse(404, {}));

    renderTela();

    expect(await screen.findByText('Veículo não encontrado')).toBeTruthy();
    const botoes = screen.getAllByRole('button', { name: 'Voltar para o cliente' });
    fireEvent.press(botoes[botoes.length - 1]);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('should go to the client list when there is no history to go back to', async () => {
    mockPodeVoltar = false;
    mockFetch().mockImplementation(async () => fakeResponse(404, {}));

    renderTela();
    expect(await screen.findByText('Veículo não encontrado')).toBeTruthy();
    const botoes = screen.getAllByRole('button', { name: 'Voltar para o cliente' });
    fireEvent.press(botoes[botoes.length - 1]);

    expect(mockReplace).toHaveBeenCalledWith('/clientes');
  });

  it('should show the error state and load again when the retry is pressed', async () => {
    const fetchMock = mockFetch();
    fetchMock.mockImplementation(async () => fakeResponse(500, {}));

    renderTela();
    const tentar = await screen.findByRole('button', { name: 'Tentar novamente' });
    fetchMock.mockImplementation(async () => fakeResponse(200, VEICULO));
    fireEvent.press(tentar);

    expect(await screen.findByText('Honda Civic')).toBeTruthy();
  });

  it('should not call the API with an invalid id from the route', () => {
    mockParams = { veiculoId: 'abc' };
    const fetchMock = mockFetch();
    fetchMock.mockImplementation(async () => fakeResponse(200, VEICULO));

    renderTela();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText('Veículo não encontrado')).toBeTruthy();
  });

  it('should end the session when the read answers 401', async () => {
    mockFetch().mockImplementation(async () => fakeResponse(401, {}));

    renderTela();

    await act(async () => undefined);
    expect(tratarSessaoExpirada).toHaveBeenCalledTimes(1);
  });

  it.each(['log', 'info', 'warn', 'error', 'debug'] as const)(
    'should not write the plate or the owner name to console.%s',
    async (metodo) => {
      const espiao = jest.spyOn(console, metodo).mockImplementation(() => undefined);
      mockFetch().mockImplementation(async () => fakeResponse(200, VEICULO));

      renderTela();
      await screen.findByText('Honda Civic');

      const saida = JSON.stringify(espiao.mock.calls);
      expect(saida).not.toContain(PLACA_FICTICIA);
      expect(saida).not.toContain(VEICULO.clienteNome);
      espiao.mockRestore();
    },
  );
});

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/use-auth';
import { limparNomeSugerido, lerNomeSugerido } from '@/navigation/new-client-name';
import { fakeResponse, mockFetch } from '@/test-utils/fake-response';

import ClientesScreen from './client-list-screen';

jest.mock('@/hooks/use-auth');
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    canGoBack: () => false,
  }),
  useFocusEffect: jest.fn(),
}));

const METRICAS = {
  frame: { x: 0, y: 0, width: 360, height: 740 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

const tratarSessaoExpirada = jest.fn(async () => undefined);

function pagina(itens: unknown[], totalPaginas = 1): unknown {
  return { itens, pagina: 0, tamanho: 20, totalItens: itens.length, totalPaginas };
}

const CLIENTE_A = { id: 1, nome: 'Teodoro Lemos', telefone: '11900000001', email: null };
const CLIENTE_B = { id: 2, nome: 'Iara Montenegro', telefone: null, email: null };

function renderTela(): void {
  const tela: ReactElement = (
    <SafeAreaProvider initialMetrics={METRICAS}>
      <ClientesScreen />
    </SafeAreaProvider>
  );
  render(tela);
}

describe('ClientesScreen', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    limparNomeSugerido();
    (useAuth as jest.MockedFunction<typeof useAuth>).mockReturnValue({
      tokenAtual: 'token-de-teste',
      tratarSessaoExpirada,
    } as unknown as ReturnType<typeof useAuth>);
    fetchMock = mockFetch();
  });

  it('should show a loading indicator with an accessible name while the list is fetched', async () => {
    fetchMock.mockReturnValue(new Promise(() => undefined));

    renderTela();

    expect(screen.getByRole('progressbar', { name: 'Carregando clientes…' })).toBeTruthy();
  });

  it('should list name and contact of each client without showing any CPF', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, pagina([CLIENTE_A, CLIENTE_B])));

    renderTela();

    expect(await screen.findByText('Teodoro Lemos')).toBeTruthy();
    expect(screen.getByText('(11) 90000-0001')).toBeTruthy();
    expect(screen.getByText('Iara Montenegro')).toBeTruthy();
    expect(screen.getByText('Sem contato cadastrado')).toBeTruthy();
    expect(screen.queryByText(/cpf/i)).toBeNull();
  });

  it('should open the client detail by id when a row is pressed', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, pagina([CLIENTE_A])));

    renderTela();
    fireEvent.press(await screen.findByText('Teodoro Lemos'));

    expect(mockPush).toHaveBeenCalledWith('/clientes/1');
  });

  it('should offer to register the first client when the list is empty', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, pagina([], 0)));

    renderTela();

    expect(await screen.findByText('Nenhum cliente cadastrado')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Novo cliente' }));
    expect(mockPush).toHaveBeenCalledWith('/clientes/novo');
  });

  it('should show a connection error with retry that loads again', async () => {
    fetchMock.mockResolvedValueOnce(fakeResponse(500, {}));
    fetchMock.mockResolvedValueOnce(fakeResponse(200, pagina([CLIENTE_A])));

    renderTela();
    fireEvent.press(await screen.findByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByText('Teodoro Lemos')).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('should show "no result" with a clear action, distinct from the empty state', async () => {
    jest.useFakeTimers();
    fetchMock.mockResolvedValueOnce(fakeResponse(200, pagina([CLIENTE_A])));
    fetchMock.mockResolvedValueOnce(fakeResponse(200, pagina([], 0)));

    renderTela();
    await screen.findByText('Teodoro Lemos');
    fireEvent.changeText(screen.getByLabelText('Buscar clientes'), 'zzz');
    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    await waitFor(() => expect(screen.getByText('Nenhum resultado')).toBeTruthy());
    expect(screen.queryByText('Nenhum cliente cadastrado')).toBeNull();
    expect(screen.getByRole('button', { name: 'Limpar busca' })).toBeTruthy();
    jest.useRealTimers();
  });

  async function buscarSemResultado(termo: string): Promise<void> {
    jest.useFakeTimers();
    fetchMock.mockResolvedValueOnce(fakeResponse(200, pagina([CLIENTE_A])));
    fetchMock.mockResolvedValueOnce(fakeResponse(200, pagina([], 0)));

    renderTela();
    await screen.findByText('Teodoro Lemos');
    fireEvent.changeText(screen.getByLabelText('Buscar clientes'), termo);
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    await waitFor(() => expect(screen.getByText('Nenhum resultado')).toBeTruthy());
  }

  it('should offer to register the searched name and carry it to the new client form (P-01)', async () => {
    await buscarSemResultado('Lauro');

    fireEvent.press(screen.getByRole('button', { name: 'Cadastrar "Lauro"' }));

    expect(mockPush).toHaveBeenCalledWith('/clientes/novo');
    expect(lerNomeSugerido()).toBe('Lauro');
    jest.useRealTimers();
  });

  it('should keep "Novo cliente" with an empty form when the searched term looks like a phone', async () => {
    await buscarSemResultado('11900000001');

    fireEvent.press(screen.getByRole('button', { name: 'Novo cliente' }));

    expect(mockPush).toHaveBeenCalledWith('/clientes/novo');
    expect(lerNomeSugerido()).toBe('');
    jest.useRealTimers();
  });

  it('should draw the plus icon on the "Novo cliente" button of the filled list (P-08)', async () => {
    fetchMock.mockResolvedValue(fakeResponse(200, pagina([CLIENTE_A])));

    renderTela();
    await screen.findByText('Teodoro Lemos');

    expect(screen.getByTestId('button-icon', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Novo cliente' })).toBeTruthy();
  });

  it('should send a single request for a burst of keystrokes', async () => {
    jest.useFakeTimers();
    fetchMock.mockResolvedValue(fakeResponse(200, pagina([CLIENTE_A])));

    renderTela();
    await screen.findByText('Teodoro Lemos');
    fetchMock.mockClear();
    const campo = screen.getByLabelText('Buscar clientes');
    fireEvent.changeText(campo, 'T');
    fireEvent.changeText(campo, 'Te');
    fireEvent.changeText(campo, 'Teo');
    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(String(fetchMock.mock.calls[0][0])).toContain('q=Teo');
    jest.useRealTimers();
  });
});

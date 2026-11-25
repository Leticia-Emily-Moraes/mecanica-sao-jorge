import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/use-auth';
import { lerNomeSugerido, sugerirNomeParaNovoCliente } from '@/navigation/new-client-name';
import { fakeResponse, mockFetch } from '@/test-utils/fake-response';

import NovoClienteScreen from './client-create-screen';

jest.mock('@/hooks/use-auth');
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

type Ouvinte = (evento: { preventDefault: () => void; data: { action: unknown } }) => void;

const mockReplace = jest.fn();
const mockBack = jest.fn();
let mockPodeVoltar = true;
const mockNavigation = { addListener: jest.fn(), dispatch: jest.fn() };
let ouvinte: Ouvinte | null = null;
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    back: mockBack,
    canGoBack: () => mockPodeVoltar,
  }),
  useNavigation: () => mockNavigation,
}));

const METRICAS = {
  frame: { x: 0, y: 0, width: 360, height: 740 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

const CPF_FICTICIO = '52998224725';
const TELEFONE_FICTICIO = '11900000001';
const ROTULO_NOME = 'Nome completo *';
const ROTULO_TELEFONE = 'Telefone (opcional)';
const ROTULO_CPF = 'CPF (opcional), Só preencha se o cliente pedir nota fiscal.';

const CRIADO = {
  id: 42,
  nome: 'Teodoro Lemos',
  cpf: CPF_FICTICIO,
  telefone: TELEFONE_FICTICIO,
  email: null,
  endereco: null,
};

const tratarSessaoExpirada = jest.fn(async () => undefined);

function renderTela(): void {
  render(
    <SafeAreaProvider initialMetrics={METRICAS}>
      <NovoClienteScreen />
    </SafeAreaProvider>,
  );
}

function digitar(rotulo: string, texto: string): void {
  fireEvent.changeText(screen.getByLabelText(rotulo), texto);
}

function salvar(): void {
  fireEvent.press(screen.getByRole('button', { name: 'Salvar cliente' }));
}

describe('NovoClienteScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  it('should show the new client title with the form and a back action', () => {
    mockFetch();

    renderTela();

    expect(screen.getByRole('header', { name: 'Novo cliente' })).toBeTruthy();
    expect(screen.getByLabelText(ROTULO_NOME)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Salvar cliente' })).toBeTruthy();
  });

  it('should open with the name suggested by the empty search, editable, then forget it', () => {
    mockFetch();
    sugerirNomeParaNovoCliente('Lauro');

    const { unmount } = render(
      <SafeAreaProvider initialMetrics={METRICAS}>
        <NovoClienteScreen />
      </SafeAreaProvider>,
    );

    expect(screen.getByLabelText(ROTULO_NOME).props.value).toBe('Lauro');
    digitar(ROTULO_NOME, 'Lauro Teste');
    expect(screen.getByLabelText(ROTULO_NOME).props.value).toBe('Lauro Teste');

    unmount();
    expect(lerNomeSugerido()).toBe('');
  });

  it('should refuse an empty name without calling the API', () => {
    const fetchMock = mockFetch();

    renderTela();
    salvar();

    expect(screen.getByText('Informe o nome do cliente.')).toBeTruthy();
    expect(screen.getByText('Corrija o campo destacado para salvar.')).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should refuse an incomplete phone without calling the API', () => {
    const fetchMock = mockFetch();

    renderTela();
    digitar(ROTULO_NOME, 'Teodoro Lemos');
    digitar(ROTULO_TELEFONE, '1190');
    salvar();

    expect(screen.getByText('Telefone incompleto. Use (11) 90000-0000.')).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should create the client and replace the screen by the detail with the created notice', async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValue(fakeResponse(201, CRIADO));

    renderTela();
    digitar(ROTULO_NOME, '  Teodoro Lemos ');
    digitar(ROTULO_TELEFONE, TELEFONE_FICTICIO);
    digitar(ROTULO_CPF, CPF_FICTICIO);
    salvar();

    await waitFor(() => expect(mockReplace).toHaveBeenCalledTimes(1));
    expect(mockReplace).toHaveBeenCalledWith({
      pathname: '/clientes/[clienteId]',
      params: expect.objectContaining({ clienteId: '42', aviso: 'criado' }),
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url.endsWith('/clientes')).toBe(true);
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toMatchObject({
      nome: 'Teodoro Lemos',
      telefone: TELEFONE_FICTICIO,
      cpf: CPF_FICTICIO,
      email: null,
      endereco: null,
    });
  });

  it('should show the duplicate CPF error under the field on a 409', async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValue(fakeResponse(409, { erros: [], mensagem: 'CPF ja cadastrado' }));

    renderTela();
    digitar(ROTULO_NOME, 'Teodoro Lemos');
    digitar(ROTULO_CPF, CPF_FICTICIO);
    salvar();

    expect(await screen.findByText('Já existe um cliente com este CPF.')).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
    expect(screen.getByLabelText(ROTULO_NOME).props.value).toBe('Teodoro Lemos');
  });

  it('should keep the typed values and show the send failure when the network is down', async () => {
    const fetchMock = mockFetch();
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));

    renderTela();
    digitar(ROTULO_NOME, 'Teodoro Lemos');
    salvar();

    expect(
      await screen.findByText(
        'Não foi possível salvar. Verifique a internet da oficina e tente de novo.',
      ),
    ).toBeTruthy();
    expect(screen.getByLabelText(ROTULO_NOME).props.value).toBe('Teodoro Lemos');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should end the session when the API answers 401', async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValue(fakeResponse(401, {}));

    renderTela();
    digitar(ROTULO_NOME, 'Teodoro Lemos');
    salvar();

    await waitFor(() => expect(tratarSessaoExpirada).toHaveBeenCalledTimes(1));
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should let the person leave without asking when nothing was typed', () => {
    mockFetch();

    renderTela();
    const evento = { preventDefault: jest.fn(), data: { action: { type: 'GO_BACK' } } };
    act(() => ouvinte?.(evento));

    expect(evento.preventDefault).not.toHaveBeenCalled();
    expect(screen.queryByText('Descartar alterações?')).toBeNull();
  });

  it('should ask before discarding when the form has typed data', () => {
    mockFetch();

    renderTela();
    digitar(ROTULO_NOME, 'Teodoro');
    const evento = { preventDefault: jest.fn(), data: { action: { type: 'GO_BACK' } } };
    act(() => ouvinte?.(evento));

    expect(evento.preventDefault).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Descartar alterações?')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Continuar editando' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Descartar' })).toBeTruthy();
  });

  it('should go back through the history when the back button is pressed', () => {
    mockFetch();

    renderTela();
    fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('should fall back to the client list when there is no history to go back to', () => {
    mockFetch();
    mockPodeVoltar = false;

    renderTela();
    fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));

    expect(mockReplace).toHaveBeenCalledWith('/clientes');
  });

  describe('personal data in the log (criterion 16)', () => {
    const METODOS = ['log', 'info', 'warn', 'error', 'debug'] as const;

    it.each([
      ['success', fakeResponse(201, CRIADO)],
      ['conflict', fakeResponse(409, { erros: [], mensagem: 'CPF ja cadastrado' })],
      ['server error', fakeResponse(500, {})],
    ])('should not write CPF or phone to the console on %s', async (_nome, resposta) => {
      const espioes = METODOS.map((metodo) =>
        jest.spyOn(console, metodo).mockImplementation(() => undefined),
      );
      mockFetch().mockResolvedValue(resposta);

      renderTela();
      digitar(ROTULO_NOME, 'Teodoro Lemos');
      digitar(ROTULO_TELEFONE, TELEFONE_FICTICIO);
      digitar(ROTULO_CPF, CPF_FICTICIO);
      salvar();
      await waitFor(() => expect(screen.getByLabelText(ROTULO_NOME)).toBeTruthy());
      await act(async () => undefined);

      const saida = JSON.stringify(espioes.flatMap((espiao) => espiao.mock.calls));
      expect(saida).not.toContain(CPF_FICTICIO);
      expect(saida).not.toContain(TELEFONE_FICTICIO);
      espioes.forEach((espiao) => espiao.mockRestore());
    });
  });
});

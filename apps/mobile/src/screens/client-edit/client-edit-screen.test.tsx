import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/use-auth';
import { fakeResponse, mockFetch } from '@/test-utils/fake-response';

import EditarClienteScreen from './client-edit-screen';

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

const CPF_FICTICIO = '52998224725';
const TELEFONE_FICTICIO = '11900000001';
const ROTULO_NOME = 'Nome completo *';
const ROTULO_TELEFONE = 'Telefone (opcional)';

const CLIENTE = {
  id: 7,
  nome: 'Teodoro Lemos',
  cpf: CPF_FICTICIO,
  telefone: TELEFONE_FICTICIO,
  email: 'teodoro@example.com',
  endereco: 'Rua das Flores, 10, Centro',
};

const tratarSessaoExpirada = jest.fn(async () => undefined);

function renderTela(): void {
  render(
    <SafeAreaProvider initialMetrics={METRICAS}>
      <EditarClienteScreen />
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
  await screen.findByLabelText(ROTULO_NOME);
}

describe('EditarClienteScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { clienteId: '7' };
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

  it('should show a loading indicator with an accessible name while the client is fetched', () => {
    simularApi(new Promise(() => undefined));

    renderTela();

    expect(screen.getByRole('progressbar', { name: 'Carregando cliente…' })).toBeTruthy();
    expect(screen.queryByLabelText(ROTULO_NOME)).toBeNull();
  });

  it('should fill the form with the client data once it is loaded', async () => {
    simularApi(fakeResponse(200, CLIENTE));

    await abrirFormulario();

    expect(screen.getByRole('header', { name: 'Editar cliente' })).toBeTruthy();
    expect(screen.getByLabelText(ROTULO_NOME).props.value).toBe('Teodoro Lemos');
    expect(screen.getByLabelText(ROTULO_TELEFONE).props.value).toBe('(11) 90000-0001');
    expect(screen.getByLabelText('E-mail (opcional)').props.value).toBe('teodoro@example.com');
    expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeTruthy();
  });

  it('should show the not found state with a way back to the list on a 404', async () => {
    simularApi(fakeResponse(404, {}));

    renderTela();

    expect(await screen.findByText('Cliente não encontrado')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Voltar para clientes' }));
    expect(mockDismissTo).toHaveBeenCalledWith('/clientes');
  });

  it('should show the error state and load again when the retry is pressed', async () => {
    const fetchMock = simularApi(fakeResponse(500, {}));

    renderTela();
    const tentar = await screen.findByRole('button', { name: 'Tentar novamente' });
    fetchMock.mockImplementation(async () => fakeResponse(200, CLIENTE));
    fireEvent.press(tentar);

    expect(await screen.findByLabelText(ROTULO_NOME)).toBeTruthy();
  });

  it('should not call the API with an invalid id from the route', () => {
    mockParams = { clienteId: 'abc' };
    const fetchMock = simularApi(fakeResponse(200, CLIENTE));

    renderTela();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText('Cliente não encontrado')).toBeTruthy();
  });

  it('should refuse an empty name without sending the update', async () => {
    const fetchMock = simularApi(fakeResponse(200, CLIENTE));
    await abrirFormulario();

    fireEvent.changeText(screen.getByLabelText(ROTULO_NOME), '');
    fireEvent.press(screen.getByRole('button', { name: 'Salvar alterações' }));

    expect(screen.getByText('Informe o nome do cliente.')).toBeTruthy();
    expect(chamadasPut(fetchMock)).toHaveLength(0);
  });

  it('should send the update and go back to the detail with the edited notice', async () => {
    const fetchMock = simularApi(fakeResponse(200, CLIENTE), fakeResponse(200, CLIENTE));
    await abrirFormulario();

    fireEvent.changeText(screen.getByLabelText(ROTULO_NOME), 'Teodoro Lemos Filho');
    fireEvent.press(screen.getByRole('button', { name: 'Salvar alterações' }));

    await waitFor(() => expect(mockDismissTo).toHaveBeenCalledTimes(1));
    expect(mockDismissTo).toHaveBeenCalledWith({
      pathname: '/clientes/[clienteId]',
      params: expect.objectContaining({ clienteId: '7', aviso: 'editado' }),
    });
    const [[url, init]] = chamadasPut(fetchMock);
    expect(url.endsWith('/clientes/7')).toBe(true);
    expect(JSON.parse(String(init.body))).toMatchObject({
      nome: 'Teodoro Lemos Filho',
      cpf: CPF_FICTICIO,
      telefone: TELEFONE_FICTICIO,
    });
  });

  it('should show the duplicate e-mail error under the field on a 409', async () => {
    simularApi(
      fakeResponse(200, CLIENTE),
      fakeResponse(409, { erros: [], mensagem: 'Email ja cadastrado' }),
    );
    await abrirFormulario();

    fireEvent.changeText(screen.getByLabelText('E-mail (opcional)'), 'outro@example.com');
    fireEvent.press(screen.getByRole('button', { name: 'Salvar alterações' }));

    expect(await screen.findByText('Já existe um cliente com este e-mail.')).toBeTruthy();
    expect(mockDismissTo).not.toHaveBeenCalled();
  });

  it('should show the not found state when the client disappears before saving', async () => {
    simularApi(fakeResponse(200, CLIENTE), fakeResponse(404, {}));
    await abrirFormulario();

    fireEvent.changeText(screen.getByLabelText(ROTULO_NOME), 'Teodoro Lemos Filho');
    fireEvent.press(screen.getByRole('button', { name: 'Salvar alterações' }));

    expect(await screen.findByText('Cliente não encontrado')).toBeTruthy();
    expect(mockDismissTo).not.toHaveBeenCalled();
  });

  it('should end the session when the update answers 401', async () => {
    simularApi(fakeResponse(200, CLIENTE), fakeResponse(401, {}));
    await abrirFormulario();

    fireEvent.changeText(screen.getByLabelText(ROTULO_NOME), 'Teodoro Lemos Filho');
    fireEvent.press(screen.getByRole('button', { name: 'Salvar alterações' }));

    await waitFor(() => expect(tratarSessaoExpirada).toHaveBeenCalledTimes(1));
    expect(mockDismissTo).not.toHaveBeenCalled();
  });

  it('should leave without asking when nothing changed after loading', async () => {
    simularApi(fakeResponse(200, CLIENTE));
    await abrirFormulario();

    const evento = { preventDefault: jest.fn(), data: { action: { type: 'GO_BACK' } } };
    act(() => ouvinte?.(evento));

    expect(evento.preventDefault).not.toHaveBeenCalled();
  });

  it('should ask before discarding when a field was changed', async () => {
    simularApi(fakeResponse(200, CLIENTE));
    await abrirFormulario();

    fireEvent.changeText(screen.getByLabelText(ROTULO_NOME), 'Outro Nome');
    const evento = { preventDefault: jest.fn(), data: { action: { type: 'GO_BACK' } } };
    act(() => ouvinte?.(evento));

    expect(evento.preventDefault).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Descartar alterações?')).toBeTruthy();
  });

  describe('personal data in the log (criterion 16)', () => {
    const METODOS = ['log', 'info', 'warn', 'error', 'debug'] as const;

    it.each([
      ['success', fakeResponse(200, CLIENTE)],
      ['conflict', fakeResponse(409, { erros: [], mensagem: 'CPF ja cadastrado' })],
      ['server error', fakeResponse(500, {})],
    ])('should not write CPF or phone to the console on %s', async (_nome, resposta) => {
      const espioes = METODOS.map((metodo) =>
        jest.spyOn(console, metodo).mockImplementation(() => undefined),
      );
      simularApi(fakeResponse(200, CLIENTE), resposta);
      await abrirFormulario();

      fireEvent.changeText(screen.getByLabelText(ROTULO_NOME), 'Teodoro Lemos Filho');
      fireEvent.press(screen.getByRole('button', { name: 'Salvar alterações' }));
      await act(async () => undefined);
      await act(async () => undefined);

      const saida = JSON.stringify(espioes.flatMap((espiao) => espiao.mock.calls));
      expect(saida).not.toContain(CPF_FICTICIO);
      expect(saida).not.toContain(TELEFONE_FICTICIO);
      espioes.forEach((espiao) => espiao.mockRestore());
    });
  });
});

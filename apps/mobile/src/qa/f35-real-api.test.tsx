/**
 * QA da F35 contra a API REAL (Spring Boot + MySQL), sem mock de fetch.
 *
 * Só roda com `QA_F35_API=<base da API>`; sem isso, a suíte padrão a ignora
 * (teste determinístico não pode depender de rede). Precisa de um token real:
 * `QA_F35_EMAIL` e `QA_F35_SENHA`, de um usuário fictício do banco descartável.
 *
 * Mocks só nas bordas do app: `expo-router` (navegação), `use-auth` (entrega o
 * token do login real) e `config/env` (aponta a URL). Telas, hooks, serviços e
 * componentes são os de produção. Dados fictícios.
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SEARCH_DEBOUNCE_MS } from '@/config/search';
import { useAuth } from '@/hooks/use-auth';

import ClientesScreen from '../../app/(menu)/clientes/index';
import ClienteDetalheScreen from '../../app/(menu)/clientes/[clienteId]/index';
import EditarClienteScreen from '../../app/(menu)/clientes/[clienteId]/editar';
import NovoVeiculoScreen from '../../app/(menu)/clientes/[clienteId]/veiculos/novo';
import NovoClienteScreen from '../../app/(menu)/clientes/novo';
import EditarVeiculoScreen from '../../app/(menu)/clientes/veiculos/[veiculoId]/editar';
import VeiculoDetalheScreen from '../../app/(menu)/clientes/veiculos/[veiculoId]/index';

jest.mock('@/hooks/use-auth');
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

interface ConfigQa {
  readonly api?: string;
  readonly email?: string;
  readonly senha?: string;
}

/** Vem de `--globals='{"QA_F35":{...}}'` ou das variáveis `QA_F35_*`. */
const CONFIG: ConfigQa = (globalThis as { QA_F35?: ConfigQa }).QA_F35 ?? {
  api: process.env.QA_F35_API,
  email: process.env.QA_F35_EMAIL,
  senha: process.env.QA_F35_SENHA,
};
const API = CONFIG.api ?? '';
const URL_FORA_DO_AR = 'http://127.0.0.1:1/api/v1';
let mockBase = API;
jest.mock('@/config/env', () => ({ getApiBaseUrl: (): string => mockBase }));

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockDismissTo = jest.fn();
let mockParams: Record<string, string> = {};
const mockNavigation = { addListener: jest.fn(() => jest.fn()), dispatch: jest.fn() };
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    dismissTo: mockDismissTo,
    canGoBack: () => true,
  }),
  useLocalSearchParams: () => mockParams,
  useNavigation: () => mockNavigation,
  useFocusEffect: jest.fn(),
}));

const METRICAS = {
  frame: { x: 0, y: 0, width: 360, height: 740 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

// CPFs fictícios com dígito verificador válido.
const CPF_A = '39053344705';
const CPF_B = '86288366757';
const CPF_C = '16899535009';
const TEL_A = '11900000001';
const TEL_B = '11900000002';
const DADOS_SENSIVEIS = [
  CPF_A,
  CPF_B,
  CPF_C,
  '390.533.447-05',
  TEL_A,
  TEL_B,
  '(11) 90000-0001',
  '(11) 90000-0002',
];

const tratarSessaoExpirada = jest.fn(async () => undefined);
let tokenReal = '';
let tokenAtual = '';

const logs: string[] = [];
const espioes: jest.SpyInstance[] = [];

function registrar(...args: unknown[]): void {
  logs.push(args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '));
}

async function api(
  method: string,
  caminho: string,
  corpo?: unknown,
): Promise<{ status: number; json: unknown }> {
  const r = await fetch(`${API}${caminho}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenReal}` },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  const texto = await r.text();
  return { status: r.status, json: texto ? JSON.parse(texto) : null };
}

function tela(componente: ReactElement): void {
  render(<SafeAreaProvider initialMetrics={METRICAS}>{componente}</SafeAreaProvider>);
}

function digitar(rotulo: string | RegExp, texto: string): void {
  fireEvent.changeText(screen.getByLabelText(rotulo), texto);
}

function contarChamadas(): { urls: string[]; restaurar: () => void } {
  const original = global.fetch;
  const urls: string[] = [];
  global.fetch = ((entrada: RequestInfo | URL, init?: RequestInit) => {
    urls.push(`${init?.method ?? 'GET'} ${String(entrada)}`);
    return original(entrada, init);
  }) as typeof fetch;
  return {
    urls,
    restaurar: () => {
      global.fetch = original;
    },
  };
}

async function idDoClientePorNome(nome: string): Promise<number> {
  const r = await api('GET', `/clientes?q=${encodeURIComponent(nome)}`);
  const itens = (r.json as { itens: { id: number; nome: string }[] }).itens;
  const achado = itens.find((c) => c.nome === nome);
  if (!achado) {
    throw new Error(`cliente fixture ausente: ${nome}`);
  }
  return achado.id;
}

const suite = API ? describe : describe.skip;

suite('F35 contra a API real', () => {
  beforeAll(async () => {
    const r = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: CONFIG.email,
        senha: CONFIG.senha,
      }),
    });
    tokenReal = ((await r.json()) as { token: string }).token;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockBase = API;
    mockParams = {};
    tokenAtual = tokenReal;
    logs.length = 0;
    for (const metodo of ['log', 'info', 'warn', 'error', 'debug'] as const) {
      espioes.push(jest.spyOn(console, metodo).mockImplementation(registrar));
    }
    (useAuth as jest.MockedFunction<typeof useAuth>).mockImplementation(
      () => ({ tokenAtual, tratarSessaoExpirada }) as unknown as ReturnType<typeof useAuth>,
    );
  });

  afterEach(() => {
    const saida = logs.join('\n');
    for (const valor of DADOS_SENSIVEIS) {
      expect(saida).not.toContain(valor);
    }
    expect(saida).not.toContain(tokenReal);
    espioes.splice(0).forEach((e) => e.mockRestore());
  });

  describe('lista vazia (rodar com o banco sem clientes)', () => {
    it('should show loading, then the empty state with a create action when no client exists [crit 3, 4]', async () => {
      tela(<ClientesScreen />);

      expect(screen.getByRole('progressbar', { name: 'Carregando clientes…' })).toBeTruthy();
      expect(await screen.findByText('Nenhum cliente cadastrado')).toBeTruthy();
      fireEvent.press(screen.getByRole('button', { name: 'Novo cliente' }));
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });

  describe('criar cliente', () => {
    it('should create the client through POST and replace the screen by the detail [crit 7]', async () => {
      tela(<NovoClienteScreen />);

      digitar('Nome completo *', 'Teodoro Lemos');
      digitar('Telefone (opcional)', TEL_A);
      digitar(/^CPF/, CPF_A);
      digitar('E-mail (opcional)', 'teodoro@example.com');
      digitar('Endereço (opcional)', 'Rua das Flores, 10, Centro');
      fireEvent.press(screen.getByRole('button', { name: 'Salvar cliente' }));

      await waitFor(() => expect(mockReplace).toHaveBeenCalledTimes(1));
      const id = await idDoClientePorNome('Teodoro Lemos');
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/clientes/[clienteId]',
        params: expect.objectContaining({ clienteId: String(id), aviso: 'criado' }),
      });
    });

    it('should refuse a CPF with invalid check digit without calling the API [crit 8]', async () => {
      const chamadas = contarChamadas();
      tela(<NovoClienteScreen />);

      digitar('Nome completo *', 'Cliente Cpf Ruim');
      digitar(/^CPF/, '12345678900');
      fireEvent.press(screen.getByRole('button', { name: 'Salvar cliente' }));

      expect(screen.getByText('CPF inválido. Confira os 11 números.')).toBeTruthy();
      expect(chamadas.urls.filter((u) => u.startsWith('POST'))).toHaveLength(0);
      chamadas.restaurar();
    });

    it('should refuse a CPF with fewer than 11 digits without calling the API [crit 8]', async () => {
      const chamadas = contarChamadas();
      tela(<NovoClienteScreen />);

      digitar('Nome completo *', 'Cliente Cpf Curto');
      digitar(/^CPF/, '1234567');
      fireEvent.press(screen.getByRole('button', { name: 'Salvar cliente' }));

      expect(screen.getByText('CPF inválido. Confira os 11 números.')).toBeTruthy();
      expect(chamadas.urls.filter((u) => u.startsWith('POST'))).toHaveLength(0);
      chamadas.restaurar();
    });

    it('should show the API duplicate CPF error at the CPF field, keep typed data and not navigate [crit 22]', async () => {
      tela(<NovoClienteScreen />);

      digitar('Nome completo *', 'Outra Pessoa');
      digitar('Telefone (opcional)', TEL_B);
      digitar(/^CPF/, CPF_A);
      fireEvent.press(screen.getByRole('button', { name: 'Salvar cliente' }));

      expect(await screen.findByText('Já existe um cliente com este CPF.')).toBeTruthy();
      expect(mockReplace).not.toHaveBeenCalled();
      expect(screen.getByLabelText('Nome completo *').props.value).toBe('Outra Pessoa');
    });

    it('should show a field error when the API requires CPF and phone that the form labels as optional [F-1]', async () => {
      tela(<NovoClienteScreen />);

      digitar('Nome completo *', 'So Nome');
      fireEvent.press(screen.getByRole('button', { name: 'Salvar cliente' }));

      await waitFor(() => expect(screen.queryByText('Salvando…')).toBeNull(), { timeout: 5000 });
      expect(mockReplace).not.toHaveBeenCalled();
      // O usuário precisa ver ALGUM erro que diga o que falta (além dos rótulos fixos).
      const textos = screen.UNSAFE_getAllByType(Text).map((t) => String(t.props.children));
      const rotulosFixos = ['CPF (opcional)', 'Telefone (opcional)'];
      const mensagens = textos.filter(
        (t) =>
          /cpf|telefone|obrigat|corrija|preencha|n[ãa]o foi poss/i.test(t) &&
          !rotulosFixos.includes(t),
      );
      expect(mensagens).not.toEqual([]);
      // Caracterização: o 400 vem com `chave: null` e o app cai no texto genérico do campo,
      // que fala de "incompleto/inválido" para um campo que só está vazio.
      expect(screen.getByText('Corrija os 2 campos destacados para salvar.')).toBeTruthy();
      expect(screen.getByText(/Telefone incompleto/)).toBeTruthy();
      expect(screen.getByText('CPF inválido. Confira os 11 números.')).toBeTruthy();
    });

    it('should keep typed data and offer a retry when the backend is down on create [crit 18]', async () => {
      mockBase = URL_FORA_DO_AR;
      tela(<NovoClienteScreen />);

      digitar('Nome completo *', 'Rede Caida');
      digitar('Telefone (opcional)', TEL_B);
      digitar(/^CPF/, CPF_C);
      fireEvent.press(screen.getByRole('button', { name: 'Salvar cliente' }));

      await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());
      expect(mockReplace).not.toHaveBeenCalled();
      expect(screen.getByLabelText('Nome completo *').props.value).toBe('Rede Caida');

      mockBase = API;
      fireEvent.press(screen.getByRole('button', { name: 'Salvar cliente' }));
      await waitFor(() => expect(mockReplace).toHaveBeenCalledTimes(1));
    });

    it('should call tratarSessaoExpirada when the token is rejected on create [crit 23]', async () => {
      tokenAtual = 'token-invalido';
      tela(<NovoClienteScreen />);

      digitar('Nome completo *', 'Sem Sessao');
      digitar('Telefone (opcional)', TEL_B);
      digitar(/^CPF/, CPF_B);
      fireEvent.press(screen.getByRole('button', { name: 'Salvar cliente' }));

      await waitFor(() => expect(tratarSessaoExpirada).toHaveBeenCalledTimes(1));
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  describe('lista, busca e detalhe com dados reais', () => {
    it('should list name and phone without any CPF [crit 1]', async () => {
      tela(<ClientesScreen />);

      expect(await screen.findByText('Teodoro Lemos')).toBeTruthy();
      expect(screen.getByText('(11) 90000-0001')).toBeTruthy();
      expect(screen.queryByText(/^CPF/i)).toBeNull();
      expect(screen.queryByText(/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/)).toBeNull();
      expect(screen.queryByText(/\*\*\*/)).toBeNull();
    });

    it('should show only the phone, not the email, when the client has both (characterization of F-3, card L7)', async () => {
      tela(<ClientesScreen />);

      expect(await screen.findByText('Teodoro Lemos')).toBeTruthy();
      expect(screen.queryByText('teodoro@example.com')).toBeNull();
    });

    it('should issue a single search request per typing pause, not one per key [crit 2]', async () => {
      tela(<ClientesScreen />);
      await screen.findByText('Teodoro Lemos');
      const chamadas = contarChamadas();

      const campo = screen.getByLabelText('Buscar clientes');
      for (const parcial of ['t', 'te', 'teo', 'teod']) {
        fireEvent.changeText(campo, parcial);
      }
      await new Promise((r) => setTimeout(r, SEARCH_DEBOUNCE_MS + 600));

      const comBusca = chamadas.urls.filter((u) => u.includes('q='));
      expect(comBusca).toHaveLength(1);
      expect(comBusca[0]).toContain('q=teod');
      expect(await screen.findByText('Teodoro Lemos')).toBeTruthy();
      chamadas.restaurar();
    });

    it('should show "no result" distinct from the empty state, with a clear action [crit 19]', async () => {
      tela(<ClientesScreen />);
      await screen.findByText('Teodoro Lemos');

      fireEvent.changeText(screen.getByLabelText('Buscar clientes'), 'zzzzqq');

      expect(await screen.findByText('Nenhum resultado', {}, { timeout: 4000 })).toBeTruthy();
      expect(screen.queryByText('Nenhum cliente cadastrado')).toBeNull();
      fireEvent.press(screen.getByRole('button', { name: 'Limpar busca' }));
      expect(await screen.findByText('Teodoro Lemos')).toBeTruthy();
    });

    it('should show a connection error with retry that reloads when the backend is down [crit 5]', async () => {
      mockBase = URL_FORA_DO_AR;
      tela(<ClientesScreen />);

      const tentar = await screen.findByRole('button', { name: 'Tentar novamente' });
      mockBase = API;
      fireEvent.press(tentar);

      expect(await screen.findByText('Teodoro Lemos')).toBeTruthy();
    });

    it('should show the client detail with masked CPF, full phone, email, address and vehicles [crit 6, 29, 30]', async () => {
      const id = await idDoClientePorNome('Teodoro Lemos');
      const novo = await api('POST', `/clientes/${id}/veiculos`, {
        placa: 'RTK4M81',
        marca: 'Honda',
        modelo: 'Civic',
        ano: 2020,
        cor: 'Prata',
      });
      expect(novo.status).toBe(201);
      mockParams = { clienteId: String(id) };

      tela(<ClienteDetalheScreen />);

      expect(screen.getByRole('progressbar', { name: 'Carregando cliente…' })).toBeTruthy();
      expect((await screen.findAllByText('Teodoro Lemos')).length).toBeGreaterThan(0);
      expect(screen.getByText('***.*33.4**-**')).toBeTruthy();
      expect(screen.queryByText(CPF_A)).toBeNull();
      expect(screen.getByLabelText(/parcialmente oculto/)).toBeTruthy();
      expect(screen.getByText('(11) 90000-0001')).toBeTruthy();
      expect(screen.getByText('teodoro@example.com')).toBeTruthy();
      expect(screen.getByText('Rua das Flores, 10, Centro')).toBeTruthy();
      expect(await screen.findByText('RTK4M81')).toBeTruthy();
      expect(screen.getByText(/Honda/)).toBeTruthy();
    });

    it('should show "Não informado" for missing email and address and never "null" [crit 27]', async () => {
      const id = await idDoClientePorNome('Cliente Sem Contato');
      mockParams = { clienteId: String(id) };

      tela(<ClienteDetalheScreen />);

      expect((await screen.findAllByText('Cliente Sem Contato')).length).toBeGreaterThan(0);
      expect(screen.getAllByText('Não informado').length).toBeGreaterThanOrEqual(2);
      expect(screen.queryByText(/null/i)).toBeNull();
    });

    it('should show "Não informado" when the stored CPF is null [crit 28]', async () => {
      const id = await idDoClientePorNome('Cliente Sem Cpf');
      mockParams = { clienteId: String(id) };

      tela(<ClienteDetalheScreen />);

      expect((await screen.findAllByText('Cliente Sem Cpf')).length).toBeGreaterThan(0);
      expect(screen.getAllByText('Não informado').length).toBeGreaterThanOrEqual(1);
    });

    it('should show the no-vehicle message with the register action for a client without vehicles [crit 20]', async () => {
      const id = await idDoClientePorNome('Cliente Sem Contato');
      mockParams = { clienteId: String(id) };

      tela(<ClienteDetalheScreen />);

      expect(await screen.findByText('Nenhum veículo cadastrado')).toBeTruthy();
      fireEvent.press(screen.getByRole('button', { name: /Veículo/ }));
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it('should show "not found" without retry and with a way back when the client does not exist [crit 21]', async () => {
      mockParams = { clienteId: '999999' };

      tela(<ClienteDetalheScreen />);

      expect(await screen.findByText('Cliente não encontrado')).toBeTruthy();
      expect(screen.queryByRole('button', { name: 'Tentar novamente' })).toBeNull();
      expect(
        screen.getAllByRole('button', { name: 'Voltar para clientes' }).length,
      ).toBeGreaterThan(0);
    });

    it('should show an announced connection error with retry on the client detail [crit 18]', async () => {
      const id = await idDoClientePorNome('Teodoro Lemos');
      mockParams = { clienteId: String(id) };
      mockBase = URL_FORA_DO_AR;

      tela(<ClienteDetalheScreen />);

      const tentar = await screen.findByRole('button', { name: 'Tentar novamente' });
      mockBase = API;
      fireEvent.press(tentar);
      expect((await screen.findAllByText('Teodoro Lemos')).length).toBeGreaterThan(0);
    });

    it('should call tratarSessaoExpirada on 401 in the list [crit 23]', async () => {
      tokenAtual = 'token-invalido';
      tela(<ClientesScreen />);
      await waitFor(() => expect(tratarSessaoExpirada).toHaveBeenCalled());
    });

    it('should call tratarSessaoExpirada on 401 in the client detail [crit 23]', async () => {
      const id = await idDoClientePorNome('Teodoro Lemos');
      mockParams = { clienteId: String(id) };
      tokenAtual = 'token-invalido';

      tela(<ClienteDetalheScreen />);

      await waitFor(() => expect(tratarSessaoExpirada).toHaveBeenCalled());
      expect(screen.queryByText('Teodoro Lemos')).toBeNull();
    });
  });

  describe('editar cliente', () => {
    it('should update the client through PUT and navigate with the edited notice [crit 9]', async () => {
      const id = await idDoClientePorNome('Teodoro Lemos');
      mockParams = { clienteId: String(id) };
      tela(<EditarClienteScreen />);

      await waitFor(() =>
        expect(screen.getByLabelText('Nome completo *').props.value).toBe('Teodoro Lemos'),
      );
      digitar('Nome completo *', 'Teodoro Lemos Junior');
      fireEvent.press(screen.getByRole('button', { name: 'Salvar alterações' }));

      await waitFor(() => expect(mockDismissTo).toHaveBeenCalledTimes(1));
      const lido = await api('GET', `/clientes/${id}`);
      expect((lido.json as { nome: string }).nome).toBe('Teodoro Lemos Junior');
    });

    it('should show the duplicate CPF error from the API on edit and keep typed data [crit 22]', async () => {
      const id = await idDoClientePorNome('Teodoro Lemos Junior');
      mockParams = { clienteId: String(id) };
      tela(<EditarClienteScreen />);

      await waitFor(() =>
        expect(screen.getByLabelText('Nome completo *').props.value).toBe('Teodoro Lemos Junior'),
      );
      digitar(/^CPF/, '52998224725'); // CPF da fixture "Cliente Sem Contato"
      fireEvent.press(screen.getByRole('button', { name: 'Salvar alterações' }));

      expect(await screen.findByText('Já existe um cliente com este CPF.')).toBeTruthy();
      expect(mockDismissTo).not.toHaveBeenCalled();
    });

    it('should show "not found" when editing a client the API reports as 404 [crit 21]', async () => {
      mockParams = { clienteId: '999999' };
      tela(<EditarClienteScreen />);
      expect(await screen.findByText('Cliente não encontrado')).toBeTruthy();
    });
  });

  describe('veículos', () => {
    it('should create a vehicle for the client and show the API required-year error when the year is empty [F-2]', async () => {
      const id = await idDoClientePorNome('Teodoro Lemos Junior');
      mockParams = { clienteId: String(id) };
      tela(<NovoVeiculoScreen />);

      await screen.findByLabelText(/^Placa/);
      digitar(/^Placa/, 'ABC1D23');
      digitar(/^Marca/, 'Fiat');
      digitar(/^Modelo/, 'Uno');
      fireEvent.press(screen.getByRole('button', { name: 'Salvar veículo' }));

      await waitFor(() => expect(screen.queryByText('Salvando…')).toBeNull(), { timeout: 5000 });
      expect(mockReplace).not.toHaveBeenCalled();
      expect(mockDismissTo).not.toHaveBeenCalled();
      // Caracterização: o rótulo diz "(opcional)", mas a API exige o ano; o 400 vem com `chave: null`
      // e o app mostra só o texto genérico, sem dizer que o ano é obrigatório.
      expect(screen.getByText('Ano (opcional)')).toBeTruthy();
      expect(screen.getByText('Corrija o campo destacado para salvar.')).toBeTruthy();
      expect(screen.getByText('Confira este campo.')).toBeTruthy();
    });

    it('should create a vehicle with valid plate and year and navigate back to the client [crit 10]', async () => {
      const id = await idDoClientePorNome('Teodoro Lemos Junior');
      mockParams = { clienteId: String(id) };
      tela(<NovoVeiculoScreen />);

      await screen.findByLabelText(/^Placa/);
      digitar(/^Placa/, 'abc1d23');
      digitar(/^Marca/, 'Fiat');
      digitar(/^Modelo/, 'Uno');
      digitar(/^Ano/, '2018');
      digitar(/^Cor/, 'Branco');
      fireEvent.press(screen.getByRole('button', { name: 'Salvar veículo' }));

      await waitFor(() => expect(mockDismissTo).toHaveBeenCalledTimes(1));
      const lista = await api('GET', `/clientes/${id}/veiculos`);
      expect((lista.json as { placa: string }[]).map((v) => v.placa)).toContain('ABC1D23');
    });

    it('should refuse an invalid plate before calling the API [crit 17]', async () => {
      const id = await idDoClientePorNome('Teodoro Lemos Junior');
      mockParams = { clienteId: String(id) };
      const chamadas = contarChamadas();
      tela(<NovoVeiculoScreen />);

      await screen.findByLabelText(/^Placa/);
      digitar(/^Placa/, 'XX');
      digitar(/^Marca/, 'Fiat');
      digitar(/^Modelo/, 'Uno');
      digitar(/^Ano/, '2018');
      fireEvent.press(screen.getByRole('button', { name: 'Salvar veículo' }));

      expect(screen.getByText('Placa inválida. Use ABC1D23 ou ABC1234.')).toBeTruthy();
      expect(chamadas.urls.filter((u) => u.startsWith('POST'))).toHaveLength(0);
      chamadas.restaurar();
    });

    it('should show the API duplicate plate error at the plate field and not navigate [crit 17]', async () => {
      const id = await idDoClientePorNome('Cliente Sem Contato');
      mockParams = { clienteId: String(id) };
      tela(<NovoVeiculoScreen />);

      await screen.findByLabelText(/^Placa/);
      digitar(/^Placa/, 'ABC1D23');
      digitar(/^Marca/, 'Fiat');
      digitar(/^Modelo/, 'Uno');
      digitar(/^Ano/, '2018');
      fireEvent.press(screen.getByRole('button', { name: 'Salvar veículo' }));

      expect(await screen.findByText('Esta placa já está cadastrada.')).toBeTruthy();
      expect(mockDismissTo).not.toHaveBeenCalled();
      expect(mockReplace).not.toHaveBeenCalled();
      expect(screen.getByLabelText(/^Modelo/).props.value).toBe('Uno');
    });

    it('should keep typed vehicle data and allow retry when the backend is down [crit 18]', async () => {
      const id = await idDoClientePorNome('Cliente Sem Contato');
      mockParams = { clienteId: String(id) };
      tela(<NovoVeiculoScreen />);
      await screen.findByLabelText(/^Placa/);
      mockBase = URL_FORA_DO_AR;

      digitar(/^Placa/, 'QWE1R23');
      digitar(/^Marca/, 'VW');
      digitar(/^Modelo/, 'Gol');
      digitar(/^Ano/, '2015');
      fireEvent.press(screen.getByRole('button', { name: 'Salvar veículo' }));

      await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());
      expect(screen.getByLabelText(/^Modelo/).props.value).toBe('Gol');
      mockBase = API;
      fireEvent.press(screen.getByRole('button', { name: 'Salvar veículo' }));
      await waitFor(() => expect(mockDismissTo).toHaveBeenCalledTimes(1));
    });

    it('should show the vehicle detail with an empty history message by default [crit 13]', async () => {
      const id = await idDoClientePorNome('Teodoro Lemos Junior');
      const lista = (await api('GET', `/clientes/${id}/veiculos`)).json as {
        id: number;
        placa: string;
      }[];
      const veiculo = lista.find((v) => v.placa === 'RTK4M81');
      mockParams = { veiculoId: String(veiculo?.id) };

      tela(<VeiculoDetalheScreen />);

      expect((await screen.findAllByText('RTK4M81')).length).toBeGreaterThan(0);
      expect(await screen.findByText('Nenhuma OS neste veículo')).toBeTruthy();
    });

    it('should update the vehicle through PUT and show it changed on the detail [crit 11]', async () => {
      const id = await idDoClientePorNome('Teodoro Lemos Junior');
      const lista = (await api('GET', `/clientes/${id}/veiculos`)).json as {
        id: number;
        placa: string;
      }[];
      const veiculo = lista.find((v) => v.placa === 'RTK4M81');
      mockParams = { veiculoId: String(veiculo?.id) };
      tela(<EditarVeiculoScreen />);

      await waitFor(() => expect(screen.getByLabelText(/^Modelo/).props.value).toBe('Civic'));
      digitar(/^Modelo/, 'Civic EXL');
      fireEvent.press(screen.getByRole('button', { name: 'Salvar alterações' }));

      await waitFor(() => expect(mockDismissTo).toHaveBeenCalledTimes(1));
      const lido = await api('GET', `/veiculos/${veiculo?.id}`);
      expect((lido.json as { modelo: string }).modelo).toBe('Civic EXL');
    });

    it('should show "not found" for a vehicle the API reports as 404 [crit 21]', async () => {
      mockParams = { veiculoId: '999999' };

      tela(<VeiculoDetalheScreen />);

      expect(await screen.findByText('Veículo não encontrado')).toBeTruthy();
      expect(screen.queryByRole('button', { name: 'Tentar novamente' })).toBeNull();
    });

    it('should call tratarSessaoExpirada on 401 in the vehicle detail [crit 23]', async () => {
      mockParams = { veiculoId: '1' };
      tokenAtual = 'token-invalido';

      tela(<VeiculoDetalheScreen />);

      await waitFor(() => expect(tratarSessaoExpirada).toHaveBeenCalled());
    });
  });

  describe('histórico de OS com linhas reais no banco (rodar após inserir OS via SQL)', () => {
    it('should show an empty history although the DB has OS rows, because the API does not fill historicoOs yet (characterization of F-4) [crit 12]', async () => {
      const id = await idDoClientePorNome('Cliente Com Os');
      const lista = (await api('GET', `/clientes/${id}/veiculos`)).json as { id: number }[];
      const bruto = await api('GET', `/veiculos/${lista[0]?.id}`);
      expect((bruto.json as { historicoOs: unknown[] }).historicoOs).toEqual([]);
      mockParams = { veiculoId: String(lista[0]?.id) };

      tela(<VeiculoDetalheScreen />);

      expect(await screen.findByText('Nenhuma OS neste veículo')).toBeTruthy();
    });
  });
});

import { fireEvent } from '@testing-library/react-native';
import { renderRouter, screen, waitFor } from 'expo-router/testing-library';
import * as SecureStore from 'expo-secure-store';

import RootLayout from '../../app/_layout';
import IndexScreen from '../../app/index';
import LoginScreen from '../../app/login';
import PerfilScreen from '../../app/perfil';
import MenuLayout from '../../app/(menu)/_layout';
import InicioScreen from '../../app/(menu)/inicio';

/**
 * Integração real do Expo Router (sem mockar `expo-router`): confirma que a
 * rota `/inicio`, dentro do grupo `(menu)`, é servida pelo layout da tab bar,
 * que o Perfil é uma tela própria fora do grupo (sem tab bar) alcançada pelo
 * botão de usuário do cabeçalho, e que a guarda de sessão cobre as duas rotas.
 * Cobre US-MENU-08 e o grafo pós-login da F41 (US-PAR-03 B e US-PAR-18) ao
 * nível de configuração de rota, não só de unidade com `useRouter` mockado.
 */
const CONTEXTO_APP = {
  _layout: RootLayout,
  index: IndexScreen,
  login: LoginScreen,
  perfil: PerfilScreen,
  '(menu)/_layout': MenuLayout,
  '(menu)/inicio': InicioScreen,
};

const secureStoreMock = SecureStore as unknown as { __limparArmazenamentoDeTeste: () => void };

const USUARIO_FICTICIO = {
  id: 1,
  nome: 'Ana Beatriz Souza',
  email: 'ana.souza@exemplo-ficticio.com.br',
  perfil: 'ADMIN',
};

async function guardarSessao(): Promise<void> {
  await SecureStore.setItemAsync('mecanicaSaoJorge.auth.token', 'token-existente');
  await SecureStore.setItemAsync('mecanicaSaoJorge.auth.usuario', JSON.stringify(USUARIO_FICTICIO));
}

describe('Roteamento real do menu principal (F33 + F41)', () => {
  beforeEach(() => {
    secureStoreMock.__limparArmazenamentoDeTeste();
  });

  it('should land on the start screen with the 4-item tab bar and no selected item when a session exists (US-PAR-18)', async () => {
    await guardarSessao();

    renderRouter(CONTEXTO_APP, { initialUrl: '/' });

    await waitFor(() => expect(screen.getByRole('header', { name: 'Início' })).toBeTruthy());
    expect(screen.getAllByRole('tab')).toHaveLength(4);
    expect(screen.queryByRole('tab', { selected: true })).toBeNull();
    expect(screen.getByRole('button', { name: 'Perfil' })).toBeTruthy();
  });

  it('should open the Perfil without a tab bar from the header user button and come back with the arrow (US-PAR-03 B)', async () => {
    await guardarSessao();
    renderRouter(CONTEXTO_APP, { initialUrl: '/' });
    await waitFor(() => expect(screen.getByRole('header', { name: 'Início' })).toBeTruthy());

    fireEvent.press(screen.getByRole('button', { name: 'Perfil' }));

    await waitFor(() => expect(screen.getByText('Ana Beatriz Souza')).toBeTruthy());
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeTruthy();
    expect(screen.queryAllByRole('tab')).toHaveLength(0);

    fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));

    await waitFor(() => expect(screen.getByRole('header', { name: 'Início' })).toBeTruthy());
    expect(screen.getAllByRole('tab')).toHaveLength(4);
  });

  it('should redirect a deep link straight into /inicio to /login when there is no session (US-MENU-08)', async () => {
    renderRouter(CONTEXTO_APP, { initialUrl: '/inicio' });

    await waitFor(() =>
      expect(screen.getByRole('header', { name: 'MECÂNICA SÃO JORGE' })).toBeTruthy(),
    );
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
  });

  it('should redirect a deep link to /perfil to /login when there is no session (US-MENU-08)', async () => {
    renderRouter(CONTEXTO_APP, { initialUrl: '/perfil' });

    await waitFor(() =>
      expect(screen.getByRole('header', { name: 'MECÂNICA SÃO JORGE' })).toBeTruthy(),
    );
    expect(screen.queryByText('Ana Beatriz Souza')).toBeNull();
  });
});

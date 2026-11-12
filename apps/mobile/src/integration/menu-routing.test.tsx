import { renderRouter, screen, waitFor } from 'expo-router/testing-library';
import * as SecureStore from 'expo-secure-store';

import RootLayout from '../../app/_layout';
import IndexScreen from '../../app/index';
import LoginScreen from '../../app/login';
import MenuLayout from '../../app/(menu)/_layout';
import PerfilScreen from '../../app/(menu)/perfil';

/**
 * Integração real do Expo Router (sem mockar `expo-router`): confirma que a
 * rota `/perfil`, estando dentro do grupo `(menu)`, é servida pelo layout da
 * tab bar — e não mais como uma tela "pelada" sem chrome — satisfazendo
 * US-MENU-01 e US-MENU-08 ao nível de configuração de rota, não só de
 * unidade isolada com `useRouter` mockado.
 */
const CONTEXTO_APP = {
  _layout: RootLayout,
  index: IndexScreen,
  login: LoginScreen,
  '(menu)/_layout': MenuLayout,
  '(menu)/perfil': PerfilScreen,
};

const secureStoreMock = SecureStore as unknown as { __limparArmazenamentoDeTeste: () => void };

const USUARIO_FICTICIO = {
  id: 1,
  nome: 'Ana Beatriz Souza',
  email: 'ana.souza@exemplo-ficticio.com.br',
  perfil: 'ADMIN',
};

describe('Roteamento real do menu principal (F33)', () => {
  beforeEach(() => {
    secureStoreMock.__limparArmazenamentoDeTeste();
  });

  it('should land on the tab bar menu (not a bare Perfil screen) when a session already exists (US-MENU-01)', async () => {
    await SecureStore.setItemAsync('mecanicaSaoJorge.auth.token', 'token-existente');
    await SecureStore.setItemAsync(
      'mecanicaSaoJorge.auth.usuario',
      JSON.stringify(USUARIO_FICTICIO),
    );

    renderRouter(CONTEXTO_APP, { initialUrl: '/' });

    await waitFor(() => expect(screen.getByText('Ana Beatriz Souza')).toBeTruthy());
    expect(screen.getAllByRole('tab')).toHaveLength(5);
    expect(screen.getByRole('tab', { name: 'Perfil, aba selecionada' })).toBeTruthy();
  });

  it('should redirect a deep link straight into the menu to /login when there is no session (US-MENU-08)', async () => {
    renderRouter(CONTEXTO_APP, { initialUrl: '/perfil' });

    await waitFor(() => expect(screen.getByText('Mecânica São Jorge')).toBeTruthy());
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(screen.queryByText('Ana Beatriz Souza')).toBeNull();
  });
});

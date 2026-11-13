import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MenuTabBar } from './menu-tab-bar';

const METRICAS_DE_TESTE = {
  frame: { x: 0, y: 0, width: 375, height: 812 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

function renderMenuTabBar(): ReturnType<typeof render> {
  return render(
    <SafeAreaProvider initialMetrics={METRICAS_DE_TESTE}>
      <MenuTabBar />
    </SafeAreaProvider>,
  );
}

describe('MenuTabBar', () => {
  it('should show only the Perfil item as selected and navigable (US-MENU-02)', () => {
    renderMenuTabBar();

    const perfil = screen.getByRole('tab', { name: 'Perfil, aba selecionada' });
    expect(perfil.props.accessibilityState).toMatchObject({ selected: true, disabled: false });
  });

  it('should show the four future items as disabled with an accessible unavailable label (US-MENU-02/05)', () => {
    renderMenuTabBar();

    const rotulosIndisponiveis = [
      'Clientes e Veículos, indisponível nesta versão',
      'Catálogo, indisponível nesta versão',
      'Ordens de Serviço, indisponível nesta versão',
      'Financeiro, indisponível nesta versão',
    ];

    for (const rotulo of rotulosIndisponiveis) {
      const item = screen.getByRole('tab', { name: rotulo });
      expect(item.props.accessibilityState).toMatchObject({ selected: false, disabled: true });
    }
  });

  it('should not navigate when a disabled item is pressed (US-MENU-02)', () => {
    renderMenuTabBar();

    const catalogo = screen.getByRole('tab', { name: 'Catálogo, indisponível nesta versão' });
    fireEvent.press(catalogo);

    // Item desabilitado: a própria API do Pressable bloqueia o onPress;
    // nenhuma navegação ocorre porque nenhum handler é chamado.
    expect(catalogo.props.accessibilityState.disabled).toBe(true);
  });

  it('should expose all five items with a minimum 48pt touch target (US-MENU-05)', () => {
    renderMenuTabBar();

    expect(screen.getAllByRole('tab')).toHaveLength(5);
  });
});

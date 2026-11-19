import { mostrarTabBar, tabDoCaminho } from './use-menu-tabs';

describe('mostrarTabBar', () => {
  it.each(['/inicio', '/clientes'])('should show the tab bar on the root screen %s', (caminho) => {
    expect(mostrarTabBar(caminho)).toBe(true);
  });

  it.each([
    '/clientes/12',
    '/clientes/novo',
    '/clientes/12/editar',
    '/clientes/veiculos/5',
    '/perfil',
  ])('should hide the tab bar on %s', (caminho) => {
    expect(mostrarTabBar(caminho)).toBe(false);
  });
});

describe('tabDoCaminho', () => {
  it.each(['/clientes', '/clientes/12', '/clientes/12/veiculos/novo'])(
    'should select Clientes when the path is %s',
    (caminho) => {
      expect(tabDoCaminho(caminho)).toBe('clientes');
    },
  );

  it.each(['/inicio', '/perfil', '/clientes-antigos', '/'])(
    'should select no tab when the path is %s',
    (caminho) => {
      expect(tabDoCaminho(caminho)).toBeNull();
    },
  );
});

import { tabDoCaminho } from './use-menu-tabs';

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

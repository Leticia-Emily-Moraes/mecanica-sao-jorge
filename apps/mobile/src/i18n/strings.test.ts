import { t } from './strings';

describe('strings', () => {
  it('should write the loading label of the login button with one ellipsis character (L2, R-1)', () => {
    expect(t('login.botaoEntrar.carregando')).toBe('Entrando…');
  });

  it('should write the session loading label with one ellipsis character (P1)', () => {
    expect(t('sessao.inicializando.rotulo')).toBe('Carregando sessão…');
  });

  it('should replace the placeholders with the given parameters', () => {
    expect(t('clientes.detalhe.veiculos.titulo', { quantidade: 3 })).toBe('Veículos (3)');
  });

  it('should leave the placeholder untouched when the parameter is missing', () => {
    expect(t('clientes.detalhe.veiculos.titulo', {})).toBe('Veículos ({quantidade})');
  });

  it('should return the text unchanged when it has no placeholder', () => {
    expect(t('clientes.lista.titulo', { quantidade: 3 })).toBe(t('clientes.lista.titulo'));
  });
});

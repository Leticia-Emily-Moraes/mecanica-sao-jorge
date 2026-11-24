import { t } from './strings';

describe('strings', () => {
  it('should write the loading label of the login button with one ellipsis character (L2, R-1)', () => {
    expect(t('login.botaoEntrar.carregando')).toBe('Entrando…');
  });

  it('should write the session loading label with one ellipsis character (P1)', () => {
    expect(t('sessao.inicializando.rotulo')).toBe('Carregando sessão…');
  });
});

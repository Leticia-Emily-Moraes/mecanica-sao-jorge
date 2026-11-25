import {
  limparNomeSugerido,
  lerNomeSugerido,
  nomeSugeridoDoTermo,
  sugerirNomeParaNovoCliente,
} from './new-client-name';

describe('nomeSugeridoDoTermo', () => {
  it('should return the trimmed term when it is text', () => {
    expect(nomeSugeridoDoTermo('  Lauro Teste ')).toBe('Lauro Teste');
  });

  it.each([['11900000001'], ['(11) 90000-0001'], ['+55 11 90000-0001']])(
    'should return empty when the term looks like a phone: %s',
    (termo) => {
      expect(nomeSugeridoDoTermo(termo)).toBe('');
    },
  );

  it('should return empty when the term has an at sign', () => {
    expect(nomeSugeridoDoTermo('lauro@example.com')).toBe('');
  });

  it('should return empty for a blank term', () => {
    expect(nomeSugeridoDoTermo('   ')).toBe('');
  });

  it('should keep a name that has digits among letters', () => {
    expect(nomeSugeridoDoTermo('Lauro 2')).toBe('Lauro 2');
  });

  it('should cut the term at 100 characters', () => {
    expect(nomeSugeridoDoTermo('a'.repeat(150))).toHaveLength(100);
  });
});

describe('suggested name hand-off', () => {
  afterEach(() => {
    limparNomeSugerido();
  });

  it('should hold the suggested name until it is cleared', () => {
    sugerirNomeParaNovoCliente('Lauro');

    expect(lerNomeSugerido()).toBe('Lauro');
    expect(lerNomeSugerido()).toBe('Lauro');

    limparNomeSugerido();

    expect(lerNomeSugerido()).toBe('');
  });

  it('should hold nothing when the term is not a name', () => {
    sugerirNomeParaNovoCliente('11900000001');

    expect(lerNomeSugerido()).toBe('');
  });
});

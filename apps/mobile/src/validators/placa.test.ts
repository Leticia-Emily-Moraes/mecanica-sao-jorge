import { isPlacaValida, normalizarPlaca } from './placa';

describe('normalizarPlaca', () => {
  it('should upper-case the letters and drop hyphens and spaces', () => {
    expect(normalizarPlaca('abc-1d23')).toBe('ABC1D23');
    expect(normalizarPlaca(' rtk 4m81 ')).toBe('RTK4M81');
  });

  it('should cut the text at seven characters', () => {
    expect(normalizarPlaca('ABC1D234567')).toBe('ABC1D23');
  });

  it('should return an empty text when there is no letter or digit', () => {
    expect(normalizarPlaca('--- ')).toBe('');
  });
});

describe('isPlacaValida', () => {
  it.each(['ABC1234', 'RTK4M81', 'abc1d23', 'ABC-1234'])(
    'should accept %s as an old or Mercosul plate',
    (placa) => {
      expect(isPlacaValida(placa)).toBe(true);
    },
  );

  it.each(['', 'ABC123', 'AB1D234', '1234ABC', 'ABCD123', 'ABC12D3', 'ABC1D2'])(
    'should reject %p',
    (placa) => {
      expect(isPlacaValida(placa)).toBe(false);
    },
  );
});

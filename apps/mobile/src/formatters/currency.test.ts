import { formatarMoeda } from './currency';

describe('formatarMoeda', () => {
  it('should format a value in reais with a comma for cents', () => {
    expect(formatarMoeda(455).replace(/\s/g, ' ')).toBe('R$ 455,00');
  });

  it('should use a dot for thousands', () => {
    expect(formatarMoeda(1234.5).replace(/\s/g, ' ')).toBe('R$ 1.234,50');
  });
});

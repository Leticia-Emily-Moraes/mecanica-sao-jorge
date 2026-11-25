import { formatarCpf } from './cpf-format';

describe('formatarCpf', () => {
  it.each([
    ['', ''],
    ['5', '5'],
    ['529', '529'],
    ['5299', '529.9'],
    ['529982', '529.982'],
    ['5299822', '529.982.2'],
    ['529982247', '529.982.247'],
    ['5299822472', '529.982.247-2'],
    ['52998224725', '529.982.247-25'],
  ])('should format "%s" as "%s"', (entrada, esperado) => {
    expect(formatarCpf(entrada)).toBe(esperado);
  });

  it('should ignore letters and cut at 11 digits', () => {
    expect(formatarCpf('a529.982.247-25999')).toBe('529.982.247-25');
  });

  it('should return empty for text without digits', () => {
    expect(formatarCpf('abc')).toBe('');
  });
});

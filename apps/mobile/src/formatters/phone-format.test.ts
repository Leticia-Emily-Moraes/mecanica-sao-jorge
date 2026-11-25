import { formatarTelefone } from './phone-format';

describe('formatarTelefone', () => {
  it('should format an 11-digit mobile number', () => {
    expect(formatarTelefone('11900000001')).toBe('(11) 90000-0001');
  });

  it('should format a 10-digit landline', () => {
    expect(formatarTelefone('1130000001')).toBe('(11) 3000-0001');
  });

  it('should keep an already formatted number unchanged', () => {
    expect(formatarTelefone('(11) 90000-0001')).toBe('(11) 90000-0001');
  });

  it('should format partial input while typing', () => {
    expect(formatarTelefone('1')).toBe('(1');
    expect(formatarTelefone('11')).toBe('(11');
    expect(formatarTelefone('119')).toBe('(11) 9');
    expect(formatarTelefone('1190000')).toBe('(11) 9000-0');
  });

  it('should return an empty string when there is no digit', () => {
    expect(formatarTelefone('abc')).toBe('');
    expect(formatarTelefone('')).toBe('');
  });

  it('should drop digits beyond the 11th', () => {
    expect(formatarTelefone('1190000000199')).toBe('(11) 90000-0001');
  });
});

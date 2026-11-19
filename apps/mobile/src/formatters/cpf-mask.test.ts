import { digitosVisiveisDoCpf, mascararCpf } from './cpf-mask';

// CPF fictício, só para formato (não pertence a ninguém).
const CPF_FICTICIO = '12345678909';

describe('mascararCpf', () => {
  it('should mask an 11-digit CPF as ***.*56.7**-** (D-C)', () => {
    expect(mascararCpf(CPF_FICTICIO)).toBe('***.*56.7**-**');
  });

  it('should mask a CPF that already has punctuation', () => {
    expect(mascararCpf('123.456.789-09')).toBe('***.*56.7**-**');
  });

  it.each([[null], [undefined], [''], ['   ']])(
    'should return null when the CPF is %p',
    (valor) => {
      expect(mascararCpf(valor)).toBeNull();
    },
  );

  it('should return null when the CPF has fewer than 11 digits and never echo the raw value', () => {
    expect(mascararCpf('1234567890')).toBeNull();
  });

  it('should return null when the CPF has more than 11 digits', () => {
    expect(mascararCpf('123456789012')).toBeNull();
  });

  it('should return null for text without digits', () => {
    expect(mascararCpf('abc.def.ghi-jk')).toBeNull();
  });

  it('should never contain digits other than the three visible ones', () => {
    const mascara = mascararCpf(CPF_FICTICIO) ?? '';

    expect(mascara.replace(/\D/g, '')).toBe('567');
  });
});

describe('digitosVisiveisDoCpf', () => {
  it('should list the three visible digits separated by commas', () => {
    expect(digitosVisiveisDoCpf(CPF_FICTICIO)).toBe('5, 6, 7');
  });

  it('should accept punctuation', () => {
    expect(digitosVisiveisDoCpf('123.456.789-09')).toBe('5, 6, 7');
  });

  it.each([[null], [undefined], [''], ['1234567890'], ['123456789012']])(
    'should return null when the CPF is %p',
    (valor) => {
      expect(digitosVisiveisDoCpf(valor)).toBeNull();
    },
  );

  it('should not contain asterisks, so the screen reader never spells them', () => {
    expect(digitosVisiveisDoCpf(CPF_FICTICIO)).not.toContain('*');
  });
});

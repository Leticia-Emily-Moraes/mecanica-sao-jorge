import { isCpfValido } from './cpf';

describe('isCpfValido', () => {
  it.each(['52998224725', '529.982.247-25', '11144477735'])(
    'should accept the CPF "%s" with correct check digits',
    (cpf) => {
      expect(isCpfValido(cpf)).toBe(true);
    },
  );

  it.each([
    ['wrong first check digit', '52998224715'],
    ['wrong second check digit', '52998224726'],
    ['all digits equal', '11111111111'],
    ['too short', '5299822472'],
    ['too long', '529982247255'],
    ['empty', ''],
    ['letters only', 'abcdefghijk'],
  ])('should reject a CPF with %s', (_descricao, cpf) => {
    expect(isCpfValido(cpf)).toBe(false);
  });
});

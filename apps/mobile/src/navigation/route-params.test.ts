import { lerAviso, lerAvisoId, lerIdDaRota, parametrosDeAviso } from './route-params';

describe('lerIdDaRota', () => {
  it.each([
    ['1', 1],
    ['42', 42],
    ['9007199254740991', 9007199254740991],
  ])('should read "%s" as the id %d', (parametro, esperado) => {
    expect(lerIdDaRota(parametro)).toBe(esperado);
  });

  it.each([
    ['empty text', ''],
    ['zero', '0'],
    ['leading zero', '01'],
    ['negative number', '-3'],
    ['decimal', '1.5'],
    ['letters', 'abc'],
    ['id followed by text', '12abc'],
    ['spaces around', ' 12 '],
    ['sql-like text', '1 OR 1=1'],
    ['path traversal', '../1'],
    ['17 digits', '12345678901234567'],
    ['16 digits above the safe integer', '9999999999999999'],
  ])('should return null when the parameter is %s', (_descricao, parametro) => {
    expect(lerIdDaRota(parametro)).toBeNull();
  });

  it('should return null when the parameter is missing', () => {
    expect(lerIdDaRota(undefined)).toBeNull();
  });

  it('should return null when the parameter is repeated', () => {
    expect(lerIdDaRota(['1', '2'])).toBeNull();
  });
});

describe('lerAviso', () => {
  it.each(['criado', 'editado', 'veiculoCriado'])(
    'should accept the listed notice "%s"',
    (aviso) => {
      expect(lerAviso(aviso)).toBe(aviso);
    },
  );

  it.each(['', 'CRIADO', 'excluido', '<script>', 'criado ', 'Cliente cadastrado.'])(
    'should return null for the unlisted value "%s"',
    (valor) => {
      expect(lerAviso(valor)).toBeNull();
    },
  );

  it('should return null when the parameter is missing or repeated', () => {
    expect(lerAviso(undefined)).toBeNull();
    expect(lerAviso(['criado', 'editado'])).toBeNull();
  });
});

describe('lerAvisoId', () => {
  it('should read a numeric identifier', () => {
    expect(lerAvisoId('1763600000000')).toBe('1763600000000');
  });

  it.each([
    ['empty text', ''],
    ['letters', 'abc'],
    ['digits followed by text', '12a'],
    ['17 digits', '12345678901234567'],
  ])('should return null for %s', (_descricao, parametro) => {
    expect(lerAvisoId(parametro)).toBeNull();
  });

  it('should return null when missing or repeated', () => {
    expect(lerAvisoId(undefined)).toBeNull();
    expect(lerAvisoId(['1', '2'])).toBeNull();
  });
});

describe('parametrosDeAviso', () => {
  it('should carry the fixed notice and a numeric id', () => {
    const parametros = parametrosDeAviso('editado');

    expect(parametros.aviso).toBe('editado');
    expect(lerAvisoId(parametros.avisoId)).toBe(parametros.avisoId);
  });
});

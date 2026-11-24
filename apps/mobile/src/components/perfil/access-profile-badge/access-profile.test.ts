import { describeAccessProfile } from './access-profile';

describe('describeAccessProfile', () => {
  it('should describe ADMIN with the badge and the long text from the Figma', () => {
    expect(describeAccessProfile('ADMIN')).toEqual({
      badge: 'ADMIN',
      description: 'Administrador',
    });
  });

  it('should describe FUNCIONARIO with its own badge and text', () => {
    expect(describeAccessProfile('FUNCIONARIO')).toEqual({
      badge: 'FUNCIONÁRIO',
      description: 'Funcionário',
    });
  });

  it('should show an unknown profile as it came instead of an empty text', () => {
    expect(describeAccessProfile('GERENTE')).toEqual({ badge: 'GERENTE', description: 'GERENTE' });
  });
});

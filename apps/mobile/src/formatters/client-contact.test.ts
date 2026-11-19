import { contatoDoCliente } from './client-contact';

describe('contatoDoCliente', () => {
  it('should prefer the formatted phone when there is one', () => {
    expect(contatoDoCliente({ telefone: '11900000001', email: 'maria@example.com' })).toBe(
      '(11) 90000-0001',
    );
  });

  it('should fall back to the e-mail when there is no phone', () => {
    expect(contatoDoCliente({ telefone: null, email: 'maria@example.com' })).toBe(
      'maria@example.com',
    );
  });

  it('should fall back to the e-mail when the phone has no digit', () => {
    expect(contatoDoCliente({ telefone: '   ', email: 'maria@example.com' })).toBe(
      'maria@example.com',
    );
  });

  it('should return null when there is neither phone nor e-mail', () => {
    expect(contatoDoCliente({ telefone: null, email: null })).toBeNull();
    expect(contatoDoCliente({ telefone: '', email: '  ' })).toBeNull();
  });
});

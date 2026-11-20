import { render, screen, within } from '@testing-library/react-native';

import type { ClienteDetalhe } from '@/services/clients-types';

import { ClientInfoCard } from './client-info-card';

const COMPLETO: ClienteDetalhe = {
  id: 1,
  nome: 'Teodoro Lemos',
  cpf: '12345678900',
  telefone: '11900000001',
  email: 'teodoro@example.com',
  endereco: 'Rua das Flores, 10, Centro, Campinas',
};

const VAZIO: ClienteDetalhe = {
  id: 2,
  nome: 'Iara Montenegro',
  cpf: null,
  telefone: null,
  email: null,
  endereco: null,
};

describe('ClientInfoCard', () => {
  it('should show name, phone, email, masked CPF and address', () => {
    render(<ClientInfoCard cliente={COMPLETO} />);

    expect(screen.getByRole('header', { name: 'Teodoro Lemos' })).toBeTruthy();
    expect(screen.getByText('(11) 90000-0001')).toBeTruthy();
    expect(screen.getByText('teodoro@example.com')).toBeTruthy();
    expect(screen.getByText('***.*56.7**-**')).toBeTruthy();
    expect(screen.getByText('Rua das Flores, 10, Centro, Campinas')).toBeTruthy();
  });

  it('should never render the raw CPF', () => {
    render(<ClientInfoCard cliente={COMPLETO} />);

    expect(screen.queryByText(/12345678900/)).toBeNull();
    expect(screen.queryByText(/123\.456\.789/)).toBeNull();
  });

  it('should read the CPF row as "CPF parcialmente oculto", without asterisks or digits', () => {
    render(<ClientInfoCard cliente={COMPLETO} />);

    const linha = screen.getByLabelText('CPF parcialmente oculto');

    expect(linha.props.accessible).toBe(true);
    expect(screen.queryByLabelText(/\*/)).toBeNull();
    expect(screen.queryByLabelText(/567/)).toBeNull();
  });

  it('should keep the visible "CPF" label next to the masked value in the same row', () => {
    render(<ClientInfoCard cliente={COMPLETO} />);

    const linha = screen.getByLabelText('CPF parcialmente oculto');

    expect(within(linha).getByText('CPF')).toBeTruthy();
    expect(within(linha).getByText('***.*56.7**-**')).toBeTruthy();
  });

  it('should show "Não informado" in every field when the API sends null', () => {
    render(<ClientInfoCard cliente={VAZIO} />);

    expect(screen.getAllByText('Não informado')).toHaveLength(4);
    expect(screen.queryByText(/null/i)).toBeNull();
  });

  it('should show "Não informado" for an empty CPF', () => {
    render(<ClientInfoCard cliente={{ ...COMPLETO, cpf: '' }} />);

    expect(screen.getByLabelText('CPF: Não informado')).toBeTruthy();
  });

  it.each(['123', '123456789001'])(
    'should show "Não informado" and not the raw value for the CPF %s',
    (cpf) => {
      render(<ClientInfoCard cliente={{ ...COMPLETO, cpf }} />);

      expect(screen.getByLabelText('CPF: Não informado')).toBeTruthy();
      expect(screen.queryByText(cpf)).toBeNull();
    },
  );

  it('should treat blank text as missing', () => {
    render(<ClientInfoCard cliente={{ ...COMPLETO, email: '   ', endereco: '' }} />);

    expect(screen.getAllByText('Não informado')).toHaveLength(2);
  });
});

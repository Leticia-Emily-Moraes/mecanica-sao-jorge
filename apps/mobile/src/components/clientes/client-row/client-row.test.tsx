import { fireEvent, render, screen } from '@testing-library/react-native';

import type { ClienteResumo } from '@/services/clients-types';

import { ClientRow } from './client-row';

// Fonte de ícones é a borda externa: o carregamento assíncrono da fonte
// atualiza estado fora do `act` e não faz parte do que se testa aqui.
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

const MARIA: ClienteResumo = {
  id: 7,
  nome: 'Maria Souza',
  telefone: '11900000001',
  email: 'maria@example.com',
};

describe('ClientRow', () => {
  it('should show the name, the formatted phone and the initials', () => {
    render(<ClientRow cliente={MARIA} onPress={jest.fn()} />);

    expect(screen.getByText('Maria Souza')).toBeTruthy();
    expect(screen.getByText('(11) 90000-0001')).toBeTruthy();
    // O avatar é decorativo (escondido do leitor de tela), por isso a busca o inclui.
    expect(screen.getByText('MS', { includeHiddenElements: true })).toBeTruthy();
  });

  it('should name the button after the client and the contact, with the hint', () => {
    render(<ClientRow cliente={MARIA} onPress={jest.fn()} />);

    const button = screen.getByRole('button', { name: 'Maria Souza, (11) 90000-0001' });

    expect(button.props.accessibilityHint).toBe('Abre os dados do cliente');
  });

  it('should show one contact line only: the phone, not the e-mail, when both exist (L1/L7)', () => {
    render(<ClientRow cliente={MARIA} onPress={jest.fn()} />);

    expect(screen.getByText('(11) 90000-0001')).toBeTruthy();
    expect(screen.queryByText('maria@example.com')).toBeNull();
  });

  it('should show the e-mail when there is no phone', () => {
    render(<ClientRow cliente={{ ...MARIA, telefone: null }} onPress={jest.fn()} />);

    expect(screen.getByText('maria@example.com')).toBeTruthy();
  });

  it('should say there is no contact when neither phone nor e-mail exist', () => {
    render(<ClientRow cliente={{ ...MARIA, telefone: null, email: null }} onPress={jest.fn()} />);

    expect(screen.getByText('Sem contato cadastrado')).toBeTruthy();
  });

  it('should call onPress with the client id only', () => {
    const onPress = jest.fn();
    render(<ClientRow cliente={MARIA} onPress={onPress} />);

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledWith(7);
  });
});

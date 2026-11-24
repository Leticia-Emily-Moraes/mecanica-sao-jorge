import { fireEvent, render, screen } from '@testing-library/react-native';

import { NotFoundState } from './not-found-state';

// Fonte de ícones é a borda externa: o carregamento assíncrono da fonte
// atualiza estado fora do `act` e não faz parte do que se testa aqui.
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

describe('NotFoundState', () => {
  const props = {
    title: 'Cliente não encontrado',
    message: 'Este cliente não existe mais ou o endereço está incorreto.',
    actionLabel: 'Voltar para clientes',
  };

  it('should show the title as a header and the message', () => {
    render(<NotFoundState {...props} onAction={jest.fn()} />);

    expect(screen.getByRole('header', { name: 'Cliente não encontrado' })).toBeTruthy();
    expect(screen.getByText(props.message)).toBeTruthy();
  });

  it('should offer only the back action, never a retry', () => {
    render(<NotFoundState {...props} onAction={jest.fn()} />);

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Voltar para clientes' })).toBeTruthy();
  });

  it('should call onAction when the back button is pressed', () => {
    const onAction = jest.fn();
    render(<NotFoundState {...props} onAction={onAction} />);

    fireEvent.press(screen.getByRole('button', { name: 'Voltar para clientes' }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('should hide the decorative icon from the screen reader', () => {
    render(<NotFoundState {...props} onAction={jest.fn()} />);

    expect(screen.UNSAFE_getByProps({ accessibilityElementsHidden: true })).toBeTruthy();
  });
});

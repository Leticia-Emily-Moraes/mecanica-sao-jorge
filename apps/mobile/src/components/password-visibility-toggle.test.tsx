import { Ionicons } from '@expo/vector-icons';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { PasswordVisibilityToggle } from './password-visibility-toggle';

describe('PasswordVisibilityToggle', () => {
  it('should show "Mostrar senha" when the password is hidden (US-PWD-01)', () => {
    render(<PasswordVisibilityToggle visible={false} onToggle={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Mostrar senha' })).toBeTruthy();
  });

  it('should show "Ocultar senha" when the password is visible (US-PWD-02)', () => {
    render(<PasswordVisibilityToggle visible onToggle={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Ocultar senha' })).toBeTruthy();
  });

  it('should draw the closed-eye glyph when the password is hidden (US-PWD-01)', () => {
    render(<PasswordVisibilityToggle visible={false} onToggle={jest.fn()} />);

    expect(screen.UNSAFE_getByType(Ionicons).props.name).toBe('eye-off-outline');
  });

  it('should draw the open-eye glyph when the password is visible (US-PWD-02)', () => {
    render(<PasswordVisibilityToggle visible onToggle={jest.fn()} />);

    expect(screen.UNSAFE_getByType(Ionicons).props.name).toBe('eye-outline');
  });

  it('should call onToggle when pressed (US-PWD-02/03)', () => {
    const onToggle = jest.fn();
    render(<PasswordVisibilityToggle visible={false} onToggle={onToggle} />);

    fireEvent.press(screen.getByRole('button', { name: 'Mostrar senha' }));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('should expose the disabled accessibility state when disabled', () => {
    render(<PasswordVisibilityToggle visible={false} onToggle={jest.fn()} disabled />);

    const botao = screen.getByRole('button', { name: 'Mostrar senha' });
    expect(botao.props.accessibilityState).toMatchObject({ disabled: true });
  });
});

import { fireEvent, render, screen } from '@testing-library/react-native';
import { createRef } from 'react';
import { StyleSheet, Text, type TextInput, type ViewStyle } from 'react-native';

import { hasFocusRing } from '@/test-utils/has-focus-ring';
import { borderWidth, color } from '@/theme/tokens';

import { TextField } from './text-field';

function rowStyle(): ViewStyle {
  return StyleSheet.flatten(screen.getByTestId('text-field-row').props.style as ViewStyle);
}

describe('TextField', () => {
  it('should show the visible label and use it as the accessible name when there is no error', () => {
    render(<TextField label="E-mail" value="" onChangeText={jest.fn()} />);

    expect(screen.getByText('E-mail')).toBeTruthy();
    expect(screen.getByLabelText('E-mail')).toBeTruthy();
  });

  it('should include the error in the accessible name when errorMessage is set', () => {
    render(
      <TextField
        label="E-mail"
        value=""
        onChangeText={jest.fn()}
        errorMessage="Informe seu e-mail"
      />,
    );

    expect(screen.getByLabelText('E-mail, Informe seu e-mail')).toBeTruthy();
  });

  it('should announce the error as an alert with text, never only color', () => {
    render(
      <TextField
        label="E-mail"
        value=""
        onChangeText={jest.fn()}
        errorMessage="Informe seu e-mail"
      />,
    );

    const alert = screen.getByRole('alert');

    expect(screen.getByText('Informe seu e-mail')).toBe(alert);
    expect(alert.props.accessibilityLiveRegion).toBe('polite');
  });

  it('should not render the alert when there is no error', () => {
    render(<TextField label="E-mail" value="" onChangeText={jest.fn()} />);

    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('should prefer an explicit accessibilityLabel for the input', () => {
    render(
      <TextField
        label="E-mail"
        accessibilityLabel="Endereço de e-mail"
        value=""
        onChangeText={jest.fn()}
      />,
    );

    expect(screen.getByLabelText('Endereço de e-mail')).toBeTruthy();
  });

  it('should call onChangeText with the typed value', () => {
    const onChangeText = jest.fn();
    render(<TextField label="E-mail" value="" onChangeText={onChangeText} />);

    fireEvent.changeText(screen.getByLabelText('E-mail'), 'ana@exemplo-ficticio.com.br');

    expect(onChangeText).toHaveBeenCalledWith('ana@exemplo-ficticio.com.br');
  });

  it('should report disabled and block editing when editable is false', () => {
    render(<TextField label="E-mail" value="" onChangeText={jest.fn()} editable={false} />);

    const input = screen.getByLabelText('E-mail');

    expect(input.props.editable).toBe(false);
    expect(input.props.accessibilityState).toEqual({ disabled: true });
  });

  it('should forward the ref to the underlying TextInput', () => {
    const ref = createRef<TextInput>();
    render(<TextField ref={ref} label="E-mail" value="" onChangeText={jest.fn()} />);

    expect(ref.current).not.toBeNull();
  });

  it('should render the right accessory next to the input', () => {
    render(
      <TextField
        label="Senha"
        value=""
        onChangeText={jest.fn()}
        rightAccessory={<Text>acessório</Text>}
      />,
    );

    expect(screen.getByText('acessório')).toBeTruthy();
  });

  it('should hide the typed text when secureTextEntry is set', () => {
    render(<TextField label="Senha" value="" onChangeText={jest.fn()} secureTextEntry />);

    expect(screen.getByLabelText('Senha').props.secureTextEntry).toBe(true);
  });

  it('should show the placeholder in the placeholder color token', () => {
    render(
      <TextField label="E-mail" value="" onChangeText={jest.fn()} placeholder="seu@email.com" />,
    );

    const input = screen.getByLabelText('E-mail');

    expect(input.props.placeholder).toBe('seu@email.com');
    expect(input.props.placeholderTextColor).toBe(color.text.placeholder);
  });

  it('should draw the field border in the error color when there is an error', () => {
    render(<TextField label="E-mail" value="" onChangeText={jest.fn()} errorMessage="Informe" />);

    expect(rowStyle()).toMatchObject({
      borderColor: color.text.error,
      borderWidth: borderWidth.emphasis,
    });
  });

  it('should keep the default border when there is no error', () => {
    render(<TextField label="E-mail" value="" onChangeText={jest.fn()} />);

    expect(rowStyle()).toMatchObject({
      borderColor: color.border.default,
      borderWidth: borderWidth.field,
    });
  });

  it('should use the skeleton border and fill when the field is disabled', () => {
    render(<TextField label="E-mail" value="" onChangeText={jest.fn()} editable={false} />);

    expect(rowStyle()).toMatchObject({
      borderColor: color.border.skeleton,
      backgroundColor: color.surface.skeleton,
    });
  });

  it('should draw the focus ring only while the input is focused', () => {
    render(<TextField label="E-mail" value="" onChangeText={jest.fn()} />);
    const input = screen.getByLabelText('E-mail');

    expect(hasFocusRing(input)).toBe(false);

    fireEvent(input, 'focus');
    expect(hasFocusRing(screen.getByLabelText('E-mail'))).toBe(true);

    fireEvent(input, 'blur');
    expect(hasFocusRing(screen.getByLabelText('E-mail'))).toBe(false);
  });
});

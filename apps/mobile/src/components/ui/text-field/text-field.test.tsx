import { fireEvent, render, screen } from '@testing-library/react-native';
import { createRef } from 'react';
import { StyleSheet, Text, type TextInput } from 'react-native';

import { findFixedWidths } from '@/test-utils/find-fixed-widths';
import type { TestStyle } from '@/test-utils/flat-style';
import { borderWidth, color } from '@/theme/tokens';

import { TextField } from './text-field';

type TestNode = ReturnType<typeof screen.getByLabelText>;

/** Sobe a árvore a partir do campo e devolve a borda da caixa (a que tem `borderWidth`). */
function fieldBorder(node: TestNode): { width?: number; color?: string } {
  let current: TestNode | null = node;
  while (current) {
    const style = StyleSheet.flatten(current.props.style as TestStyle) as
      { borderWidth?: number; borderColor?: string } | undefined;
    if (style?.borderWidth !== undefined) {
      return { width: style.borderWidth, color: style.borderColor };
    }
    current = current.parent;
  }
  return {};
}

describe('TextField', () => {
  it('should show the visible label and use it as the accessible name when there is no error', () => {
    render(<TextField label="Usuário" value="" onChangeText={jest.fn()} />);

    expect(screen.getByText('Usuário')).toBeTruthy();
    expect(screen.getByLabelText('Usuário')).toBeTruthy();
  });

  it('should include the error in the accessible name when errorMessage is set', () => {
    render(
      <TextField
        label="Usuário"
        value=""
        onChangeText={jest.fn()}
        errorMessage="Informe seu usuário"
      />,
    );

    expect(screen.getByLabelText('Usuário, Informe seu usuário')).toBeTruthy();
  });

  it('should announce the error as an alert with text, never only color', () => {
    render(
      <TextField
        label="Usuário"
        value=""
        onChangeText={jest.fn()}
        errorMessage="Informe seu usuário"
      />,
    );

    const alert = screen.getByRole('alert');

    expect(screen.getByText('Informe seu usuário')).toBe(alert);
    expect(alert.props.accessibilityLiveRegion).toBe('polite');
  });

  it('should not render the alert when there is no error', () => {
    render(<TextField label="Usuário" value="" onChangeText={jest.fn()} />);

    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('should prefer an explicit accessibilityLabel for the input', () => {
    render(
      <TextField
        label="Usuário"
        accessibilityLabel="Endereço de e-mail"
        value=""
        onChangeText={jest.fn()}
      />,
    );

    expect(screen.getByLabelText('Endereço de e-mail')).toBeTruthy();
  });

  it('should call onChangeText with the typed value', () => {
    const onChangeText = jest.fn();
    render(<TextField label="Usuário" value="" onChangeText={onChangeText} />);

    fireEvent.changeText(screen.getByLabelText('Usuário'), 'ana@exemplo-ficticio.com.br');

    expect(onChangeText).toHaveBeenCalledWith('ana@exemplo-ficticio.com.br');
  });

  it('should report disabled and block editing when editable is false', () => {
    render(<TextField label="Usuário" value="" onChangeText={jest.fn()} editable={false} />);

    const input = screen.getByLabelText('Usuário');

    expect(input.props.editable).toBe(false);
    expect(input.props.accessibilityState).toEqual({ disabled: true });
  });

  it('should fill the box with the skeleton gray #F1F5F9 and keep the resting border when editable is false (R-15)', () => {
    render(<TextField label="Usuário" value="" onChangeText={jest.fn()} editable={false} />);

    expect(
      StyleSheet.flatten(screen.getByTestId('text-field-box').props.style as TestStyle),
    ).toMatchObject({
      backgroundColor: '#F1F5F9',
      borderWidth: borderWidth.hairline,
      borderColor: '#8C8780',
    });
  });

  it('should keep the white fill when the field is editable', () => {
    render(<TextField label="Usuário" value="" onChangeText={jest.fn()} />);

    expect(
      StyleSheet.flatten(screen.getByTestId('text-field-box').props.style as TestStyle),
    ).toMatchObject({ backgroundColor: '#FFFFFF' });
  });

  it('should forward the ref to the underlying TextInput', () => {
    const ref = createRef<TextInput>();
    render(<TextField ref={ref} label="Usuário" value="" onChangeText={jest.fn()} />);

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

  it('should show the placeholder with the AA-safe placeholder color', () => {
    render(
      <TextField label="Usuário" value="" placeholder="Seu usuário" onChangeText={jest.fn()} />,
    );

    const input = screen.getByLabelText('Usuário');

    expect(input.props.placeholder).toBe('Seu usuário');
    expect(input.props.placeholderTextColor).toBe(color.text.placeholder);
  });

  it('should give the visible box 46 of height and a touch area of at least 48 by hitSlop', () => {
    render(<TextField label="Usuário" value="" onChangeText={jest.fn()} />);

    const input = screen.getByLabelText('Usuário');

    expect(
      StyleSheet.flatten(screen.getByTestId('text-field-box').props.style as TestStyle),
    ).toMatchObject({ height: 46 });
    expect(input.props.hitSlop).toEqual({ top: 1, bottom: 1 });
  });

  it('should use a 1 px border at rest and a 2 px Crail border while focused', () => {
    render(<TextField label="Usuário" value="" onChangeText={jest.fn()} />);
    const input = screen.getByLabelText('Usuário');

    expect(fieldBorder(input)).toEqual({
      width: borderWidth.hairline,
      color: color.border.default,
    });

    fireEvent(input, 'focus');
    expect(fieldBorder(screen.getByLabelText('Usuário'))).toEqual({
      width: borderWidth.field,
      color: color.border.focusField,
    });

    fireEvent(input, 'blur');
    expect(fieldBorder(screen.getByLabelText('Usuário')).width).toBe(borderWidth.hairline);
  });

  it('should draw the resting border in the approved #8C8780 (3,56:1 on white)', () => {
    render(<TextField label="Usuário" value="" onChangeText={jest.fn()} />);

    expect(fieldBorder(screen.getByLabelText('Usuário')).color).toBe('#8C8780');
  });

  it('should draw the label in Inter Medium 13 Flint, 6 above the box (V-L06)', () => {
    render(<TextField label="Usuário" value="" onChangeText={jest.fn()} />);

    expect(StyleSheet.flatten(screen.getByText('Usuário').props.style as TestStyle)).toMatchObject({
      fontFamily: 'Inter_500Medium',
      fontSize: 13,
      color: '#6E6A66',
      marginBottom: 6,
    });
  });

  it('should draw the box with radius 8, white fill and a 14 inner margin (V-L08)', () => {
    render(<TextField label="Usuário" value="" onChangeText={jest.fn()} />);

    // 1 px de borda em repouso: o padding soma 1 para o conteúdo ficar nos 14 do frame.
    expect(
      StyleSheet.flatten(screen.getByTestId('text-field-box').props.style as TestStyle),
    ).toMatchObject({ borderRadius: 8, backgroundColor: '#FFFFFF', paddingHorizontal: 14 + 1 });
  });

  it('should type in Inter 15 petro and use Flint for the placeholder (V-L07, V-L08)', () => {
    render(
      <TextField label="Usuário" value="" placeholder="Seu usuário" onChangeText={jest.fn()} />,
    );
    const input = screen.getByLabelText('Usuário');

    expect(StyleSheet.flatten(input.props.style as TestStyle)).toMatchObject({
      fontFamily: 'Inter_400Regular',
      fontSize: 15,
      color: '#1E3A3F',
    });
    expect(input.props.placeholderTextColor).toBe('#6E6A66');
  });

  it('should leave the field without a fixed width so it follows the screen (320 to 430)', () => {
    render(<TextField label="Usuário" value="" onChangeText={jest.fn()} />);

    expect(findFixedWidths(screen.toJSON())).toEqual([]);
  });

  it('should show the helper text under the field and include it in the accessible name', () => {
    render(
      <TextField label="CPF" value="" onChangeText={jest.fn()} helperText="Só se pedir nota." />,
    );

    expect(screen.getByText('Só se pedir nota.')).toBeTruthy();
    expect(screen.getByLabelText('CPF, Só se pedir nota.')).toBeTruthy();
  });

  it('should replace the helper text by the error message when there is an error', () => {
    render(
      <TextField
        label="CPF"
        value=""
        onChangeText={jest.fn()}
        helperText="Só se pedir nota."
        errorMessage="CPF inválido."
      />,
    );

    expect(screen.queryByText('Só se pedir nota.')).toBeNull();
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByLabelText('CPF, CPF inválido.')).toBeTruthy();
  });

  it('should pass multiline and maxLength to the input and use the 76 px box', () => {
    render(
      <TextField label="Endereço" value="" onChangeText={jest.fn()} multiline maxLength={200} />,
    );

    const input = screen.getByLabelText('Endereço');
    expect(input.props.multiline).toBe(true);
    expect(input.props.maxLength).toBe(200);
    const box = StyleSheet.flatten(screen.getByTestId('text-field-box').props.style as TestStyle);
    expect(box).toMatchObject({ height: 76 });
  });

  it('should call onSubmitEditing when the keyboard action is pressed', () => {
    const onSubmitEditing = jest.fn();
    render(
      <TextField
        label="Nome"
        value=""
        onChangeText={jest.fn()}
        returnKeyType="next"
        onSubmitEditing={onSubmitEditing}
      />,
    );

    fireEvent(screen.getByLabelText('Nome'), 'submitEditing');

    expect(onSubmitEditing).toHaveBeenCalledTimes(1);
  });

  it('should draw the 2 px error border when invalid, even without its own message', () => {
    render(<TextField label="Senha" value="" invalid onChangeText={jest.fn()} />);

    expect(fieldBorder(screen.getByLabelText('Senha'))).toEqual({
      width: borderWidth.field,
      color: color.border.error,
    });
    expect(screen.queryByRole('alert')).toBeNull();
  });
});

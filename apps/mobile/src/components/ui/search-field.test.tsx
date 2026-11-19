import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import type { TestStyle } from '@/test-utils/flat-style';
import { borderWidth, color, size } from '@/theme/tokens';

import { SearchField, type SearchFieldProps } from './search-field';

// Fonte de ícones é a borda externa: o carregamento assíncrono da fonte
// atualiza estado fora do `act` e não faz parte do que se testa aqui.
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

function renderField(overrides: Partial<SearchFieldProps> = {}): ReturnType<typeof render> {
  return render(
    <SearchField
      value=""
      onChangeText={jest.fn()}
      onSubmit={jest.fn()}
      onClear={jest.fn()}
      placeholder="Buscar por nome ou CPF"
      label="Buscar cliente"
      clearLabel="Limpar busca"
      maxLength={100}
      {...overrides}
    />,
  );
}

function boxStyle(): TestStyle {
  return StyleSheet.flatten(screen.getByTestId('search-field').props.style as TestStyle);
}

describe('SearchField', () => {
  it('should expose the field with its accessible name inside a search region', () => {
    renderField();

    expect(screen.getByLabelText('Buscar cliente')).toBeTruthy();
    expect(screen.getByTestId('search-field').props.accessibilityRole).toBe('search');
  });

  it('should show the placeholder when empty', () => {
    renderField();

    expect(screen.getByPlaceholderText('Buscar por nome ou CPF')).toBeTruthy();
  });

  it('should limit the text to maxLength characters', () => {
    renderField({ maxLength: 100 });

    expect(screen.getByLabelText('Buscar cliente').props.maxLength).toBe(100);
  });

  it('should send what is typed through onChangeText', () => {
    const onChangeText = jest.fn();
    renderField({ onChangeText });

    fireEvent.changeText(screen.getByLabelText('Buscar cliente'), 'maria');

    expect(onChangeText).toHaveBeenCalledWith('maria');
  });

  it('should call onSubmit when the search key is pressed', () => {
    const onSubmit = jest.fn();
    renderField({ onSubmit });

    fireEvent(screen.getByLabelText('Buscar cliente'), 'submitEditing');

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should hide the clear button while the field is empty', () => {
    renderField({ value: '' });

    expect(screen.queryByRole('button', { name: 'Limpar busca' })).toBeNull();
  });

  it('should show the clear button with text and call onClear when pressed', () => {
    const onClear = jest.fn();
    renderField({ value: 'maria', onClear });

    fireEvent.press(screen.getByRole('button', { name: 'Limpar busca' }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('should extend the clear touch area to 48 high', () => {
    renderField({ value: 'maria' });

    const slop = screen.getByRole('button', { name: 'Limpar busca' }).props.hitSlop as {
      top: number;
      bottom: number;
    };

    expect(size.field + slop.top + slop.bottom).toBeGreaterThanOrEqual(48);
  });

  it('should use a 1 px border at rest and a 2 px focus border while focused', () => {
    renderField();

    expect(boxStyle()).toMatchObject({
      borderWidth: borderWidth.hairline,
      borderColor: color.border.default,
    });

    fireEvent(screen.getByLabelText('Buscar cliente'), 'focus');

    expect(boxStyle()).toMatchObject({
      borderWidth: borderWidth.field,
      borderColor: color.border.focusField,
    });

    fireEvent(screen.getByLabelText('Buscar cliente'), 'blur');

    expect(boxStyle().borderWidth).toBe(borderWidth.hairline);
  });
});

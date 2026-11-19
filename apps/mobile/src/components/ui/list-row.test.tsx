import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet, Text } from 'react-native';

import type { TestStyle } from '@/test-utils/flat-style';
import { borderWidth, color, minTouchTarget } from '@/theme/tokens';

import { ListRow } from './list-row';

// Fonte de ícones é a borda externa: o carregamento assíncrono da fonte
// atualiza estado fora do `act` e não faz parte do que se testa aqui.
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

function renderRow(onPress = jest.fn()): ReturnType<typeof render> {
  return render(
    <ListRow
      leading={<Text>MS</Text>}
      title="Maria Souza"
      subtitle="2 veículos"
      onPress={onPress}
      accessibilityHint="Abre o detalhe do cliente"
    />,
  );
}

describe('ListRow', () => {
  it('should show the title, the subtitle and the leading element', () => {
    renderRow();

    expect(screen.getByText('Maria Souza')).toBeTruthy();
    expect(screen.getByText('2 veículos')).toBeTruthy();
    expect(screen.getByText('MS')).toBeTruthy();
  });

  it('should be a single button named after title and subtitle, with the hint', () => {
    renderRow();

    const button = screen.getByRole('button', { name: 'Maria Souza, 2 veículos' });

    expect(button.props.accessibilityHint).toBe('Abre o detalhe do cliente');
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('should use the custom accessible label when one is given', () => {
    render(
      <ListRow
        leading={<Text>MS</Text>}
        title="Maria Souza"
        subtitle="2 veículos"
        onPress={jest.fn()}
        accessibilityLabel="Cliente Maria Souza, 2 veículos"
      />,
    );

    expect(screen.getByRole('button', { name: 'Cliente Maria Souza, 2 veículos' })).toBeTruthy();
  });

  it('should call onPress when the card is pressed', () => {
    const onPress = jest.fn();
    renderRow(onPress);

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should keep the touch target at 48 or more', () => {
    renderRow();

    const style = StyleSheet.flatten(screen.getByRole('button').props.style as TestStyle);

    expect(style.minHeight).toBeGreaterThanOrEqual(minTouchTarget);
  });

  it('should hide the decorative chevron from the screen reader', () => {
    renderRow();

    expect(screen.UNSAFE_getByProps({ accessibilityElementsHidden: true })).toBeTruthy();
  });

  it('should show a transparent ring at rest and the focus ring while focused', () => {
    renderRow();

    expect(
      StyleSheet.flatten(screen.getByTestId('list-row-ring').props.style as TestStyle),
    ).toMatchObject({ borderColor: 'transparent' });

    fireEvent(screen.getByRole('button'), 'focus');

    expect(
      StyleSheet.flatten(screen.getByTestId('list-row-ring').props.style as TestStyle),
    ).toMatchObject({ borderColor: color.focus.ring, borderWidth: borderWidth.field });

    fireEvent(screen.getByRole('button'), 'blur');

    expect(
      StyleSheet.flatten(screen.getByTestId('list-row-ring').props.style as TestStyle),
    ).toMatchObject({ borderColor: 'transparent' });
  });
});

import { fireEvent, render, screen } from '@testing-library/react-native';
import { ActivityIndicator, StyleSheet } from 'react-native';
import type { TestStyle } from '@/test-utils/flat-style';

import { hasFocusRing } from '@/test-utils/has-focus-ring';
import { color, opacity } from '@/theme/tokens';

import { Button } from './button';

// Fonte de ícones é a borda externa: o carregamento assíncrono da fonte
// atualiza estado fora do `act` e não faz parte do que se testa aqui.
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

describe('Button', () => {
  it('should expose the button role and the label as accessible name when rendered', () => {
    render(<Button label="Entrar" onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Entrar' })).toBeTruthy();
  });

  it('should prefer accessibilityLabel over the visible label when both are given', () => {
    render(<Button label="Sair" accessibilityLabel="Sair da conta" onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Sair da conta' })).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button label="Entrar" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress and report disabled when disabled', () => {
    const onPress = jest.fn();
    render(<Button label="Entrar" onPress={onPress} disabled />);

    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Entrar', disabled: true })).toBeTruthy();
  });

  it('should show the loading label, report busy and ignore presses when loading', () => {
    const onPress = jest.fn();
    render(<Button label="Entrar" loadingLabel="Entrando…" loading onPress={onPress} />);

    expect(screen.getByText('Entrando…')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Entrar', busy: true })).toBeTruthy();
  });

  it('should keep the loading button at full opacity, not dimmed like a disabled one (L2, R-2)', () => {
    render(<Button label="Entrar" loadingLabel="Entrando…" loading onPress={jest.fn()} />);

    const style = StyleSheet.flatten(
      screen.getByRole('button', { name: 'Entrar' }).props.style as TestStyle,
    );

    expect(style.opacity).toBeUndefined();
    expect(style).toMatchObject({ backgroundColor: color.action.primaryBackground });
    expect(StyleSheet.flatten(screen.getByText('Entrando…').props.style as TestStyle).color).toBe(
      color.text.onPrimaryAction,
    );
  });

  it('should draw the white loading indicator on the primary button, left of the label (L2)', () => {
    render(<Button label="Entrar" loadingLabel="Entrando…" loading onPress={jest.fn()} />);

    const indicator = screen.UNSAFE_getByType(ActivityIndicator);

    expect(indicator.props.color).toBe(color.text.onPrimaryAction);
    expect(
      StyleSheet.flatten(screen.getByTestId('button-loading-row').props.style as TestStyle),
    ).toMatchObject({ flexDirection: 'row' });
  });

  it('should box the indicator in 16 and mirror it so the label stays centered (L2, R-11)', () => {
    render(<Button label="Entrar" loadingLabel="Entrando…" loading onPress={jest.fn()} />);

    const slot = StyleSheet.flatten(
      screen.getByTestId('button-loading-indicator').props.style as TestStyle,
    );
    const balance = StyleSheet.flatten(
      screen.getByTestId('button-loading-balance').props.style as TestStyle,
    );
    const row = StyleSheet.flatten(
      screen.getByTestId('button-loading-row').props.style as TestStyle,
    );

    expect(slot).toMatchObject({ width: 16, height: 16 });
    expect(balance).toMatchObject({ width: 16, height: 16 });
    expect(row.gap).toBe(6);
  });

  it('should dim a truly disabled button to the disabled opacity', () => {
    render(<Button label="Entrar" disabled onPress={jest.fn()} />);

    expect(
      StyleSheet.flatten(screen.getByRole('button', { name: 'Entrar' }).props.style as TestStyle)
        .opacity,
    ).toBe(opacity.disabled);
  });

  it('should fall back to the label while loading when no loadingLabel is given', () => {
    render(<Button label="Entrar" loading onPress={jest.fn()} />);

    expect(screen.getByText('Entrar')).toBeTruthy();
  });

  it('should draw 50 of height with radius 8 and keep the touch area at 48 or more', () => {
    render(<Button label="Entrar" onPress={jest.fn()} />);

    const style = StyleSheet.flatten(
      screen.getByRole('button', { name: 'Entrar' }).props.style as TestStyle,
    );

    expect(style).toMatchObject({ height: 50, borderRadius: 8 });
    expect(screen.getByRole('button', { name: 'Entrar' }).props.hitSlop).toEqual({
      top: 0,
      bottom: 0,
    });
  });

  it('should paint the primary variant Crail with white text', () => {
    render(<Button label="Entrar" onPress={jest.fn()} />);

    expect(
      StyleSheet.flatten(screen.getByRole('button', { name: 'Entrar' }).props.style as TestStyle),
    ).toMatchObject({ backgroundColor: color.action.primaryBackground });
    expect(StyleSheet.flatten(screen.getByText('Entrar').props.style as TestStyle).color).toBe(
      color.text.onPrimaryAction,
    );
  });

  it('should paint the secondary variant with a petro outline and petro text (Cancelar)', () => {
    render(<Button label="Cancelar" variant="secondary" onPress={jest.fn()} />);

    expect(
      StyleSheet.flatten(screen.getByRole('button', { name: 'Cancelar' }).props.style as TestStyle),
    ).toMatchObject({ borderColor: color.text.primary, borderWidth: 1 });
    expect(StyleSheet.flatten(screen.getByText('Cancelar').props.style as TestStyle).color).toBe(
      color.text.primary,
    );
  });

  it('should paint the outlineAccent variant with a Westar outline and Crail text (Sair da conta)', () => {
    render(<Button label="Sair da conta" variant="outlineAccent" onPress={jest.fn()} />);

    expect(
      StyleSheet.flatten(
        screen.getByRole('button', { name: 'Sair da conta' }).props.style as TestStyle,
      ),
    ).toMatchObject({ borderColor: color.border.divider, borderWidth: 1 });
    expect(
      StyleSheet.flatten(screen.getByText('Sair da conta').props.style as TestStyle).color,
    ).toBe(color.text.error);
  });

  it('should draw the focus ring only while focused', () => {
    render(<Button label="Entrar" onPress={jest.fn()} />);
    const button = screen.getByRole('button', { name: 'Entrar' });

    expect(hasFocusRing(button)).toBe(false);

    fireEvent(button, 'focus');
    expect(hasFocusRing(screen.getByRole('button', { name: 'Entrar' }))).toBe(true);

    fireEvent(button, 'blur');
    expect(hasFocusRing(screen.getByRole('button', { name: 'Entrar' }))).toBe(false);
  });

  describe('icon', () => {
    it('should draw no icon when the icon prop is absent', () => {
      render(<Button label="Entrar" onPress={jest.fn()} />);

      expect(screen.queryByTestId('button-icon', { includeHiddenElements: true })).toBeNull();
    });

    it('should draw the icon before the label and keep the label as the accessible name', () => {
      render(<Button label="Novo cliente" icon="add" onPress={jest.fn()} />);

      const icone = screen.getByTestId('button-icon', { includeHiddenElements: true });

      expect(screen.getByRole('button', { name: 'Novo cliente' })).toBeTruthy();
      expect(icone.props.accessibilityElementsHidden).toBe(true);
      expect(icone.props.importantForAccessibility).toBe('no-hide-descendants');
      const arvore = JSON.stringify(screen.toJSON());

      expect(arvore.indexOf('button-icon')).toBeLessThan(arvore.indexOf('["Novo cliente"]'));
    });

    it('should swap the icon for the loading indicator while loading', () => {
      render(<Button label="Salvar" icon="add" loading onPress={jest.fn()} />);

      expect(screen.queryByTestId('button-icon', { includeHiddenElements: true })).toBeNull();
      expect(screen.getByTestId('button-loading-indicator')).toBeTruthy();
    });
  });
});

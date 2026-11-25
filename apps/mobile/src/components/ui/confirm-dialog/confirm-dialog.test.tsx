import { fireEvent, render, screen } from '@testing-library/react-native';
import { Modal, StyleSheet } from 'react-native';

import { findAncestorStyle } from '@/test-utils/find-ancestor-with-style';
import type { TestStyle } from '@/test-utils/flat-style';

import { ConfirmDialog } from './confirm-dialog';

function renderDialog(overrides: { visible?: boolean; message?: string } = {}): {
  onCancel: jest.Mock;
  onConfirm: jest.Mock;
} {
  const onCancel = jest.fn();
  const onConfirm = jest.fn();
  render(
    <ConfirmDialog
      visible={overrides.visible ?? true}
      title="Deseja realmente sair?"
      message={overrides.message}
      cancelLabel="Cancelar"
      confirmLabel="Sair"
      closeLabel="Fechar"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />,
  );
  return { onCancel, onConfirm };
}

describe('ConfirmDialog stacked', () => {
  function renderEmpilhado(): { onCancel: jest.Mock; onConfirm: jest.Mock } {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    render(
      <ConfirmDialog
        visible
        stacked
        title="Descartar alterações?"
        closeLabel="Fechar"
        cancelLabel="Continuar editando"
        confirmLabel="Descartar"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    );
    return { onCancel, onConfirm };
  }

  it('should keep the safe action first and call each handler on its own button', () => {
    const { onCancel, onConfirm } = renderEmpilhado();

    // O X do padrão F38 vem antes das ações; entre elas, a segura fica primeiro.
    const botoes = screen.getAllByRole('button');
    expect(botoes.map((botao) => botao.props.accessibilityLabel)).toEqual([
      'Fechar',
      'Continuar editando',
      'Descartar',
    ]);
    fireEvent.press(screen.getByRole('button', { name: 'Continuar editando' }));
    fireEvent.press(screen.getByRole('button', { name: 'Descartar' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should treat the system back as "keep editing", never as discard', () => {
    const { onCancel, onConfirm } = renderEmpilhado();

    fireEvent(screen.UNSAFE_getByType(Modal), 'requestClose');

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});

describe('ConfirmDialog', () => {
  it('should expose the card as a modal assertive alert, as approved in F30', () => {
    renderDialog();

    const [card] = screen.UNSAFE_getAllByProps({ accessibilityRole: 'alert' });

    expect(card.props.accessibilityLiveRegion).toBe('assertive');
    expect(card.props.accessibilityViewIsModal).toBe(true);
  });

  it('should close through the X button as an extra way to cancel (F38, US-POP-01)', () => {
    const { onCancel, onConfirm } = renderDialog();

    fireEvent.press(screen.getByRole('button', { name: 'Fechar' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('should show the title with both actions when visible', () => {
    renderDialog();

    expect(screen.getByText('Deseja realmente sair?')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sair' })).toBeTruthy();
  });

  it('should show the message under the title when one is given', () => {
    renderDialog({ message: 'Você vai precisar do usuário e senha para entrar de novo.' });

    expect(screen.getByRole('header', { name: 'Deseja realmente sair?' })).toBeTruthy();
    expect(
      screen.getByText('Você vai precisar do usuário e senha para entrar de novo.'),
    ).toBeTruthy();
  });

  it('should not render a message line when none is given', () => {
    renderDialog();

    expect(screen.queryByText(/Você vai precisar/)).toBeNull();
  });

  it('should keep Cancelar before Sair, side by side (frame 10:3886)', () => {
    renderDialog();

    const tree = JSON.stringify(screen.toJSON());

    expect(tree.indexOf('"Cancelar"')).toBeLessThan(tree.indexOf('"Sair"'));
  });

  describe('literal Figma values (frame 10:3886)', () => {
    const MENSAGEM = 'Você vai precisar do usuário e senha para entrar de novo.';

    it('should draw the card with radius 10, 20 margin, 14 between blocks and the dialog shadow', () => {
      renderDialog({ message: MENSAGEM });

      const [card] = screen.UNSAFE_getAllByProps({ accessibilityRole: 'alert' });

      expect(StyleSheet.flatten(card.props.style as TestStyle)).toMatchObject({
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        gap: 14,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      });
    });

    it('should keep 22 on each side of the screen over the petro scrim at 55 percent', () => {
      renderDialog();

      const [card] = screen.UNSAFE_getAllByProps({ accessibilityRole: 'alert' });
      const overlay = StyleSheet.flatten(card.parent?.props.style as TestStyle);

      expect(overlay).toMatchObject({
        paddingHorizontal: 22,
        backgroundColor: 'rgba(30, 58, 63, 0.55)',
      });
    });

    it('should draw the title in Barlow Condensed Bold 22 petro, left aligned', () => {
      renderDialog();

      const title = StyleSheet.flatten(
        screen.getByText('Deseja realmente sair?').props.style as TestStyle,
      );

      expect(title).toMatchObject({
        fontFamily: 'BarlowCondensed_700Bold',
        fontSize: 22,
        color: '#1E3A3F',
      });
      expect(title.textAlign).toBeUndefined();
    });

    it('should draw the message in Inter 14 over 21 Flint', () => {
      renderDialog({ message: MENSAGEM });

      expect(StyleSheet.flatten(screen.getByText(MENSAGEM).props.style as TestStyle)).toMatchObject(
        {
          fontFamily: 'Inter_400Regular',
          fontSize: 14,
          lineHeight: 21,
          color: '#6E6A66',
        },
      );
    });

    it('should put the two actions in a row with 10 between them, each taking half', () => {
      renderDialog();

      const cancel = screen.getByRole('button', { name: 'Cancelar' });

      expect(findAncestorStyle(cancel, 'flexDirection')).toMatchObject({
        flexDirection: 'row',
        gap: 10,
      });
    });
  });

  it('should render nothing when not visible', () => {
    renderDialog({ visible: false });

    expect(screen.queryByText('Deseja realmente sair?')).toBeNull();
  });

  it('should call only onCancel when cancel is pressed', () => {
    const { onCancel, onConfirm } = renderDialog();

    fireEvent.press(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('should call only onConfirm when confirm is pressed', () => {
    const { onCancel, onConfirm } = renderDialog();

    fireEvent.press(screen.getByRole('button', { name: 'Sair' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });
});

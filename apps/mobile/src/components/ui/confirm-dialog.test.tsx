import { fireEvent, render, screen } from '@testing-library/react-native';

import { ConfirmDialog } from './confirm-dialog';

function renderDialog(overrides: { visible?: boolean } = {}): {
  onCancel: jest.Mock;
  onConfirm: jest.Mock;
} {
  const onCancel = jest.fn();
  const onConfirm = jest.fn();
  render(
    <ConfirmDialog
      visible={overrides.visible ?? true}
      title="Deseja realmente sair?"
      cancelLabel="Cancelar"
      confirmLabel="Sair"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />,
  );
  return { onCancel, onConfirm };
}

describe('ConfirmDialog', () => {
  it('should expose the card as a modal assertive alert, as approved in F30', () => {
    renderDialog();

    const [card] = screen.UNSAFE_getAllByProps({ accessibilityRole: 'alert' });

    expect(card.props.accessibilityLiveRegion).toBe('assertive');
    expect(card.props.accessibilityViewIsModal).toBe(true);
  });

  it('should show the title with both actions when visible', () => {
    renderDialog();

    expect(screen.getByText('Deseja realmente sair?')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sair' })).toBeTruthy();
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

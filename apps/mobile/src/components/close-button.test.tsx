import { fireEvent, render, screen } from '@testing-library/react-native';

import { CloseButton } from './close-button';

describe('CloseButton', () => {
  it('should expose an accessible "Fechar" button (US-POP-01)', () => {
    render(<CloseButton onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Fechar' })).toBeTruthy();
  });

  it('should call onPress when touched (US-POP-02)', () => {
    const onPress = jest.fn();
    render(<CloseButton onPress={onPress} />);

    fireEvent.press(screen.getByRole('button', { name: 'Fechar' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

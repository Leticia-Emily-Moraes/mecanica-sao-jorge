import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import type { TestStyle } from '@/test-utils/flat-style';
import { color, radius, size } from '@/theme/tokens';

import { VehicleTile } from './vehicle-tile';

// Fonte de ícones é a borda externa: o carregamento assíncrono da fonte
// atualiza estado fora do `act` e não faz parte do que se testa aqui.
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

describe('VehicleTile', () => {
  it('should draw a 40 square with the avatar color and an 8 radius', () => {
    render(<VehicleTile />);

    expect(
      StyleSheet.flatten(
        screen.getByTestId('vehicle-tile', { includeHiddenElements: true }).props
          .style as TestStyle,
      ),
    ).toMatchObject({
      width: size.avatarSmall,
      height: size.avatarSmall,
      borderRadius: radius.sm,
      backgroundColor: color.surface.avatar,
    });
  });

  it('should be hidden from the screen reader because the row text names the vehicle', () => {
    render(<VehicleTile />);

    const tile = screen.getByTestId('vehicle-tile', { includeHiddenElements: true });

    expect(tile.props.accessibilityElementsHidden).toBe(true);
    expect(tile.props.importantForAccessibility).toBe('no-hide-descendants');
  });
});

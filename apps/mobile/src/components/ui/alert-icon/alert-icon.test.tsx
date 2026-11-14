import { Ionicons } from '@expo/vector-icons';
import { render, screen } from '@testing-library/react-native';

import { color } from '@/theme/tokens';

import { AlertIcon } from './alert-icon';

describe('AlertIcon', () => {
  it('should draw the filled warning triangle in the error color at the given size', () => {
    render(<AlertIcon size={32} />);

    expect(screen.UNSAFE_getByType(Ionicons).props).toMatchObject({
      name: 'warning',
      size: 32,
      color: color.text.error,
    });
  });

  it('should hide the decorative icon from the screen reader', () => {
    const { toJSON } = render(<AlertIcon size={16} />);
    const root = toJSON() as { props: Record<string, unknown> };

    expect(root.props.accessibilityElementsHidden).toBe(true);
    expect(root.props.importantForAccessibility).toBe('no-hide-descendants');
  });
});

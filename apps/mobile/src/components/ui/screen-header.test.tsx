import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { ScreenHeader } from './screen-header';

describe('ScreenHeader', () => {
  it('should expose the title with the header role', () => {
    render(<ScreenHeader title="Perfil" />);

    expect(screen.getByRole('header', { name: 'Perfil' })).toBeTruthy();
  });

  it('should align the title to the start by default', () => {
    render(<ScreenHeader title="Perfil" />);

    const style = StyleSheet.flatten(screen.getByRole('header').props.style);

    expect(style.textAlign).toBeUndefined();
  });

  it('should center the title when align is center', () => {
    render(<ScreenHeader title="Mecânica São Jorge" align="center" />);

    const style = StyleSheet.flatten(screen.getByRole('header').props.style);

    expect(style.textAlign).toBe('center');
  });
});

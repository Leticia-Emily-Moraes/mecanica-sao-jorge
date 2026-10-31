import { render, screen } from '@testing-library/react-native';

import HomeScreen from './index';

describe('HomeScreen', () => {
  it('should render the welcome message when the screen mounts', () => {
    render(<HomeScreen />);

    expect(screen.getByText('Mecânica São Jorge')).toBeTruthy();
  });
});

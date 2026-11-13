import { render, screen } from '@testing-library/react-native';

import { Avatar, getInitials } from './avatar';

describe('getInitials', () => {
  it('should return the first letter of the first two names when there are more than two', () => {
    expect(getInitials('Ana Beatriz Souza')).toBe('AB');
  });

  it('should return a single letter when the name has one word', () => {
    expect(getInitials('Ana')).toBe('A');
  });

  it('should upper-case accented and lower-case initials', () => {
    expect(getInitials('érica  lima')).toBe('ÉL');
  });

  it('should ignore surrounding and repeated spaces', () => {
    expect(getInitials('  Ana   Souza  ')).toBe('AS');
  });

  it('should return an empty string for an empty name', () => {
    expect(getInitials('   ')).toBe('');
  });
});

describe('Avatar', () => {
  it('should show the initials of the name', () => {
    render(<Avatar name="Ana Beatriz Souza" />);

    expect(screen.getByText('AB', { includeHiddenElements: true })).toBeTruthy();
  });

  it('should be hidden from the screen reader because the name is read next to it', () => {
    render(<Avatar name="Ana Beatriz Souza" />);

    expect(screen.queryByText('AB')).toBeNull();
  });
});

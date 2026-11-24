import { render, screen } from '@testing-library/react-native';

import { ProfileIdentity } from './profile-identity';

describe('ProfileIdentity', () => {
  it('should show the name as a header, the badge and the initials hidden from the screen reader', () => {
    render(<ProfileIdentity initials="JS" name="João da Silva" badge="ADMIN" />);

    expect(screen.getByRole('header', { name: 'João da Silva' })).toBeTruthy();
    expect(screen.getByText('ADMIN')).toBeTruthy();
    expect(screen.getByText('JS', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.queryByText('JS')).toBeNull();
  });
});

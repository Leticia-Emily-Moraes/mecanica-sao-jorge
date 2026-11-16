import { render, screen } from '@testing-library/react-native';

import { AccessProfileBadge } from './access-profile-badge';

describe('AccessProfileBadge', () => {
  it('should show the access profile label as readable text', () => {
    render(<AccessProfileBadge label="ADMIN" />);

    expect(screen.getByText('ADMIN')).toBeTruthy();
  });
});

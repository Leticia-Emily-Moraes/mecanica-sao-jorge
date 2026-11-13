import { render, screen } from '@testing-library/react-native';

import { InlineAlert } from './inline-alert';

describe('InlineAlert', () => {
  it('should show the message with the alert role', () => {
    render(<InlineAlert message="E-mail ou senha incorretos." />);

    expect(screen.getByRole('alert')).toBe(screen.getByText('E-mail ou senha incorretos.'));
  });

  it('should be a polite live region so screen readers announce it when it appears', () => {
    render(<InlineAlert message="E-mail ou senha incorretos." />);

    expect(screen.getByRole('alert').props.accessibilityLiveRegion).toBe('polite');
  });
});

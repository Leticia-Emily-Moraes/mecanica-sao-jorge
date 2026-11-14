import { render, screen } from '@testing-library/react-native';

import { ProfileSummary } from './profile-summary';

function renderSummary(): void {
  render(
    <ProfileSummary
      name="Ana Beatriz Souza"
      email="ana.souza@exemplo-ficticio.com.br"
      accessProfile="ADMIN"
      accessibilityLabel="Nome: Ana Beatriz Souza. E-mail: ana.souza@exemplo-ficticio.com.br. Perfil de acesso: ADMIN"
    />,
  );
}

describe('ProfileSummary', () => {
  it('should show the name, the email and the access profile badge', () => {
    renderSummary();

    expect(screen.getByText('Ana Beatriz Souza')).toBeTruthy();
    expect(screen.getByText('ana.souza@exemplo-ficticio.com.br')).toBeTruthy();
    expect(screen.getByText('ADMIN')).toBeTruthy();
  });

  it('should read the whole block as one element with the labelled description', () => {
    renderSummary();

    expect(
      screen.getByLabelText(
        'Nome: Ana Beatriz Souza. E-mail: ana.souza@exemplo-ficticio.com.br. Perfil de acesso: ADMIN',
      ),
    ).toBeTruthy();
  });

  it('should draw the avatar with the initials, hidden from the screen reader', () => {
    renderSummary();

    expect(screen.getByText('AB', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.queryByText('AB')).toBeNull();
  });
});

import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { ReadOnlyField } from './read-only-field';

describe('ReadOnlyField', () => {
  it('should show the label and the value', () => {
    render(<ReadOnlyField label="Nome" value="Ana Beatriz Souza" />);

    expect(screen.getByText('Nome')).toBeTruthy();
    expect(screen.getByText('Ana Beatriz Souza')).toBeTruthy();
  });

  it('should render children in place of the value text', () => {
    render(
      <ReadOnlyField label="Perfil de acesso" value="ignorado">
        <Text>ADMIN</Text>
      </ReadOnlyField>,
    );

    expect(screen.getByText('ADMIN')).toBeTruthy();
    expect(screen.queryByText('ignorado')).toBeNull();
  });
});

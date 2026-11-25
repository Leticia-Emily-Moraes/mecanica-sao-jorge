import { render, screen } from '@testing-library/react-native';

import { EmptyCard } from './empty-card';

describe('EmptyCard', () => {
  it('should render title and message', () => {
    render(<EmptyCard title="Nenhum veículo cadastrado" message="Cadastre o primeiro." />);

    expect(screen.getByText('Nenhum veículo cadastrado')).toBeTruthy();
    expect(screen.getByText('Cadastre o primeiro.')).toBeTruthy();
  });

  it('should be read as a single element with title and message', () => {
    render(<EmptyCard title="Nenhuma OS" message="Aparecem aqui." />);

    expect(screen.getByLabelText('Nenhuma OS. Aparecem aqui.')).toBeTruthy();
  });
});

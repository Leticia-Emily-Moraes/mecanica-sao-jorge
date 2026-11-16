import { render, screen } from '@testing-library/react-native';

import { InfoCard } from './info-card';

const LINHAS = [
  { label: 'Usuário', value: 'joao.silva' },
  { label: 'Perfil de acesso', value: 'Administrador' },
  { label: 'Versão do app', value: '0.1.0' },
];

describe('InfoCard', () => {
  it('should show each label with its value', () => {
    render(<InfoCard rows={LINHAS} />);

    for (const linha of LINHAS) {
      expect(screen.getByText(linha.label)).toBeTruthy();
      expect(screen.getByText(linha.value)).toBeTruthy();
    }
  });

  it('should read each row as one phrase for the screen reader', () => {
    render(<InfoCard rows={LINHAS} />);

    expect(screen.getByLabelText('Usuário: joao.silva')).toBeTruthy();
    expect(screen.getByLabelText('Perfil de acesso: Administrador')).toBeTruthy();
    expect(screen.getByLabelText('Versão do app: 0.1.0')).toBeTruthy();
  });

  it('should keep the rows in the given order', () => {
    render(<InfoCard rows={LINHAS} />);

    const tree = JSON.stringify(screen.toJSON());

    expect(tree.indexOf('"Usuário"')).toBeLessThan(tree.indexOf('"Perfil de acesso"'));
    expect(tree.indexOf('"Perfil de acesso"')).toBeLessThan(tree.indexOf('"Versão do app"'));
  });

  it('should render an empty card when there are no rows', () => {
    render(<InfoCard rows={[]} />);

    expect(screen.queryByText('Usuário')).toBeNull();
  });
});

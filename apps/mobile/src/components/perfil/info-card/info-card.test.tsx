import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { findAncestorStyle } from '@/test-utils/find-ancestor-with-style';
import type { TestStyle } from '@/test-utils/flat-style';

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

  it('should draw the card with a 1 px Westar border, radius 8, 15 margin and the card shadow (V-P06)', () => {
    render(<InfoCard rows={LINHAS} />);

    const card = findAncestorStyle(screen.getByLabelText('Usuário: joao.silva'), 'borderWidth');

    expect(card).toMatchObject({
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E2DEDA',
      borderRadius: 8,
      padding: 15,
      shadowColor: '#1E3A3F',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 1,
    });
  });

  it('should draw the label in Flint 14 and the value in petro Inter Medium 14 on the right (V-P07)', () => {
    render(<InfoCard rows={LINHAS} />);

    expect(StyleSheet.flatten(screen.getByText('Usuário').props.style as TestStyle)).toMatchObject({
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: '#6E6A66',
    });
    expect(
      StyleSheet.flatten(screen.getByText('joao.silva').props.style as TestStyle),
    ).toMatchObject({
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      color: '#1E3A3F',
      textAlign: 'right',
    });
  });

  it('should render an empty card when there are no rows', () => {
    render(<InfoCard rows={[]} />);

    expect(screen.queryByText('Usuário')).toBeNull();
  });
});

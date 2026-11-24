import { Ionicons } from '@expo/vector-icons';
import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { findAncestorStyle } from '@/test-utils/find-ancestor-with-style';
import type { TestStyle } from '@/test-utils/flat-style';
import { color, fontFamily, layout, spacing } from '@/theme/tokens';

import { ErrorState } from './error-state';

// A fonte de ícones é a borda externa: o carregamento assíncrono dela atualiza estado fora do `act`.
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

const TITLE = 'Não foi possível carregar';
const MESSAGE = 'Verifique a internet da oficina e tente de novo. Se continuar, entre novamente.';

function renderError(): void {
  render(
    <ErrorState
      title={TITLE}
      message={MESSAGE}
      retryLabel="Tentar novamente"
      onRetry={jest.fn()}
      secondaryLabel="Entrar novamente"
      onSecondaryPress={jest.fn()}
    />,
  );
}

/** Frame P2 (`83:754`), valores lidos pelo ESQUADRO em 16/11 (planilha F41, §15.3). */
describe('ErrorState (P2)', () => {
  it('should draw a 72 circle filled with the neutral #EDE9E4 behind the icon (R-4)', () => {
    renderError();

    const circle = findAncestorStyle(screen.UNSAFE_getByType(Ionicons), 'backgroundColor');

    expect(circle).toMatchObject({
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: '#EDE9E4',
    });
    expect(circle?.backgroundColor).toBe(color.surface.neutral);
  });

  it('should draw a 32 no-connection icon in Spectra (R-5)', () => {
    renderError();

    const icon = screen.UNSAFE_getByType(Ionicons);

    expect(icon.props.size).toBe(32);
    expect(icon.props.color).toBe('#33575D');
    expect(icon.props.name).toBe('cloud-offline-outline');
  });

  it('should draw the title in Barlow Condensed SemiBold 20 in petro (R-6)', () => {
    renderError();

    expect(StyleSheet.flatten(screen.getByText(TITLE).props.style as TestStyle)).toMatchObject({
      fontFamily: fontFamily.displaySemiBold,
      fontSize: 20,
      color: color.text.primary,
      textAlign: 'center',
    });
  });

  it('should draw the message in Inter Regular 14 over 21 in Flint, centered (R-7)', () => {
    renderError();

    expect(StyleSheet.flatten(screen.getByText(MESSAGE).props.style as TestStyle)).toMatchObject({
      fontFamily: fontFamily.body,
      fontSize: 14,
      lineHeight: 21,
      color: color.text.secondary,
      textAlign: 'center',
    });
  });

  it('should cap the action column at the 328 of the frame buttons, never a fixed width', () => {
    renderError();

    const actions = findAncestorStyle(screen.getByText('Tentar novamente'), 'maxWidth');

    expect(actions).toMatchObject({ width: '100%', maxWidth: layout.stateActionsMaxWidth });
    expect(layout.stateActionsMaxWidth).toBe(328);
  });

  it('should space circle to title by 16 and title to message by 10 (R-12)', () => {
    renderError();

    expect(StyleSheet.flatten(screen.getByText(TITLE).props.style as TestStyle)).toMatchObject({
      marginTop: 16,
    });
    expect(StyleSheet.flatten(screen.getByText(MESSAGE).props.style as TestStyle)).toMatchObject({
      marginTop: 10,
    });
    expect(spacing.md).toBe(16);
    expect(spacing.s10).toBe(10);
  });

  it('should center the illustration above and anchor the actions at the base (R-13)', () => {
    renderError();

    const root = screen.getByTestId('error-state');
    const illustration = screen.getByTestId('error-state-illustration');
    const actions = screen.getByTestId('error-state-actions');
    const rootStyle = StyleSheet.flatten(root.props.style as TestStyle);

    const order = (root.children as readonly (string | { props: { testID?: string } })[]).map(
      (child) => (typeof child === 'string' ? child : child.props.testID),
    );

    expect(order).toEqual(['error-state-illustration', 'error-state-actions']);
    expect(StyleSheet.flatten(illustration.props.style as TestStyle)).toMatchObject({
      flex: 1,
      justifyContent: 'center',
    });
    expect(StyleSheet.flatten(actions.props.style as TestStyle)).not.toHaveProperty('flex');
    expect(StyleSheet.flatten(actions.props.style as TestStyle)).not.toHaveProperty('marginTop');
    expect(rootStyle).toMatchObject({ gap: 12, paddingBottom: 16 });
  });

  it('should keep 12 between the two action buttons (R-14)', () => {
    renderError();

    expect(
      StyleSheet.flatten(screen.getByTestId('error-state-actions').props.style as TestStyle),
    ).toMatchObject({ gap: 12 });
    expect(spacing.s12).toBe(12);
  });

  it('should draw only the primary action at the base when there is no secondary one', () => {
    render(
      <ErrorState
        title={TITLE}
        message={MESSAGE}
        retryLabel="Tentar novamente"
        onRetry={jest.fn()}
      />,
    );

    expect(screen.getByText('Tentar novamente')).toBeTruthy();
    expect(screen.queryByText('Entrar novamente')).toBeNull();
  });

  it('should keep the icon circle hidden from the screen reader', () => {
    renderError();

    expect(screen.UNSAFE_getByProps({ accessibilityElementsHidden: true })).toBeTruthy();
  });
});

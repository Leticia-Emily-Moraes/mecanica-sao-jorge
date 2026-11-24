import { fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, ActivityIndicator, Modal, StyleSheet } from 'react-native';

import { findFixedWidths } from '@/test-utils/find-fixed-widths';
import type { TestStyle } from '@/test-utils/flat-style';
import { color, fontFamily } from '@/theme/tokens';

import { StateView } from './state-view';

type TestNode = ReturnType<typeof screen.getByRole>;

/** Estilo do botão: sobe do nó acessível até o Pressable que desenha fundo ou contorno. */
function styleOfButton(node: TestNode): TestStyle {
  return StyleSheet.flatten(node.props.style as TestStyle);
}

// Fonte de ícones é a borda externa: o carregamento assíncrono da fonte
// atualiza estado fora do `act` e não faz parte do que se testa aqui.
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

describe('StateView', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('state loading', () => {
    it('should expose the loading label with the progressbar role and busy state', () => {
      render(<StateView state="loading" loadingLabel="Carregando sessão..." />);

      expect(
        screen.getByRole('progressbar', { name: 'Carregando sessão...', busy: true }),
      ).toBeTruthy();
    });

    it('should be a polite live region so the change is announced without moving focus', () => {
      render(<StateView state="loading" loadingLabel="Carregando sessão..." />);

      const region = screen.getByRole('progressbar');

      expect(region.props.accessibilityLiveRegion).toBe('polite');
    });

    it('should announce the loading label once on mount for platforms without live regions', () => {
      const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
      announce.mockClear();

      render(<StateView state="loading" loadingLabel="Carregando sessão..." />);

      expect(announce).toHaveBeenCalledTimes(1);
      expect(announce).toHaveBeenCalledWith('Carregando sessão...');
    });

    it('should show the loading label as visible text in Flint under the petro indicator (P1)', () => {
      render(<StateView state="loading" loadingLabel="Carregando sessão…" />);

      const text = screen.getByText('Carregando sessão…');

      expect(StyleSheet.flatten(text.props.style as TestStyle)).toMatchObject({
        color: color.text.secondary,
        fontFamily: fontFamily.body,
        fontSize: 14,
      });
      expect(screen.UNSAFE_getByType(ActivityIndicator).props.color).toBe(color.text.primary);
    });
  });

  describe('state loading spacing (P1, R-9)', () => {
    it('should leave 12 between the indicator and the loading text', () => {
      render(<StateView state="loading" loadingLabel="Carregando sessão…" />);

      expect(
        StyleSheet.flatten(screen.getByText('Carregando sessão…').props.style as TestStyle)
          .marginTop,
      ).toBe(12);
    });

    it('should use the large system indicator, drawn by the platform (D-16)', () => {
      render(<StateView state="loading" loadingLabel="Carregando sessão…" />);

      expect(screen.UNSAFE_getByType(ActivityIndicator).props.size).toBe('large');
    });
  });

  describe('state empty', () => {
    it('should show the title and the message as readable text', () => {
      render(
        <StateView
          state="empty"
          title="Nenhum cliente cadastrado ainda"
          message="Cadastre o primeiro cliente para começar."
        />,
      );

      expect(screen.getByText('Nenhum cliente cadastrado ainda')).toBeTruthy();
      expect(screen.getByText('Cadastre o primeiro cliente para começar.')).toBeTruthy();
    });

    it('should render no action button when no action is given', () => {
      render(<StateView state="empty" title="Nenhum cliente cadastrado ainda" />);

      expect(screen.queryByRole('button')).toBeNull();
    });

    it('should render the primary action and call onAction when pressed', () => {
      const onAction = jest.fn();
      render(
        <StateView
          state="empty"
          title="Nenhum cliente cadastrado ainda"
          actionLabel="Cadastrar cliente"
          onAction={onAction}
        />,
      );

      fireEvent.press(screen.getByRole('button', { name: 'Cadastrar cliente' }));

      expect(onAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('state error (P2, full screen)', () => {
    const baseProps = {
      state: 'error' as const,
      title: 'Não foi possível carregar',
      message: 'Verifique a internet da oficina e tente de novo.',
      retryLabel: 'Tentar novamente',
    };

    it('should expose the screen as an assertive alert, not as a modal popup', () => {
      render(<StateView {...baseProps} onRetry={jest.fn()} />);

      // Não é `accessible`: agrupar esconderia os botões do leitor de tela.
      const alert = screen.UNSAFE_getByProps({ accessibilityRole: 'alert' });

      expect(alert.props.accessibilityLiveRegion).toBe('assertive');
      expect(alert.props.accessible).toBeUndefined();
      expect(screen.UNSAFE_queryByType(Modal)).toBeNull();
    });

    it('should show the title as a header, the message and the retry button', () => {
      render(<StateView {...baseProps} onRetry={jest.fn()} />);

      expect(screen.getByRole('header', { name: 'Não foi possível carregar' })).toBeTruthy();
      expect(screen.getByText('Verifique a internet da oficina e tente de novo.')).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeTruthy();
    });

    it('should hide the decorative no-connection icon from the screen reader', () => {
      render(<StateView {...baseProps} onRetry={jest.fn()} />);

      expect(screen.UNSAFE_getByProps({ accessibilityElementsHidden: true })).toBeTruthy();
    });

    it('should draw the title in petro and the message in Flint', () => {
      render(<StateView {...baseProps} onRetry={jest.fn()} />);

      expect(
        StyleSheet.flatten(screen.getByText('Não foi possível carregar').props.style as TestStyle),
      ).toMatchObject({ color: color.text.primary, fontFamily: fontFamily.displaySemiBold });
      expect(
        StyleSheet.flatten(
          screen.getByText('Verifique a internet da oficina e tente de novo.').props
            .style as TestStyle,
        ).color,
      ).toBe(color.text.secondary);
    });

    it('should keep 16 under the circle, 10 under the title and a 289 wide message (P2, R-12)', () => {
      render(<StateView {...baseProps} onRetry={jest.fn()} />);

      expect(
        StyleSheet.flatten(screen.getByText('Não foi possível carregar').props.style as TestStyle)
          .marginTop,
      ).toBe(16);
      expect(
        StyleSheet.flatten(
          screen.getByText('Verifique a internet da oficina e tente de novo.').props
            .style as TestStyle,
        ),
      ).toMatchObject({ marginTop: 10, maxWidth: 289, fontSize: 14, lineHeight: 21 });
    });

    it('should call onRetry when the retry button is pressed', () => {
      const onRetry = jest.fn();
      render(<StateView {...baseProps} onRetry={onRetry} />);

      fireEvent.press(screen.getByRole('button', { name: 'Tentar novamente' }));

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should show the secondary action only when label and handler are given', () => {
      const onSecondaryPress = jest.fn();
      render(
        <StateView
          {...baseProps}
          onRetry={jest.fn()}
          secondaryLabel="Entrar novamente"
          onSecondaryPress={onSecondaryPress}
        />,
      );

      fireEvent.press(screen.getByRole('button', { name: 'Entrar novamente' }));

      expect(onSecondaryPress).toHaveBeenCalledTimes(1);
    });

    it('should not show a secondary action when none is given', () => {
      render(<StateView {...baseProps} onRetry={jest.fn()} />);

      expect(screen.getAllByRole('button')).toHaveLength(1);
    });

    it('should draw the retry button filled in Crail and the secondary one as an outline (P2)', () => {
      render(
        <StateView
          {...baseProps}
          onRetry={jest.fn()}
          secondaryLabel="Entrar novamente"
          onSecondaryPress={jest.fn()}
        />,
      );

      const retry = styleOfButton(screen.getByRole('button', { name: 'Tentar novamente' }));
      const secondary = styleOfButton(screen.getByRole('button', { name: 'Entrar novamente' }));

      expect(retry).toMatchObject({ backgroundColor: color.action.primaryBackground });
      expect(retry.borderWidth).toBeUndefined();
      expect(secondary).toMatchObject({ backgroundColor: 'transparent', borderWidth: 1 });
    });

    it('should keep only the decorative icon circle with an absolute width', () => {
      render(
        <StateView
          {...baseProps}
          onRetry={jest.fn()}
          secondaryLabel="Entrar novamente"
          onSecondaryPress={jest.fn()}
        />,
      );

      // O círculo do ícone é o único elemento com medida absoluta (decorativo).
      expect(findFixedWidths(screen.toJSON())).toEqual([72]);
    });
  });
});

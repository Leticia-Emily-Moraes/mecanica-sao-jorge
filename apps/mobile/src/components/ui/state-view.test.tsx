import { fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import { StateView } from './state-view';

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

  describe('state error', () => {
    const baseProps = {
      state: 'error' as const,
      title: 'Não foi possível conectar.',
      message: 'Verifique sua conexão e tente novamente.',
      retryLabel: 'Tentar novamente',
    };

    it('should expose the card as a modal assertive alert, as approved in F30', () => {
      render(<StateView {...baseProps} visible onRetry={jest.fn()} />);

      const [card] = screen.UNSAFE_getAllByProps({ accessibilityRole: 'alert' });

      expect(card.props.accessibilityLiveRegion).toBe('assertive');
      expect(card.props.accessibilityViewIsModal).toBe(true);
    });

    it('should show title, message and retry button when visible', () => {
      render(<StateView {...baseProps} visible onRetry={jest.fn()} />);

      expect(screen.getByText('Não foi possível conectar.')).toBeTruthy();
      expect(screen.getByText('Verifique sua conexão e tente novamente.')).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeTruthy();
    });

    it('should render nothing when not visible', () => {
      render(<StateView {...baseProps} visible={false} onRetry={jest.fn()} />);

      expect(screen.queryByText('Não foi possível conectar.')).toBeNull();
    });

    it('should call onRetry when the retry button is pressed', () => {
      const onRetry = jest.fn();
      render(<StateView {...baseProps} visible onRetry={onRetry} />);

      fireEvent.press(screen.getByRole('button', { name: 'Tentar novamente' }));

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should show the secondary action only when label and handler are given', () => {
      const onSecondaryPress = jest.fn();
      render(
        <StateView
          {...baseProps}
          visible
          onRetry={jest.fn()}
          secondaryLabel="Entrar novamente"
          onSecondaryPress={onSecondaryPress}
        />,
      );

      fireEvent.press(screen.getByRole('button', { name: 'Entrar novamente' }));

      expect(onSecondaryPress).toHaveBeenCalledTimes(1);
    });

    it('should not show a secondary action when none is given', () => {
      render(<StateView {...baseProps} visible onRetry={jest.fn()} />);

      expect(screen.getAllByRole('button')).toHaveLength(1);
    });
  });
});

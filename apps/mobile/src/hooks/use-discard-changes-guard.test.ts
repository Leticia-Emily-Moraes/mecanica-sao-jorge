import { act, renderHook } from '@testing-library/react-native';

import { useDiscardChangesGuard } from './use-discard-changes-guard';

type Ouvinte = (evento: { preventDefault: () => void; data: { action: unknown } }) => void;

const mockNavigation = {
  addListener: jest.fn(),
  dispatch: jest.fn(),
};
let ouvinte: Ouvinte | null = null;
const remover = jest.fn();

jest.mock('expo-router', () => ({
  useNavigation: () => mockNavigation,
}));

const ACAO = { type: 'GO_BACK' };

function sair(): { preventDefault: jest.Mock } {
  const evento = { preventDefault: jest.fn(), data: { action: ACAO } };
  act(() => ouvinte?.(evento));
  return evento;
}

beforeEach(() => {
  jest.clearAllMocks();
  ouvinte = null;
  mockNavigation.addListener.mockImplementation((_nome: string, fn: Ouvinte) => {
    ouvinte = fn;
    return remover;
  });
});

describe('useDiscardChangesGuard', () => {
  it('should let the person leave without asking when nothing changed', () => {
    const { result } = renderHook(() => useDiscardChangesGuard(false));

    const evento = sair();

    expect(evento.preventDefault).not.toHaveBeenCalled();
    expect(result.current.dialogoVisivel).toBe(false);
  });

  it('should block the exit and open the dialog when there are changes', () => {
    const { result } = renderHook(() => useDiscardChangesGuard(true));

    const evento = sair();

    expect(evento.preventDefault).toHaveBeenCalledTimes(1);
    expect(result.current.dialogoVisivel).toBe(true);
    expect(mockNavigation.dispatch).not.toHaveBeenCalled();
  });

  it('should close the dialog and stay on the form when the person keeps editing', () => {
    const { result } = renderHook(() => useDiscardChangesGuard(true));
    sair();

    act(() => result.current.continuarEditando());

    expect(result.current.dialogoVisivel).toBe(false);
    expect(mockNavigation.dispatch).not.toHaveBeenCalled();
  });

  it('should replay the blocked exit once when the person discards', () => {
    const { result } = renderHook(() => useDiscardChangesGuard(true));
    sair();

    act(() => result.current.descartar());

    expect(result.current.dialogoVisivel).toBe(false);
    expect(mockNavigation.dispatch).toHaveBeenCalledTimes(1);
    expect(mockNavigation.dispatch).toHaveBeenCalledWith(ACAO);
  });

  it('should not block the replayed exit again after discarding', () => {
    const { result } = renderHook(() => useDiscardChangesGuard(true));
    sair();
    act(() => result.current.descartar());

    const evento = sair();

    expect(evento.preventDefault).not.toHaveBeenCalled();
  });

  it('should not ask after the form was saved', () => {
    const { rerender } = renderHook(
      ({ alterado }: { alterado: boolean }) => useDiscardChangesGuard(alterado),
      { initialProps: { alterado: true } },
    );
    rerender({ alterado: false });

    const evento = sair();

    expect(evento.preventDefault).not.toHaveBeenCalled();
  });

  it('should ask again on a later exit after the person keeps editing', () => {
    const { result } = renderHook(() => useDiscardChangesGuard(true));
    sair();
    act(() => result.current.continuarEditando());

    const evento = sair();

    expect(evento.preventDefault).toHaveBeenCalledTimes(1);
    expect(result.current.dialogoVisivel).toBe(true);
  });

  it('should remove the listener on unmount', () => {
    const { unmount } = renderHook(() => useDiscardChangesGuard(true));

    unmount();

    expect(remover).toHaveBeenCalledTimes(1);
  });
});

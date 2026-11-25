import { act, renderHook } from '@testing-library/react-native';

import { useAutoDismiss } from './use-auto-dismiss';

describe('useAutoDismiss', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call the handler once after the duration while active', () => {
    const aoExpirar = jest.fn();
    renderHook(() => useAutoDismiss(true, aoExpirar, 5000));

    act(() => {
      jest.advanceTimersByTime(4999);
    });
    expect(aoExpirar).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(aoExpirar).toHaveBeenCalledTimes(1);
  });

  it('should use 5 seconds when no duration is given', () => {
    const aoExpirar = jest.fn();
    renderHook(() => useAutoDismiss(true, aoExpirar));

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(aoExpirar).toHaveBeenCalledTimes(1);
  });

  it('should never call the handler while inactive', () => {
    const aoExpirar = jest.fn();
    renderHook(() => useAutoDismiss(false, aoExpirar, 5000));

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(aoExpirar).not.toHaveBeenCalled();
  });

  it('should cancel the wait when it becomes inactive before the time ends', () => {
    const aoExpirar = jest.fn();
    const { rerender } = renderHook(
      ({ ativo }: { ativo: boolean }) => useAutoDismiss(ativo, aoExpirar, 5000),
      { initialProps: { ativo: true } },
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    rerender({ ativo: false });
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(aoExpirar).not.toHaveBeenCalled();
  });

  it('should cancel the wait when the component unmounts', () => {
    const aoExpirar = jest.fn();
    const { unmount } = renderHook(() => useAutoDismiss(true, aoExpirar, 5000));

    unmount();
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(aoExpirar).not.toHaveBeenCalled();
  });

  it('should call the latest handler without restarting the count', () => {
    const primeiro = jest.fn();
    const segundo = jest.fn();
    const { rerender } = renderHook(
      ({ aoExpirar }: { aoExpirar: () => void }) => useAutoDismiss(true, aoExpirar, 5000),
      { initialProps: { aoExpirar: primeiro } },
    );

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    rerender({ aoExpirar: segundo });
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(primeiro).not.toHaveBeenCalled();
    expect(segundo).toHaveBeenCalledTimes(1);
  });
});

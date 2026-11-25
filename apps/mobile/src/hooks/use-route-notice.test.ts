import { act, renderHook } from '@testing-library/react-native';

import { NOTICE_DURATION_MS } from '@/config/notice';

import { useRouteNotice } from './use-route-notice';

describe('useRouteNotice', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show the notice from the route', () => {
    const { result } = renderHook(() => useRouteNotice('editado', '1'));

    expect(result.current.aviso).toBe('editado');
  });

  it('should show nothing without a notice or without its id', () => {
    expect(renderHook(() => useRouteNotice(null, '1')).result.current.aviso).toBeNull();
    expect(renderHook(() => useRouteNotice('editado', null)).result.current.aviso).toBeNull();
  });

  it('should hide the notice after the display time', () => {
    const { result } = renderHook(() => useRouteNotice('criado', '1'));

    act(() => {
      jest.advanceTimersByTime(NOTICE_DURATION_MS);
    });

    expect(result.current.aviso).toBeNull();
  });

  it('should hide the notice when dismissed by hand', () => {
    const { result } = renderHook(() => useRouteNotice('criado', '1'));

    act(() => result.current.dispensar());

    expect(result.current.aviso).toBeNull();
  });

  it('should show a new notice with the same text but a new id after one was dismissed', () => {
    const { result, rerender } = renderHook(
      ({ id }: { id: string }) => useRouteNotice('editado', id),
      { initialProps: { id: '1' } },
    );
    act(() => result.current.dispensar());

    rerender({ id: '2' });

    expect(result.current.aviso).toBe('editado');
  });

  it('should not bring back a dismissed notice on a re-render with the same id', () => {
    const { result, rerender } = renderHook(
      ({ id }: { id: string }) => useRouteNotice('editado', id),
      { initialProps: { id: '1' } },
    );
    act(() => result.current.dispensar());

    rerender({ id: '1' });

    expect(result.current.aviso).toBeNull();
  });
});

import { act, renderHook } from '@testing-library/react-native';

import { useDebouncedValue } from './use-debounced-value';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should start with the initial value', () => {
    const { result } = renderHook(() => useDebouncedValue('a', 400));

    expect(result.current).toBe('a');
  });

  it('should hold the old value until the wait has passed', () => {
    const { result, rerender } = renderHook(
      ({ valor }: { valor: string }) => useDebouncedValue(valor, 400),
      { initialProps: { valor: 'a' } },
    );

    rerender({ valor: 'ab' });
    act(() => {
      jest.advanceTimersByTime(399);
    });
    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('ab');
  });

  it('should restart the wait on every change and publish only the last value', () => {
    const { result, rerender } = renderHook(
      ({ valor }: { valor: string }) => useDebouncedValue(valor, 400),
      { initialProps: { valor: '' } },
    );

    rerender({ valor: 'a' });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    rerender({ valor: 'ab' });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('');

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('ab');
  });
});

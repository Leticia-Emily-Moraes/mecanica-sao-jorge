import { useFocusEffect } from 'expo-router';
import { useEffect } from 'react';
import { renderHook } from '@testing-library/react-native';

import { useRefreshOnFocus } from './use-refresh-on-focus';

jest.mock('expo-router', () => ({ useFocusEffect: jest.fn() }));

const mockedFocusEffect = useFocusEffect as jest.MockedFunction<typeof useFocusEffect>;

/** Simula o foco: roda o callback ao montar e de novo a cada nova identidade dele. */
function simularFoco(): void {
  mockedFocusEffect.mockImplementation((callback) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => callback(), [callback]);
  });
}

describe('useRefreshOnFocus', () => {
  beforeEach(() => {
    simularFoco();
  });

  it('should not refresh on the first focus, which is the initial load', () => {
    const atualizar = jest.fn();

    renderHook(() => useRefreshOnFocus(atualizar));

    expect(atualizar).not.toHaveBeenCalled();
  });

  it('should refresh on every focus after the first', () => {
    const atualizar = jest.fn();
    const { rerender } = renderHook(({ fn }: { fn: () => void }) => useRefreshOnFocus(fn), {
      initialProps: { fn: atualizar },
    });

    const segunda = jest.fn();
    rerender({ fn: segunda });

    expect(segunda).toHaveBeenCalledTimes(1);
  });
});

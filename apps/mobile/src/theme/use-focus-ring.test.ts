import { act, renderHook } from '@testing-library/react-native';

import { color, focusRingInset, focusRingOffset, focusRingRadius, focusRingWidth } from './tokens';
import { useFocusRing } from './use-focus-ring';

describe('useFocusRing', () => {
  it('should keep a transparent ring that already reserves its space when not focused', () => {
    const { result } = renderHook(() => useFocusRing());

    expect(result.current.focused).toBe(false);
    expect(result.current.focusRingStyle).toMatchObject({
      borderWidth: focusRingWidth,
      borderColor: 'transparent',
      padding: focusRingOffset,
      margin: -focusRingInset,
      backgroundColor: 'transparent',
    });
  });

  it('should paint the petro ring over a white halo when focused', () => {
    const { result } = renderHook(() => useFocusRing());

    act(() => result.current.onFocus());

    expect(result.current.focused).toBe(true);
    expect(result.current.focusRingStyle).toMatchObject({
      borderColor: color.focus.ring,
      backgroundColor: color.focus.ringOffset,
    });
  });

  it('should return to the transparent ring when blurred', () => {
    const { result } = renderHook(() => useFocusRing());

    act(() => result.current.onFocus());
    act(() => result.current.onBlur());

    expect(result.current.focusRingStyle).toMatchObject({ borderColor: 'transparent' });
  });

  it('should match the frame ring: 2 pt petro, 4 pt halo and outer radius 14', () => {
    expect(focusRingWidth).toBe(2);
    expect(focusRingOffset).toBe(4);
    expect(focusRingRadius).toBe(14);
  });
});

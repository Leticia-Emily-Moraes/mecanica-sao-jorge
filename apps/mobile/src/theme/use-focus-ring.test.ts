import { act, renderHook } from '@testing-library/react-native';

import { color, focusRingOffset, focusRingRadius, focusRingWidth } from './tokens';
import { useFocusRing } from './use-focus-ring';

describe('useFocusRing', () => {
  it('should keep a transparent ring that already reserves its space when not focused', () => {
    const { result } = renderHook(() => useFocusRing());

    expect(result.current.focused).toBe(false);
    expect(result.current.focusRingStyle).toMatchObject({
      borderWidth: focusRingWidth,
      borderColor: 'transparent',
      padding: focusRingOffset,
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

  it('should match the tokens of the approved ring: 2 pt petro, 2 pt halo and outer radius 12', () => {
    expect(focusRingWidth).toBe(2);
    expect(focusRingOffset).toBe(2);
    expect(focusRingRadius).toBe(12);
  });

  it('should paint a white ring without halo over the petro bar (onBrand)', () => {
    const { result } = renderHook(() => useFocusRing({ onBrand: true }));

    act(() => result.current.onFocus());

    expect(result.current.focusRingStyle).toMatchObject({
      borderColor: color.focus.ringOnBrand,
      backgroundColor: 'transparent',
    });
  });
});

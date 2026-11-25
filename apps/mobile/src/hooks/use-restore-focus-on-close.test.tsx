import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { AccessibilityInfo, View } from 'react-native';

import { useRestoreFocusOnClose } from './use-restore-focus-on-close';

// No renderer de teste não há tag nativa; devolve uma tag fixa quando o ref existe.
jest.mock('react-native/Libraries/ReactNative/RendererProxy', () => ({
  ...jest.requireActual('react-native/Libraries/ReactNative/RendererProxy'),
  findNodeHandle: jest.fn((ref: unknown) => (ref ? 42 : null)),
}));

interface HarnessProps {
  readonly visible: boolean;
  readonly mountTrigger?: boolean;
}

function Harness({ visible, mountTrigger = true }: HarnessProps): ReactElement {
  const triggerRef = useRestoreFocusOnClose(visible);
  return mountTrigger ? <View ref={triggerRef} testID="trigger" /> : <View />;
}

describe('useRestoreFocusOnClose', () => {
  const setFocusSpy = jest.spyOn(AccessibilityInfo, 'setAccessibilityFocus');

  beforeEach(() => {
    setFocusSpy.mockReset();
  });

  it('should move screen reader focus to the trigger when the popup closes (US-POP-02)', () => {
    const { rerender } = render(<Harness visible />);

    rerender(<Harness visible={false} />);

    expect(setFocusSpy).toHaveBeenCalledTimes(1);
    expect(setFocusSpy).toHaveBeenCalledWith(42);
  });

  it('should not move focus while the popup is open or if it was never opened', () => {
    const { rerender } = render(<Harness visible={false} />);

    rerender(<Harness visible={false} />);
    rerender(<Harness visible />);

    expect(setFocusSpy).not.toHaveBeenCalled();
  });

  it('should do nothing when the trigger is not mounted on close', () => {
    const { rerender } = render(<Harness visible mountTrigger={false} />);

    rerender(<Harness visible={false} mountTrigger={false} />);

    expect(setFocusSpy).not.toHaveBeenCalled();
  });
});

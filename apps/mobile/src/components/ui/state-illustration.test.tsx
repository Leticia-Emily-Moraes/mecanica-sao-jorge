import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import type { TestStyle } from '@/test-utils/flat-style';
import { color, fontFamily } from '@/theme/tokens';

import { StateIllustration } from './state-illustration';

const mockIonicon = jest.fn((_props: Record<string, unknown>) => null);
jest.mock('@expo/vector-icons', () => ({
  Ionicons: (props: Record<string, unknown>) => mockIonicon(props),
}));
const ionicon = mockIonicon;

function styleOf(text: string): TestStyle {
  return StyleSheet.flatten(screen.getByText(text).props.style as TestStyle);
}

describe('StateIllustration', () => {
  beforeEach(() => {
    ionicon.mockClear();
  });

  it('should draw a 72 circle in #EDE9E4 with a 32 Spectra icon (I1 V-I02, V-I03)', () => {
    render(
      <StateIllustration
        icon="document-text-outline"
        title="T"
        message="M"
        titleGap={16}
        messageGap={10}
      />,
    );

    expect(ionicon).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'document-text-outline', size: 32, color: '#33575D' }),
    );
    const circle = screen.getByTestId('state-illustration-circle', { includeHiddenElements: true });

    expect(StyleSheet.flatten(circle.props.style as TestStyle)).toMatchObject({
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: '#EDE9E4',
    });
  });

  it('should draw the title in Barlow SemiBold 20 petro with the given gap above (V-I04)', () => {
    render(
      <StateIllustration
        icon="document-text-outline"
        title="Em breve"
        message="M"
        titleGap={16}
        messageGap={10}
      />,
    );

    expect(styleOf('Em breve')).toMatchObject({
      fontFamily: fontFamily.displaySemiBold,
      fontSize: 20,
      color: color.text.primary,
      marginTop: 16,
    });
  });

  it('should draw the message in Inter 14 over 21, Flint, up to 289 wide, 10 under the title (V-I05)', () => {
    render(
      <StateIllustration
        icon="document-text-outline"
        title="T"
        message="Mensagem"
        titleGap={16}
        messageGap={10}
      />,
    );

    expect(styleOf('Mensagem')).toMatchObject({
      fontFamily: fontFamily.body,
      fontSize: 14,
      lineHeight: 21,
      color: color.text.secondary,
      maxWidth: 289,
      marginTop: 10,
    });
  });

  it('should hide the icon from the screen reader and expose a header only when asked', () => {
    const { rerender } = render(
      <StateIllustration
        icon="document-text-outline"
        title="T"
        message="M"
        titleGap={16}
        messageGap={10}
      />,
    );

    expect(screen.queryByRole('header')).toBeNull();

    rerender(
      <StateIllustration
        icon="document-text-outline"
        title="T"
        message="M"
        titleGap={16}
        messageGap={10}
        titleIsHeader
      />,
    );

    expect(screen.getByRole('header', { name: 'T' })).toBeTruthy();
  });

  it('should render no message text when none is given', () => {
    render(
      <StateIllustration icon="document-text-outline" title="T" titleGap={16} messageGap={10} />,
    );

    expect(screen.queryByText('M')).toBeNull();
    expect(screen.getByText('T')).toBeTruthy();
  });
});

import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { TestStyle } from '@/test-utils/flat-style';
import { color, fontFamily } from '@/theme/tokens';

import InicioScreen from './inicio';

const mockIonicon = jest.fn((_props: Record<string, unknown>) => null);
jest.mock('@expo/vector-icons', () => ({
  Ionicons: (props: Record<string, unknown>) => mockIonicon(props),
}));
const ionicon = mockIonicon;

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const METRICAS_DE_TESTE = {
  frame: { x: 0, y: 0, width: 360, height: 740 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

function renderInicio(): void {
  render(
    <SafeAreaProvider initialMetrics={METRICAS_DE_TESTE}>
      <InicioScreen />
    </SafeAreaProvider>,
  );
}

describe('InicioScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show the header title and the empty state while no module is programmed', () => {
    renderInicio();

    expect(screen.getByRole('header', { name: 'Início' })).toBeTruthy();
    expect(screen.getByText('Em breve')).toBeTruthy();
    expect(screen.getByText('Os módulos da oficina chegam nas próximas versões.')).toBeTruthy();
  });

  it('should draw the empty state as in the I1 frame: document icon 32 Spectra in a 72 circle', () => {
    renderInicio();

    expect(ionicon).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'document-text-outline', size: 32, color: '#33575D' }),
    );
    expect(
      StyleSheet.flatten(
        screen.getByTestId('state-illustration-circle', { includeHiddenElements: true }).props
          .style as TestStyle,
      ),
    ).toMatchObject({ width: 72, height: 72, backgroundColor: '#EDE9E4' });
  });

  it('should draw title in Barlow 20 petro and message in Inter 14/21 Flint, 289 wide (I1)', () => {
    renderInicio();

    expect(StyleSheet.flatten(screen.getByText('Em breve').props.style as TestStyle)).toMatchObject(
      {
        fontFamily: fontFamily.displaySemiBold,
        fontSize: 20,
        color: color.text.primary,
        marginTop: 16,
      },
    );
    expect(
      StyleSheet.flatten(
        screen.getByText('Os módulos da oficina chegam nas próximas versões.').props
          .style as TestStyle,
      ),
    ).toMatchObject({
      fontFamily: fontFamily.body,
      fontSize: 14,
      lineHeight: 21,
      color: color.text.secondary,
      maxWidth: 289,
      marginTop: 10,
    });
  });

  it('should centre the empty block in the area between header and tab bar (I1 V-I06)', () => {
    renderInicio();

    const block = screen.getByTestId('state-view-empty');

    expect(StyleSheet.flatten(block.props.style as TestStyle)).toMatchObject({
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    });
  });

  it('should open the Perfil from the user button in the header', () => {
    renderInicio();

    fireEvent.press(screen.getByRole('button', { name: 'Perfil' }));

    expect(mockPush).toHaveBeenCalledWith('/perfil');
  });
});

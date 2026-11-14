import { render, screen } from '@testing-library/react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { jsonChildren, jsonStyle, type JsonNode } from '@/test-utils/render-tree';
import { color, typography } from '@/theme/tokens';

import { ScreenHeader } from './screen-header';

function bandStyle(): ReturnType<typeof jsonStyle> {
  return jsonStyle(screen.toJSON() as JsonNode);
}

describe('ScreenHeader', () => {
  it('should expose the title with the header role', () => {
    render(<ScreenHeader title="Perfil" />);

    expect(screen.getByRole('header', { name: 'Perfil' })).toBeTruthy();
  });

  it('should draw the title in white, header size, over the brand band', () => {
    render(<ScreenHeader title="Perfil" />);

    const title = StyleSheet.flatten(screen.getByRole('header').props.style);

    expect(title).toMatchObject({
      color: color.text.onBrand,
      fontSize: typography.header.fontSize,
    });
    expect(bandStyle().backgroundColor).toBe(color.surface.brand);
  });

  it('should force light status bar content over the petro band', () => {
    render(<ScreenHeader title="Perfil" />);

    expect(screen.UNSAFE_getByType(StatusBar).props.style).toBe('light');
  });

  it('should show the subtitle when given', () => {
    render(<ScreenHeader title="Mecânica São Jorge" subtitle="Entre com sua conta" />);

    expect(screen.getByText('Entre com sua conta')).toBeTruthy();
  });

  it('should not render a subtitle when none is given', () => {
    render(<ScreenHeader title="Perfil" />);

    expect(screen.queryByText('Entre com sua conta')).toBeNull();
  });

  it('should reserve the status bar area using the top safe area inset', () => {
    render(
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 375, height: 812 },
          insets: { top: 44, left: 0, right: 0, bottom: 34 },
        }}
      >
        <ScreenHeader title="Perfil" />
      </SafeAreaProvider>,
    );

    // Dentro do provedor a raiz da árvore é o próprio provedor; a faixa é o primeiro filho.
    const band = jsonStyle(jsonChildren(screen.toJSON() as JsonNode)[0]);

    expect(band.paddingTop).toBe(44);
  });
});

import { StatusBar } from 'expo-status-bar';
import { useContext, type ReactElement } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import { styles, topInset } from './screen-header.styles';

export interface ScreenHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
}

/**
 * Faixa de cabeçalho da tela (Figma 29:80, 33:34): fundo petro, título à
 * esquerda e subtítulo opcional. Ocupa a área sob a barra de status. O título
 * é anunciado como cabeçalho pelo leitor de tela. A barra de status fica
 * clara sobre a faixa petro: no tema escuro do aparelho o texto padrão seria
 * escuro e daria 1,73:1 (abaixo de 3:1); com texto branco dá 12,12:1.
 */
export function ScreenHeader({ title, subtitle }: ScreenHeaderProps): ReactElement {
  // Contexto lido direto: sem provedor (testes isolados) o inset é zero.
  const insets = useContext(SafeAreaInsetsContext);

  return (
    <View style={[styles.band, topInset(insets?.top ?? 0)]}>
      <StatusBar style="light" />
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

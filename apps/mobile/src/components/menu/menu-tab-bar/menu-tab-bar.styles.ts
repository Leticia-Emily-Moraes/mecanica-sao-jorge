import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';

import { color, layout, size } from '@/theme/tokens';

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: color.surface.brand,
    alignItems: 'center',
  },
  // Altura explícita de 62 (frame `20:1102`): sem ela o Yoga mede a barra só pela
  // moldura do anel de foco das células e a tab bar sai cortada na base da tela.
  bar: {
    flexDirection: 'row',
    height: size.tabBar,
    width: '100%',
    maxWidth: layout.tabBarMaxWidth,
  },
});

export function bottomInset(bottom: number): ViewStyle {
  return { paddingBottom: bottom };
}

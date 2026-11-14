import { StyleSheet, type ViewStyle } from 'react-native';

import { color, layout } from '@/theme/tokens';

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: color.surface.brand,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: layout.tabBarMaxWidth,
  },
});

export function bottomInset(bottom: number): ViewStyle {
  return { paddingBottom: bottom };
}

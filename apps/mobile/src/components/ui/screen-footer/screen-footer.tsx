import type { ReactElement, ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { footerInset, styles } from './screen-footer.styles';

export interface ScreenFooterProps {
  readonly children: ReactNode;
}

/**
 * Rodapé que empurra as ações para a base da tela e respeita a área segura de
 * baixo, com 20 de respiro acima dela (Perfil, frame `10:3842`).
 */
export function ScreenFooter({ children }: ScreenFooterProps): ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <View testID="screen-footer" style={[styles.footer, footerInset(insets.bottom)]}>
      {children}
    </View>
  );
}

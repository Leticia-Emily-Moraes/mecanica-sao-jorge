import type { ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme/tokens';

export interface FormActionsProps {
  readonly children: ReactNode;
}

/**
 * Área de ações do formulário (ex.: botão Entrar). Afasta as ações dos campos:
 * 24 do último campo até o botão (Figma 29:79), já descontado o espaço de 6
 * que todo campo reserva abaixo de si.
 */
export function FormActions({ children }: FormActionsProps): ReactElement {
  return <View style={styles.actions}>{children}</View>;
}

const styles = StyleSheet.create({
  actions: {
    marginTop: spacing.lg - spacing.field,
  },
});

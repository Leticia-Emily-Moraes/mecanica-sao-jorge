import { Ionicons } from '@expo/vector-icons';
import type { ReactElement } from 'react';
import { Pressable, View } from 'react-native';

import { useFocusRing } from '@/theme/use-focus-ring';

import { styles, visual } from './close-button.styles';

export interface CloseButtonProps {
  /** Nome acessível ("Fechar"); vem da tela, como todo texto de componente base. */
  readonly label: string;
  readonly onPress: () => void;
}

/**
 * Botão de fechar (X) reutilizável, padrão F38 para todo popup/modal do app.
 * Posiciona-se no canto superior direito do cartão que o envolve.
 */
export function CloseButton({ label, onPress }: CloseButtonProps): ReactElement {
  const { focusRingStyle, onFocus, onBlur } = useFocusRing();

  return (
    <View style={[styles.ringWrapper, focusRingStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onFocus={onFocus}
        onBlur={onBlur}
        onPress={onPress}
        style={styles.pressable}
        hitSlop={visual.hitSlop}
      >
        <Ionicons name="close" size={visual.iconSize} color={visual.iconColor} />
      </Pressable>
    </View>
  );
}

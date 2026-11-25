import { Ionicons } from '@expo/vector-icons';
import type { ReactElement, ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useFocusRing } from '@/theme/use-focus-ring';

import { styles, visual } from './list-row.styles';

export interface ListRowProps {
  /** Avatar ou ícone à esquerda; decorativo, o nome vem em `title`. */
  readonly leading: ReactNode;
  readonly title: string;
  readonly subtitle: string;
  readonly onPress: () => void;
  /** Frase completa que o leitor de tela lê; o padrão é "título, subtítulo". */
  readonly accessibilityLabel?: string;
  /** Dica falada depois do nome (ex.: "Abre o detalhe do cliente"). */
  readonly accessibilityHint?: string;
}

/**
 * Cartão tocável de lista (cliente e veículo): elemento à esquerda, duas linhas
 * de texto e seta à direita, em 66 de altura mínima (cresce com fonte grande).
 * O cartão inteiro é um só alvo de toque e uma só parada do leitor de tela.
 */
export function ListRow({
  leading,
  title,
  subtitle,
  onPress,
  accessibilityLabel,
  accessibilityHint,
}: ListRowProps): ReactElement {
  const { focusRingStyle, onFocus, onBlur } = useFocusRing();

  return (
    <View testID="list-row-ring" style={[styles.ring, focusRingStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? `${title}, ${subtitle}`}
        accessibilityHint={accessibilityHint}
        onFocus={onFocus}
        onBlur={onBlur}
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <View style={styles.leading}>{leading}</View>
        <View style={styles.texts}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Ionicons name="chevron-forward" size={visual.chevronSize} color={visual.chevronColor} />
        </View>
      </Pressable>
    </View>
  );
}

import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useFocusRing } from '@/theme/use-focus-ring';

import { styles, toneStyle, visual } from './tab-bar-item.styles';

export type TabBarIconName = ComponentProps<typeof Ionicons>['name'];

export interface TabBarItemProps {
  readonly icon: TabBarIconName;
  /** Rótulo visível sob o ícone. */
  readonly label: string;
  /** Nome acessível completo (inclui o estado, ex.: "Ordens, aba selecionada"). */
  readonly accessibilityLabel: string;
  readonly selected: boolean;
  /** Item de placeholder: não navega, fica esmaecido e anunciado como desabilitado. */
  readonly unavailable?: boolean;
  readonly onPress?: () => void;
}

/**
 * Item de aba da barra de navegação inferior, no desenho da referência: sem
 * pílula, ícone de 22 e rótulo de 11 em colunas de 62 de altura. O item
 * selecionado muda de cor e vai de Medium para SemiBold (não depende só de
 * cor, WCAG 1.4.1) e expõe `selected` ao leitor de tela. Esmaecido quando
 * indisponível e com anel de foco duplo.
 */
export function TabBarItem({
  icon,
  label,
  accessibilityLabel,
  selected,
  unavailable = false,
  onPress,
}: TabBarItemProps): ReactElement {
  const { focusRingStyle, onFocus, onBlur } = useFocusRing({ onBrand: true });
  const tone = selected ? visual.toneSelected : visual.toneIdle;

  return (
    <View style={styles.cell}>
      <View style={[styles.ring, focusRingStyle]}>
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ selected, disabled: unavailable }}
          disabled={unavailable}
          onFocus={onFocus}
          onBlur={onBlur}
          onPress={onPress}
          style={styles.pressable}
        >
          <View style={styles.content}>
            <Ionicons
              name={icon}
              size={visual.iconSize}
              color={tone}
              style={unavailable && styles.unavailable}
            />
            <Text
              style={[
                styles.label,
                selected ? styles.labelSelected : styles.labelIdle,
                toneStyle(tone),
                unavailable && styles.unavailable,
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

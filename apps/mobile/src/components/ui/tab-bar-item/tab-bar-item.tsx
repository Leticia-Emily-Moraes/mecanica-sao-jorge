import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import type { ComponentProps, ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

import { styles, visual } from './tab-bar-item.styles';

export type TabBarIconName = ComponentProps<typeof Ionicons>['name'];

export interface TabBarItemProps {
  readonly icon: TabBarIconName;
  /** Rótulo visível sob o ícone. */
  readonly label: string;
  /** Nome acessível completo (inclui o estado, ex.: "Perfil, aba selecionada"). */
  readonly accessibilityLabel: string;
  readonly selected: boolean;
  /** Item de placeholder: não navega, fica esmaecido e anunciado como desabilitado. */
  readonly unavailable?: boolean;
  readonly onPress?: () => void;
}

/**
 * Item de aba da barra de navegação inferior (Figma 39:3): pílula só atrás do
 * ícone quando selecionado, rótulo de 10 abaixo, esmaecido quando indisponível.
 * O foco é um anel branco de 2 de borda, sem preenchimento: a barra é petro e
 * o anel petro/branco dos demais controles sumiria ou deixaria ícone e rótulo
 * brancos sobre branco.
 */
export function TabBarItem({
  icon,
  label,
  accessibilityLabel,
  selected,
  unavailable = false,
  onPress,
}: TabBarItemProps): ReactElement {
  const [focused, setFocused] = useState(false);
  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => setFocused(false), []);

  return (
    <View style={[styles.cell, focused && styles.cellFocused]}>
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
        <View testID="tab-pill" style={[styles.iconSlot, selected && styles.pill]}>
          <Ionicons
            name={icon}
            size={visual.iconSize}
            color={visual.iconColor}
            style={unavailable && styles.unavailable}
          />
        </View>
        <Text
          style={[
            styles.label,
            selected && styles.labelSelected,
            unavailable && styles.unavailable,
          ]}
          numberOfLines={2}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

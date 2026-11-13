import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  color,
  iconSize,
  minTouchTarget,
  opacity,
  radius,
  spacing,
  typography,
} from '@/theme/tokens';
import { useFocusRing } from '@/theme/use-focus-ring';

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
 * Item de aba da barra de navegação inferior: ícone, rótulo, pílula quando
 * selecionado, esmaecido quando indisponível e anel de foco duplo.
 */
export function TabBarItem({
  icon,
  label,
  accessibilityLabel,
  selected,
  unavailable = false,
  onPress,
}: TabBarItemProps): ReactElement {
  const { focusRingStyle, onFocus, onBlur } = useFocusRing();

  return (
    <View style={[styles.cell, focusRingStyle]}>
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
        <View style={[styles.content, selected && styles.pill]}>
          <Ionicons
            name={icon}
            size={iconSize.tab}
            color={selected ? color.text.onPrimaryAction : color.text.onBrand}
            style={unavailable && styles.unavailable}
          />
          <Text
            style={[
              styles.label,
              selected ? styles.labelSelected : styles.labelIdle,
              unavailable && styles.unavailable,
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    borderRadius: radius.md,
  },
  pressable: {
    flex: 1,
    minHeight: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  pill: {
    backgroundColor: color.action.primaryBackground,
  },
  unavailable: {
    opacity: opacity.unavailable,
  },
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.label.fontWeight,
  },
  labelSelected: {
    color: color.text.onPrimaryAction,
  },
  labelIdle: {
    color: color.text.onBrand,
  },
});

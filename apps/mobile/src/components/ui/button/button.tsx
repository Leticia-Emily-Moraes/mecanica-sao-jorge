import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactElement, Ref } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { useFocusRing } from '@/theme/use-focus-ring';

import {
  iconColorByVariant,
  labelColorByVariant,
  styles,
  TOUCH_SLOP,
  variantStyle,
  visual,
} from './button.styles';

/**
 * `primary`: ação principal (Crail). `secondary`: contorno petro (Cancelar).
 * `outlineAccent`: contorno Westar com texto Crail ("Sair da conta").
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outlineAccent';

export interface ButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly variant?: ButtonVariant;
  readonly loading?: boolean;
  readonly loadingLabel?: string;
  readonly disabled?: boolean;
  readonly accessibilityLabel?: string;
  /** Ícone decorativo antes do texto; o nome acessível continua sendo só o texto. */
  readonly icon?: ComponentProps<typeof Ionicons>['name'];
  /** Ref do controle, usado para devolver o foco ao fechar um popup aberto por ele (F38). */
  readonly triggerRef?: Ref<View>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  loadingLabel,
  disabled = false,
  accessibilityLabel,
  icon,
  triggerRef,
}: ButtonProps): ReactElement {
  const { focusRingStyle, onFocus, onBlur } = useFocusRing();
  const isDisabled = disabled || loading;
  const labelStyle = [styles.label, labelColorByVariant[variant]];

  return (
    <View style={[styles.ringWrapper, focusRingStyle]}>
      <Pressable
        ref={triggerRef}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        hitSlop={TOUCH_SLOP}
        onFocus={onFocus}
        onBlur={onBlur}
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          variantStyle[variant],
          // Carregando bloqueia o toque mas não esmaece (L2, 100%); só o desabilitado esmaece.
          disabled && styles.disabled,
          pressed && !isDisabled && styles.pressed,
        ]}
      >
        {loading ? (
          <View testID="button-loading-row" style={styles.loadingRow}>
            <View testID="button-loading-indicator" style={styles.loadingSlot}>
              <ActivityIndicator
                color={variant === 'primary' ? visual.spinnerOnPrimary : visual.spinnerOnOther}
              />
            </View>
            <Text style={labelStyle}>{loadingLabel ?? label}</Text>
            {/* Espelha o indicador para o texto ficar centralizado no botão (L2, R-11). */}
            <View testID="button-loading-balance" style={styles.loadingSlot} />
          </View>
        ) : (
          <View style={styles.content}>
            {icon === undefined ? null : (
              <View
                testID="button-icon"
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                <Ionicons name={icon} size={visual.iconSize} color={iconColorByVariant[variant]} />
              </View>
            )}
            <Text style={labelStyle}>{label}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

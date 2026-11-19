import { StatusBar } from 'expo-status-bar';
import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeaderIconButton, type HeaderIconName } from '@/components/ui/header-icon-button';
import { color, size, spacing, typography } from '@/theme/tokens';

export interface ScreenHeaderAction {
  /** Nome acessível do botão (só tem ícone). */
  readonly label: string;
  readonly onPress: () => void;
}

export interface ScreenHeaderIconAction extends ScreenHeaderAction {
  readonly icon: HeaderIconName;
}

export interface ScreenHeaderProps {
  readonly title: string;
  /** Seta de voltar no canto esquerdo (Perfil). */
  readonly back?: ScreenHeaderAction;
  /** Botão de usuário no canto direito (telas do menu). */
  readonly user?: ScreenHeaderAction;
  /** Ação de ícone no canto direito (ex.: lápis de editar); vale no lugar de `user`. */
  readonly action?: ScreenHeaderIconAction;
}

/**
 * Cabeçalho petro de 56 de altura, sob a barra de status. A ordem de foco é a
 * ordem da leitura: seta de voltar, título, botão de usuário. A barra de
 * status fica com ícones claros porque o fundo atrás dela é petro.
 */
export function ScreenHeader({ title, back, user, action }: ScreenHeaderProps): ReactElement {
  const insets = useSafeAreaInsets();
  const trailing: ScreenHeaderIconAction | undefined =
    action ?? (user ? { ...user, icon: 'person-outline' } : undefined);

  return (
    <View testID="screen-header" style={[styles.wrapper, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View testID="screen-header-bar" style={[styles.bar, back && styles.barWithBack]}>
        {back ? (
          <HeaderIconButton
            icon="chevron-back"
            accessibilityLabel={back.label}
            onPress={back.onPress}
          />
        ) : null}
        <Text accessibilityRole="header" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {trailing ? (
          <HeaderIconButton
            icon={trailing.icon}
            accessibilityLabel={trailing.label}
            onPress={trailing.onPress}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: color.surface.brand,
  },
  bar: {
    height: size.appBar,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    paddingLeft: spacing.md,
    paddingRight: spacing.s12,
  },
  /** No frame do Perfil a seta fica a 10 da borda e a 10 do título. */
  barWithBack: {
    gap: spacing.s10,
    paddingLeft: spacing.s10,
  },
  title: {
    flex: 1,
    color: color.text.onBrand,
    fontFamily: typography.appBarTitle.fontFamily,
    fontSize: typography.appBarTitle.fontSize,
    letterSpacing: typography.appBarTitle.letterSpacing,
  },
});

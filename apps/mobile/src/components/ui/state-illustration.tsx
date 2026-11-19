import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { color, iconSize, layout, size, typography } from '@/theme/tokens';

export type StateIconName = ComponentProps<typeof Ionicons>['name'];

export interface StateIllustrationProps {
  readonly icon: StateIconName;
  readonly title: string;
  readonly message?: string;
  /** Espaço entre o círculo e o título (16 no Início I1, 24 no erro P2). */
  readonly titleGap: number;
  /** Espaço entre o título e a mensagem (10 no Início I1, 8 no erro P2). */
  readonly messageGap: number;
  /** Só o erro P2 expõe o título como cabeçalho; o do estado vazio é texto simples. */
  readonly titleIsHeader?: boolean;
}

/**
 * Ilustração de estado de tela cheia (P2 e Início I1): círculo neutro de 72 com
 * ícone de 32 em Spectra, título Barlow SemiBold 20 e mensagem Inter 14 / 21 em
 * até 289 de largura. O ícone é decorativo (escondido do leitor de tela).
 */
export function StateIllustration({
  icon,
  title,
  message,
  titleGap,
  messageGap,
  titleIsHeader = false,
}: StateIllustrationProps): ReactElement {
  return (
    <>
      <View
        testID="state-illustration-circle"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.iconCircle}
      >
        <Ionicons name={icon} size={iconSize.alert} color={color.icon.state} />
      </View>
      <Text
        accessibilityRole={titleIsHeader ? 'header' : undefined}
        style={[styles.title, { marginTop: titleGap }]}
      >
        {title}
      </Text>
      {message ? <Text style={[styles.message, { marginTop: messageGap }]}>{message}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: size.stateIcon,
    height: size.stateIcon,
    borderRadius: size.stateIcon / 2,
    backgroundColor: color.surface.neutral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: typography.stateTitle.fontFamily,
    fontSize: typography.stateTitle.fontSize,
    color: color.text.primary,
    textAlign: 'center',
  },
  message: {
    maxWidth: layout.stateMessageMaxWidth,
    fontFamily: typography.dialogMessage.fontFamily,
    fontSize: typography.dialogMessage.fontSize,
    lineHeight: typography.dialogMessage.lineHeight,
    color: color.text.secondary,
    textAlign: 'center',
  },
});

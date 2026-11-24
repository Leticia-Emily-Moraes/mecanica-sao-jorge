import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactElement } from 'react';
import { Text, View } from 'react-native';

import { gapAbove, styles, visual } from './state-illustration.styles';

type IconName = ComponentProps<typeof Ionicons>['name'];

export interface StateIllustrationProps {
  readonly icon: IconName;
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
        <Ionicons name={icon} size={visual.iconSize} color={visual.iconColor} />
      </View>
      <Text
        accessibilityRole={titleIsHeader ? 'header' : undefined}
        style={[styles.title, gapAbove(titleGap)]}
      >
        {title}
      </Text>
      {message ? <Text style={[styles.message, gapAbove(messageGap)]}>{message}</Text> : null}
    </>
  );
}

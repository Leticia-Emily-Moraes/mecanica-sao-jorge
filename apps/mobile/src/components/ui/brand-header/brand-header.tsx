import type { ReactElement } from 'react';
import { Image, Text, View } from 'react-native';

import { styles } from './brand-header.styles';

// Metro escolhe o arquivo 1x, 2x ou 3x pela densidade da tela (o app não usa react-native-svg).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const SHIELD_SOURCE = require('../../../../assets/brand/escudo-login.png') as number;

export interface BrandHeaderProps {
  readonly title: string;
  readonly subtitle: string;
}

/**
 * Bloco da marca no Login: escudo 84 × 96, título em caixa alta e subtítulo,
 * centralizados (frame `10:905`). O escudo é decorativo: o título logo abaixo já
 * nomeia a marca, então ele fica fora da árvore de acessibilidade e sem foco.
 * Licença do ativo: dúvida S-2 da F41, ainda sem registro da pessoa.
 */
export function BrandHeader({ title, subtitle }: BrandHeaderProps): ReactElement {
  return (
    <View style={styles.container}>
      <Image
        testID="brand-shield"
        source={SHIELD_SOURCE}
        accessible={false}
        importantForAccessibility="no"
        accessibilityElementsHidden
        resizeMode="contain"
        style={styles.shield}
      />
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

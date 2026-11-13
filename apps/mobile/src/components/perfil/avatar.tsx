import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { color, layout, radius, typography } from '@/theme/tokens';

export interface AvatarProps {
  /** Nome completo de quem o avatar representa. */
  readonly name: string;
}

/**
 * Iniciais do nome: primeira letra das duas primeiras palavras, em maiúsculas
 * ("Ana Beatriz Souza" → "AB", como no frame 33:36 do Figma).
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/u).filter(Boolean).slice(0, 2);

  return words.map((word) => (Array.from(word)[0] ?? '').toLocaleUpperCase('pt-BR')).join('');
}

/**
 * Círculo petro com as iniciais (Figma 33:36). Decorativo: o nome já aparece
 * ao lado em texto, então o leitor de tela não o lê.
 */
export function Avatar({ name }: AvatarProps): ReactElement {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.circle}
    >
      <Text style={styles.initials}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: layout.avatarSize,
    height: layout.avatarSize,
    borderRadius: radius.pill,
    backgroundColor: color.surface.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: typography.header.fontSize,
    fontWeight: typography.header.fontWeight,
    color: color.text.onBrand,
  },
});

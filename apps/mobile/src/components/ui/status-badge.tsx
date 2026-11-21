import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { borderWidth, color, radius, spacing, typography } from '@/theme/tokens';

/** `neutral` é o selo de status ainda sem desenho próprio: contorno e o nome do status. */
export type StatusTone = 'inProgress' | 'success' | 'neutral';

export interface StatusBadgeProps {
  /** Texto do status; o selo nunca depende só da cor para dizer o que é. */
  readonly label: string;
  readonly tone: StatusTone;
}

/** Selo de status da ordem de serviço (EM ANDAMENTO, ENTREGUE ou neutro). */
export function StatusBadge({ label, tone }: StatusBadgeProps): ReactElement {
  return (
    <View testID="status-badge" style={[styles.badge, toneStyle[tone]]}>
      <Text style={[styles.label, tone === 'neutral' ? styles.labelNeutral : styles.labelFilled]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.s10,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: borderWidth.hairline,
  },
  label: {
    fontFamily: typography.badge.fontFamily,
    fontSize: typography.badge.fontSize,
  },
  labelFilled: {
    color: color.text.onBrand,
  },
  labelNeutral: {
    color: color.text.primary,
  },
});

const toneStyle = StyleSheet.create({
  inProgress: {
    backgroundColor: color.status.inProgress,
    borderColor: color.status.inProgress,
  },
  success: {
    backgroundColor: color.feedback.success,
    borderColor: color.feedback.success,
  },
  neutral: {
    backgroundColor: color.surface.default,
    borderColor: color.border.default,
  },
});

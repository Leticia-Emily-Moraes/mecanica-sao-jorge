import type { ReactElement, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { borderWidth, color, radius, shadow, spacing, typography } from '@/theme/tokens';

export interface InfoRow {
  readonly label: string;
  readonly value: string;
  /** Valor sem dado (ex.: "Não informado"): sai em cinza e à esquerda não muda nada. */
  readonly muted?: boolean;
  /** Frase inteira que o leitor de tela lê no lugar de "rótulo: valor" (ex.: "CPF parcialmente oculto"). */
  readonly accessibilityLabel?: string;
}

export interface InfoCardProps {
  readonly rows: readonly InfoRow[];
  /** Cabeçalho do cartão: avatar ou ícone à esquerda e o nome em destaque. */
  readonly header?: {
    readonly leading: ReactNode;
    readonly title: string;
    /** Linha de apoio sob o título (ex.: nome do dono do veículo); lida logo após o título. */
    readonly subtitle?: string;
  };
}

/**
 * Cartão de leitura (Perfil e detalhes de cliente e veículo): linhas com
 * rótulo (Flint) à esquerda e valor (petro) à direita. Cada linha é lida de
 * uma vez ("Usuário: joao.silva"); o título do cabeçalho é um cabeçalho.
 */
export function InfoCard({ rows, header }: InfoCardProps): ReactElement {
  return (
    <View style={styles.card}>
      {header ? (
        <View style={styles.header}>
          {header.leading}
          <View style={styles.headerTexts}>
            <Text accessibilityRole="header" style={styles.title}>
              {header.title}
            </Text>
            {header.subtitle === undefined ? null : (
              <Text style={styles.subtitle}>{header.subtitle}</Text>
            )}
          </View>
        </View>
      ) : null}
      {rows.map((row) => (
        <View
          key={row.label}
          accessible
          accessibilityLabel={row.accessibilityLabel ?? `${row.label}: ${row.value}`}
          style={styles.row}
        >
          <Text style={styles.label}>{row.label}</Text>
          <Text style={[styles.value, row.muted && styles.valueMuted]}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface.default,
    borderWidth: borderWidth.hairline,
    borderColor: color.border.divider,
    borderRadius: radius.sm,
    padding: spacing.md - borderWidth.hairline,
    gap: spacing.s10,
    ...shadow.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    marginBottom: spacing.xs,
  },
  headerTexts: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontFamily: typography.detailName.fontFamily,
    fontSize: typography.detailName.fontSize,
    color: color.text.primary,
  },
  subtitle: {
    fontFamily: typography.subtitle.fontFamily,
    fontSize: typography.subtitle.fontSize,
    color: color.text.secondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  label: {
    fontFamily: typography.rowLabel.fontFamily,
    fontSize: typography.rowLabel.fontSize,
    color: color.text.secondary,
  },
  value: {
    flexShrink: 1,
    fontFamily: typography.rowValue.fontFamily,
    fontSize: typography.rowValue.fontSize,
    color: color.text.primary,
    textAlign: 'right',
  },
  valueMuted: {
    fontFamily: typography.rowLabel.fontFamily,
    color: color.text.secondary,
  },
});

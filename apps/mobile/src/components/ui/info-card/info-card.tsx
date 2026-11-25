import type { ReactElement, ReactNode } from 'react';
import { Text, View } from 'react-native';

import { elevationStyle, styles } from './info-card.styles';

export type InfoCardElevation = 'card' | 'detail';

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
  /** `card` (Perfil, raio 1) ou `detail` (detalhes de cliente e veículo no F26, raio 2). */
  readonly elevation?: InfoCardElevation;
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
export function InfoCard({ rows, header, elevation = 'card' }: InfoCardProps): ReactElement {
  return (
    <View style={[styles.card, elevationStyle(elevation)]}>
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

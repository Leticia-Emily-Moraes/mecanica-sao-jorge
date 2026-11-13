/**
 * Tokens de cor, espaçamento e tipografia da identidade visual.
 * Fonte: docs/design/figma.md, página "F25 · Protótipo alta fidelidade"
 * (coleção de variáveis `OP-002 Tokens de cor`). Mantenha este arquivo como
 * única fonte de valor de cor do app — nenhuma outra tela deve usar um hex
 * solto fora daqui.
 */

const primitiveColor = {
  petro900: '#1E3A3F',
  primary600: '#B5453D',
  white: '#FFFFFF',
  slate700: '#334155',
  slate500: '#64748B',
  slate200: '#E2E8F0',
  slate100: '#F1F5F9',
  overlayScrim: 'rgba(0, 0, 0, 0.5)',
} as const;

export const color = {
  surface: {
    default: primitiveColor.white,
    skeleton: primitiveColor.slate100,
    brand: primitiveColor.petro900,
    overlay: primitiveColor.overlayScrim,
  },
  text: {
    primary: primitiveColor.petro900,
    onBrand: primitiveColor.white,
    secondary: primitiveColor.slate700,
    onPrimaryAction: primitiveColor.white,
    error: primitiveColor.primary600,
  },
  border: {
    default: primitiveColor.slate500,
    skeleton: primitiveColor.slate200,
  },
  action: {
    primaryBackground: primitiveColor.primary600,
  },
  focus: {
    ring: primitiveColor.petro900,
    ringOffset: primitiveColor.white,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 24, fontWeight: '700' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  label: { fontSize: 14, fontWeight: '600' as const },
  button: { fontSize: 16, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
} as const;

/** Toque mínimo recomendado: 44pt (iOS) / 48dp (Android) — 48 atende os dois. */
export const minTouchTarget = 48;

/**
 * Anel de foco duplo (petro + halo branco): petro isolado sobre o botão
 * primary dá 2,24:1 (não passa AA), por isso o indicador de foco usa uma
 * borda petro com um respiro branco entre ela e o controle. Componentes
 * focáveis aplicam isto como `borderWidth: focusRingWidth, borderColor:
 * color.focus.ring, padding: focusRingOffset, backgroundColor:
 * color.focus.ringOffset` no wrapper, só quando focados.
 */
export const focusRingWidth = 2;
export const focusRingOffset = 2;

/** Raio do wrapper do anel de foco: contorna um controle de `radius.md` (12) mais borda e respiro. */
export const focusRingRadius = radius.md + focusRingWidth + focusRingOffset;

export const borderWidth = {
  hairline: 1,
} as const;

export const opacity = {
  pressed: 0.85,
  disabled: 0.5,
  unavailable: 0.6,
} as const;

export const iconSize = {
  tab: 22,
  alert: 32,
  /** Ícone ilustrativo do estado vazio — valor novo (a F40 cria o estado; ver spec §4.4). */
  empty: 48,
} as const;

export const layout = {
  dialogMaxWidth: 320,
  tabBarMaxWidth: 480,
} as const;

/** Glifos decorativos (escondidos do leitor de tela), não são texto de interface. */
export const glyph = {
  alert: '⚠',
} as const;

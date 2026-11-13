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
  primary600Tint: 'rgba(181, 69, 61, 0.08)',
} as const;

export const color = {
  surface: {
    default: primitiveColor.white,
    skeleton: primitiveColor.slate100,
    brand: primitiveColor.petro900,
    overlay: primitiveColor.overlayScrim,
    /** Faixa de erro do formulário (Figma 29:60). Texto `error` sobre ela dá 4,83:1. */
    errorTint: primitiveColor.primary600Tint,
  },
  text: {
    primary: primitiveColor.petro900,
    onBrand: primitiveColor.white,
    secondary: primitiveColor.slate700,
    onPrimaryAction: primitiveColor.white,
    error: primitiveColor.primary600,
    /** Placeholder de campo: slate-500 sobre branco = 4,76:1. */
    placeholder: primitiveColor.slate500,
  },
  border: {
    default: primitiveColor.slate500,
    skeleton: primitiveColor.slate200,
    /** Divisor do Perfil (Figma 33:42). Cor lida da captura (quase preto), nó não inspecionado: confirmar. */
    divider: primitiveColor.petro900,
  },
  action: {
    primaryBackground: primitiveColor.primary600,
  },
  focus: {
    ring: primitiveColor.petro900,
    ringOffset: primitiveColor.white,
    /** Anel sobre fundo petro (tab bar): o petro sumiria sobre a barra. Branco/petro = 12,12:1. */
    ringOnBrand: primitiveColor.white,
  },
} as const;

export const spacing = {
  xs: 4,
  /** Entre campos de formulário (Figma 29:79). */
  field: 6,
  sm: 8,
  md: 16,
  /** Respiro interno do cartão de popup e diálogo (Figma 33:49). */
  card: 20,
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
  /** Títulos de faixa de cabeçalho e iniciais do avatar (Figma 29:81, 33:35). */
  header: { fontSize: 20, fontWeight: '700' as const },
  /** Subtítulo da faixa, mensagem de popup e diálogo (Figma 29:82, 33:64). */
  subtitle: { fontSize: 13, fontWeight: '400' as const },
  /** Rótulo de campo e texto da faixa de erro (Figma 29:60, 29:80). */
  labelSmall: { fontSize: 13, fontWeight: '500' as const },
  /** Valor digitado no campo (Figma 29:79). */
  field: { fontSize: 15, fontWeight: '400' as const },
  /** Título de diálogo e nome do usuário no Perfil (Figma 33:38, 33:49). */
  heading: { fontSize: 17, fontWeight: '600' as const },
  /** Selo do perfil de acesso (Figma 33:41). */
  micro: { fontSize: 11, fontWeight: '600' as const },
  /** Rótulo da tab bar (Figma 39:3). */
  tab: { fontSize: 10, fontWeight: '400' as const },
  tabSelected: { fontSize: 10, fontWeight: '600' as const },
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

/** Espaço que o anel ocupa ao redor do controle; o wrapper compensa com margem negativa. */
export const focusRingInset = focusRingWidth + focusRingOffset;

/** Raio do wrapper do anel de foco: contorna um controle de `radius.sm` (8) mais borda e respiro. */
export const focusRingRadius = radius.sm + focusRingInset;

export const borderWidth = {
  hairline: 1,
  /** Borda de campo e botão de contorno (Figma 29:79). */
  field: 1.25,
  /** Campo em erro e botão de contorno do diálogo (Figma 29:64, 33:49). */
  emphasis: 1.5,
} as const;

export const opacity = {
  pressed: 0.85,
  disabled: 0.5,
  unavailable: 0.6,
} as const;

export const iconSize = {
  tab: 22,
  /** Ícone de ação dentro de campo (olho da senha, Figma 29:89). */
  action: 22,
  alert: 32,
  /** Ícone ilustrativo do estado vazio — valor novo (a F40 cria o estado; ver spec §4.4). */
  empty: 48,
} as const;

export const layout = {
  dialogMaxWidth: 320,
  tabBarMaxWidth: 480,
  /** Altura da célula da tab bar (Figma 39:3). */
  tabItemHeight: 64,
  /** Pílula do item selecionado, só atrás do ícone (Figma 39:4). */
  tabPillWidth: 56,
  tabPillHeight: 32,
  avatarSize: 64,
} as const;

/** Glifos decorativos (escondidos do leitor de tela), não são texto de interface. */
export const glyph = {
  alert: '⚠',
} as const;

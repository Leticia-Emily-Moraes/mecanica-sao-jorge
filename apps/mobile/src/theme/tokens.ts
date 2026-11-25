/**
 * Tokens de cor, espaçamento e tipografia da identidade visual.
 * Fonte: arquivo Figma de referência `FPdB8RymAnN81pbKfizdzE` (F41, ADR-014),
 * lido por `get_variable_defs` em 16/11/2026. Mantenha este arquivo como
 * única fonte de valor de cor do app — nenhuma outra tela deve usar um hex
 * solto fora daqui.
 *
 * Três pares do Figma reprovavam AA (placeholder Dawn 2,50:1, borda de campo
 * Westar 1,34:1, item selecionado Crail sobre petro 2,24:1). A pessoa aprovou
 * em 16/11 os valores que passam: placeholder = Flint, borda de campo =
 * `#8C8780` e aba selecionada = `#EE8279` (planilha F41, decisão D-17). As três
 * variáveis correspondentes no FPdB8 são criadas pelo ESQUADRO; enquanto não
 * existirem, os valores daqui são os da decisão, não leitura do arquivo.
 */

const primitiveColor = {
  petro900: '#1E3A3F',
  primary600: '#B5453D',
  white: '#FFFFFF',
  pampas: '#F7F5F2',
  flint: '#6E6A66',
  westar: '#E2DEDA',
  tide: '#B7B2AC',
  /** Borda de campo em repouso (aprovada em 16/11), 3,56:1 sobre branco. */
  stone: '#8C8780',
  /** Item selecionado da tab bar (aprovado em 16/11), 4,68:1 sobre petro. */
  coral: '#EE8279',
  spectra: '#33575D',
  /** Círculo neutro do ícone de estado do P2 (`color/grey/91` no FPdB8). */
  grey91: '#EDE9E4',
  potPourri: '#F6E7E5',
  roseFog: '#E2B5B0',
  elSalva: '#923631',
  slate200: '#E2E8F0',
  slate100: '#F1F5F9',
  whiteOverlay12: 'rgba(255, 255, 255, 0.12)',
  scrimPetro: 'rgba(30, 58, 63, 0.55)',
  /** Aviso de sucesso e selo ENTREGUE (F35), 5,94:1 com texto branco. */
  moss: '#3E6E4A',
  /** Selo EM ANDAMENTO (F35), 8,55:1 com texto branco. */
  deepTeal: '#2C5258',
} as const;

export const color = {
  /** Ícone ilustrativo de estado (P2): Spectra, 6,53:1 sobre `#EDE9E4`. */
  icon: {
    state: primitiveColor.spectra,
  },
  surface: {
    default: primitiveColor.white,
    /** Fundo de tela (Pampas). */
    background: primitiveColor.pampas,
    skeleton: primitiveColor.slate100,
    brand: primitiveColor.petro900,
    overlay: primitiveColor.scrimPetro,
    /** Faixa de erro dentro do formulário (Pot Pourri). */
    errorTint: primitiveColor.potPourri,
    /** Círculo do ícone de estado de tela cheia (P2), `#EDE9E4`. */
    neutral: primitiveColor.grey91,
    /** Círculo do avatar (Spectra). */
    avatar: primitiveColor.spectra,
    /** Botão de ícone sobre o cabeçalho petro (branco a 12%). */
    onBrandControl: primitiveColor.whiteOverlay12,
  },
  text: {
    primary: primitiveColor.petro900,
    onBrand: primitiveColor.white,
    /** Texto secundário (Flint), 5,36:1 sobre branco. */
    secondary: primitiveColor.flint,
    onPrimaryAction: primitiveColor.white,
    error: primitiveColor.primary600,
    /** Texto dentro da faixa de erro (El Salva), 6,26:1 sobre Pot Pourri. */
    errorOnBanner: primitiveColor.elSalva,
    /** Placeholder do campo (Flint), 5,36:1 sobre branco. */
    placeholder: primitiveColor.flint,
    /** Item inativo da tab bar (Tide), 5,76:1 sobre petro. */
    onBrandMuted: primitiveColor.tide,
    /** Item selecionado da tab bar, 4,68:1 sobre petro. */
    tabSelected: primitiveColor.coral,
  },
  border: {
    /** Borda de campo em repouso, 3,56:1 sobre branco e 3,28:1 sobre Pampas. */
    default: primitiveColor.stone,
    skeleton: primitiveColor.slate200,
    /** Divisor e contorno decorativo (Westar): cartão e botão "Sair da conta". */
    divider: primitiveColor.westar,
    /** Contorno da faixa de erro (Rose Fog). */
    errorBanner: primitiveColor.roseFog,
    /** Campo com foco e campo em erro: 2 px Crail (5,41:1 sobre branco). */
    focusField: primitiveColor.primary600,
    error: primitiveColor.primary600,
  },
  action: {
    primaryBackground: primitiveColor.primary600,
  },
  /** Confirmação de ação concluída (aviso de sucesso e selo ENTREGUE). */
  feedback: {
    success: primitiveColor.moss,
  },
  /** Selos de status da ordem de serviço sem token próprio no FPdB8 (só EM ANDAMENTO). */
  status: {
    inProgress: primitiveColor.deepTeal,
  },
  focus: {
    ring: primitiveColor.petro900,
    ringOffset: primitiveColor.white,
    /** Anel sobre a barra petro (T1): branco, 12,12:1; o petro some sobre a barra. */
    ringOnBrand: primitiveColor.white,
  },
} as const;

/** Escala do Figma FPdB8: as chaves `sN` repetem o valor em px. */
export const spacing = {
  xs: 4,
  s6: 6,
  sm: 8,
  s10: 10,
  s12: 12,
  s14: 14,
  md: 16,
  s20: 20,
  s22: 22,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  /** Avatar de 40 (metade). */
  avatarSmall: 20,
  md: 12,
  lg: 16,
  /** Cartão do diálogo (Figma). */
  dialog: 10,
  /** Anel de foco do item da tab bar (T1 `84:786`): 86 × 58 dentro da célula de 90 × 62. */
  tabFocus: 10,
  /** Avatar de 84 px (metade). */
  avatar: 42,
  pill: 999,
} as const;

/** Famílias embutidas por `expo-font` (pacotes `@expo-google-fonts/*`, OFL-1.1). */
export const fontFamily = {
  displayBold: 'BarlowCondensed_700Bold',
  displaySemiBold: 'BarlowCondensed_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
} as const;

export const typography = {
  title: { fontFamily: fontFamily.displaySemiBold, fontSize: 24 },
  /** Título do estado de tela cheia (P2): Barlow Condensed SemiBold 20. */
  stateTitle: { fontFamily: fontFamily.displaySemiBold, fontSize: 20 },
  body: { fontFamily: fontFamily.body, fontSize: 16 },
  label: { fontFamily: fontFamily.bodySemiBold, fontSize: 14 },
  button: { fontFamily: fontFamily.bodySemiBold, fontSize: 15 },
  caption: { fontFamily: fontFamily.body, fontSize: 12 },
  /** Título da marca no Login (caixa alta). */
  brandTitle: { fontFamily: fontFamily.displayBold, fontSize: 30, letterSpacing: 0.6 },
  subtitle: { fontFamily: fontFamily.body, fontSize: 13 },
  /** Título do cabeçalho petro. */
  appBarTitle: { fontFamily: fontFamily.displaySemiBold, fontSize: 21, letterSpacing: 0.21 },
  fieldLabel: { fontFamily: fontFamily.bodyMedium, fontSize: 13 },
  input: { fontFamily: fontFamily.body, fontSize: 15 },
  /** Mensagem dentro da faixa de erro. */
  banner: { fontFamily: fontFamily.body, fontSize: 14, lineHeight: 19.6 },
  dialogTitle: { fontFamily: fontFamily.displayBold, fontSize: 22 },
  dialogMessage: { fontFamily: fontFamily.body, fontSize: 14, lineHeight: 21 },
  rowLabel: { fontFamily: fontFamily.body, fontSize: 14 },
  rowValue: { fontFamily: fontFamily.bodyMedium, fontSize: 14 },
  badge: { fontFamily: fontFamily.bodySemiBold, fontSize: 12 },
  avatarInitials: { fontFamily: fontFamily.displaySemiBold, fontSize: 32 },
  /** Iniciais do avatar de 40 das listas. */
  avatarInitialsSmall: { fontFamily: fontFamily.displaySemiBold, fontSize: 17 },
  /** Nome no cartão de detalhe do cliente e do veículo. */
  detailName: { fontFamily: fontFamily.displaySemiBold, fontSize: 22 },
  /** Título de seção ("Veículos (2)"); a caixa alta é visual. */
  sectionTitle: { fontFamily: fontFamily.displaySemiBold, fontSize: 15, letterSpacing: 0.5 },
  /** Título do cartão de lista. */
  cardTitle: { fontFamily: fontFamily.bodySemiBold, fontSize: 15 },
  tabLabel: { fontFamily: fontFamily.bodyMedium, fontSize: 11 },
  tabLabelSelected: { fontFamily: fontFamily.bodySemiBold, fontSize: 11 },
} as const;

/** Toque mínimo recomendado: 44pt (iOS) / 48dp (Android) — 48 atende os dois. */
export const minTouchTarget = 48;

/** Medidas visíveis do Figma (ADR-014, regra 15): a área de toque segue `minTouchTarget`. */
export const size = {
  field: 46,
  button: 50,
  appBar: 56,
  tabBar: 62,
  avatar: 84,
  /** Botão de ícone do cabeçalho (seta de voltar e botão de usuário). */
  iconButton: 36,
  /** Círculo do ícone de estado de tela cheia (P2). */
  stateIcon: 72,
  /** Caixa visível do X de fechar dos popups (F38, 48 − 16); o toque chega a 48 por `hitSlop`. */
  closeButton: 32,
  /** Caixa do indicador de carregamento dentro do botão (L2 `82:2137`). */
  loadingIndicator: 16,
  /** Avatar das listas (F35). */
  avatarSmall: 40,
  /** Altura mínima do cartão de lista (F35); cresce com fonte ampliada. */
  listRow: 66,
  /** Altura do campo de texto multilinha (Endereço). */
  textArea: 76,
  /** Altura mínima do aviso de sucesso (F35). */
  notice: 44,
  /** Escudo da marca no Login (`10:906`, 84 × 96). */
  brandShieldWidth: 84,
  brandShieldHeight: 96,
} as const;

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

/** Raio do wrapper do anel de foco: contorna um controle de `radius.sm` (8) mais borda e respiro. */
export const focusRingRadius = radius.sm + focusRingWidth + focusRingOffset;

export const borderWidth = {
  hairline: 1,
  /** Foco e erro de campo. */
  field: 2,
} as const;

export const opacity = {
  pressed: 0.85,
  disabled: 0.5,
  /** Itens desabilitados da tab bar (T2, legenda do frame: 50%). */
  unavailable: 0.5,
} as const;

export const iconSize = {
  tab: 22,
  alert: 32,
  /** Ícones do cabeçalho (seta e usuário) e da faixa de erro. */
  appBar: 18,
  banner: 18,
  /** Ícone do cartão de veículo. */
  row: 20,
  /** Seta do cartão de lista. */
  chevron: 18,
  search: 18,
  /** Ícone à esquerda do texto do botão ("+" de "Novo cliente", L1 do F26). */
  button: 18,
} as const;

export const layout = {
  dialogMaxWidth: 320,
  tabBarMaxWidth: 480,
  /** Coluna de ações do estado de tela cheia (P2): botões de 328 no frame de 360. */
  stateActionsMaxWidth: 328,
  /** Largura da mensagem do estado de tela cheia (P2 `83:769` e Início I1 `89:985`). */
  stateMessageMaxWidth: 289,
  /** Coluna de conteúdo de lista, detalhe e formulário em 768 e 1280 (F35). */
  contentMaxWidth: 560,
} as const;

/**
 * Sombras do Figma: cartão do Perfil `0 1 1 rgba(30,58,63,.06)`, cartão de dados dos
 * detalhes (F26) `0 1 2 rgba(30,58,63,.06)` e diálogo `0 12 16 rgba(0,0,0,.25)`.
 * Cartões de lista e de OS do F26 não têm sombra. No Android `elevation` só aproxima
 * (P-08 do ADR-014).
 */
export const shadow = {
  card: {
    shadowColor: primitiveColor.petro900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 1,
    elevation: 1,
  },
  detail: {
    shadowColor: primitiveColor.petro900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  dialog: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

/** Glifos decorativos (escondidos do leitor de tela), não são texto de interface. */
export const glyph = {
  alert: '⚠',
  /** Ponto de exclamação do ícone de alerta da faixa de erro. */
  alertMark: '!',
} as const;

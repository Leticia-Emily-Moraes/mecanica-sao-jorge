/**
 * Regras de fronteira da F40: tornam verificável por `npm run lint` que tela
 * e componente não chamam API, não guardam token, não declaram valor visual
 * solto nem texto literal de interface. Só regras core do ESLint 8.
 */

const HEX_COLOR = {
  selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
  message: 'Cor fixa: use um token de `@/theme/tokens`.',
};

const FIXED_VISUAL_NUMBER = {
  selector:
    'Property[key.name=/^(fontSize|lineHeight|padding.*|margin.*|gap|borderRadius|borderWidth|minHeight|minWidth|maxWidth|maxHeight|opacity)$/] > Literal[raw=/^[1-9]/]',
  message: 'Tamanho, espaçamento, borda ou opacidade fixos: use um token de `@/theme/tokens`.',
};

const LITERAL_UI_TEXT = [
  {
    selector: 'JSXText[value=/\\S/]',
    message: 'Texto de interface literal: receba por prop, vindo de `t(chave)`.',
  },
  {
    selector:
      'JSXAttribute[name.name=/^(accessibilityLabel|accessibilityHint|placeholder|title|label)$/] > Literal',
    message: 'Texto de interface literal: receba por prop, vindo de `t(chave)`.',
  },
];

const FETCH_GLOBAL = {
  name: 'fetch',
  message: 'Chamada HTTP só na camada `services/`; a tela usa um hook.',
};

function forbidImports(patterns, message) {
  return {
    'no-restricted-imports': ['error', { patterns: [{ group: patterns, message }] }],
  };
}

module.exports = {
  root: true,
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
  ignorePatterns: ['node_modules/', 'dist/', 'web-build/', '.expo/'],
  overrides: [
    {
      // Valor visual só em tokens.ts: nenhum hex em tela, componente, hook ou serviço.
      files: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
      excludedFiles: ['src/theme/tokens.ts', '**/*.test.{ts,tsx}', 'src/test-utils/**'],
      rules: { 'no-restricted-syntax': ['error', HEX_COLOR] },
    },
    {
      // Tela e componente: sem valor visual fixo, sem texto literal e sem fetch.
      files: ['app/**/*.tsx', 'src/components/**/*.{ts,tsx}'],
      excludedFiles: ['**/*.test.{ts,tsx}'],
      rules: {
        'no-restricted-syntax': ['error', HEX_COLOR, FIXED_VISUAL_NUMBER, ...LITERAL_UI_TEXT],
        'no-restricted-globals': ['error', FETCH_GLOBAL],
      },
    },
    {
      // Tela: não importa serviço nem armazenamento seguro; passa por hook.
      files: ['app/**/*.tsx'],
      excludedFiles: ['**/*.test.tsx'],
      rules: forbidImports(
        ['@/services/*', 'expo-secure-store'],
        'Tela não fala com serviço nem com SecureStore: use um hook de `@/hooks`.',
      ),
    },
    {
      // Componente base: sem texto próprio, sem estado de negócio, sem rede.
      files: ['src/components/ui/**/*.{ts,tsx}'],
      excludedFiles: ['**/*.test.{ts,tsx}'],
      rules: forbidImports(
        [
          '@/i18n/*',
          '@/hooks/*',
          '@/services/*',
          '@/config/*',
          '@/components/menu/*',
          '@/components/perfil/*',
        ],
        'Componente base recebe texto e dados por prop; não importa i18n, hooks nem serviços.',
      ),
    },
    {
      files: ['src/components/menu/**/*.{ts,tsx}', 'src/components/perfil/**/*.{ts,tsx}'],
      excludedFiles: ['**/*.test.{ts,tsx}'],
      rules: forbidImports(
        ['@/services/*', 'expo-secure-store'],
        'Componente não fala com serviço nem com SecureStore: use um hook de `@/hooks`.',
      ),
    },
    {
      // Hook: orquestra serviço e estado; não conhece componente, texto nem estilo.
      files: ['src/hooks/**/*.{ts,tsx}'],
      excludedFiles: ['**/*.test.{ts,tsx}'],
      rules: forbidImports(
        ['@/components/*', '@/i18n/*', '@/theme/*'],
        'Hook devolve estado tipado; a tela escolhe o texto e o estilo.',
      ),
    },
    {
      // Serviço: TypeScript puro, sem React e sem log (token e dado pessoal passam por aqui).
      files: ['src/services/**/*.ts'],
      excludedFiles: ['**/*.test.ts'],
      rules: {
        ...forbidImports(
          [
            'react',
            'react-native',
            'expo-router',
            '@/components/*',
            '@/hooks/*',
            '@/i18n/*',
            '@/theme/*',
          ],
          'Serviço é TypeScript puro: sem React, sem UI.',
        ),
        'no-console': 'error',
      },
    },
  ],
};

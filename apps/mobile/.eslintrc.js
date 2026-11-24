/**
 * Regras de fronteira da F40 e do ADR-015: tornam verificável por `npm run lint`
 * que `app/` só roteia, que tela e componente não chamam API, não guardam token,
 * não declaram estilo no arquivo do JSX, não leem token direto, não declaram valor
 * visual solto nem texto literal de interface. Só regras core do ESLint 8.
 *
 * Atenção (ESLint 8): quando dois overrides casam o mesmo arquivo e configuram a
 * mesma regra, o último substitui as opções inteiras, não soma. Por isso cada
 * lista de `no-restricted-syntax` abaixo é montada completa, uma vez por pasta.
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

const ROUTE_ONLY = {
  selector: 'Program > :not(ExportNamedDeclaration[source], ExportAllDeclaration)',
  message: 'app/ só roteia: reexporte a tela de `@/screens` ou o layout de `@/layouts`.',
};

const STYLESHEET_IN_JSX_FILE = {
  selector: 'MemberExpression[object.name="StyleSheet"][property.name="create"]',
  message: 'StyleSheet.create só em `<nome>.styles.ts`, na pasta do componente.',
};

const INLINE_STYLE_OBJECT = {
  selector: 'JSXAttribute[name.name=/[sS]tyle/] ObjectExpression',
  message: 'Objeto de estilo inline: use `styles` ou uma função de `<nome>.styles.ts`.',
};

const TOKENS_IN_JSX_FILE = {
  selector: 'ImportDeclaration[source.value="@/theme/tokens"]',
  message:
    'Valor visual entra pelo `<nome>.styles.ts` (`styles` ou `visual`), não direto do token.',
};

const FOREIGN_STYLES_IMPORT = [
  {
    selector: 'ImportDeclaration[source.value=/^[.][.]/][source.value=/styles$/]',
    message: '`*.styles` é privado da pasta do componente: só `./<nome>.styles` é permitido.',
  },
  {
    selector: 'ImportDeclaration[source.value=/^@/][source.value=/styles$/]',
    message: '`*.styles` é privado da pasta do componente: só `./<nome>.styles` é permitido.',
  },
];

const ANY_STYLES_IMPORT = {
  selector: 'ImportDeclaration[source.value=/styles$/]',
  message: 'Tela e layout não têm estilo: componha componentes de `@/components`.',
};

const STYLES_EXPORT_FROM_INDEX = {
  selector: ':matches(ExportAllDeclaration, ExportNamedDeclaration)[source.value=/styles$/]',
  message: 'O `index.ts` reexporta só o componente e seus tipos; nunca o estilo.',
};

const STYLES_FILE_IMPORTS = {
  selector: 'ImportDeclaration:not([source.value="react-native"], [source.value="@/theme/tokens"])',
  message: 'Arquivo de estilo importa só `StyleSheet`, tipos de estilo e `@/theme/tokens`.',
};

const STYLES_FILE_RUNTIME_IMPORT = {
  selector:
    'ImportDeclaration[source.value="react-native"][importKind="value"] ImportSpecifier[importKind="value"]:not([imported.name="StyleSheet"])',
  message: 'Arquivo de estilo importa de `react-native` só `StyleSheet` (tipos com `import type`).',
};

const STYLES_FILE_DEFAULT_EXPORT = {
  selector: 'ExportDefaultDeclaration',
  message: 'Use export nomeado: `styles`, `visual` ou função pura de estilo.',
};

const FETCH_GLOBAL = {
  name: 'fetch',
  message: 'Chamada HTTP só na camada `services/`; a tela usa um hook.',
};

const JSX_FILE_SYNTAX = [
  HEX_COLOR,
  FIXED_VISUAL_NUMBER,
  ...LITERAL_UI_TEXT,
  STYLESHEET_IN_JSX_FILE,
  INLINE_STYLE_OBJECT,
  TOKENS_IN_JSX_FILE,
  ...FOREIGN_STYLES_IMPORT,
];

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
      // app/ só roteia: cada arquivo é um re-export de tela ou de layout (ADR-015).
      files: ['app/**/*.{ts,tsx}'],
      excludedFiles: ['**/*.test.{ts,tsx}'],
      rules: { 'no-restricted-syntax': ['error', ROUTE_ONLY] },
    },
    {
      // Componente, tela e layout (JSX): sem estilo no arquivo, sem token direto,
      // sem valor visual fixo, sem texto literal e sem fetch.
      files: ['src/components/**/*.tsx', 'src/screens/**/*.tsx', 'src/layouts/**/*.tsx'],
      excludedFiles: ['**/*.test.tsx'],
      rules: {
        'no-restricted-syntax': ['error', ...JSX_FILE_SYNTAX],
        'no-restricted-globals': ['error', FETCH_GLOBAL],
      },
    },
    {
      // Tela e layout não têm estilo próprio nem falam com serviço ou SecureStore.
      files: ['src/screens/**/*.tsx', 'src/layouts/**/*.tsx'],
      excludedFiles: ['**/*.test.tsx'],
      rules: {
        'no-restricted-syntax': ['error', ...JSX_FILE_SYNTAX, ANY_STYLES_IMPORT],
        ...forbidImports(
          ['@/services/*', 'expo-secure-store'],
          'Tela não fala com serviço nem com SecureStore: use um hook de `@/hooks`.',
        ),
      },
    },
    {
      // Arquivo de estilo: só StyleSheet, tipos de estilo e tokens; export nomeado.
      files: ['src/**/*.styles.ts'],
      rules: {
        'no-restricted-syntax': [
          'error',
          HEX_COLOR,
          FIXED_VISUAL_NUMBER,
          STYLES_FILE_IMPORTS,
          STYLES_FILE_RUNTIME_IMPORT,
          STYLES_FILE_DEFAULT_EXPORT,
        ],
      },
    },
    {
      // O index.ts da pasta do componente não expõe o estilo.
      files: ['src/components/**/index.ts'],
      rules: { 'no-restricted-syntax': ['error', STYLES_EXPORT_FROM_INDEX] },
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

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// O Expo Router empacota todo arquivo de "app/" via require.context; sem isto,
// *.test.tsx (que fica ao lado do código testado, por convenção da casa) entra
// no bundle do app e arrasta dependências de teste (ex. @testing-library) que
// não rodam em runtime nativo.
config.resolver.blockList = [/\.test\.[jt]sx?$/, /\.spec\.[jt]sx?$/];

module.exports = config;

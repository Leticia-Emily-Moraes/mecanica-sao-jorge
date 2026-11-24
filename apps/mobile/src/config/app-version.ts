import Constants from 'expo-constants';

/**
 * Versão do app lida da configuração do Expo (`app.config.ts`) por
 * `expo-constants`. Devolve `undefined` quando a configuração não traz versão,
 * e a tela mostra o texto neutro da chave `perfil.versaoIndisponivel`.
 */
export function getAppVersion(): string | undefined {
  const version = Constants.expoConfig?.version;
  return typeof version === 'string' && version.trim() !== '' ? version : undefined;
}

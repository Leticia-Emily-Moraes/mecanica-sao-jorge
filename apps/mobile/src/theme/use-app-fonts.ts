import { BarlowCondensed_600SemiBold } from '@expo-google-fonts/barlow-condensed/600SemiBold';
import { BarlowCondensed_700Bold } from '@expo-google-fonts/barlow-condensed/700Bold';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { useFonts } from 'expo-font';

import { fontFamily } from './tokens';

/**
 * Carrega as famílias da identidade (Barlow Condensed e Inter, OFL-1.1),
 * embutidas no bundle por `expo-font` — nada vem de CDN em tempo de execução.
 * Só os cinco pesos que `tokens.ts` usa entram no bundle. Devolve `true` quando
 * terminou: com sucesso ou com falha (o app abre com a fonte do sistema em vez
 * de ficar preso na tela em branco).
 */
export function useAppFonts(): boolean {
  const [loaded, error] = useFonts({
    [fontFamily.displaySemiBold]: BarlowCondensed_600SemiBold,
    [fontFamily.displayBold]: BarlowCondensed_700Bold,
    [fontFamily.body]: Inter_400Regular,
    [fontFamily.bodyMedium]: Inter_500Medium,
    [fontFamily.bodySemiBold]: Inter_600SemiBold,
  });

  return loaded || error !== null;
}

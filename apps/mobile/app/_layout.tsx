import { Stack } from 'expo-router';
import type { ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/hooks/use-auth';
import { useAppFonts } from '@/theme/use-app-fonts';

export default function RootLayout(): ReactElement | null {
  const fontsReady = useAppFonts();

  // Sem as fontes o primeiro quadro sairia na fonte do sistema e trocaria
  // de tipografia logo depois; espera o carregamento (ou a falha).
  if (!fontsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

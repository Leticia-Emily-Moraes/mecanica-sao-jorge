import { Stack } from 'expo-router';
import type { ReactElement } from 'react';

import { AuthProvider } from '@/auth/auth-context';

export default function RootLayout(): ReactElement {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}

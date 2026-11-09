import { Slot, useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAuth } from '@/auth/auth-context';
import { MenuTabBar } from '@/components/menu-tab-bar';
import { color } from '@/theme/tokens';

/**
 * Casa pós-login (F33, US-MENU-01/08): guarda a sessão de novo aqui, no nível
 * do grupo, independente do guard de `app/index.tsx` — cobre quem chega
 * direto numa rota do menu por deep link ou retomada do app sem passar pelo
 * guard de entrada. Mesmo padrão de defesa dupla que `(menu)/perfil.tsx` já
 * usa para si mesma.
 */
export default function MenuLayout(): ReactElement | null {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status.tipo !== 'autenticado' && status.tipo !== 'carregando') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status.tipo !== 'autenticado') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.conteudo}>
        <Slot />
      </View>
      <MenuTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.surface.default,
  },
  conteudo: {
    flex: 1,
  },
});

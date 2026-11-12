import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/auth/auth-context';
import { ErrorRetryModal } from '@/components/error-retry-modal';
import { t } from '@/i18n/strings';
import { color } from '@/theme/tokens';

/**
 * Tela de reidratação de sessão: decide, sem interação do usuário, se o
 * destino é Login ou Perfil (US-LGN-FRONT-06). É também onde os estados de
 * carregando/erro da "entrada" em Perfil aparecem — decisão registrada no
 * handoff da F30 (F25 PRD, Dúvida 1, opção a): sem endpoint de perfil
 * dedicado, Perfil não tem carregamento de rede próprio, só a reidratação do
 * SecureStore ao abrir o app.
 */
export default function IndexScreen(): ReactElement {
  const { status, tentarNovamenteInicializacao, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status.tipo === 'autenticado') {
      router.replace('/perfil');
    } else if (status.tipo === 'naoAutenticado') {
      router.replace('/login');
    }
  }, [status, router]);

  return (
    <View style={styles.container}>
      {status.tipo === 'carregando' ? (
        <ActivityIndicator
          size="large"
          color={color.text.primary}
          accessibilityLabel={t('sessao.inicializando.anuncio')}
        />
      ) : null}

      <ErrorRetryModal
        visible={status.tipo === 'erroInicializacao'}
        title={t('sessao.erroInicializacao.titulo')}
        message={t('sessao.erroInicializacao.mensagem')}
        retryLabel={t('sessao.erroInicializacao.botaoTentarNovamente')}
        onRetry={tentarNovamenteInicializacao}
        secondaryLabel={t('sessao.erroInicializacao.botaoEntrarNovamente')}
        onSecondaryPress={() => void logout()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.surface.default,
  },
});

import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useEffect } from 'react';

import { ScreenContainer } from '@/components/ui/screen-container';
import { StateView } from '@/components/ui/state-view';
import { useAuth } from '@/hooks/use-auth';
import { t } from '@/i18n/strings';

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
    <ScreenContainer>
      {status.tipo === 'carregando' ? (
        <StateView state="loading" loadingLabel={t('sessao.inicializando.anuncio')} />
      ) : null}

      <StateView
        state="error"
        visible={status.tipo === 'erroInicializacao'}
        title={t('sessao.erroInicializacao.titulo')}
        message={t('sessao.erroInicializacao.mensagem')}
        retryLabel={t('sessao.erroInicializacao.botaoTentarNovamente')}
        onRetry={tentarNovamenteInicializacao}
        secondaryLabel={t('sessao.erroInicializacao.botaoEntrarNovamente')}
        onSecondaryPress={() => void logout()}
      />
    </ScreenContainer>
  );
}

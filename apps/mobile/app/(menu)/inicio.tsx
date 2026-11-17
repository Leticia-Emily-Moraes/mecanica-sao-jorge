import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';

import { ScreenContainer } from '@/components/ui/screen-container';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StateView } from '@/components/ui/state-view';
import { t } from '@/i18n/strings';

/**
 * Tela inicial pós-login (F41, P-01 do PRD, opção A, aguardando confirmação da
 * pessoa): nenhum módulo está programado, então a tela mostra o cabeçalho com
 * o botão de usuário, o estado vazio e a tab bar do menu com os 4 itens
 * desabilitados. Não é uma tela de negócio; vai embora quando o primeiro
 * módulo (Ordens, F42) chegar.
 */
export default function InicioScreen(): ReactElement {
  const router = useRouter();

  return (
    <>
      <ScreenHeader
        title={t('inicio.titulo')}
        user={{ label: t('cabecalho.usuario.rotulo'), onPress: () => router.push('/perfil') }}
      />
      <ScreenContainer>
        <StateView
          state="empty"
          title={t('inicio.vazio.titulo')}
          message={t('inicio.vazio.mensagem')}
        />
      </ScreenContainer>
    </>
  );
}

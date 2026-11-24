import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';

import { describeAccessProfile } from '@/components/perfil/access-profile-badge';
import { getInitials } from '@/components/perfil/avatar';
import { InfoCard } from '@/components/perfil/info-card';
import { ProfileIdentity } from '@/components/perfil/profile-identity';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ScreenContainer } from '@/components/ui/screen-container';
import { ScreenFooter } from '@/components/ui/screen-footer';
import { ScreenHeader } from '@/components/ui/screen-header';
import { getAppVersion } from '@/config/app-version';
import { useAuth } from '@/hooks/use-auth';
import { t } from '@/i18n/strings';

/**
 * Perfil: tela própria, fora do grupo `(menu)` e sem tab bar (frame `10:3842`).
 * Chega pelo botão de usuário do cabeçalho; a seta de voltar devolve ao
 * início. Só leitura, com o botão de sair no rodapé.
 */
export default function ProfileScreen(): ReactElement | null {
  const { status, logout } = useAuth();
  const router = useRouter();
  const [dialogoVisivel, setDialogoVisivel] = useState(false);

  useEffect(() => {
    if (status.tipo !== 'autenticado' && status.tipo !== 'carregando') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status.tipo !== 'autenticado') {
    return null;
  }

  const { usuario } = status;
  const perfil = describeAccessProfile(usuario.perfil);

  function voltar(): void {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/inicio');
    }
  }

  async function confirmarSaida(): Promise<void> {
    setDialogoVisivel(false);
    await logout();
  }

  return (
    <>
      <ScreenHeader
        title={t('perfil.titulo')}
        back={{ label: t('cabecalho.voltar.rotulo'), onPress: voltar }}
      />
      <ScreenContainer>
        <ProfileIdentity
          initials={getInitials(usuario.nome)}
          name={usuario.nome}
          badge={perfil.badge}
        />

        <InfoCard
          rows={[
            { label: t('perfil.rotuloUsuario'), value: usuario.email },
            { label: t('perfil.rotuloPerfil'), value: perfil.description },
            {
              label: t('perfil.rotuloVersao'),
              value: getAppVersion() ?? t('perfil.versaoIndisponivel'),
            },
          ]}
        />

        <ScreenFooter>
          <Button
            label={t('perfil.botaoSair.rotulo')}
            onPress={() => setDialogoVisivel(true)}
            variant="outlineAccent"
          />
        </ScreenFooter>

        <ConfirmDialog
          visible={dialogoVisivel}
          title={t('perfil.dialogoLogout.titulo')}
          message={t('perfil.dialogoLogout.mensagem')}
          cancelLabel={t('perfil.dialogoLogout.botaoCancelar')}
          confirmLabel={t('perfil.dialogoLogout.botaoConfirmar')}
          onCancel={() => setDialogoVisivel(false)}
          onConfirm={() => void confirmarSaida()}
        />
      </ScreenContainer>
    </>
  );
}

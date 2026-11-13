import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';

import { ProfileSummary } from '@/components/perfil/profile-summary';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ScreenContainer } from '@/components/ui/screen-container';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useAuth } from '@/hooks/use-auth';
import { t } from '@/i18n/strings';

export default function PerfilScreen(): ReactElement | null {
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

  async function confirmarSaida(): Promise<void> {
    setDialogoVisivel(false);
    await logout();
  }

  return (
    <ScreenContainer
      header={<ScreenHeader title={t('perfil.titulo')} />}
      footer={
        <Button
          label={t('perfil.botaoSair.rotulo')}
          onPress={() => setDialogoVisivel(true)}
          variant="primary"
          size="page"
        />
      }
    >
      <ProfileSummary
        name={usuario.nome}
        email={usuario.email}
        accessProfile={usuario.perfil}
        accessibilityLabel={[
          `${t('perfil.rotuloNome')}: ${usuario.nome}`,
          `${t('perfil.rotuloEmail')}: ${usuario.email}`,
          `${t('perfil.rotuloPerfil')}: ${usuario.perfil}`,
        ].join('. ')}
      />

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
  );
}

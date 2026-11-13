import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';

import { AccessProfileBadge } from '@/components/perfil/access-profile-badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ReadOnlyField } from '@/components/ui/read-only-field';
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
    <ScreenContainer>
      <ScreenHeader title={t('perfil.titulo')} />

      <ReadOnlyField label={t('perfil.rotuloNome')} value={usuario.nome} />
      <ReadOnlyField label={t('perfil.rotuloEmail')} value={usuario.email} />
      <ReadOnlyField label={t('perfil.rotuloPerfil')}>
        <AccessProfileBadge label={usuario.perfil} />
      </ReadOnlyField>

      <Button
        label={t('perfil.botaoSair.rotulo')}
        onPress={() => setDialogoVisivel(true)}
        variant="primary"
      />

      <ConfirmDialog
        visible={dialogoVisivel}
        title={t('perfil.dialogoLogout.titulo')}
        cancelLabel={t('perfil.dialogoLogout.botaoCancelar')}
        confirmLabel={t('perfil.dialogoLogout.botaoConfirmar')}
        onCancel={() => setDialogoVisivel(false)}
        onConfirm={() => void confirmarSaida()}
      />
    </ScreenContainer>
  );
}

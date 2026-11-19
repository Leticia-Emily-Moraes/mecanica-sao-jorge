import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccessProfileBadge } from '@/components/perfil/access-profile-badge';
import { describeAccessProfile } from '@/components/perfil/access-profile';
import { Avatar } from '@/components/ui/avatar';
import { InfoCard } from '@/components/ui/info-card';
import { getInitials } from '@/formatters/get-initials';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ScreenContainer } from '@/components/ui/screen-container';
import { ScreenHeader } from '@/components/ui/screen-header';
import { getAppVersion } from '@/config/app-version';
import { useAuth } from '@/hooks/use-auth';
import { t } from '@/i18n/strings';
import { color, spacing, typography } from '@/theme/tokens';

/**
 * Perfil: tela própria, fora do grupo `(menu)` e sem tab bar (frame `10:3842`).
 * Chega pelo botão de usuário do cabeçalho; a seta de voltar devolve ao
 * início. Só leitura, com o botão de sair no rodapé.
 */
export default function PerfilScreen(): ReactElement | null {
  const { status, logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
        <View style={styles.identity}>
          <Avatar initials={getInitials(usuario.nome)} />
          <Text accessibilityRole="header" style={styles.name}>
            {usuario.nome}
          </Text>
          <AccessProfileBadge label={perfil.badge} />
        </View>

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

        <View style={[styles.footer, { paddingBottom: spacing.s20 + insets.bottom }]}>
          <Button
            label={t('perfil.botaoSair.rotulo')}
            onPress={() => setDialogoVisivel(true)}
            variant="outlineAccent"
          />
        </View>

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

const styles = StyleSheet.create({
  identity: {
    alignItems: 'center',
    gap: spacing.sm,
    // Medido no frame 10:3842: 36 entre a barra e o avatar, 20 entre o selo e o cartão.
    paddingTop: spacing.md + spacing.s20,
    paddingBottom: spacing.s20,
  },
  name: {
    color: color.text.primary,
    fontFamily: typography.title.fontFamily,
    fontSize: typography.title.fontSize,
    textAlign: 'center',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

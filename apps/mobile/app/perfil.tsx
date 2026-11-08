import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/auth-context';
import { Button } from '@/components/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { t } from '@/i18n/strings';
import { color, radius, spacing, typography } from '@/theme/tokens';

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
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        {t('perfil.titulo')}
      </Text>

      <View style={styles.campo}>
        <Text style={styles.rotulo}>{t('perfil.rotuloNome')}</Text>
        <Text style={styles.valor}>{usuario.nome}</Text>
      </View>

      <View style={styles.campo}>
        <Text style={styles.rotulo}>{t('perfil.rotuloEmail')}</Text>
        <Text style={styles.valor}>{usuario.email}</Text>
      </View>

      <View style={styles.campo}>
        <Text style={styles.rotulo}>{t('perfil.rotuloPerfil')}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>{usuario.perfil}</Text>
        </View>
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: color.surface.default,
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    color: color.text.primary,
    marginBottom: spacing.lg,
  },
  campo: {
    marginBottom: spacing.md,
  },
  rotulo: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: color.text.secondary,
    marginBottom: spacing.xs,
  },
  valor: {
    fontSize: typography.body.fontSize,
    color: color.text.primary,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: color.surface.skeleton,
    borderWidth: 1,
    borderColor: color.border.default,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeLabel: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: color.text.primary,
  },
});

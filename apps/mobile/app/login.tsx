import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useEffect } from 'react';

import { BrandHeader } from '@/components/ui/brand-header';
import { Button } from '@/components/ui/button';
import { InlineActionButton } from '@/components/ui/inline-action-button';
import { InlineAlert } from '@/components/ui/inline-alert';
import { ScreenContainer } from '@/components/ui/screen-container';
import { TextField } from '@/components/ui/text-field';
import { useAuth } from '@/hooks/use-auth';
import { useLogin } from '@/hooks/use-login';
import { t } from '@/i18n/strings';
import { spacing } from '@/theme/tokens';

/** Margem lateral do Login no Figma: 16 da tela + 12 do formulário (conteúdo de 304 em 360). */
const LOGIN_HORIZONTAL_PADDING = spacing.md + spacing.s12;

export default function LoginScreen(): ReactElement {
  const { status } = useAuth();
  const router = useRouter();
  const form = useLogin();

  useEffect(() => {
    if (status.tipo === 'autenticado') {
      router.replace('/inicio');
    }
  }, [status, router]);

  const enviando = form.estadoEnvio === 'enviando';
  const credencialInvalida = form.estadoEnvio === 'erroCredencial';
  const erroDeRede = form.estadoEnvio === 'erroRede';

  return (
    <ScreenContainer centered horizontalPadding={LOGIN_HORIZONTAL_PADDING} statusBarStyle="dark">
      <BrandHeader title={t('login.titulo')} subtitle={t('login.subtitulo')} />

      {form.sessaoExpirada ? <InlineAlert message={t('login.sessaoExpirada.mensagem')} /> : null}

      <TextField
        ref={form.emailRef}
        label={t('login.campoEmail.rotulo')}
        placeholder={t('login.campoEmail.placeholder')}
        value={form.email}
        onChangeText={form.atualizarEmail}
        errorMessage={form.erroEmail ? t('login.campoEmail.erroVazio') : undefined}
        invalid={credencialInvalida}
        editable={!enviando}
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
      />

      <TextField
        ref={form.senhaRef}
        label={t('login.campoSenha.rotulo')}
        placeholder={t('login.campoSenha.placeholder')}
        value={form.senha}
        onChangeText={form.atualizarSenha}
        errorMessage={form.erroSenha ? t('login.campoSenha.erroVazio') : undefined}
        invalid={credencialInvalida}
        editable={!enviando}
        secureTextEntry={!form.mostrarSenha}
        textContentType="password"
        rightAccessory={
          <InlineActionButton
            label={
              form.mostrarSenha
                ? t('login.campoSenha.ocultarTexto')
                : t('login.campoSenha.mostrarTexto')
            }
            accessibilityLabel={
              form.mostrarSenha ? t('login.campoSenha.ocultar') : t('login.campoSenha.mostrar')
            }
            disabled={enviando}
            onPress={form.alternarMostrarSenha}
          />
        }
      />

      {credencialInvalida ? <InlineAlert message={t('login.erroCredencial.mensagem')} /> : null}
      {erroDeRede ? <InlineAlert message={t('login.erroRede.mensagem')} /> : null}

      <Button
        label={t('login.botaoEntrar.rotulo')}
        loadingLabel={t('login.botaoEntrar.carregando')}
        loading={enviando}
        onPress={() => void form.enviar()}
      />
    </ScreenContainer>
  );
}

import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { InlineActionButton } from '@/components/ui/inline-action-button';
import { InlineAlert } from '@/components/ui/inline-alert';
import { ScreenContainer } from '@/components/ui/screen-container';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StateView } from '@/components/ui/state-view';
import { TextField } from '@/components/ui/text-field';
import { useAuth } from '@/hooks/use-auth';
import { useLogin } from '@/hooks/use-login';
import { t } from '@/i18n/strings';

export default function LoginScreen(): ReactElement {
  const { status } = useAuth();
  const router = useRouter();
  const form = useLogin();

  useEffect(() => {
    if (status.tipo === 'autenticado') {
      router.replace('/perfil');
    }
  }, [status, router]);

  const enviando = form.estadoEnvio === 'enviando';

  return (
    <ScreenContainer centered>
      <ScreenHeader title={t('login.titulo')} align="center" />

      {form.sessaoExpirada ? <InlineAlert message={t('login.sessaoExpirada.mensagem')} /> : null}

      {form.estadoEnvio === 'erroCredencial' ? (
        <InlineAlert message={t('login.erroCredencial.mensagem')} />
      ) : null}

      <TextField
        ref={form.emailRef}
        label={t('login.campoEmail.rotulo')}
        value={form.email}
        onChangeText={form.atualizarEmail}
        errorMessage={form.erroEmail ? t('login.campoEmail.erroVazio') : undefined}
        editable={!enviando}
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
      />

      <TextField
        ref={form.senhaRef}
        label={t('login.campoSenha.rotulo')}
        value={form.senha}
        onChangeText={form.atualizarSenha}
        errorMessage={form.erroSenha ? t('login.campoSenha.erroVazio') : undefined}
        editable={!enviando}
        secureTextEntry={!form.mostrarSenha}
        textContentType="password"
        rightAccessory={
          <InlineActionButton
            label={
              form.mostrarSenha ? t('login.campoSenha.ocultar') : t('login.campoSenha.mostrar')
            }
            disabled={enviando}
            onPress={form.alternarMostrarSenha}
          />
        }
      />

      <Button
        label={t('login.botaoEntrar.rotulo')}
        loadingLabel={t('login.botaoEntrar.carregando')}
        loading={enviando}
        onPress={() => void form.enviar()}
      />

      <StateView
        state="error"
        visible={form.estadoEnvio === 'erroRede'}
        title={t('login.erroRede.titulo')}
        message={t('login.erroRede.mensagem')}
        retryLabel={t('login.erroRede.botaoTentarNovamente')}
        onRetry={() => void form.enviar()}
      />
    </ScreenContainer>
  );
}

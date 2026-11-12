import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CredenciaisInvalidasError } from '@/auth/auth-api';
import { useAuth } from '@/auth/auth-context';
import { Button } from '@/components/button';
import { ErrorRetryModal } from '@/components/error-retry-modal';
import { TextField } from '@/components/text-field';
import { t } from '@/i18n/strings';
import { color, minTouchTarget, spacing, typography } from '@/theme/tokens';
import { useFocusRing } from '@/theme/use-focus-ring';

type EstadoEnvio = 'idle' | 'enviando' | 'erroRede' | 'erroCredencial';

export default function LoginScreen(): ReactElement {
  const { status, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroEmail, setErroEmail] = useState<string | undefined>(undefined);
  const [erroSenha, setErroSenha] = useState<string | undefined>(undefined);
  const [estadoEnvio, setEstadoEnvio] = useState<EstadoEnvio>('idle');

  const emailRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);
  const toggleFocusRing = useFocusRing();

  useEffect(() => {
    if (status.tipo === 'autenticado') {
      router.replace('/perfil');
    }
  }, [status, router]);

  function limparBannerDeEnvio(): void {
    if (estadoEnvio === 'erroCredencial' || estadoEnvio === 'erroRede') {
      setEstadoEnvio('idle');
    }
  }

  function atualizarEmail(valor: string): void {
    setEmail(valor);
    limparBannerDeEnvio();
  }

  function atualizarSenha(valor: string): void {
    setSenha(valor);
    limparBannerDeEnvio();
  }

  function validar(): boolean {
    const emailVazio = email.trim().length === 0;
    const senhaVazia = senha.length === 0;

    setErroEmail(emailVazio ? t('login.campoEmail.erroVazio') : undefined);
    setErroSenha(senhaVazia ? t('login.campoSenha.erroVazio') : undefined);

    if (emailVazio) {
      emailRef.current?.focus();
    } else if (senhaVazia) {
      senhaRef.current?.focus();
    }

    return !emailVazio && !senhaVazia;
  }

  async function handleSubmit(): Promise<void> {
    if (!validar()) {
      return;
    }

    setEstadoEnvio('enviando');
    try {
      await login(email.trim(), senha);
    } catch (erro) {
      setEstadoEnvio(erro instanceof CredenciaisInvalidasError ? 'erroCredencial' : 'erroRede');
    }
  }

  const enviando = estadoEnvio === 'enviando';
  const sessaoExpirada = status.tipo === 'naoAutenticado' && status.sessaoExpirada;

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        {t('login.titulo')}
      </Text>

      {sessaoExpirada ? (
        <Text
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={styles.avisoSessaoExpirada}
        >
          {t('login.sessaoExpirada.mensagem')}
        </Text>
      ) : null}

      {estadoEnvio === 'erroCredencial' ? (
        <Text
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={styles.erroCredencial}
        >
          {t('login.erroCredencial.mensagem')}
        </Text>
      ) : null}

      <TextField
        ref={emailRef}
        label={t('login.campoEmail.rotulo')}
        value={email}
        onChangeText={atualizarEmail}
        errorMessage={erroEmail}
        editable={!enviando}
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
      />

      <TextField
        ref={senhaRef}
        label={t('login.campoSenha.rotulo')}
        value={senha}
        onChangeText={atualizarSenha}
        errorMessage={erroSenha}
        editable={!enviando}
        secureTextEntry={!mostrarSenha}
        textContentType="password"
        rightAccessory={
          <View style={[styles.toggleRing, toggleFocusRing.focusRingStyle]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                mostrarSenha ? t('login.campoSenha.ocultar') : t('login.campoSenha.mostrar')
              }
              disabled={enviando}
              onFocus={toggleFocusRing.onFocus}
              onBlur={toggleFocusRing.onBlur}
              onPress={() => setMostrarSenha((valor) => !valor)}
              style={styles.toggleButton}
            >
              <Text style={styles.toggleLabel}>
                {mostrarSenha ? t('login.campoSenha.ocultar') : t('login.campoSenha.mostrar')}
              </Text>
            </Pressable>
          </View>
        }
      />

      <Button
        label={t('login.botaoEntrar.rotulo')}
        loadingLabel={t('login.botaoEntrar.carregando')}
        loading={enviando}
        onPress={() => void handleSubmit()}
      />

      <ErrorRetryModal
        visible={estadoEnvio === 'erroRede'}
        title={t('login.erroRede.titulo')}
        message={t('login.erroRede.mensagem')}
        retryLabel={t('login.erroRede.botaoTentarNovamente')}
        onRetry={() => void handleSubmit()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    backgroundColor: color.surface.default,
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    color: color.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  avisoSessaoExpirada: {
    color: color.text.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  erroCredencial: {
    color: color.text.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  toggleRing: {
    borderRadius: spacing.sm,
  },
  toggleButton: {
    minHeight: minTouchTarget,
    minWidth: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  toggleLabel: {
    fontSize: typography.caption.fontSize,
    color: color.text.secondary,
  },
});

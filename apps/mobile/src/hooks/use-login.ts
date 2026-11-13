import type { RefObject } from 'react';
import { useRef, useState } from 'react';
import type { TextInput } from 'react-native';

import { useAuth } from '@/hooks/use-auth';
import { CredenciaisInvalidasError } from '@/services/auth-service';

export type LoginSubmitState = 'idle' | 'enviando' | 'erroRede' | 'erroCredencial';

/** Só há um tipo de erro de campo hoje (campo vazio); a tela escolhe o texto. */
export type LoginFieldError = 'vazio';

export interface UseLoginResult {
  readonly email: string;
  readonly senha: string;
  readonly mostrarSenha: boolean;
  readonly erroEmail: LoginFieldError | undefined;
  readonly erroSenha: LoginFieldError | undefined;
  readonly estadoEnvio: LoginSubmitState;
  readonly sessaoExpirada: boolean;
  readonly emailRef: RefObject<TextInput | null>;
  readonly senhaRef: RefObject<TextInput | null>;
  atualizarEmail(valor: string): void;
  atualizarSenha(valor: string): void;
  alternarMostrarSenha(): void;
  enviar(): Promise<void>;
}

/**
 * Estado e orquestração do formulário de login. Nunca loga e-mail, senha
 * nem token: só converte o resultado do serviço em estado tipado.
 */
export function useLogin(): UseLoginResult {
  const { status, login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroEmail, setErroEmail] = useState<LoginFieldError | undefined>(undefined);
  const [erroSenha, setErroSenha] = useState<LoginFieldError | undefined>(undefined);
  const [estadoEnvio, setEstadoEnvio] = useState<LoginSubmitState>('idle');

  const emailRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);

  function limparAvisoDeEnvio(): void {
    if (estadoEnvio === 'erroCredencial' || estadoEnvio === 'erroRede') {
      setEstadoEnvio('idle');
    }
  }

  function atualizarEmail(valor: string): void {
    setEmail(valor);
    limparAvisoDeEnvio();
  }

  function atualizarSenha(valor: string): void {
    setSenha(valor);
    limparAvisoDeEnvio();
  }

  function alternarMostrarSenha(): void {
    setMostrarSenha((valor) => !valor);
  }

  function validar(): boolean {
    const emailVazio = email.trim().length === 0;
    const senhaVazia = senha.length === 0;

    setErroEmail(emailVazio ? 'vazio' : undefined);
    setErroSenha(senhaVazia ? 'vazio' : undefined);

    if (emailVazio) {
      emailRef.current?.focus();
    } else if (senhaVazia) {
      senhaRef.current?.focus();
    }

    return !emailVazio && !senhaVazia;
  }

  async function enviar(): Promise<void> {
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

  return {
    email,
    senha,
    mostrarSenha,
    erroEmail,
    erroSenha,
    estadoEnvio,
    sessaoExpirada: status.tipo === 'naoAutenticado' && status.sessaoExpirada,
    emailRef,
    senhaRef,
    atualizarEmail,
    atualizarSenha,
    alternarMostrarSenha,
    enviar,
  };
}

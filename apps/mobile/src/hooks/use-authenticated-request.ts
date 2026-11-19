import { useCallback, useEffect, useRef } from 'react';

import {
  ErroDeValidacaoError,
  type ErroDeApi,
  FalhaDeConexaoError,
  RecursoNaoEncontradoError,
  RequisicaoCanceladaError,
} from '@/services/api-errors';
import { SessaoExpiradaError } from '@/services/http-client';

import { useAuth } from './use-auth';

export type Resultado<T> =
  { readonly ok: true; readonly valor: T } | { readonly ok: false; readonly erro: ErroDeApi };

export type Chamada<T> = (token: string, signal: AbortSignal) => Promise<T>;

export interface AuthenticatedRequest {
  /**
   * Roda a chamada com o token da sessão. Uma chamada nova no mesmo `canal`
   * aborta a anterior; resposta de chamada abortada nunca chega à tela.
   */
  readonly executar: <T>(chamada: Chamada<T>, canal?: string) => Promise<Resultado<T>>;
}

const CANCELADO: Resultado<never> = { ok: false, erro: new RequisicaoCanceladaError() };

function comoErroDeApi(erro: unknown): ErroDeApi {
  if (
    erro instanceof FalhaDeConexaoError ||
    erro instanceof RequisicaoCanceladaError ||
    erro instanceof RecursoNaoEncontradoError ||
    erro instanceof ErroDeValidacaoError
  ) {
    return erro;
  }
  // Defeito de código: aparece como erro de conexão, nunca em silêncio (ADR-030, D5).
  return new FalhaDeConexaoError('respostaInesperada');
}

/**
 * Base dos hooks de tela (ADR-030, D5): injeta o token, cancela o que ficou
 * velho, aborta tudo ao desmontar e concentra o tratamento do 401 em um lugar.
 */
export function useAuthenticatedRequest(): AuthenticatedRequest {
  const { tokenAtual, tratarSessaoExpirada } = useAuth();
  const tokenRef = useRef(tokenAtual);
  const tratarRef = useRef(tratarSessaoExpirada);
  const porCanal = useRef(new Map<string, AbortController>());

  tokenRef.current = tokenAtual;
  tratarRef.current = tratarSessaoExpirada;

  useEffect(() => {
    const canais = porCanal.current;
    return () => {
      canais.forEach((controlador) => controlador.abort());
      canais.clear();
    };
  }, []);

  const executar = useCallback(
    async <T>(chamada: Chamada<T>, canal = 'padrao'): Promise<Resultado<T>> => {
      const token = tokenRef.current;
      if (token === null) {
        await tratarRef.current();
        return CANCELADO;
      }

      porCanal.current.get(canal)?.abort();
      const controlador = new AbortController();
      porCanal.current.set(canal, controlador);

      try {
        const valor = await chamada(token, controlador.signal);
        return controlador.signal.aborted ? CANCELADO : { ok: true, valor };
      } catch (erro) {
        if (erro instanceof SessaoExpiradaError) {
          await tratarRef.current();
          return CANCELADO;
        }
        return controlador.signal.aborted ? CANCELADO : { ok: false, erro: comoErroDeApi(erro) };
      } finally {
        if (porCanal.current.get(canal) === controlador) {
          porCanal.current.delete(canal);
        }
      }
    },
    [],
  );

  return { executar };
}

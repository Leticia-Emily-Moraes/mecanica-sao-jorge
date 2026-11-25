import { useCallback, useEffect, useRef, useState } from 'react';

import { RecursoNaoEncontradoError, RequisicaoCanceladaError } from '@/services/api-errors';

import { useAuthenticatedRequest } from './use-authenticated-request';

/** Estado de uma leitura única (ADR-030, D6). */
export type EstadoCarga<T> =
  | { readonly tipo: 'carregando' }
  | { readonly tipo: 'erroConexao' }
  | { readonly tipo: 'naoEncontrado' }
  | { readonly tipo: 'sucesso'; readonly dados: T; readonly atualizando: boolean };

export interface Resource<T> {
  readonly estado: EstadoCarga<T>;
  /** A recarga ao voltar ao foco falhou; os dados antigos continuam na tela. */
  readonly falhaAoAtualizar: boolean;
  /** Volta a `carregando` e repete a chamada. */
  readonly tentarNovamente: () => void;
  /** Recarrega mantendo os dados na tela (`atualizando: true`). */
  readonly atualizar: () => void;
}

/**
 * Lê um recurso identificado por `chave`. `chave` nula significa "não existe":
 * vira `naoEncontrado` sem chamar a API (id inválido na rota, ADR-029).
 * Trocar a chave aborta a leitura anterior e começa de novo.
 */
export function useResource<T>(
  chave: number | null,
  carregar: (id: number, token: string, signal: AbortSignal) => Promise<T>,
): Resource<T> {
  const { executar } = useAuthenticatedRequest();
  const carregarRef = useRef(carregar);
  carregarRef.current = carregar;
  const chaveRef = useRef(chave);
  chaveRef.current = chave;

  const [estado, setEstado] = useState<EstadoCarga<T>>(
    chave === null ? { tipo: 'naoEncontrado' } : { tipo: 'carregando' },
  );
  const [falhaAoAtualizar, setFalhaAoAtualizar] = useState(false);
  const estadoRef = useRef(estado);
  estadoRef.current = estado;

  const buscar = useCallback(
    async (mantendoDados: boolean): Promise<void> => {
      const id = chaveRef.current;
      if (id === null) {
        return;
      }
      const resultado = await executar(
        (token, signal) => carregarRef.current(id, token, signal),
        'recurso',
      );

      if (resultado.ok) {
        setFalhaAoAtualizar(false);
        setEstado({ tipo: 'sucesso', dados: resultado.valor, atualizando: false });
        return;
      }
      if (resultado.erro instanceof RequisicaoCanceladaError) {
        return;
      }
      if (resultado.erro instanceof RecursoNaoEncontradoError) {
        setEstado({ tipo: 'naoEncontrado' });
        return;
      }
      if (mantendoDados) {
        setFalhaAoAtualizar(true);
        setEstado((atual) => (atual.tipo === 'sucesso' ? { ...atual, atualizando: false } : atual));
        return;
      }
      setEstado({ tipo: 'erroConexao' });
    },
    [executar],
  );

  useEffect(() => {
    setFalhaAoAtualizar(false);
    if (chave === null) {
      setEstado({ tipo: 'naoEncontrado' });
      return;
    }
    setEstado({ tipo: 'carregando' });
    void buscar(false);
  }, [chave, buscar]);

  const tentarNovamente = useCallback((): void => {
    setFalhaAoAtualizar(false);
    setEstado({ tipo: 'carregando' });
    void buscar(false);
  }, [buscar]);

  const atualizar = useCallback((): void => {
    if (chave === null) {
      return;
    }
    const atual = estadoRef.current;
    if (atual.tipo === 'sucesso') {
      setEstado({ ...atual, atualizando: true });
      void buscar(true);
      return;
    }
    if (atual.tipo !== 'carregando') {
      setEstado({ tipo: 'carregando' });
      void buscar(false);
    }
  }, [chave, buscar]);

  return { estado, falhaAoAtualizar, tentarNovamente, atualizar };
}

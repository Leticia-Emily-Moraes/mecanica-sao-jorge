import { useCallback, useEffect, useRef, useState } from 'react';

import { SEARCH_DEBOUNCE_MS } from '@/config/search';
import { RequisicaoCanceladaError } from '@/services/api-errors';
import { listarClientes } from '@/services/clients-service';
import type { ClienteResumo, Pagina } from '@/services/clients-types';

import { useAuthenticatedRequest } from './use-authenticated-request';
import { useDebouncedValue } from './use-debounced-value';
import { useRefreshOnFocus } from './use-refresh-on-focus';

/** Estado da lista de clientes (ADR-030, D6). */
export type EstadoLista =
  | { readonly tipo: 'carregando' }
  | { readonly tipo: 'erroConexao' }
  /** Sem termo e sem nenhum cliente cadastrado. */
  | { readonly tipo: 'vazio' }
  /** Com termo e sem nenhum cliente que combine. */
  | { readonly tipo: 'semResultado' }
  | {
      readonly tipo: 'sucesso';
      readonly itens: ReadonlyArray<ClienteResumo>;
      readonly total: number;
      readonly temMais: boolean;
      readonly carregandoMais: boolean;
      readonly falhaAoCarregarMais: boolean;
      readonly atualizando: boolean;
      readonly falhaAoAtualizar: boolean;
    };

export interface ClientList {
  readonly estado: EstadoLista;
  /** Texto do campo, como digitado. */
  readonly termo: string;
  /** Termo em uso na última busca, já aparado; vazio quando não há filtro. */
  readonly termoAplicado: string;
  readonly alterarTermo: (texto: string) => void;
  /** Limpa o campo e busca de imediato. */
  readonly limpar: () => void;
  /** Busca já, sem esperar a pausa da digitação (tecla de busca do teclado). */
  readonly buscarAgora: () => void;
  readonly carregarMais: () => void;
  readonly tentarNovamente: () => void;
  readonly atualizar: () => void;
}

function sucessoDe(pagina: Pagina<ClienteResumo>): EstadoLista & { tipo: 'sucesso' } {
  return {
    tipo: 'sucesso',
    itens: pagina.itens,
    total: pagina.totalItens,
    temMais: pagina.pagina + 1 < pagina.totalPaginas,
    carregandoMais: false,
    falhaAoCarregarMais: false,
    atualizando: false,
    falhaAoAtualizar: false,
  };
}

function semDuplicados(
  atuais: ReadonlyArray<ClienteResumo>,
  novos: ReadonlyArray<ClienteResumo>,
): ReadonlyArray<ClienteResumo> {
  const ids = new Set(atuais.map((cliente) => cliente.id));
  return [...atuais, ...novos.filter((cliente) => !ids.has(cliente.id))];
}

/**
 * Lista de clientes com busca e paginação (ADR-030 D6, ADR-031). A busca espera
 * a pausa da digitação, apara o termo, não manda `q` vazio e cancela a chamada
 * anterior. Nada vai para disco, log nem rota: a lista vive só neste estado.
 */
export function useClientList(): ClientList {
  const { executar } = useAuthenticatedRequest();
  const [termo, setTermo] = useState('');
  const [termoAplicado, setTermoAplicado] = useState('');
  const [estado, setEstado] = useState<EstadoLista>({ tipo: 'carregando' });
  const estadoRef = useRef(estado);
  estadoRef.current = estado;
  const paginaRef = useRef(0);
  const termoAplicadoRef = useRef(termoAplicado);
  termoAplicadoRef.current = termoAplicado;

  const termoAparado = termo.trim();
  const termoAtrasado = useDebouncedValue(termoAparado, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setTermoAplicado(termoAtrasado);
  }, [termoAtrasado]);

  const buscarPrimeiraPagina = useCallback(
    async (mantendoDados: boolean): Promise<void> => {
      const q = termoAplicadoRef.current;
      const resultado = await executar(
        (token, signal) => listarClientes({ q, page: 0 }, token, signal),
        'lista',
      );

      if (resultado.ok) {
        paginaRef.current = 0;
        const pagina = resultado.valor;
        if (pagina.totalItens === 0) {
          setEstado({ tipo: q === '' ? 'vazio' : 'semResultado' });
          return;
        }
        setEstado(sucessoDe(pagina));
        return;
      }
      if (resultado.erro instanceof RequisicaoCanceladaError) {
        return;
      }
      if (mantendoDados) {
        setEstado((atual) =>
          atual.tipo === 'sucesso'
            ? { ...atual, atualizando: false, falhaAoAtualizar: true }
            : atual,
        );
        return;
      }
      setEstado({ tipo: 'erroConexao' });
    },
    [executar],
  );

  useEffect(() => {
    setEstado({ tipo: 'carregando' });
    void buscarPrimeiraPagina(false);
  }, [termoAplicado, buscarPrimeiraPagina]);

  const carregarMais = useCallback((): void => {
    const atual = estadoRef.current;
    if (atual.tipo !== 'sucesso' || !atual.temMais || atual.carregandoMais || atual.atualizando) {
      return;
    }
    setEstado({ ...atual, carregandoMais: true, falhaAoCarregarMais: false });
    const proxima = paginaRef.current + 1;
    const q = termoAplicadoRef.current;

    void executar((token, signal) => listarClientes({ q, page: proxima }, token, signal), 'lista')
      .then((resultado) => {
        if (resultado.ok) {
          paginaRef.current = proxima;
          setEstado((corrente) =>
            corrente.tipo === 'sucesso'
              ? {
                  ...corrente,
                  itens: semDuplicados(corrente.itens, resultado.valor.itens),
                  total: resultado.valor.totalItens,
                  temMais: resultado.valor.pagina + 1 < resultado.valor.totalPaginas,
                  carregandoMais: false,
                }
              : corrente,
          );
          return;
        }
        if (resultado.erro instanceof RequisicaoCanceladaError) {
          return;
        }
        setEstado((corrente) =>
          corrente.tipo === 'sucesso'
            ? { ...corrente, carregandoMais: false, falhaAoCarregarMais: true }
            : corrente,
        );
      })
      .catch(() => {
        setEstado((corrente) =>
          corrente.tipo === 'sucesso'
            ? { ...corrente, carregandoMais: false, falhaAoCarregarMais: true }
            : corrente,
        );
      });
  }, [executar]);

  const tentarNovamente = useCallback((): void => {
    setEstado({ tipo: 'carregando' });
    void buscarPrimeiraPagina(false);
  }, [buscarPrimeiraPagina]);

  const atualizar = useCallback((): void => {
    const atual = estadoRef.current;
    if (atual.tipo === 'sucesso') {
      if (atual.carregandoMais) {
        return;
      }
      setEstado({ ...atual, atualizando: true, falhaAoAtualizar: false });
      void buscarPrimeiraPagina(true);
      return;
    }
    if (atual.tipo === 'erroConexao') {
      tentarNovamente();
    }
  }, [buscarPrimeiraPagina, tentarNovamente]);

  useRefreshOnFocus(atualizar);

  const alterarTermo = useCallback((texto: string): void => setTermo(texto), []);

  const limpar = useCallback((): void => {
    setTermo('');
    setTermoAplicado('');
  }, []);

  const buscarAgora = useCallback((): void => {
    setTermoAplicado(termoAparado);
  }, [termoAparado]);

  return {
    estado,
    termo,
    termoAplicado,
    alterarTermo,
    limpar,
    buscarAgora,
    carregarMais,
    tentarNovamente,
    atualizar,
  };
}

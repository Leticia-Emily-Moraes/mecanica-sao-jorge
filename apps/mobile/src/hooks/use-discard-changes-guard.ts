import { useNavigation } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface DiscardChangesGuard {
  /** Há uma saída barrada esperando a resposta da pessoa. */
  readonly dialogoVisivel: boolean;
  /** Fecha o diálogo e fica no formulário. */
  readonly continuarEditando: () => void;
  /** Fecha o diálogo e refaz a saída que tinha sido barrada. */
  readonly descartar: () => void;
}

type AcaoDeNavegacao = unknown;

interface EventoDeRemocao {
  readonly preventDefault: () => void;
  readonly data: { readonly action: AcaoDeNavegacao };
}

/** O mínimo do objeto de navegação que a guarda usa; o tipo completo vive em dependência interna. */
interface NavegacaoComBarreira {
  readonly addListener: (
    evento: 'beforeRemove',
    ouvinte: (evento: EventoDeRemocao) => void,
  ) => () => void;
  readonly dispatch: (acao: AcaoDeNavegacao) => void;
}

/**
 * Pergunta antes de sair de um formulário com alteração (ADR-029, D3). Voltar,
 * gesto do sistema e troca de aba passam pelo `beforeRemove`; sem alteração, ou
 * depois de salvar (a tela passa `false`), a saída segue direto. O diálogo guarda
 * só a ação de navegação, nunca o que foi digitado.
 */
export function useDiscardChangesGuard(temAlteracao: boolean): DiscardChangesGuard {
  const navigation = useNavigation<NavegacaoComBarreira>();
  const temAlteracaoRef = useRef(temAlteracao);
  temAlteracaoRef.current = temAlteracao;
  // Depois de "Descartar", a saída refeita passa sem nova pergunta.
  const saidaLiberada = useRef(false);
  const acaoBarrada = useRef<AcaoDeNavegacao | null>(null);
  const [dialogoVisivel, setDialogoVisivel] = useState(false);

  useEffect(() => {
    return navigation.addListener('beforeRemove', (evento) => {
      if (saidaLiberada.current || !temAlteracaoRef.current) {
        return;
      }
      evento.preventDefault();
      acaoBarrada.current = evento.data.action;
      setDialogoVisivel(true);
    });
  }, [navigation]);

  const continuarEditando = useCallback((): void => {
    acaoBarrada.current = null;
    saidaLiberada.current = false;
    setDialogoVisivel(false);
  }, []);

  const descartar = useCallback((): void => {
    const acao = acaoBarrada.current;
    acaoBarrada.current = null;
    setDialogoVisivel(false);
    if (acao !== null) {
      saidaLiberada.current = true;
      navigation.dispatch(acao);
    }
  }, [navigation]);

  return { dialogoVisivel, continuarEditando, descartar };
}

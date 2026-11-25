import { useEffect, useState } from 'react';

/** Devolve `valor` só depois de ficar `esperaMs` sem mudar; cada mudança zera a espera. */
export function useDebouncedValue<T>(valor: T, esperaMs: number): T {
  const [atrasado, setAtrasado] = useState<T>(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setAtrasado(valor), esperaMs);
    return () => clearTimeout(temporizador);
  }, [valor, esperaMs]);

  return atrasado;
}

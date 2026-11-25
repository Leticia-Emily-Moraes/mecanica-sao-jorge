import type { StatusTone } from '@/components/ui/status-badge';

/**
 * Nome do status como a API o devolve, sem o sublinhado (`EM_ANALISE` vira
 * `EM ANALISE`). O texto vem do servidor e o enum só fecha na Sprint 04, então
 * nada é traduzido nem corrigido aqui.
 */
export function formatarStatusDaOs(status: string): string {
  return status.replace(/_/g, ' ').trim();
}

/**
 * Só EM_ANDAMENTO e ENTREGUE têm selo desenhado no Figma (F26). Qualquer outro
 * status usa o selo neutro com o nome dele, até os demais serem desenhados.
 */
export function tomDoStatusDaOs(status: string): StatusTone {
  if (status === 'EM_ANDAMENTO') {
    return 'inProgress';
  }
  return status === 'ENTREGUE' ? 'success' : 'neutral';
}

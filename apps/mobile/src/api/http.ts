import { getApiBaseUrl } from '@/config/env';

/**
 * Lançado por `fetchAutenticado` quando a API responde 401 numa chamada com
 * token. O AuthProvider escuta este erro para apagar o token e voltar ao
 * login com aviso de sessão expirada (US-LGN-FRONT-07). Nenhuma tela de
 * domínio desta fatia (Perfil não tem endpoint próprio, ver F25 PRD, Dúvida
 * 1) chama isto ainda — é a infraestrutura para a próxima feature que
 * precisar de uma chamada autenticada.
 */
export class SessaoExpiradaError extends Error {
  constructor() {
    super('Sessão expirada.');
    this.name = 'SessaoExpiradaError';
  }
}

export async function fetchAutenticado(
  caminho: string,
  token: string,
  init?: RequestInit,
): Promise<Response> {
  const resposta = await fetch(`${getApiBaseUrl()}${caminho}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (resposta.status === 401) {
    throw new SessaoExpiradaError();
  }

  return resposta;
}

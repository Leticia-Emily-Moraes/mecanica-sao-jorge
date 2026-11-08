import { getApiBaseUrl } from '@/config/env';

import type { RespostaLogin } from './types';

/** E-mail ou senha incorretos (401) — nunca indica qual campo errou. */
export class CredenciaisInvalidasError extends Error {
  constructor() {
    super('Credenciais inválidas.');
    this.name = 'CredenciaisInvalidasError';
  }
}

/** API fora do ar, sem resposta, ou retorno inesperado (não é 401). */
export class ErroDeRedeError extends Error {
  constructor(mensagem = 'Falha de conexão ao autenticar.') {
    super(mensagem);
    this.name = 'ErroDeRedeError';
  }
}

function isRespostaLogin(valor: unknown): valor is RespostaLogin {
  if (!valor || typeof valor !== 'object') {
    return false;
  }

  const candidato = valor as Record<string, unknown>;
  return (
    typeof candidato.token === 'string' &&
    typeof candidato.usuario === 'object' &&
    candidato.usuario !== null
  );
}

/**
 * Chama POST /auth/login. Nunca loga o corpo da requisição/resposta nem o
 * token — só mensagens de erro genéricas (LGPD/segredo fora do log).
 */
export async function autenticar(email: string, senha: string): Promise<RespostaLogin> {
  let resposta: Response;

  try {
    resposta = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
  } catch {
    throw new ErroDeRedeError();
  }

  if (resposta.status === 401) {
    throw new CredenciaisInvalidasError();
  }

  if (!resposta.ok) {
    throw new ErroDeRedeError(`Resposta inesperada da API (status ${resposta.status}).`);
  }

  let corpo: unknown;
  try {
    corpo = await resposta.json();
  } catch {
    throw new ErroDeRedeError();
  }

  if (!isRespostaLogin(corpo)) {
    throw new ErroDeRedeError();
  }

  return corpo;
}

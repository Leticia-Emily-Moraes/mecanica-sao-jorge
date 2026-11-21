import {
  type CampoComErro,
  ErroDeValidacaoError,
  FalhaDeConexaoError,
  RecursoNaoEncontradoError,
  RequisicaoCanceladaError,
} from './api-errors';
import { fetchAutenticado, SessaoExpiradaError } from './http-client';
import { isRecord, isTextoOuNulo } from './type-guards';

export type MetodoHttp = 'GET' | 'POST' | 'PUT';

export interface PedidoApi<T> {
  readonly caminho: string;
  readonly token: string;
  readonly signal: AbortSignal;
  /** Confere a forma da resposta; fora dela o app trata como falha, nunca renderiza. */
  readonly guarda: (valor: unknown) => valor is T;
  readonly metodo?: MetodoHttp;
  readonly corpo?: unknown;
}

type Parametros = Readonly<Record<string, string | number | undefined>>;

/** Anexa query string só com os parâmetros presentes, todos codificados. */
export function comParametros(caminho: string, parametros: Parametros): string {
  const pares = Object.entries(parametros)
    .filter((par): par is [string, string | number] => par[1] !== undefined)
    .map(([nome, valor]) => `${encodeURIComponent(nome)}=${encodeURIComponent(String(valor))}`);
  return pares.length === 0 ? caminho : `${caminho}?${pares.join('&')}`;
}

function isCampoComErro(valor: unknown): valor is CampoComErro {
  return isRecord(valor) && typeof valor.campo === 'string' && isTextoOuNulo(valor.chave ?? null);
}

async function lerJson(resposta: Response): Promise<unknown> {
  try {
    return await resposta.json();
  } catch {
    return undefined;
  }
}

async function traduzirErro(resposta: Response): Promise<Error> {
  if (resposta.status === 404) {
    return new RecursoNaoEncontradoError();
  }
  if (resposta.status === 400 || resposta.status === 409) {
    const corpo = await lerJson(resposta);
    if (isRecord(corpo) && Array.isArray(corpo.erros)) {
      const campos = corpo.erros.filter(isCampoComErro).map((item) => ({
        campo: item.campo,
        chave: item.chave ?? null,
      }));
      const conflito =
        resposta.status === 409 && campos.length === 0 && typeof corpo.mensagem === 'string'
          ? corpo.mensagem
          : null;
      return new ErroDeValidacaoError(resposta.status, campos, conflito);
    }
    return new FalhaDeConexaoError(resposta.status === 400 ? 'respostaInesperada' : 'servidor');
  }
  return new FalhaDeConexaoError('servidor');
}

/**
 * Única porta de saída de rede de Clientes e Veículos: traduz status e falha
 * de rede em erro tipado (ADR-030, D2) e confere o JSON antes de devolvê-lo.
 * Não registra nada: nem URL, nem corpo, nem token.
 */
export async function chamarApi<T>(pedido: PedidoApi<T>): Promise<T> {
  const { caminho, token, signal, guarda, metodo = 'GET', corpo } = pedido;
  const temCorpo = corpo !== undefined;

  let resposta: Response;
  try {
    resposta = await fetchAutenticado(caminho, token, {
      method: metodo,
      signal,
      headers: temCorpo ? { 'Content-Type': 'application/json' } : undefined,
      body: temCorpo ? JSON.stringify(corpo) : undefined,
    });
  } catch (erro) {
    if (erro instanceof SessaoExpiradaError) {
      throw erro;
    }
    throw signal.aborted ? new RequisicaoCanceladaError() : new FalhaDeConexaoError('semResposta');
  }

  if (!resposta.ok) {
    throw await traduzirErro(resposta);
  }

  const json = await lerJson(resposta);
  if (!guarda(json)) {
    throw new FalhaDeConexaoError('respostaInesperada');
  }
  return json;
}

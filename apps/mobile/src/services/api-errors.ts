/**
 * Erros tipados da camada de API (ADR-030, D2). Toda `message` é fixa: nunca
 * carrega status, URL, corpo nem valor digitado, para que nenhum dado pessoal
 * saia por mensagem de erro (critério 16, política de dados seção 7).
 * `SessaoExpiradaError` (401) continua em `http-client.ts`.
 */

/** Um erro de campo devolvido pela API: `campo` e, quando há, a `chave` estável. */
export interface CampoComErro {
  readonly campo: string;
  readonly chave: string | null;
}

export type MotivoDaFalha = 'semResposta' | 'servidor' | 'respostaInesperada';

/** Rede fora, servidor com erro ou resposta fora do contrato: a tela trata igual. */
export class FalhaDeConexaoError extends Error {
  readonly motivo: MotivoDaFalha;

  constructor(motivo: MotivoDaFalha) {
    super('Falha de conexão com a API.');
    this.name = 'FalhaDeConexaoError';
    this.motivo = motivo;
  }
}

/** A chamada foi abortada por troca de busca, de id ou desmontagem da tela. */
export class RequisicaoCanceladaError extends Error {
  constructor() {
    super('Requisição cancelada.');
    this.name = 'RequisicaoCanceladaError';
  }
}

/** 404: o registro não existe (mais). Repetir a chamada não resolve. */
export class RecursoNaoEncontradoError extends Error {
  constructor() {
    super('Recurso não encontrado.');
    this.name = 'RecursoNaoEncontradoError';
  }
}

/**
 * 400 ou 409 com a lista `erros`. `conflito` só é preenchido no 409 sem erros
 * por campo: guarda o texto da `mensagem`, que `clients-service` compara com
 * as duas constantes conhecidas (ADR-030, D3, passo 3) e nunca exibe.
 */
export class ErroDeValidacaoError extends Error {
  readonly status: 400 | 409;
  readonly campos: ReadonlyArray<CampoComErro>;
  readonly conflito: string | null;

  constructor(status: 400 | 409, campos: ReadonlyArray<CampoComErro>, conflito: string | null) {
    super('A API recusou os dados enviados.');
    this.name = 'ErroDeValidacaoError';
    this.status = status;
    this.campos = campos;
    this.conflito = conflito;
  }
}

export type ErroDeApi =
  FalhaDeConexaoError | RequisicaoCanceladaError | RecursoNaoEncontradoError | ErroDeValidacaoError;

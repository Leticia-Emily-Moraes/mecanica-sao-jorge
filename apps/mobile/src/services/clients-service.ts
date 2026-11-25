import { apenasDigitos } from '@/formatters/digits';

import { ErroDeValidacaoError } from './api-errors';
import { chamarApi, comParametros } from './api-request';
import {
  type ClienteDetalhe,
  type ClienteResumo,
  isClienteDetalhe,
  isPaginaDeClientes,
  type Pagina,
} from './clients-types';

/** Tamanho de página pedido à API (o padrão dela; ADR-030, D4). */
export const TAMANHO_PAGINA_CLIENTES = 20;

export interface BuscaDeClientes {
  /** Termo já aparado; vazio ou `undefined` não vai para a URL. */
  readonly q?: string;
  readonly page: number;
}

/** `GET /clientes`: uma página, com ou sem termo de busca. */
export function listarClientes(
  busca: BuscaDeClientes,
  token: string,
  signal: AbortSignal,
): Promise<Pagina<ClienteResumo>> {
  const termo = busca.q?.trim();
  return chamarApi({
    caminho: comParametros('/clientes', {
      q: termo === undefined || termo === '' ? undefined : termo,
      page: busca.page,
      size: TAMANHO_PAGINA_CLIENTES,
    }),
    token,
    signal,
    guarda: isPaginaDeClientes,
  });
}

/** Valores do formulário, como digitados (com máscara e espaços). */
export interface ClienteEntrada {
  readonly nome: string;
  readonly cpf: string;
  readonly telefone: string;
  readonly email: string;
  readonly endereco: string;
}

/** Corpo enviado à API: CPF e telefone só com dígitos, texto opcional vazio vira `null`. */
export interface ClienteCorpo {
  readonly nome: string;
  readonly cpf: string | null;
  readonly telefone: string | null;
  readonly email: string | null;
  readonly endereco: string | null;
}

function textoOuNulo(valor: string): string | null {
  const aparado = valor.trim();
  return aparado === '' ? null : aparado;
}

function digitosOuNulo(valor: string): string | null {
  const digitos = apenasDigitos(valor);
  return digitos === '' ? null : digitos;
}

export function montarCorpoDoCliente(entrada: ClienteEntrada): ClienteCorpo {
  return {
    nome: entrada.nome.trim(),
    cpf: digitosOuNulo(entrada.cpf),
    telefone: digitosOuNulo(entrada.telefone),
    email: textoOuNulo(entrada.email),
    endereco: textoOuNulo(entrada.endereco),
  };
}

/** Mensagens fixas do 409 de cliente enquanto a API não devolve `erros[]` (B-1, ADR-030 D3). */
const CONFLITO_CPF = 'CPF ja cadastrado';
const CONFLITO_EMAIL = 'Email ja cadastrado';

/** Converte o 409 sem `erros` em erro de campo; qualquer outra mensagem segue como está. */
function traduzirConflito(erro: unknown): unknown {
  if (!(erro instanceof ErroDeValidacaoError) || erro.conflito === null) {
    return erro;
  }
  if (erro.conflito === CONFLITO_CPF) {
    return new ErroDeValidacaoError(
      409,
      [{ campo: 'cpf', chave: 'cliente.form.cpf.duplicado' }],
      null,
    );
  }
  if (erro.conflito === CONFLITO_EMAIL) {
    return new ErroDeValidacaoError(
      409,
      [{ campo: 'email', chave: 'cliente.form.email.duplicado' }],
      null,
    );
  }
  return erro;
}

async function enviarCliente(
  caminho: string,
  metodo: 'POST' | 'PUT',
  entrada: ClienteEntrada,
  token: string,
  signal: AbortSignal,
): Promise<ClienteDetalhe> {
  try {
    return await chamarApi({
      caminho,
      metodo,
      corpo: montarCorpoDoCliente(entrada),
      token,
      signal,
      guarda: isClienteDetalhe,
    });
  } catch (erro) {
    throw traduzirConflito(erro);
  }
}

/** `POST /clientes`: devolve o cliente criado (201). */
export function criarCliente(
  entrada: ClienteEntrada,
  token: string,
  signal: AbortSignal,
): Promise<ClienteDetalhe> {
  return enviarCliente('/clientes', 'POST', entrada, token, signal);
}

/** `PUT /clientes/{id}`: corpo total; o id vem validado da rota. */
export function atualizarCliente(
  id: number,
  entrada: ClienteEntrada,
  token: string,
  signal: AbortSignal,
): Promise<ClienteDetalhe> {
  return enviarCliente(
    `/clientes/${encodeURIComponent(String(id))}`,
    'PUT',
    entrada,
    token,
    signal,
  );
}

/** `GET /clientes/{id}`: o id vem validado da rota, nunca digitado. */
export function obterCliente(
  id: number,
  token: string,
  signal: AbortSignal,
): Promise<ClienteDetalhe> {
  return chamarApi({
    caminho: `/clientes/${encodeURIComponent(String(id))}`,
    token,
    signal,
    guarda: isClienteDetalhe,
  });
}

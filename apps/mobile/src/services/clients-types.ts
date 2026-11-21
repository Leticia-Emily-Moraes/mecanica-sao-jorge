import { isId, isListaDe, isRecord, isTextoOuNulo } from './type-guards';

/** Item da lista de clientes (`GET /clientes`): sem CPF nem endereço. */
export interface ClienteResumo {
  readonly id: number;
  readonly nome: string;
  readonly telefone: string | null;
  readonly email: string | null;
}

/** Detalhe do cliente (`GET /clientes/{id}`); `null` nos campos opcionais ausentes. */
export interface ClienteDetalhe {
  readonly id: number;
  readonly nome: string;
  readonly cpf: string | null;
  readonly telefone: string | null;
  readonly email: string | null;
  readonly endereco: string | null;
}

export interface Pagina<T> {
  readonly itens: ReadonlyArray<T>;
  readonly pagina: number;
  readonly tamanho: number;
  readonly totalItens: number;
  readonly totalPaginas: number;
}

export function isClienteResumo(valor: unknown): valor is ClienteResumo {
  return (
    isRecord(valor) &&
    isId(valor.id) &&
    typeof valor.nome === 'string' &&
    isTextoOuNulo(valor.telefone) &&
    isTextoOuNulo(valor.email)
  );
}

export function isClienteDetalhe(valor: unknown): valor is ClienteDetalhe {
  return (
    isRecord(valor) &&
    isId(valor.id) &&
    typeof valor.nome === 'string' &&
    isTextoOuNulo(valor.cpf) &&
    isTextoOuNulo(valor.telefone) &&
    isTextoOuNulo(valor.email) &&
    isTextoOuNulo(valor.endereco)
  );
}

function isContagem(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isInteger(valor) && valor >= 0;
}

export function isPaginaDeClientes(valor: unknown): valor is Pagina<ClienteResumo> {
  return (
    isRecord(valor) &&
    isListaDe(valor.itens, isClienteResumo) &&
    isContagem(valor.pagina) &&
    isContagem(valor.tamanho) &&
    isContagem(valor.totalItens) &&
    isContagem(valor.totalPaginas)
  );
}

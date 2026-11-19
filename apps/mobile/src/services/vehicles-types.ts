import { isId, isInteiroOuNulo, isListaDe, isRecord, isTextoOuNulo } from './type-guards';

/** Item da lista de veículos do cliente (`GET /clientes/{id}/veiculos`). */
export interface VeiculoResumo {
  readonly id: number;
  readonly placa: string;
  readonly marca: string;
  readonly modelo: string;
}

/**
 * Linha do histórico de OS do veículo, como a API devolve hoje: sem número nem
 * data (divergência do critério 12, ADR-030 D4). `status` é texto livre porque o
 * enum completo só fecha na Sprint 04.
 */
export interface HistoricoOsItem {
  readonly id: number;
  readonly status: string;
  readonly valorTotal: number;
}

/** Detalhe do veículo (`GET /veiculos/{id}`); `historicoOs` sempre presente. */
export interface VeiculoDetalhe {
  readonly id: number;
  readonly clienteId: number;
  readonly clienteNome: string;
  readonly placa: string;
  readonly marca: string;
  readonly modelo: string;
  readonly ano: number | null;
  readonly cor: string | null;
  readonly historicoOs: ReadonlyArray<HistoricoOsItem>;
}

export function isVeiculoResumo(valor: unknown): valor is VeiculoResumo {
  return (
    isRecord(valor) &&
    isId(valor.id) &&
    typeof valor.placa === 'string' &&
    typeof valor.marca === 'string' &&
    typeof valor.modelo === 'string'
  );
}

export function isHistoricoOsItem(valor: unknown): valor is HistoricoOsItem {
  return (
    isRecord(valor) &&
    isId(valor.id) &&
    typeof valor.status === 'string' &&
    typeof valor.valorTotal === 'number' &&
    Number.isFinite(valor.valorTotal)
  );
}

export function isVeiculoDetalhe(valor: unknown): valor is VeiculoDetalhe {
  return (
    isRecord(valor) &&
    isId(valor.id) &&
    isId(valor.clienteId) &&
    typeof valor.clienteNome === 'string' &&
    typeof valor.placa === 'string' &&
    typeof valor.marca === 'string' &&
    typeof valor.modelo === 'string' &&
    isInteiroOuNulo(valor.ano) &&
    isTextoOuNulo(valor.cor) &&
    isListaDe(valor.historicoOs, isHistoricoOsItem)
  );
}

export function isListaDeVeiculos(valor: unknown): valor is ReadonlyArray<VeiculoResumo> {
  return isListaDe(valor, isVeiculoResumo);
}

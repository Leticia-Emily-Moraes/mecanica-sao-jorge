import { normalizarPlaca } from '@/validators/placa';

import { chamarApi } from './api-request';
import {
  isListaDeVeiculos,
  isVeiculoDetalhe,
  isVeiculoSalvo,
  type VeiculoDetalhe,
  type VeiculoResumo,
  type VeiculoSalvo,
} from './vehicles-types';

/** `GET /clientes/{clienteId}/veiculos`: lista simples, sem paginação (ADR-030, D4). */
export function listarVeiculosDoCliente(
  clienteId: number,
  token: string,
  signal: AbortSignal,
): Promise<ReadonlyArray<VeiculoResumo>> {
  return chamarApi({
    caminho: `/clientes/${encodeURIComponent(String(clienteId))}/veiculos`,
    token,
    signal,
    guarda: isListaDeVeiculos,
  });
}

/** `GET /veiculos/{id}`: o detalhe traz `historicoOs`, vazio até a F06. */
export function obterVeiculo(
  id: number,
  token: string,
  signal: AbortSignal,
): Promise<VeiculoDetalhe> {
  return chamarApi({
    caminho: `/veiculos/${encodeURIComponent(String(id))}`,
    token,
    signal,
    guarda: isVeiculoDetalhe,
  });
}

/** Valores do formulário, como digitados (o ano ainda é texto). */
export interface VeiculoEntrada {
  readonly placa: string;
  readonly marca: string;
  readonly modelo: string;
  readonly ano: string;
  readonly cor: string;
}

/** Corpo enviado à API: placa normalizada, ano numérico e opcional vazio como `null`. */
export interface VeiculoCorpo {
  readonly placa: string;
  readonly marca: string;
  readonly modelo: string;
  readonly ano: number | null;
  readonly cor: string | null;
}

function textoOuNulo(valor: string): string | null {
  const aparado = valor.trim();
  return aparado === '' ? null : aparado;
}

function anoOuNulo(valor: string): number | null {
  const aparado = valor.trim();
  return aparado === '' ? null : Number(aparado);
}

export function montarCorpoDoVeiculo(entrada: VeiculoEntrada): VeiculoCorpo {
  return {
    placa: normalizarPlaca(entrada.placa),
    marca: entrada.marca.trim(),
    modelo: entrada.modelo.trim(),
    ano: anoOuNulo(entrada.ano),
    cor: textoOuNulo(entrada.cor),
  };
}

/** `POST /clientes/{clienteId}/veiculos`: devolve o veículo criado (201). */
export function criarVeiculo(
  clienteId: number,
  entrada: VeiculoEntrada,
  token: string,
  signal: AbortSignal,
): Promise<VeiculoSalvo> {
  return chamarApi({
    caminho: `/clientes/${encodeURIComponent(String(clienteId))}/veiculos`,
    metodo: 'POST',
    corpo: montarCorpoDoVeiculo(entrada),
    token,
    signal,
    guarda: isVeiculoSalvo,
  });
}

/** `PUT /veiculos/{id}`: corpo total; o id vem validado da rota. */
export function atualizarVeiculo(
  id: number,
  entrada: VeiculoEntrada,
  token: string,
  signal: AbortSignal,
): Promise<VeiculoSalvo> {
  return chamarApi({
    caminho: `/veiculos/${encodeURIComponent(String(id))}`,
    metodo: 'PUT',
    corpo: montarCorpoDoVeiculo(entrada),
    token,
    signal,
    guarda: isVeiculoSalvo,
  });
}

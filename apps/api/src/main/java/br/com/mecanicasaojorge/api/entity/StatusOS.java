package br.com.mecanicasaojorge.api.entity;

/**
 * Status da ordem de servico (ADR-006: persistido como STRING).
 *
 * <p>Lista incompleta de proposito: o conjunto final de valores fecha na Sprint 04
 * (docs/architecture/overview.md). A coluna {@code ordens_servico.status} nao tem CHECK no banco
 * (V2) justamente para que novos valores entrem sem migration de dado.
 */
public enum StatusOS {
  ABERTA,
  EM_ANALISE
}

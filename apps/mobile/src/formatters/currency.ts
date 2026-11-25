const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** Valor em reais no padrão pt-BR (`R$ 455,00`). */
export function formatarMoeda(valor: number): string {
  return BRL.format(valor);
}

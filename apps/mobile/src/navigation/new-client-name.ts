import { SEARCH_MAX_LENGTH } from '@/config/search';

/** Só dígitos e pontuação de telefone: o termo parece telefone, não nome. */
const PHONE_LIKE = /^[\d\s().+-]+$/;

/**
 * Nome que o botão `Cadastrar "termo"` leva ao formulário (P-01, decisão do PO).
 * Termo com "@" ou que parece telefone não vira nome: devolve `''` e o botão
 * volta a ser "Novo cliente" com o formulário vazio. Corta em 100 caracteres.
 */
export function nomeSugeridoDoTermo(termo: string): string {
  const aparado = termo.trim();
  if (aparado === '' || aparado.includes('@') || PHONE_LIKE.test(aparado)) {
    return '';
  }
  return aparado.slice(0, SEARCH_MAX_LENGTH);
}

/**
 * O termo buscado é dado pessoal de terceiro: passa da lista ao formulário só
 * por esta variável em memória, nunca por parâmetro de rota, log ou
 * armazenamento (política de dados, seção 7).
 */
let nomeSugerido = '';

export function sugerirNomeParaNovoCliente(termo: string): void {
  nomeSugerido = nomeSugeridoDoTermo(termo);
}

export function lerNomeSugerido(): string {
  return nomeSugerido;
}

export function limparNomeSugerido(): void {
  nomeSugerido = '';
}

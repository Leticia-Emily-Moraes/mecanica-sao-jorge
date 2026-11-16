/**
 * Iniciais do avatar: primeira letra do primeiro e do último nome, em caixa
 * alta; com um nome só, a primeira letra dele. Nome vazio devolve texto vazio.
 * Regra proposta na P-14 da planilha F41 (o Figma não a define).
 */
export function getInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean);

  const first = words[0];
  const last = words[words.length - 1];
  if (first === undefined || last === undefined) {
    return '';
  }

  const firstLetter = Array.from(first)[0] ?? '';
  const lastLetter = words.length > 1 ? (Array.from(last)[0] ?? '') : '';

  return `${firstLetter}${lastLetter}`.toLocaleUpperCase('pt-BR');
}

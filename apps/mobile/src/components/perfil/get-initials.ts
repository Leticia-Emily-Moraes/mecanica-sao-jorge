/** Partículas de ligação que não contam como nome (decisão D-14, 16/11). */
const NAME_PARTICLES: ReadonlySet<string> = new Set(['da', 'de', 'do', 'dos', 'das']);

function firstLetter(word: string): string {
  return Array.from(word)[0] ?? '';
}

/**
 * Iniciais do avatar: primeira letra do primeiro e do último nome, em caixa
 * alta, ignorando da/de/do/dos/das; com um nome só, a primeira letra dele.
 * Nome vazio devolve texto vazio. Se o texto só tiver partículas, elas contam
 * como nome, para o avatar nunca ficar sem iniciais por causa da regra.
 */
export function getInitials(fullName: string): string {
  const allWords = fullName.trim().split(/\s+/).filter(Boolean);
  const names = allWords.filter((word) => !NAME_PARTICLES.has(word.toLocaleLowerCase('pt-BR')));
  const words = names.length > 0 ? names : allWords;

  const first = words[0];
  const last = words[words.length - 1];
  if (first === undefined || last === undefined) {
    return '';
  }

  const lastLetter = words.length > 1 ? firstLetter(last) : '';

  return `${firstLetter(first)}${lastLetter}`.toLocaleUpperCase('pt-BR');
}

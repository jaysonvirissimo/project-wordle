/**
 * Normalize text by removing diacritics and converting to uppercase
 * This allows "mōtum" to match "MOTUM"
 */
export function normalizeDiacritics(text) {
  if (!text) return '';

  return text
    .normalize('NFD') // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .toUpperCase()
    .trim();
}

/**
 * Check if two words are the same when normalized (ignoring diacritics)
 */
export function wordsMatch(word1, word2) {
  return normalizeDiacritics(word1) === normalizeDiacritics(word2);
}

export type RsvpWord = {
  text: string;
  orpIndex: number;
  pauseMultiplier: number;
};

const SENTENCE_END = /[.!?]$/;
const CLAUSE_END = /[,;:]$/;

function orpIndexFor(word: string): number {
  const len = word.length;
  if (len <= 1) return 0;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  if (len <= 13) return 3;
  return 4;
}

export function tokenize(text: string): RsvpWord[] {
  return text
    .split(/\s+/)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((word) => ({
      text: word,
      orpIndex: Math.min(orpIndexFor(word), word.length - 1),
      pauseMultiplier: SENTENCE_END.test(word) ? 2.4 : CLAUSE_END.test(word) ? 1.6 : 1,
    }));
}

export function chunkWords(words: RsvpWord[], chunkSize: number): RsvpWord[][] {
  if (chunkSize <= 1) return words.map((w) => [w]);
  const chunks: RsvpWord[][] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize));
  }
  return chunks;
}

export function msPerWord(wpm: number): number {
  return 60000 / wpm;
}

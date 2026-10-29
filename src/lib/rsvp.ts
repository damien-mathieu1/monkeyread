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

export type TimingOptions = {
  punctuationPause: boolean;
  /** Letters from which a word gets extra time; 0 turns it off. */
  longWordLength: number;
  /** Extra time for long words, as a fraction (0.5 = 50% longer). */
  longWordExtra: number;
};

/** How many times longer than a plain word this word stays on screen. */
export function durationFactor(w: RsvpWord, o: TimingOptions): number {
  const letters = w.text.replace(/[^\p{L}\p{N}]/gu, "").length;
  const long = o.longWordLength > 0 && letters >= o.longWordLength;
  return (o.punctuationPause ? w.pauseMultiplier : 1) * (long ? 1 + o.longWordExtra : 1);
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

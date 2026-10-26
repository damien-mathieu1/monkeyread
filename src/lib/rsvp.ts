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

export const SAMPLE_TEXT =
  "Lire vite n'est pas une question de talent, mais d'habitude. Quand les mots arrivent un par un, au même endroit, tes yeux n'ont plus besoin de sauter d'une ligne à l'autre. Ils restent immobiles, et ton cerveau fait le reste. La lettre colorée marque le point où le regard se pose naturellement. Commence doucement, autour de deux cent cinquante mots par minute, puis augmente la vitesse petit à petit. Tu seras surpris de voir à quel point cela devient agréable. Quand tu es prêt, colle ton propre texte et lance la lecture.";

export function msPerWord(wpm: number): number {
  return 60000 / wpm;
}

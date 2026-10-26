import type { RsvpWord } from "@/lib/rsvp";

function HighlightedWord({ word }: { word: RsvpWord }) {
  const before = word.text.slice(0, word.orpIndex);
  const letter = word.text.slice(word.orpIndex, word.orpIndex + 1);
  const after = word.text.slice(word.orpIndex + 1);
  return (
    <span className="font-serif text-6xl">
      {before}
      <span className="text-highlight">{letter}</span>
      {after}
    </span>
  );
}

export function WordDisplay({ chunk }: { chunk: RsvpWord[] | undefined }) {
  return (
    <div className="border-border relative flex h-48 w-full items-center justify-center border-y">
      <div className="bg-border absolute top-0 left-1/2 h-4 w-px -translate-x-1/2" />
      <div className="bg-border absolute bottom-0 left-1/2 h-4 w-px -translate-x-1/2" />
      <div className="flex gap-3">
        {chunk?.length ? (
          chunk.map((word, i) => <HighlightedWord key={i} word={word} />)
        ) : (
          <span className="text-muted-foreground font-serif text-6xl">ready.</span>
        )}
      </div>
    </div>
  );
}

import type { RsvpWord } from "@/lib/rsvp";

// Splits the chunk around the pivot letter so that letter sits on the center guide.
function splitAtPivot(chunk: RsvpWord[]) {
  const pivotWord = Math.floor((chunk.length - 1) / 2);
  let offset = 0;
  for (let i = 0; i < pivotWord; i++) offset += chunk[i].text.length + 1;
  const full = chunk.map((w) => w.text).join(" ");
  const p = offset + chunk[pivotWord].orpIndex;
  return { before: full.slice(0, p), letter: full[p], after: full.slice(p + 1) };
}

export function WordDisplay({ chunk }: { chunk: RsvpWord[] | undefined }) {
  const parts = chunk?.length ? splitAtPivot(chunk) : null;

  return (
    <div className="relative flex h-40 w-full items-center border-y-2 border-muted">
      <div className="absolute top-0 left-1/2 h-4 w-0.5 -translate-x-1/2 bg-muted" />
      <div className="absolute bottom-0 left-1/2 h-4 w-0.5 -translate-x-1/2 bg-muted" />
      <div className="flex w-full text-5xl whitespace-pre">
        {parts ? (
          <>
            <span className="flex-1 text-right">{parts.before}</span>
            <span className="text-primary">{parts.letter}</span>
            <span className="flex-1 text-left">{parts.after}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}

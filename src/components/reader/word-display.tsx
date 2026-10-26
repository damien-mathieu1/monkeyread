import { cn } from "@/lib/utils";
import type { RsvpWord } from "@/lib/rsvp";

export const FONT_SIZES = [1, 1.5, 2, 3, 4] as const;

const SIZE_CLASS: Record<number, string> = {
  1: "text-3xl",
  1.5: "text-4xl",
  2: "text-5xl",
  3: "text-7xl",
  4: "text-8xl",
};

// Splits the chunk around the pivot letter so that letter sits on the center guide.
function splitAtPivot(chunk: RsvpWord[]) {
  const pivotWord = Math.floor((chunk.length - 1) / 2);
  let offset = 0;
  for (let i = 0; i < pivotWord; i++) offset += chunk[i].text.length + 1;
  const full = chunk.map((w) => w.text).join(" ");
  const p = offset + chunk[pivotWord].orpIndex;
  return { before: full.slice(0, p), letter: full[p], after: full.slice(p + 1) };
}

type Props = {
  chunk: RsvpWord[] | undefined;
  ended: boolean;
  highlight: boolean;
  guides: boolean;
  fontSize: number;
};

export function WordDisplay({ chunk, ended, highlight, guides, fontSize }: Props) {
  const parts = chunk?.length ? splitAtPivot(chunk) : null;

  return (
    <div
      className={cn("relative flex h-40 w-full items-center", guides && "border-y-2 border-muted")}
    >
      {guides && (
        <>
          <div className="absolute top-0 left-1/2 h-4 w-0.5 -translate-x-1/2 bg-muted" />
          <div className="absolute bottom-0 left-1/2 h-4 w-0.5 -translate-x-1/2 bg-muted" />
        </>
      )}
      <div className={cn("flex w-full whitespace-pre", SIZE_CLASS[fontSize] ?? "text-5xl")}>
        {ended ? (
          <span className="flex-1 animate-in text-center text-muted-foreground duration-125 fade-in">
            fin.
          </span>
        ) : parts ? (
          <>
            <span className="flex-1 text-right">{parts.before}</span>
            <span className={cn(highlight && "text-primary")}>{parts.letter}</span>
            <span className="flex-1 text-left">{parts.after}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  wordsRead: number;
  elapsedMs: number;
  targetWpm: number;
  onRestart: () => void;
};

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl text-muted-foreground">{label}</span>
      <span className="text-6xl text-primary">{value}</span>
    </div>
  );
}

export function Result({ wordsRead, elapsedMs, targetWpm, onRestart }: Props) {
  const minutes = elapsedMs / 60000;
  const wpm = minutes > 0 ? Math.round(wordsRead / minutes) : 0;
  const seconds = Math.round(elapsedMs / 1000);

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex gap-16">
        <Stat label="wpm" value={wpm} />
        <Stat label="mots" value={wordsRead} />
        <Stat label="temps" value={`${seconds}s`} />
        <Stat label="cible" value={targetWpm} />
      </div>
      <Button variant="text" size="icon-lg" onClick={onRestart} aria-label="recommencer">
        <RotateCcw />
      </Button>
    </div>
  );
}

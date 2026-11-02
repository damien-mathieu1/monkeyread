"use client";

import { FastForward, Pause, Play, Rewind, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

type Props = {
  playing: boolean;
  skipSeconds: number;
  onRestart: () => void;
  onSkip: (seconds: number) => void;
  onToggle: () => void;
};

/** Reader controls for touch screens, which have no keyboard shortcuts. */
export function TouchControls({ playing, skipSeconds, onRestart, onSkip, onToggle }: Props) {
  const t = useT();
  return (
    <div className="hidden items-center justify-center gap-4 pointer-coarse:flex">
      <Button variant="text" size="icon-lg" aria-label={t.keys.restart} onClick={onRestart}>
        <RotateCcw />
      </Button>
      <Button
        variant="text"
        size="icon-lg"
        aria-label={t.keys.skip(skipSeconds)}
        onClick={() => onSkip(-skipSeconds)}
      >
        <Rewind />
      </Button>
      <Button size="icon-lg" aria-label={t.keys.playPause} onClick={onToggle}>
        {playing ? <Pause /> : <Play />}
      </Button>
      <Button
        variant="text"
        size="icon-lg"
        aria-label={t.keys.skip(skipSeconds)}
        onClick={() => onSkip(skipSeconds)}
      >
        <FastForward />
      </Button>
    </div>
  );
}

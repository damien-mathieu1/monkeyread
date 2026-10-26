"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  wpm: number;
  onWpmChange: (wpm: number) => void;
  chunkSize: number;
  onChunkSizeChange: (size: number) => void;
  playing: boolean;
  onPlayPause: () => void;
  onReset: () => void;
};

export function ReaderControls({
  wpm,
  onWpmChange,
  chunkSize,
  onChunkSizeChange,
  playing,
  onPlayPause,
  onReset,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-muted-foreground font-serif text-lg italic">{wpm} mots/min</p>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onReset}>
          <RotateCcw />
        </Button>
        <Button size="icon" onClick={onPlayPause}>
          {playing ? <Pause /> : <Play />}
        </Button>
      </div>

      <div className="flex w-full max-w-sm items-center gap-4">
        <span className="text-muted-foreground w-10 text-sm">vitesse</span>
        <Slider
          min={100}
          max={700}
          step={10}
          value={[wpm]}
          onValueChange={([value]) => onWpmChange(value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-muted-foreground text-sm">mots groupés</span>
        <Select
          value={String(chunkSize)}
          onValueChange={(value) => onChunkSizeChange(Number(value))}
        >
          <SelectTrigger size="sm" className="w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

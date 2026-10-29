"use client";

import { useState } from "react";
import { FileText, Pause, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Settings, UpdateSetting } from "@/hooks/use-settings";
import { useT } from "@/lib/i18n";

const WPM_PRESETS = [200, 250, 300, 400, 500];
export const CHUNK_SIZES = [1, 2, 3, 4, 5];
/** Matches the reading_sessions.chunk_size check in the database. */
export const MAX_CHUNK_SIZE = 10;

type Props = {
  settings: Settings;
  update: UpdateSetting;
  onCustomText: () => void;
};

function Spacer() {
  return <div className="my-2 w-1 rounded-full bg-background" />;
}

/** Shows the keyboard shortcut of a config group on hover. */
function Hint({ keys, children }: { keys: string[]; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="flex gap-1">
        {keys.map((k) => (
          <kbd key={k} className="rounded bg-muted px-1.5 text-foreground">
            {k}
          </kbd>
        ))}
      </TooltipContent>
    </Tooltip>
  );
}

function Option({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button variant="text" size="sm" aria-pressed={active} onClick={onClick}>
      {children}
    </Button>
  );
}

export function ConfigBar({ settings, update, onCustomText }: Props) {
  const t = useT();
  const [customWpmOpen, setCustomWpmOpen] = useState(false);
  const [customWpm, setCustomWpm] = useState("");
  const isPreset = WPM_PRESETS.includes(settings.wpm);

  const saveCustomWpm = () => {
    const value = Number(customWpm);
    if (value >= 50 && value <= 2000) update("wpm", Math.round(value));
    setCustomWpmOpen(false);
  };

  return (
    <div className="flex w-max gap-2 rounded-lg bg-muted px-2 text-xs">
      <Hint keys={["p"]}>
        <Option
          active={settings.punctuationPause}
          onClick={() => update("punctuationPause", !settings.punctuationPause)}
        >
          <Pause />
          {t.reader.punctuationPause}
        </Option>
      </Hint>

      <Spacer />

      <Hint keys={["↑", "↓"]}>
        <div className="flex">
          {WPM_PRESETS.map((wpm) => (
            <Option key={wpm} active={settings.wpm === wpm} onClick={() => update("wpm", wpm)}>
              {wpm}
            </Option>
          ))}
          <Option
            active={!isPreset}
            onClick={() => {
              setCustomWpm(String(settings.wpm));
              setCustomWpmOpen(true);
            }}
          >
            <Wrench />
            {!isPreset && settings.wpm}
          </Option>
        </div>
      </Hint>

      <Spacer />

      <Hint keys={[`1–${CHUNK_SIZES.length}`]}>
        <div className="flex items-center">
          <span className="px-2 text-muted-foreground">{t.reader.words}</span>
          {CHUNK_SIZES.map((size) => (
            <Option
              key={size}
              active={settings.chunkSize === size}
              onClick={() => update("chunkSize", size)}
            >
              {size}
            </Option>
          ))}
        </div>
      </Hint>

      <Spacer />

      <Hint keys={["t"]}>
        <Option onClick={onCustomText}>
          <FileText />
          {t.reader.text}
        </Option>
      </Hint>

      <Dialog open={customWpmOpen} onOpenChange={setCustomWpmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.reader.customSpeed}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveCustomWpm();
            }}
          >
            <Input
              type="number"
              min={50}
              max={2000}
              autoFocus
              value={customWpm}
              onChange={(e) => setCustomWpm(e.target.value)}
            />
            <DialogFooter className="mt-4 grid">
              <Button type="submit">{t.common.ok}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
